import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import formidable from "formidable";

export default async function handler(req, res) {
    // console.log("getting request");
    // console.log(req)
    // console.log(req.body)
    // console.log("req.files")
    // console.log(req.files)
    // console.log("req.fields")
    // console.log(req.fields)
    // console.log("res")
    // console.log(res)
    if(req.method === 'POST') {
        try {
            console.log("processing files")
            console.log(req.body)
            // res.status(200).json( req.body );
            // const imagePath1 = req.files.userImage[0].path;
            // const imagePath2 = req.files.productImage[0].path;
            console.log("got paths")
            // console.log(req.body)
            const form = formidable({ multiples: true });
            const data = new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if(err) {
                        reject(err);
                    }
                    resolve({ fields, files });
                });
            });
            console.log("done here")
            const { fields, files } = await data;
            const isValid = await validateFromData(fields, files);
            if(!isValid) {
                console.log("invalid data")
                return res.status(400).json({ message: 'Invalid data' });
            }
            // const data = await new Promise(function (resolve, reject) {
            //     const form = new IncomingForm({ keepExtensions: true });
            //     form.parse(req.body, function (err, fields, files) {
            //         if(err) return reject(err);
            //         resolve({ fields, files });
            //     });
            // });
            console.log("got data")
            console.log(data)

            // const products = [
            //     { id: 1, name: 'dress no long', image: 'garments/dress/020714_1.jpg' },
            //     { id: 2, name: 'dress no long', image: 'garments/dress/020715_1.jpg' },
            //     { id: 3, name: 'dress no long', image: 'garments/dress/020716_1.jpg' },
            //     { id: 4, name: 'dress short long', image: 'garments/dress/020717_1.jpg' },

            //     { id: 5, name: 'top long none', image: 'garments/upper_body/000000_1.jpg' },
            //     { id: 6, name: 'top long none', image: 'garments/upper_body/000001_1.jpg' },
            //     { id: 7, name: 'top short none', image: 'garments/upper_body/000002_1.jpg' },
            //     { id: 8, name: 'top long none', image: 'garments/upper_body/000003_1.jpg' },

            //     { id: 9, name: 'pants none short', image: 'garments/lower_body/013563_1.jpg' },
            //     { id: 10, name: 'pants none short', image: 'garments/lower_body/013564_1.jpg' },
            //     { id: 11, name: 'pants none short', image: 'garments/lower_body/013565_1.jpg' },
            //     { id: 12, name: 'pants none short', image: 'garments/lower_body/013566_1.jpg' },
            // ];

            const imagePath1 = data.files.userImage.path;
            const imagePath2 = data.files.productImage.path;
            // const imagePath2 = products[parseInt(data.fields.productId) - 1].image

            // Execute the python script with the paths as arguments
            const pythonProcess = spawn('python', ['backbone.py', imagePath1, imagePath2]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                // Send response once the process is finished
                res.status(200).json({ message: 'Files uploaded and processed successfully.' });
            });
        } catch(err) {
            console.error('Error processing files:', err);
            res.status(500).json({ message: 'Error processing files' });
        }
    } else if(req.method === 'GET') {
        const resultsFolderPath = path.join(process.cwd(), 'results');

        fs.readdir(resultsFolderPath, (err, files) => {
            if(err) {
                console.error('Error reading the results directory:', err);
                return res.status(500).send('Error reading files');
            }
            const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            res.status(200).json(images);
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}