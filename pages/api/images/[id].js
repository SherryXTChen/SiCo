import { validate } from 'uuid';
import prisma from '../../../lib/db';

// New API endpoint to list images in the /results directory
export default async function GET(req, res) {
    const { id } = req.query;
    const uid = id.split('--')[0];
    const firstSite = id.split('--')[1];
    if(!validate(uid)) {
        res.status(401).json({ message: 'Invalid user id' });
    }

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
    try {
        const files = await prisma.user.findUnique({
            where: {
                uid: uid,
            },
            select: {
                userImageResult: {
                    where: {
                        firstSite: firstSite === "true",
                    },
                    select: {
                        url: true,
                    },
                },
            },
        });
        if(!files) {
            return res.status(200).json({ message: [] });
        }
        return res.status(200).json({ message: files.userImageResult.map(file => file.url) });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
};