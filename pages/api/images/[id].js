const fs = require('fs');
const path = require('path');
import { validate } from 'uuid';

// New API endpoint to list images in the /results directory
export default async function GET(req, res) {
    const { id } = req.query;
    if(!validate(id)) {
        res.status(401).json({ message: 'Invalid user id' });
    }
    const resultsFolderPath = path.join(process.cwd(), 'results', id);
    try {
        const files = await fs.promises.readdir(resultsFolderPath);
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.status(200).json({ message: images });
    } catch(err) {
        console.error('Error reading the results directory:', err);
        res.status(500).json({ message: 'Error reading files' });
    }
};
