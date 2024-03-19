const fs = require('fs');
const path = require('path');
import { validate } from 'uuid';
import prisma from '../../../lib/db';

// New API endpoint to list images in the /results directory
export default async function GET(req, res) {
    const { id } = req.query;
    if(!validate(id)) {
        res.status(401).json({ message: 'Invalid user id' });
    }
    const uid = id;

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
    try {
        const files = await prisma.user.findUnique({
            where: {
                uid: uid,
            },
            select: {
                userImageResult: {
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

    // const resultsFolderPath = path.join(process.cwd(), 'results', id);
    // try {
    //     const files = await fs.promises.readdir(resultsFolderPath);
    //     const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    //     res.status(200).json({ message: images });
    // } catch(err) {
    //     console.error('Error reading the results directory:', err);
    //     res.status(500).json({ message: 'Error reading files' });
    // }
};