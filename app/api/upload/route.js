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
        console.log("Got user image");
        const productImage = data.get('productImage');
        if(!productImage) {
            return NextResponse.error(new Error('No product image found'));
        }
        console.log("Got product image");
        const garmentInfo = data.get('garmentInfo');
        if(!garmentInfo) {
            return NextResponse.error(new Error('No garment info found'));
        }
        console.log("Got garment info");
        const uid = data.get('uid');
        if(!uid) {
            return NextResponse.error(new Error('No user id found'));
        }
        if(!validate(uid)) {
            return NextResponse.error(new Error('Invalid user id'));
        }
        console.log("Got user id");
        const firstSite = data.get('firstSite');
        if(!firstSite) {
            return NextResponse.error(new Error('No first site found'));
        }
        console.log("Got first site");

        console.log("Sending files to netcat");
        const response = await sendTextToNetcat(`upload\n${uid}\n${userImage}\n${productImage}\n${garmentInfo}\n${firstSite}`);
        console.log("Got response from netcat:", response);
        if(response !== 'success') {
            return NextResponse.error(new Error('Error processing files'));
        }
        return NextResponse.json({ message: 'Files uploaded successfully.' }, { status: 200 });
    } catch(err) {
        console.error('Error processing files:', err);
        return NextResponse.error(new Error('Error processing files'));
    }
}