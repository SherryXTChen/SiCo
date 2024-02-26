import { spawn } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'uuid';
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
        const uid = data.get('uid');
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }

        const userPath = join('cache', `${uid}`);
        await mkdir(userPath, { recursive: true });
        const userImageBytes = await userImage.arrayBuffer();
        const userImageBuffer = Buffer.from(userImageBytes);
        const productImageBytes = await productImage.arrayBuffer();
        const productImageBuffer = Buffer.from(productImageBytes);
        const userImagePath = join(userPath, 'userImage.jpg');
        const productImagePath = join(userPath, `${garmentInfo}`);
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
            const pythonProcess = spawn('python', ['backbone.py', imagePath1, imagePath2, uid], {
                env: {
                    ...process.env,
                    PYTHONPATH: 'venv/bin/python'
                },
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
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