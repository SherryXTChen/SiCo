import { validate } from 'uuid';
import prisma from '../../../../lib/prisma';

export default async function GET(req, res) {
    try {
        const { id } = req.query;
        if(!validate(id)) {
            res.status(401).json({ message: 'Invalid user id' });
        }
        console.log('testing here 0.5:', id)
        const existsUser = await prisma.user.findUnique({
            where: {
                uid: id,
            },
        });
        if(!existsUser) {
            res.setHeader('Content-Type', 'text/plain');
            res.end('0');
            return;
        }
        console.log("testing here 1:", existsUser)

        const userSurveys = await prisma.survey.findMany({
            where: {
                uid: id,
            },
        });
        console.log("testing here 2:", userSurveys)
        if(!userSurveys) {
            res.setHeader('Content-Type', 'text/plain');
            res.end('0');
            return;
        }

        res.setHeader('Content-Type', 'text/plain');
        res.end(`${userSurveys.length}`);
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}