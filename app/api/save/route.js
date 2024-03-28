import { NextResponse } from 'next/server';
import path from 'path';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';

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
        const chosenImageBlobURL = `https://hal-virtual-try-on.vercel.app/models/${path.parse(userImageData).base}`;

        const existsUser = await prisma.user.findUnique({
            where: {
                uid: uid,
            },
            select: {
                uid: true,
            }
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
                        url: chosenImageBlobURL,
                        firstSite: firstSite === 'true',
                    }
                },
            },
        });
        await prisma.$disconnect();
        return NextResponse.json({ message: `${chosenImageBlobURL}` }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}