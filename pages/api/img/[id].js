import fs from 'fs';
import path from 'path';
import { validate } from 'uuid';

export default function GET(req, res) {
    try {
        const { id } = req.query;
        if(!validate(id)) {
            res.status(401).json({ message: 'Invalid user id' });
        }
        const imagePath = path.join(process.cwd(), 'cache', `${id}`, 'userImage.jpg');
        if(!fs.existsSync(imagePath)) {
            res.status(404).json({ message: 'Image not found' });
        }
        const image = fs.readFileSync(imagePath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.end(image);
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
