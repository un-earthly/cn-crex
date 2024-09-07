"use client"
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";
import Link from "next/link";

export default function NewsPage({ params }) {
    const { slug, subSlug } = params;
    const [data, setData] = useState(null);
    const [title, setTitle] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_BASE + '/api/series/' + slug + '/' + subSlug + "/news")
            .then((response) => {
                console.log(response.data);
                setData(response.data.data.newsItems);
                setTitle(response.data.data.title)
            })
            .catch(err => console.log(err))
            .finally(() => { setLoading(false); });
    }, []);
    if (loading) {
        return <Loading />
    }
    return <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
        <div className="grid gap-6 md:grid-cols-2">
            {data.map((item, index) => (
                <Link href={item.url} key={index} className={`group ${item.excerpt ? 'md:col-span-2 ' : ''}`}>
                    <Card className="overflow-hidden h-full flex transition-shadow hover:shadow-lg">
                        <div className="relative basis-1/4">
                            <img

                                src={item.imageUrl}
                                alt={item.title}
                                className="transition-transform group-hover:scale-105 h-full w-full object-cover"
                            />
                        </div>
                        <CardContent className="p-4 basis-3/4">
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{item.time}</span>
                            </div>
                            <h2 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {item.title}
                            </h2>
                            {item.excerpt && (
                                <p className="text-muted-foreground text-sm line-clamp-3">{item.excerpt}</p>
                            )}
                            {item.title.toLowerCase().includes('dream11') && (
                                <Badge variant="secondary" className="mt-2">Fantasy Tips</Badge>
                            )}
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
}