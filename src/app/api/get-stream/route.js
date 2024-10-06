import { NextResponse } from 'next/server';
import axios from 'axios';

function getUserIP(req) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    return forwardedFor ? forwardedFor.split(',')[0] : req.ip;
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const chid = searchParams.get('chid');

    if (!chid) {
        return NextResponse.json({ message: 'Channel ID (chid) is required' }, { status: 400 });
    }

    const userIP = getUserIP(req);

    if (!userIP) {
        return NextResponse.json({ message: 'User IP is required' }, { status: 400 });
    }

    try {
        const apiUrl = `https://e765432.xyz/static/69fb31e65e4ed5d6eaebf3b8b0e0e6a715c77cc6/getdata.php?chid=${chid}&userip=${userIP}`;
        const response = await axios.get(apiUrl);
        const script = response.data;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Stream Page</title>
            </head>
            <body>
                <h1>Stream Content</h1>
                <div id="stream-container"></div>
                ${script}
            </body>
            </html>
        `;

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching stream', error: error.message }, { status: 500 });
    }
}
