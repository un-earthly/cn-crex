'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function StreamContent({ chid }) {
    const [streamData, setStreamData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStreamData = async () => {
            try {
                const response = await fetch(`/api/get-stream?chid=${chid}`);
                if (!response.ok) throw new Error('Failed to fetch stream data');
                const data = await response.json();
                setStreamData(data);
            } catch (err) {
                console.error('Error fetching stream data:', err);
                setError('Failed to load stream. Please try again later.');
            }
        };

        if (chid) fetchStreamData();
    }, [chid]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!streamData) {
        return null; // This will show the loading state from the parent
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <Script src="/testing.js" />
            <Script id="stream-script" dangerouslySetInnerHTML={{ __html: streamData.script }} />
            <p className="mb-4">Stream content goes here.</p>
            {/* Add your video player or stream content here */}
        </div>
    );
}