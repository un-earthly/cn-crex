import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

function getUserIP(req) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const userIP = forwardedFor ? forwardedFor.split(',')[0] : req.ip;
    return userIP;
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
        // Call the external API
        const apiUrl = `https://e765432.xyz/static/69fb31e65e4ed5d6eaebf3b8b0e0e6a715c77cc6/getdata.php?chid=${chid}&userip=${userIP}`;
        const response = await axios.get(apiUrl);

        let streamUrl = response.data;

        // Basic validation to ensure it's a proper URL and not a script
        // if (typeof streamUrl !== 'string' || !streamUrl.startsWith('http')) {
        //     return NextResponse.json({ message: 'Invalid stream URL received' }, { status: 400 });
        // }

        return NextResponse.json({ message: 'Stream URL fetched successfully', script : response.data });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching stream', error: error.message }, { status: 500 });
    }
}
