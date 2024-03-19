import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const initials = `${data.get('initials')}`;
        if(!initials) {
            return NextResponse.error(new Error('No initials found'));
        }
        if(initials.length !== 2) {
            return NextResponse.error(new Error('Invalid initials'));
        }
        const uid = data.get('uid');
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
                updatedAt: new Date(),
                initials: `${initials}`
            },
        });

        return NextResponse.json({ message: `Successfully registered user` }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}