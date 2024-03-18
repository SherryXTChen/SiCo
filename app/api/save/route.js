import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'uuid';
import prisma from '../../../lib/prisma';

const modelURLs = {
    'man_1.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/man_1-0CXJYnGYBd5GDWZOVj0Wip0sSP7tM6.jpg',
    'man_2.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/man_2-zzu7L3zfr28BVNqdKWIebsY9PDZFAI.jpg',
    'man_3.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/man_3-sudyA9yFqsIcf8qM0C4b2qg1JRVWcr.jpg',
    'man_4.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/man_4-tLfYwDKKD3z0zVS5gb4w0nsr2Xe6Kz.jpg',
    'man_5.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/man_5-H3UdIenvPrxd7uD5tox5yIP4AiMufc.jpg',
    'man_6.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/man_6-uwdZBcF36fxOm5dpTH5sU5dkkAl4eW.jpg',
    'woman_1.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/woman_1-AyLal0pyfs9X4pUOQEtPnmoZuNQpaL.jpg',
    'woman_2.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/woman_2-tdIjvRA1Nl3x9sGN2Y3dv6AgFe1SkT.jpg',
    'woman_3.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/woman_3-5kud9b7VcAwy2KEg9xjqtEGT6VusOJ.jpg',
    'woman_4.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/woman_4-RcaQvYM89zoN4NQS9OMrWbzJIFOz19.jpg',
    'woman_5.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/woman_5-tHQu0L8oeG0KVzRjI0QNMbefJhLhXu.jpg',
    'woman_6.jpg': 'https://owvsun6fpt6ye72u.public.blob.vercel-storage.com/woman_6-FKNDDdNPNiUgG7dixqOpEV1TNZOQVH.jpg',
};

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
        const chosenImageBlobURL = modelURLs[`${path.parse(userImageData).base}`];

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
                        url: chosenImageBlobURL,
                    }
                },
            },
        });

        return NextResponse.json({ message: `${chosenImageBlobURL}` }, { status: 200 });
    } catch (err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}