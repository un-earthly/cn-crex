"use client"
import Loading from "@/components/global/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios";
import { CalendarDays, Trophy, Clock } from "lucide-react"
import { useEffect, useState } from "react";


export default function Component({ params }) {
    const { slug, subSlug } = params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_BASE + '/api/series/' + slug + '/' + subSlug+"/info")
            .then((response) => { console.log(response.data); setData(response.data.data) })
            .catch(err => console.log(err))
            .finally(() => { setLoading(false); });
    }, []);
    if (loading) {
        return <Loading />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">{data.title}</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Series Name</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.series}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Duration</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.duration}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Format</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.format}</div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}