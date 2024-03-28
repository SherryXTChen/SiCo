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
        const productImage = data.get('productImage');
        if(!productImage) {
            return NextResponse.error(new Error('No product image found'));
        }
        const garmentInfo = data.get('garmentInfo');
        if(!garmentInfo) {
            return NextResponse.error(new Error('No garment info found'));
        }
        const uid = data.get('uid');
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }
        const firstSite = data.get('firstSite');
        if(!firstSite) {
            return NextResponse.error(new Error('No first site found'));
        }

        const response = await sendTextToNetcat(`upload\n${uid}\n${userImage}\n${productImage}\n${garmentInfo}\n${firstSite}`);
        if(response !== 'success') {
            return NextResponse.error(new Error('Error processing files'));
        }
        return NextResponse.json({ message: 'Files uploaded successfully.' }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}