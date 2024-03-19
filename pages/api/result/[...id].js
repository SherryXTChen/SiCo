import fs from 'fs';
import path from 'path';
import { validate } from 'uuid';

// TODO: remove this depreciated API endpoint
export default function GET(req, res) {
    const { id } = req.query;
    const uid = id[0];
    if(!validate(uid)) {
        res.status(401).json({ message: 'Invalid user id' });
    }
    const filepath = path.parse(id[1]).base;
    const imagePath = path.join(process.cwd(), 'results', `${uid}`, `${filepath}`);
    if(!fs.existsSync(imagePath)) {
        res.status(404).json({ message: 'Image not found' });
    }
    const image = fs.readFileSync(imagePath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.end(image);
}