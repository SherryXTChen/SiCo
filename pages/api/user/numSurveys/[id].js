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
            res.setHeader('Content-Type', 'text/plain');
            res.end('0');
            return;
        }

        const userSurveys = await prisma.survey.findMany({
            where: {
                uid: id,
            },
        });
        if(!userSurveys) {
            res.setHeader('Content-Type', 'text/plain');
            res.end('0');
            return;
        }

        await prisma.$disconnect();
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${userSurveys.length}`);
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}