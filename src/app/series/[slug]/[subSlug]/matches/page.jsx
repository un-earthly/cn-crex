"use client"
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, AlertCircleIcon } from "lucide-react";
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

const MatchCard = ({ match }) => {
    if (!match) return null;

    const {
        link = '#',
        matchInfo = 'Match Details',
        team1 = 'TBA',
        team2 = 'TBA',
        team1Score = '',
        team2Score = '',
        result = '',
        startTime = ''
    } = match;

    return (
        <Link href={link}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{matchInfo}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                            <p className="font-semibold">{team1}</p>
                            <p className="text-muted-foreground">{team1Score}</p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-xl font-bold">vs</p>
                        </div>
                        <div className="flex-1 text-right">
                            <p className="font-semibold">{team2}</p>
                            <p className="text-muted-foreground">{team2Score}</p>
                        </div>
                    </div>
                    {result ? (
                        <Badge variant="secondary" className="w-full justify-center">
                            {result}
                        </Badge>
                    ) : startTime ? (
                        <div className="flex items-center justify-center text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            {startTime}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </Link>
    );
};

export default function Component({ params }) {
    const { slug, subSlug } = params ?? {};
    const [state, setState] = useState({
        data: [],
        title: '',
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchMatches = async () => {
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
                    `${process.env.NEXT_PUBLIC_BASE}/api/series/${slug}/${subSlug}/matches`
                );

                if (!response?.data?.data) {
                    throw new Error('Invalid data format received');
                }

                setState(prev => ({
                    ...prev,
                    data: response.data.data.matchesByDate || [],
                    title: response.data.data.title || 'Matches',
                    error: null,
                    loading: false
                }));
            } catch (err) {
                console.error('Error fetching matches:', err);
                setState(prev => ({
                    ...prev,
                    error: err.response?.data?.message || 'Failed to load matches',
                    loading: false
                }));
            }
        };

        fetchMatches();
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
                    <p>No matches available</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                {state.title}
            </h1>
            {state.data.map((matchDay, index) => (
                <div key={index} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <CalendarDays className="mr-2" />
                        {matchDay.date || 'Date TBA'}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {matchDay?.matches?.map((match, matchIndex) => (
                            <MatchCard key={matchIndex} match={match} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}