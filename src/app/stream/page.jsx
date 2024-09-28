import { Suspense } from 'react';
import StreamContent from '../../components/global/StreamContent';
import Loading from '@/components/global/loading';

export const metadata = {
    title: 'Stream Page',
    description: 'Watch your favorite stream',
};

export default function StreamPage({ searchParams }) {
    const chid = searchParams.chid;

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Stream for Channel {chid}</h1>
                <Suspense fallback={<Loading />}>
                    <StreamContent chid={chid} />
                </Suspense>
            </main>
        </div>
    );
}