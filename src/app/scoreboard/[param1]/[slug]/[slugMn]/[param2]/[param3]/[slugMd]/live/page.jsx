"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Ribbon, Trophy, AlertCircleIcon } from "lucide-react";
import axios from "axios";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Loading from "@/components/global/loading";
import DataNotFound from "@/components/global/notfound";

const ErrorAlert = ({ message }) => (
    <Alert variant="destructive" className="mb-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);

const SafeAvatar = ({ player }) => (
    <Avatar>
        <AvatarImage
            src={player.img || '/placeholder.svg?height=40&width=40'}
            alt={player.name}
        />
        <AvatarFallback>
            {(player.name || "").split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
    </Avatar>
);

const MatchPage = ({ playersData = [], oversData = [], projectedScore, probability, playerOfTheMatch }) => {
    return (
        <div className="space-y-4">
            {/* Players Data */}
            {playersData?.length > 0 ? (
                playersData.map((player, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                        <SafeAvatar player={player} />
                        <div>
                            <p className="text-sm font-medium leading-none">{player.name || 'Unknown Player'}</p>
                            <p className="text-sm text-muted-foreground">
                                {player.score?.runs ?? 'N/A'} {player.score?.ball ?? ''}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground">No player data available</p>
            )}

            {/* Overs Data */}
            {oversData?.length > 0 && (
                <ScrollArea className="w-full max-w-sm">
                    <div className="flex space-x-4 p-4">
                        {oversData.reverse().map((over, idx) => (
                            <div key={idx} className="flex-shrink-0">
                                <h3 className="text-sm font-semibold mb-2">{over.thisOver || `Over ${idx + 1}`}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(over.overData || []).map((ball, ballIdx) => (
                                        <Badge key={ballIdx} variant={ball === 'W' ? 'destructive' : 'secondary'}>
                                            {ball}
                                        </Badge>
                                    ))}
                                    <Badge variant="outline">
                                        = {(over.overData || []).reduce((sum, b) => sum + (parseInt(b) || 0), 0)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            )}

            {/* Projected Score */}
            {projectedScore?.rows?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Projected Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                            {projectedScore.rows.map((row, idx) => (
                                <Fragment key={idx}>
                                    {(row || []).map((col, colIdx) => (
                                        <div key={colIdx} className="text-sm">{col || '-'}</div>
                                    ))}
                                </Fragment>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Probability */}
            {probability?.teams?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Winning Probability</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            {probability.teams.map((team, idx) => (
                                <Fragment key={idx}>
                                    <div className="text-sm font-medium">{team || 'Team'}</div>
                                    <div className="text-sm">{probability.percentages?.[idx] || '0%'}</div>
                                </Fragment>
                            ))}
                            <div className="relative w-full h-2 bg-gray-200 rounded-full col-span-2">
                                <div
                                    className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                                    style={{ width: probability.progressBarWidth || '0%' }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Player of the Match */}
            {playerOfTheMatch && (
                <div className="text-center mt-4 space-y-2">
                    <h3 className="font-bold text-lg">Player of the Match</h3>
                    <p className="text-sm">
                        <span className="font-medium">{playerOfTheMatch.name}</span>
                        {" "}({playerOfTheMatch.team})
                    </p>
                    <div className="space-y-1">
                        {(playerOfTheMatch.performance || []).map((perf, idx) => (
                            <Badge key={idx} variant="secondary">{perf}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function LivePage({ params }) {
    const { param1, slug, slugMn, param2, param3, slugMd } = params ?? {};
    const [state, setState] = useState({
        commentary: [],
        data: null,
        loading: true,
        comLoading: false,
        error: null,
        page: 1,
        hasMore: true
    });

    const observer = useRef();

    const loadMoreCommentary = async () => {
        if (state.comLoading || !state.hasMore) return;

        setState(prev => ({ ...prev, comLoading: true }));

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE}/api/match/com/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/${state.page}`
            );

            if (!response?.data?.commentary) {
                throw new Error('Invalid commentary data');
            }

            setState(prev => ({
                ...prev,
                commentary: [...prev.commentary, ...(response.data.commentary || [])],
                page: prev.page + 1,
                hasMore: response.data.hasMore ?? false,
                error: null
            }));
        } catch (err) {
            console.error('Error loading commentary:', err);
            setState(prev => ({
                ...prev,
                error: 'Failed to load commentary'
            }));
        } finally {
            setState(prev => ({ ...prev, comLoading: false }));
        }
    };

    const lastCommentaryElementRef = useCallback(node => {
        if (state.loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && state.hasMore) {
                loadMoreCommentary();
            }
        });

        if (node) observer.current.observe(node);
    }, [state.loading, state.hasMore]);

    useEffect(() => {
        const loadMatchData = async () => {
            if (!param1 || !slug || !slugMn || !param2 || !param3 || !slugMd) {
                setState(prev => ({
                    ...prev,
                    error: 'Invalid match parameters',
                    loading: false
                }));
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE}/api/match/scoreboard/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/live`
                );

                if (!response?.data) {
                    throw new Error('No match data available');
                }

                setState(prev => ({
                    ...prev,
                    data: response.data,
                    error: null
                }));

                await loadMoreCommentary();
            } catch (err) {
                console.error('Error loading match data:', err);
                setState(prev => ({
                    ...prev,
                    error: 'Failed to load match data'
                }));
            } finally {
                setState(prev => ({ ...prev, loading: false }));
            }
        };

        loadMatchData();
    }, [param1, slug, slugMn, param2, param3, slugMd]);

    if (state.loading) return <Loading />;

    if (state.error) {
        return (
            <div className="container mx-auto p-4">
                <ErrorAlert message={state.error} />
            </div>
        );
    }

    if (!state.data) return <DataNotFound />;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <Badge variant="outline">
                        {!state.data?.playerOfTheMatch ? 'Live' : 'Finished'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    <MatchPage
                        oversData={state.data?.oversData}
                        playersData={state.data?.playersData}
                        probability={state.data?.probability}
                        projectedScore={state.data?.projectedScore}
                        playerOfTheMatch={state.data?.playerOfTheMatch}
                    />
                    <div>
                        <ScrollArea className="h-[70vh]">
                            <h4 className="font-semibold">Commentary</h4>
                            <div className="space-y-2">
                                {state.commentary.map((item, index) => (
                                    <div
                                        key={index}
                                        ref={index === state.commentary.length - 1 ? lastCommentaryElementRef : null}
                                        className="text-sm"
                                    >
                                        {item.commentaryText && (
                                            <p>
                                                <Trophy className="mr-2 inline-block h-4 w-4" />
                                                {item.commentaryText}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                ))}
                                {state.comLoading && <p className="text-center text-gray-500">Loading more commentary...</p>}
                                {!state.hasMore && <p className="text-center text-gray-500">No more commentary available</p>}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}