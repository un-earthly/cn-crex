"use client"
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";
import Link from "next/link";

const ErrorAlert = ({ message }) => (
    <Alert variant="destructive" className="mb-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);

const SafeImage = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc('/placeholder-news.png')}
        />
    );
};

const NewsCard = ({ item }) => {
    if (!item) return null;

    const {
        url = '#',
        imageUrl,
        title = 'No Title',
        time = 'Unknown time',
        excerpt
    } = item;

    const newsUrl = url?.replace("https://cricket.one", "") || '#';
    const isFantasyTip = title?.toLowerCase().includes('dream11') ?? false;

    return (
        <Link href={newsUrl} className={`group ${excerpt ? 'md:col-span-2' : ''}`}>
            <Card className="overflow-hidden h-full flex transition-shadow hover:shadow-lg">
                <div className="relative basis-1/4">
                    <SafeImage
                        src={imageUrl}
                        alt={title}
                        className="transition-transform group-hover:scale-105 h-full w-full object-cover"
                    />
                </div>
                <CardContent className="p-4 basis-3/4">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{time}</span>
                    </div>
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h2>
                    {excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-3">{excerpt}</p>
                    )}
                    {isFantasyTip && (
                        <Badge variant="secondary" className="mt-2">Fantasy Tips</Badge>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
};

export default function NewsPage({ params }) {
    const { slug, subSlug } = params ?? {};
    const [state, setState] = useState({
        data: [],
        title: '',
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchNews = async () => {
            if (!slug?.trim() || !subSlug?.trim()) {
                setState(prev => ({
                    ...prev,
                    error: 'Invalid parameters',
                    loading: false
                }));
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE}/api/series/${slug}/${subSlug}/news`
                );

                if (!response?.data?.data) {
                    throw new Error('Invalid data format received');
                }

                setState(prev => ({
                    ...prev,
                    data: response.data.data.newsItems || [],
                    title: response.data.data.title || 'Latest News',
                    error: null,
                    loading: false
                }));
            } catch (err) {
                console.error('Error fetching news:', err);
                setState(prev => ({
                    ...prev,
                    error: err.response?.data?.message || 'Failed to load news',
                    loading: false
                }));
            }
        };

        fetchNews();
    }, [slug, subSlug]);

    if (state.loading) return <Loading />;

    if (state.error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorAlert message={state.error} />
            </div>
        );
    }

    if (!state.data.length) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-6 text-center text-gray-500">
                    <p>No news articles available</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">
                {state.title}
            </h1>
            <div className="grid gap-6 md:grid-cols-2">
                {state.data.map((item, index) => (
                    <NewsCard key={index} item={item} />
                ))}
            </div>
        </div>
    );
}