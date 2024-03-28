const validate = require('uuid').validate;
const net = require('net');
const spawn = require('child_process').spawn;

const scan = async (uid, userImage) => {
    const product_names = [
        'dress no long',
        'dress short long',
        'top long none',
        'top short none',
        'pants none short'
    ];

    await new Promise((resolve, reject) => {
        const bodymaskPythonProcess = spawn('python', ['bodymask.py', `${userImage}`, uid], {
            // env: {
            //     ...process.env,
            //     PYTHONPATH: 'venv/bin/python'
            // },
        });

        bodymaskPythonProcess.stderr.on('data', (data) => {
            console.log('Error processing files:', data.toString());
            // console.error(`stderr: ${data}`);
        });

        bodymaskPythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        bodymaskPythonProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            // Send response once the process is finished
            resolve();
        });
        bodymaskPythonProcess.on('error', (err) => {
            // console.error('Error processing files:', err);
            console.log('Error processing files:', err);
            reject(err);
        });
    });

    const pythonProcessesPromises = [];
    for(const productName of product_names) {
        const pythonProcessPromise = new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', ['undress.py', userImage, productName, uid]);
            pythonProcess.stderr.on('data', (data) => {
                // console.error(`stderr: ${data}`);
                console.log(`stderr: ${data}`);
            });
            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            pythonProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                resolve();
            });
            pythonProcess.on('error', (err) => {
                // console.error('Error processing files:', err);
                console.log('Error processing files:', err);
                reject(err);
            });
        });

        pythonProcessesPromises.push(pythonProcessPromise);
    }
    await Promise.all(pythonProcessesPromises);
};

// Create a TCP server
const server = net.createServer((socket) => {
    console.log('Client connected');

    // Listen for data from the client
    socket.on('data', (data) => {
        const text = data.toString().trim();
        console.log(`Received: ${text}`);

        // Run some code based on the received text
        console.log(`Running code for: ${text}`);
        const splitText = text.split('\n');
        const command = splitText[0];
        const uid = splitText[1];
        const userImage = splitText[2];
        if(!validate(uid)) {
            console.log('Invalid uid');
            return;
        }
        scan(uid, userImage);
    });

    // Handle client disconnect
    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

// Listen on port 12346
server.listen(12346, () => {
    console.log('Server running on port 12346');
});
