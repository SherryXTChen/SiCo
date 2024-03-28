import { NextResponse } from 'next/server';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const uid = data.get('uid');
        const userImage = data.get('userImage');
        const firstSite = data.get('firstSite');
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }

        const existsUser = await prisma.user.findUnique({
            where: {
                uid: uid,
            },
            select: {
                uid: true,
            },
        });
        if(!existsUser) {
            await prisma.user.create({
                data: {
                    uid: `${uid}`,
                },
            });
        }

        await prisma.user.update({
            where: {
                uid: `${uid}`,
            },
            data: {
                userImage: {
                    create: {
                        url: `${userImage}`,
                        firstSite: firstSite === 'true',
                    },
                },
                updatedAt: new Date(),
            },
        });
        await prisma.$disconnect();
        return NextResponse.json({ message: `Successfully changed image` }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}