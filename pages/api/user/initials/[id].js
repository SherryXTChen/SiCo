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
            select: {
                uid: true,
            }
        });
        if(!existsUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userInitials = await prisma.user.findUnique({
            where: {
                uid: id,
            },
            select: {
                initials: true,
            },
        });
        await prisma.$disconnect();
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${userInitials.initials}`);
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}