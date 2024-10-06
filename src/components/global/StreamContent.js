'use client';

import { useState } from 'react';

export default function StreamLauncher({ chid }) {
    const [isLoading, setIsLoading] = useState(false);

    const launchStream = () => {
        setIsLoading(true);
        const streamUrl = `/api/get-stream?chid=${chid}`;
        const streamWindow = window.open(streamUrl, '_blank');

        if (streamWindow) {
            streamWindow.focus();
        } else {
            alert('Please allow popups for this website');
        }

        setIsLoading(false);
    };

    return (
        <button
            onClick={launchStream}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            {isLoading ? 'Loading...' : 'Launch Stream'}
        </button>
    );
}
