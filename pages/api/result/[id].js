import fs from 'fs';
import path from 'path';
// import { NextRequest, NextResponse } from 'next/server';

export default function GET(req, res) {
    const { id } = req.query;
    const filepath = path.parse(id).base;
    const imagePath = path.join(process.cwd(), 'results', `${filepath}`);
    if(!fs.existsSync(imagePath)) {
        res.status(404).json({ message: 'Image not found' });
    }
    const image = fs.readFileSync(imagePath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.end(image);
}
