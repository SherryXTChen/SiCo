import { NextResponse } from 'next/server';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const uid = data.get('uid');
        const initials = `${data.get('initials')}`;
        const date = `${data.get('date')}`;
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }
        if(!initials) {
            return NextResponse.error(new Error('No initials found'));
        }
        if(initials.length <= 0) {
            return NextResponse.error(new Error('Invalid initials'));
        }
        if(!date) {
            return NextResponse.error(new Error('No date found'));
        }
        const currentDate = new Date().toLocaleDateString().split('/');
        const selectedDate = date.split('-');
        if(parseInt(selectedDate[0]) !== parseInt(currentDate[2]) || parseInt(selectedDate[1]) !== parseInt(currentDate[0]) || parseInt(selectedDate[2]) !== parseInt(currentDate[1])) {
            return NextResponse.error(new Error('Invalid date'));
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
                initials: `${initials}`,
                consentDate: new Date(),
            },
        });

        return NextResponse.json({ message: `Successfully registered user` }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}