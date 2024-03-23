import { NextResponse } from 'next/server';
import { validate } from 'uuid';
import sendTextToNetcat from '../sendTextToNetcat';

export async function POST(req, res) {
    try {
        const data = await req.formData();
        const userImage = data.get('userImage');
        if(!userImage) {
            return NextResponse.error(new Error('No user image found'));
        }
        const uid = data.get('uid');
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }
        sendTextToNetcat(`scan\n${uid}\n${userImage}`);
        return NextResponse.json({ message: 'Files began scanning successfully.' }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}