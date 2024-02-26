import { writeFile, mkdir, readdir } from 'fs/promises';
import fs from 'fs';
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

        const userPath = join('cache', `${uid}`);
        await mkdir(userPath, { recursive: true });
        const cacheUserPath = join('cache', 'userImages', `${uid}`);
        await mkdir(cacheUserPath, { recursive: true });
        const files = await readdir(userPath);
        const counter = files.length + 1;
        const userImageBytes = await userImage.arrayBuffer();
        const userImageBuffer = Buffer.from(userImageBytes);
        const userImagePath = join(userPath, 'userImage.jpg');
        const userStoredPath = join(cacheUserPath, `userImage${counter}.jpg`);
        sharp(userImageBuffer).toFormat('jpeg').toFile(userImagePath)
            .then((outputBuffer) => {
                // console.log('outputBuffer:', outputBuffer);
            })
            .catch((err) => {
                console.error('Error converting user image to jpeg:', err);
                return NextResponse.error(new Error('Error converting user image to jpeg'));
            });
        sharp(userImageBuffer).toFormat('jpeg').toFile(userStoredPath)
            .then((outputBuffer) => {
                // console.log('outputBuffer:', outputBuffer);
            })
            .catch((err) => {
                console.error('Error converting user image to jpeg:', err);
                return NextResponse.error(new Error('Error converting user image to jpeg'));
            });
        return NextResponse.json({ message: 'Files uploaded and processed successfully.' }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}