import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const userImageData = data.get('userImage');
        if (!userImageData) {
            return NextResponse.error(new Error('No user image found'));
        }
        const uid = data.get('uid');
        if (!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if (!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }

        const userImagePath = `${uid}/userImage.jpg`;
        const blob = await put(userImagePath, userImageData, {
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
                userImage: {
                    create: {
                        url: blob.url,
                    }
                },
            },
        });

        return NextResponse.json({ message: `${blob.url}` }, { status: 200 });
    } catch (err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}