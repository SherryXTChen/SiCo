import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';
const sharp = require('sharp');

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const userImageData = data.get('userImage');
        if(!userImageData) {
            return NextResponse.error(new Error('No user image found'));
        }
        const uid = data.get('uid');
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }
        const firstSite = data.get('firstSite');
        const userImageBytes = await userImageData.arrayBuffer();
        const userImageBuffer = Buffer.from(userImageBytes);
        const userImagePath = `${uid}/userImage.jpg`;
        const userImageJpeg = await sharp(userImageBuffer).toFormat('jpeg').toFile();
        const blob = await put(userImagePath, userImageJpeg, {
            access: 'public',
        });

        const existsUser = await prisma.user.findUnique({
            where: {
                uid: uid,
            },
        });
        if(!existsUser) {
            await prisma.user.create({
                data: {
                    uid: uid,
                },
            });
        }

        await prisma.user.update({
            where: {
                uid: uid,
            },
            data: {
                updatedAt: new Date(),
                userImage: {
                    create: {
                        url: blob.url,
                        firstSite: firstSite === 'true',
                    }
                },
            },
        });

        return NextResponse.json({ message: `${blob.url}` }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}