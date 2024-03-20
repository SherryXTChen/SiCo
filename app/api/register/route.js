import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';

export async function POST(req, res) {
    try {
        const data = await req.formData();
        console.log("data", data);
        const uid = data.get('uid');
        const initials = `${data.get('initials')}`;
        const date = `${data.get('date')}`;
        console.log("testing here 1");
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        console.log("testing here 2");
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }
        console.log("testing here 3");
        if(!initials) {
            return NextResponse.error(new Error('No initials found'));
        }
        console.log("testing here 4");
        if(initials.length <= 0) {
            return NextResponse.error(new Error('Invalid initials'));
        }
        console.log("testing here 5");
        if(!date) {
            return NextResponse.error(new Error('No date found'));
        }
        console.log("testing here 6");
        console.log("date data 1:", parseInt(selectedDate[0]) !== parseInt(currentDate[2])
            || parseInt(selectedDate[1]) !== parseInt(currentDate[0])
            || Math.abs(parseInt(selectedDate[2]) - parseInt(currentDate[1])) <= 1);
        console.log("selectedDate:", selectedDate);
        console.log("currentDate:", currentDate);
        const currentDate = new Date().toLocaleDateString().split('/');
        const selectedDate = date.split('-');
        if(parseInt(selectedDate[0]) !== parseInt(currentDate[2])
            || parseInt(selectedDate[1]) !== parseInt(currentDate[0])
            || Math.abs(parseInt(selectedDate[2]) - parseInt(currentDate[1])) <= 1) {
            return NextResponse.error(new Error('Invalid date'));
        }
        console.log("testing here 7");

        const existsUser = await prisma.user.findUnique({
            where: {
                uid: uid,
            },
        });
        console.log("testing here 8");
        if(!existsUser) {
            console.log("testing here 9");
            await prisma.user.create({
                data: {
                    uid: `${uid}`,
                },
            });
        }
        console.log("testing here 10");

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
        console.log("testing here 11");

        return NextResponse.json({ message: `Successfully registered user` }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}