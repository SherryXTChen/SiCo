import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const resultsFolderPath = path.join(process.cwd(), 'results');

    try {
        fs.readdir(resultsFolderPath, (err, files) => {
            if (err) {
                console.error('Error reading the results directory:', err);
                return res.status(500).json({ message: 'Error reading files' });
            }
            const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            res.status(200).json(images);
        });
    } catch (err) {
        console.error('Error reading the results directory:', err);
        return res.status(500).json({ message: 'Error reading files' });
    }
}
