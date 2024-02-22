import { NextRequest, NextResponse } from 'next/server';
const fs = require('fs');
const path = require('path');

// New API endpoint to list images in the /results directory
export async function GET(req, res) {
    const resultsFolderPath = path.join(process.cwd(), 'results');
    try {
        const files = await fs.promises.readdir(resultsFolderPath);
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        return NextResponse.json({ message: images }, { status: 200 });
    } catch(err) {
        console.error('Error reading the results directory:', err);
        return NextResponse.error(new Error('Error reading files'));
    }
};
