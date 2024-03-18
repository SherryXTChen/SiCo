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
        const uid = data.get('uid');
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }

        const product_names = [
            'dress no long',
            'dress short long',
            'top long none',
            'top short none',
            'pants none short'
        ];

        await new Promise((resolve, reject) => {
            const bodymaskPythonProcess = spawn('python', ['./bodymask.py', `${userImage}`, uid], {
                // env: {
                //     ...process.env,
                //     PYTHONPATH: 'venv/bin/python'
                // },
            });

            bodymaskPythonProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
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
                console.error('Error processing files:', err);
                reject(err);
            });
        });

        const pythonProcessesPromises = [];
        for(const productName of product_names) {
            const pythonProcessPromise = new Promise((resolve, reject) => {
                const pythonProcess = spawn('python', ['undress.py', imagePath1, productName, uid]);
                pythonProcess.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });
                pythonProcess.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
                pythonProcess.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);
                    resolve();
                });
                pythonProcess.on('error', (err) => {
                    console.error('Error processing files:', err);
                    reject(err);
                });
            });

            pythonProcessesPromises.push(pythonProcessPromise);
        }
        await Promise.all(pythonProcessesPromises);
        return NextResponse.json({ message: 'Files scanned successfully.' }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}