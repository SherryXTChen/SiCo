const validate = require('uuid').validate;
const net = require('net');
const fs = require('fs');
const path = require('path');
const PrismaClient = require('@prisma/client').PrismaClient;
let prisma;
const spawn = require('child_process').spawn;
const join = require('path').join;
const upload = require('@vercel/blob').put;

const products = [
    { id: 1, name: 'top short none', image: 'garments/upper_body/000000_1.jpg' },
    { id: 2, name: 'top long none', image: 'garments/upper_body/000001_1.jpg' },
    { id: 3, name: 'top long none', image: 'garments/upper_body/020714_1.jpg' },
    { id: 4, name: 'top short none', image: 'garments/upper_body/020715_1.jpg' },
    { id: 5, name: 'top long none', image: 'garments/upper_body/020716_1.jpg' },
    { id: 6, name: 'top long none', image: 'garments/upper_body/020717_1.jpg' },

    { id: 7, name: 'skirt none long', image: 'garments/lower_body/000002_1.jpg' },
    { id: 8, name: 'pants none long', image: 'garments/lower_body/000003_1.jpg' },
    { id: 9, name: 'pants none long', image: 'garments/lower_body/013563_1.jpg' },
    { id: 10, name: 'pants none short', image: 'garments/lower_body/013564_1.jpg' },
    { id: 11, name: 'skirt none short', image: 'garments/lower_body/013565_1.jpg' },
    { id: 12, name: 'pants none long', image: 'garments/lower_body/013566_1.jpg' },
];

const uploadFile = async (uid, userImage, productImage, garmentInfo, firstSite) => {
    try {
        const imagePath1 = `${userImage}`;
        const productImagePath = join(`cache`, `${uid}`, `${garmentInfo}`);
        const imagePath2 = productImagePath.split(' ')[0] + ' ' + garmentInfo.split(' ').slice(1).join(' ');
        await fs.promises.mkdir(path.dirname(imagePath2), { recursive: true });
        const newClothes = parseInt(garmentInfo.split('_')[0]);
        await fs.promises.copyFile(products[newClothes - 1].image, imagePath2);
        await new Promise((resolve, reject) => {
            // Execute the python script with the paths as arguments
            const pythonProcess = spawn('python', ['backbone.py', imagePath1, imagePath2, uid, firstSite], {
                // env: {
                //     ...process.env,
                //     PYTHONPATH: 'venv/bin/python'
                // },
            });

            pythonProcess.stderr.on('data', (data) => {
                // console.error(`stderr: ${data}`);
                console.log(`stderr: ${data}`);
            });

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                // Send response once the process is finished
                resolve();
            });
            pythonProcess.on('error', (err) => {
                // console.error('Error processing files:', err);
                console.log('Error processing files:', err);
                reject(err);
            });
        });
    } catch(err) {
        // console.error('Error processing files:', err);
        console.log('Error processing files:', err);
    }

    const resultsFolderPath = path.join('results', uid, firstSite);
    try {
        await fs.promises.mkdir(resultsFolderPath, { recursive: true });
    } catch(err) {
        // console.error('Error creating results directory:', err);
        console.log('Error creating results directory:', err);
    }
    try {
        if(!(await prisma?.$connect)) {
            prisma = new PrismaClient();
        }
        const files = await fs.promises.readdir(resultsFolderPath);
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        await prisma.$connect();
        for(const image of images) {
            const imagePath = path.join(resultsFolderPath, image);
            var existsUserImageResult = false;
            try {
                existsUserImageResult = await prisma.userImageResult.findUnique({
                    where: {
                        filename: imagePath,
                    },
                    select: {
                        id: true,
                    }
                });
            } catch(err) {
                // console.error('Error reading the results directory:', err);
                console.log('Error reading the results directory:', err);
                continue;
            }
            if(existsUserImageResult) {
                continue;
            }
            const imageBuffer = await fs.promises.readFile(imagePath);
            const blob = await upload(`${uid}/${image}`, imageBuffer, {
                access: 'public',
            });
            console.log("Uploaded image to", blob.url);

            const existsUser = await prisma.user.findUnique({
                where: {
                    uid: uid,
                },
                select: {
                    uid: true,
                },
            });
            if(!existsUser) {
                await prisma.user.create({
                    data: {
                        uid: uid,
                    },
                });
            }
            console.log("Found or created user", uid);

            await prisma.user.update({
                where: {
                    uid: uid,
                },
                data: {
                    userImageResult: {
                        create: {
                            url: blob.url,
                            filename: imagePath,
                            firstSite: firstSite === 'true',
                        }
                    },
                },
            });
            await prisma.$disconnect();
            console.log("Created userImageResult at", blob.url);
        }
    } catch(err) {
        await prisma?.$disconnect();
        // console.error('Error reading the results directory:', err);
        console.log('Error reading the results directory:', err);
    }
};

// Create a TCP server
const server = net.createServer((socket) => {
    console.log(`Client connected at ${new Date().toLocaleString()}`);

    // Listen for data from the client
    socket.on('data', async (data) => {
        try {
            console.log(`Data received at ${new Date().toLocaleString()}`);
            const text = data.toString().trim();
            console.log(`Received: ${text}`);

            // Run some code based on the received text
            console.log(`Running code for: ${text}`);
            const splitText = text.split('\n');
            const command = splitText[0];
            const uid = splitText[1];
            const userImage = splitText[2];
            const productImage = splitText[3];
            const garmentInfo = splitText[4];
            const firstSite = splitText[5];
            if(!validate(uid)) {
                console.log('Invalid uid');
                return;
            }
            await uploadFile(uid, userImage, productImage, garmentInfo, firstSite);
            console.log(`Finished uploading at ${new Date().toLocaleString()}`);
            socket.end();
        } catch(err) {
            console.log(`Error at ${new Date().toLocaleString()}`);
            console.log('Error processing files:', err);
            socket.end();
        }
    });

    // Handle client disconnect
    socket.on('end', () => {
        prisma?.$disconnect();
        console.log('Client disconnected');
    });
});

// Listen on port 12345
server.listen(12345, () => {
    console.log('Server running on port 12345');
});

