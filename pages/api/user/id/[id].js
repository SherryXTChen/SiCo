import { validate } from 'uuid';
import prisma from '../../../../lib/prisma';

export default async function GET(req, res) {
    try {
        const { id } = req.query;
        if(!validate(id)) {
            res.status(401).json({ message: 'Invalid user id' });
        }
        const existsUser = await prisma.user.findUnique({
            where: {
                uid: id,
            },
        });
        if(!existsUser) {
            await prisma.user.create({
                data: {
                    uid: id,
                },
            });
        }

        const userId = await prisma.user.findUnique({
            where: {
                uid: id,
            },
            select: {
                id: true,
            },
        });

        res.setHeader('Content-Type', 'text/plain');
        res.end(`${userId.id}`);
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}