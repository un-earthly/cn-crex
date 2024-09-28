"use client"
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";
import Link from "next/link";

export default function Component({ params }) {
    const { slug, subSlug } = params;
    const [data, setData] = useState(null);
    const [title, setTitle] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_BASE + '/api/series/' + slug + '/' + subSlug + "/matches")
            .then((response) => {
                console.log(response.data);
                setData(response.data.data.matchesByDate);
                setTitle(response.data.data.title)
            })
            .catch(err => console.log(err))
            .finally(() => { setLoading(false); });
    }, []);
    if (loading) {
        return <Loading />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>
            {data.map((matchDay, index) => (
                <div key={index} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <CalendarDays className="mr-2" />
                        {matchDay.date}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {matchDay?.matches?.map((match, matchIndex) => (
                            <Link key={matchIndex} href={match.link}>
                                <Card >
                                    <CardHeader>
                                        <CardTitle className="text-lg">{match.matchInfo}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex-1">
                                                <p className="font-semibold">{match.team1 || "TBA"}</p>
                                                <p className="text-muted-foreground">{match.team1Score}</p>
                                            </div>
                                            <div className="text-center px-4">
                                                <p className="text-xl font-bold">vs</p>
                                            </div>
                                            <div className="flex-1 text-right">
                                                <p className="font-semibold">{match.team2}</p>
                                                <p className="text-muted-foreground">{match.team2Score}</p>
                                            </div>
                                        </div>
                                        {match.result ? (
                                            <Badge variant="secondary" className="w-full justify-center">
                                                {match.result}
                                            </Badge>
                                        ) : match.startTime ? (
                                            <div className="flex items-center justify-center text-muted-foreground">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {match.startTime}
                                            </div>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}