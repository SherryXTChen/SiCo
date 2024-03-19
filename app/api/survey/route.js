import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const uid = data.get('uid');
        const surveyData = `${data.get('data')}`;
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }
        if(!surveyData) {
            return NextResponse.error(new Error('No survey data found'));
        }
        const jsonData = JSON.parse(surveyData);
        if(!jsonData) {
            return NextResponse.error(new Error('Invalid survey data'));
        }
        if(jsonData["survey-type"] !== "presurvey"
            || jsonData["survey-type"] !== "postversion"
            || jsonData["survey-type"] !== "final") {
            return NextResponse.error(new Error('Invalid survey type'));
        }

        await prisma.user.update({
            where: {
                uid: `${uid}`,
            },
            data: {
                updatedAt: new Date(),
                survey: {
                    create: {
                        response: jsonData,
                    }
                },
            },
        });

        return NextResponse.json({ message: `Successfully registered user` }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}