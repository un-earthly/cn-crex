"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { Ribbon, Trophy } from "lucide-react"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loading from "@/components/global/loading.jsx"
import DataNotFound from "@/components/global/notfound"
export default function LivePage({ params }) {
    const { param1, slug, slugMn, param2, param3, slugMd } = params;
    const [commentary, setCommentary] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comLoading, setComLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const lastCommentaryElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreCommentary();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const loadMoreCommentary = async () => {
        if (comLoading || !hasMore) return;
        setComLoading(true);
        setError('');

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE}/api/match/com/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/${page}`);

            if (response.data?.commentary?.length === 0) {
                setHasMore(false); // No more commentary available
            }

            setCommentary(prevCommentary => [...prevCommentary, ...response.data?.commentary]);
            setPage(prevPage => prevPage + 1);
            setHasMore(response.data.hasMore);

        } catch (err) {
            setError('Failed to load commentaries');
        } finally {
            setComLoading(false);
        }
    };

    const loadData = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE}/api/match/scoreboard/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/live`);

            if (!response.data) {
                setError('No match data available');
            } else {
                setData(response.data);
            }

        } catch {
            setError('Failed to load Match details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMoreCommentary();
        loadData();
    }, []);

    if (loading) {
        return <Loading />
    }

    if (!data) {
        return <DataNotFound />
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    {/* <div className="flex items-center space-x-2">
                        <Ribbon className="h-6 w-6" />
                        <span>BLB - 2nd Innings</span>
                    </div> */}
                    <Badge variant="outline">{!data?.playerOfTheMatch ? 'Live' : "Finished"}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    <MatchPage oversData={data?.oversData} playersData={data?.playersData} probability={data?.probability} projectedScore={data?.projectedScore} playerOfTheMatch={data?.playerOfTheMatch} />
                    <div>
                        <ScrollArea className="h-[70vh]">
                            <h4 className="font-semibold">Commentary</h4>
                            <div className="space-y-2">
                                {commentary.map((item, index) => (
                                    <div
                                        key={index}
                                        ref={index === commentary.length - 1 ? lastCommentaryElementRef : null}
                                        className="text-sm"
                                    >
                                        {item.commentaryText && <p>
                                            <Trophy className="mr-2 inline-block h-4 w-4" />
                                            {item.commentaryText}
                                        </p>}
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                ))}
                                {comLoading && <p>Loading more commentary...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}

const MatchPage = ({ playersData, oversData, projectedScore, probability, playerOfTheMatch }) => {
    return (
        <div className="space-y-4">
            {/* Players Data */}
            {playersData?.length > 0 ? (
                playersData.map((player, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={player.img || '/placeholder.svg?height=40&width=40'} />
                            <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">{player.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {player.score?.runs || 'N/A'} {player.score?.ball || ''}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground">No player data available</p>
            )}

            {/* Overs Data */}
            {oversData?.length > 0 ? (
                <div className="w-full max-w-sm overflow-x-auto">
                    <div className="flex w-max space-x-4 p-4">
                        <div className="flex w-max space-x-4 p-4">
                            {oversData.reverse().map((over, idx) => (
                                <div key={idx} className="flex-shrink-0">
                                    <h3 className="text-sm font-semibold mb-2">{over.thisOver}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {over.overData.map((ball, ballIdx) => (
                                            <Badge key={ballIdx} variant={ball === 'W' ? 'destructive' : 'secondary'}>
                                                {ball}
                                            </Badge>
                                        ))}
                                        <Badge variant="outline">
                                            = {over.overData.reduce((sum, b) => sum + (parseInt(b) || 0), 0)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-muted-foreground">No overs data available</p>
            )}

            {/* Projected Score and Probability */}
            <div className="mt-6 space-y-3">
                {projectedScore?.rows?.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Projected Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                {projectedScore.rows.map((row, idx) => (
                                    <Fragment key={idx}>
                                        {row.map((col, colIdx) => (
                                            <div key={colIdx} className="text-sm">
                                                {col}
                                            </div>
                                        ))}
                                    </Fragment>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <p className="text-muted-foreground">No projected score available</p>
                )}

                {probability?.teams?.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Winning Probability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {probability.teams.map((team, idx) => (
                                    <Fragment key={idx}>
                                        <div className="text-sm font-medium">{team}</div>
                                        <div className="text-sm">{probability.percentages[idx]}</div>
                                    </Fragment>
                                ))}
                                <div className="relative w-full h-2 bg-gray-200 rounded-full">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-green-500"
                                        style={{ width: probability.progressBarWidth || '0%' }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <p className="text-muted-foreground">No probability data available</p>
                )}
            </div>

            {/* Player of the Match */}
            {playerOfTheMatch ? (
                <div className="text-center mt-4 space-y-2">
                    <h3 className="font-bold text-lg">Player of the Match</h3>
                    <p className="text-sm">
                        <span className="font-medium">{playerOfTheMatch.name}</span> ({playerOfTheMatch.team})
                    </p>
                    <div className="space-y-1">
                        {playerOfTheMatch.performance.map((perf, idx) => (
                            <Badge key={idx} variant="secondary">{perf}</Badge>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-muted-foreground">No player of the match selected yet</p>
            )}
        </div>
    );
};
