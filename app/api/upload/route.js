import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
const sharp = require('sharp');

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const userImage = data.get('userImage');
        if(!userImage) {
            return NextResponse.error(new Error('No user image found'));
        }
        const productImage = data.get('productImage');
        if(!productImage) {
            return NextResponse.error(new Error('No product image found'));
        }
        const garmentInfo = data.get('garmentInfo');
        if(!garmentInfo) {
            return NextResponse.error(new Error('No garment info found'));
        }

        const userImageBytes = await userImage.arrayBuffer();
        const userImageBuffer = Buffer.from(userImageBytes);
        const productImageBytes = await productImage.arrayBuffer();
        const productImageBuffer = Buffer.from(productImageBytes);
        const userImagePath = join('cache', 'userImage.jpg');
        const productImagePath = join('cache', `${garmentInfo}`);
        sharp(userImageBuffer).toFormat('jpeg').toFile(userImagePath)
            .then((outputBuffer) => {
                // console.log('outputBuffer:', outputBuffer);
            })
            .catch((err) => {
                console.error('Error converting user image to jpeg:', err);
                return NextResponse.error(new Error('Error converting user image to jpeg'));
            });
        await writeFile(productImagePath, productImageBuffer);

        const imagePath1 = userImagePath;
        const imagePath2 = productImagePath.split(' ')[0] + ' ' + garmentInfo.split(' ').slice(1).join(' ');

        await new Promise((resolve, reject) => {
            // Execute the python script with the paths as arguments
            const pythonProcess = spawn('python', ['backbone.py', imagePath1, imagePath2], {
                env: {
                    ...process.env,
                    PYTHONPATH: 'venv/bin/python'
                },
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                // console.log(`child process exited with code ${code}`);
                // Send response once the process is finished
                resolve();
            });
            pythonProcess.on('error', (err) => {
                console.error('Error processing files:', err);
                reject(err);
            });
        });
        return NextResponse.json({ message: 'Files uploaded and processed successfully.' }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}