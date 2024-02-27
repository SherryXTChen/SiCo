import { mkdir, readdir } from 'fs/promises';
import fs from 'fs';
import path, { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'uuid';

async function copyFile(sourcePath, destinationPath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(sourcePath);
        const writeStream = fs.createWriteStream(destinationPath);
        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('finish', resolve);
        readStream.pipe(writeStream);
    });
}

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
        const userPath = join('cache', `${uid}`);
        await mkdir(userPath, { recursive: true });
        const cacheUserPath = join('cache', 'userImages', `${uid}`);
        await mkdir(cacheUserPath, { recursive: true });
        const files = await readdir(userPath);
        const counter = files.length + 1;
        const userImageFilePath = join('models', path.parse(userImage).base);
        const userImagePath = join(userPath, 'userImage.jpg');
        const userStoredPath = join(cacheUserPath, `userImage${counter}.jpg`);
        await copyFile(userImageFilePath, userImagePath);
        await copyFile(userImageFilePath, userStoredPath);
        return NextResponse.json({ message: 'Files uploaded and processed successfully.' }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}