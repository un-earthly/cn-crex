"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import Flag from 'react-flagkit';

export default function MatchDetailsPage() {
    const [match, setMatch] = useState(null);
    const [commentary, setCommentary] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     fetchMatchDetails(matchId);
    //     fetchCommentary(matchId, 1);
    // }, [matchId]);

    // const fetchMatchDetails = async (id) => {
    //     const mockMatch = {
    //         id: id,
    //         teams: { home: "India", away: "Australia" },
    //         score: { home: "280/4", away: "" },
    //         overs: { home: "45.0", away: "0.0" },
    //         toss: "India won the toss and elected to bat",
    //         venue: "Melbourne Cricket Ground",
    //         date: "August 15, 2024",
    //         playingXI: {
    //             home: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"],
    //             away: ["Player A", "Player B", "Player C", "Player D", "Player E", "Player F", "Player G", "Player H", "Player I", "Player J", "Player K"]
    //         },
    //         battingSummary: [
    //             { name: "Player 1", runs: 85, balls: 94, fours: 8, sixes: 2 },
    //             { name: "Player 2", runs: 65, balls: 70, fours: 6, sixes: 1 },
    //             { name: "Player 3", runs: 45, balls: 40, fours: 4, sixes: 1 },
    //         ],
    //         bowlingSummary: [
    //             { name: "Player A", overs: "10", maidens: 1, runs: 52, wickets: 1 },
    //             { name: "Player B", overs: "9", maidens: 0, runs: 48, wickets: 2 },
    //             { name: "Player C", overs: "8", maidens: 0, runs: 45, wickets: 1 },
    //         ],
    //         oversSummary: [
    //             { over: 45, runs: 8, wickets: 0 },
    //             { over: 44, runs: 12, wickets: 1 },
    //             { over: 43, runs: 6, wickets: 0 },
    //         ]
    //     };
    //     setMatch(mockMatch);
    // };

    const fetchCommentary = async (id, page) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newCommentary = [
            { ball: "44.6", text: "FOUR! Brilliant shot through the covers." },
            { ball: "44.5", text: "Good length delivery, defended back to the bowler." },
            { ball: "44.4", text: "Short ball, pulled away for a single." },
        ];

        setCommentary(prev => [...prev, ...newCommentary]);
        setPage(page);
        setLoading(false);
    };

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop === clientHeight && !loading) {
            fetchCommentary(matchId, page + 1);
        }
    };

    if (!match) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-1/4">
                    <Card className="sticky top-4 overflow-hidden border-gray-200 border">
                        <CardHeader className="bg-green-600">
                            <CardTitle className="text-xl text-white">Match Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 bg-white">
                            <div className="space-y-4">
                                <div className="p-3 border-l-4 bg-blue-50 border-blue-500">
                                    <h3 className="font-semibold text-gray-800">
                                        <Flag country="IN" className="inline-block mr-2" />
                                        {match.teams.home}
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600">{match.score.home}</p>
                                    <p className="text-sm text-gray-600">({match.overs.home} overs)</p>
                                </div>
                                <div className="p-3 bg-green-50 border-l-4 border-green-500">
                                    <h3 className="font-semibold text-gray-800">
                                        <Flag country="AU" className="inline-block mr-2" />
                                        {match.teams.away}
                                    </h3>
                                    <p className="text-2xl font-bold text-green-600">{match.score.away}</p>
                                    <p className="text-sm text-gray-600">({match.overs.away} overs)</p>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">{match.venue}</p>
                                    <p className="text-sm text-gray-600">{match.date}</p>
                                </div>
                                <div className="border border-green-500 p-3 shadow-md rounded-lg">
                                    <p className="text-sm font-semibold text-green-800">Toss</p>
                                    <p className="text-sm text-gray-700">{match.toss}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                <main className="lg:w-3/4">
                    <Tabs defaultValue="scorecard">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                            <TabsTrigger value="scorecard" className="data-[state=active]:bg-white data-[state=active]:text-gray-800">Scorecard</TabsTrigger>
                            <TabsTrigger value="commentary" className="data-[state=active]:bg-white data-[state=active]:text-gray-800">Commentary</TabsTrigger>
                            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:text-gray-800">Info</TabsTrigger>
                        </TabsList>
                        <TabsContent value="scorecard" className="p-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Batting Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Batsman</TableHead>
                                                <TableHead>Runs</TableHead>
                                                <TableHead>Balls</TableHead>
                                                <TableHead>4s</TableHead>
                                                <TableHead>6s</TableHead>
                                                <TableHead>SR</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {match.battingSummary.map((batsman, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{batsman.name}</TableCell>
                                                    <TableCell>{batsman.runs}</TableCell>
                                                    <TableCell>{batsman.balls}</TableCell>
                                                    <TableCell>{batsman.fours}</TableCell>
                                                    <TableCell>{batsman.sixes}</TableCell>
                                                    <TableCell>{((batsman.runs / batsman.balls) * 100).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <Card className="mt-4">
                                <CardHeader>
                                    <CardTitle>Bowling Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Bowler</TableHead>
                                                <TableHead>Overs</TableHead>
                                                <TableHead>Maidens</TableHead>
                                                <TableHead>Runs</TableHead>
                                                <TableHead>Wickets</TableHead>
                                                <TableHead>Economy</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {match.bowlingSummary.map((bowler, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{bowler.name}</TableCell>
                                                    <TableCell>{bowler.overs}</TableCell>
                                                    <TableCell>{bowler.maidens}</TableCell>
                                                    <TableCell>{bowler.runs}</TableCell>
                                                    <TableCell>{bowler.wickets}</TableCell>
                                                    <TableCell>{(bowler.runs / parseFloat(bowler.overs)).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>


                        <TabsContent value="commentary" className="p-4">
                            <Card>
                                <CardHeader className="bg-gray-100">
                                    <CardTitle className="text-gray-800">Live Commentary</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="mb-4 p-3 bg-gray-50 border-l-4 border-blue-500">
                                        <h3 className="font-bold text-gray-800">Current Batsmen</h3>
                                        <p className="text-gray-700">{match.battingSummary[0].name}: {match.battingSummary[0].runs} ({match.battingSummary[0].balls})</p>
                                        <p className="text-gray-700">{match.battingSummary[1].name}: {match.battingSummary[1].runs} ({match.battingSummary[1].balls})</p>
                                    </div>
                                    <div className="mb-4 p-3 bg-gray-50 border-l-4 border-green-500">
                                        <h3 className="font-bold text-gray-800">Current Bowler</h3>
                                        <p className="text-gray-700">{match.bowlingSummary[0].name}: {match.bowlingSummary[0].wickets}/{match.bowlingSummary[0].runs} ({match.bowlingSummary[0].overs} overs)</p>
                                    </div>
                                    <ScrollArea className="h-[300px] w-full" onScrollCapture={handleScroll}>
                                        {commentary.map((item, index) => (
                                            <div key={index} className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-gray-300">
                                                <span className="font-bold text-gray-700">{item.ball}</span>: {item.text}
                                            </div>
                                        ))}
                                        {loading && <p className="text-gray-600">Loading more...</p>}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="info" className="p-4">
                            <div className="space-y-6">
                                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                    <h3 className="font-bold mb-1 text-gray-800">Match Highlights</h3>
                                    <p className="text-gray-700">{match.toss}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2 text-lg text-gray-800">Playing XI</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2 text-gray-800">
                                                <Flag country="IN" className="inline-block mr-2" />
                                                {match.teams.home}
                                            </h4>
                                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                                {match.playingXI.home.map((player, index) => (
                                                    <li key={index}>{player}</li>
                                                ))}
                                            </ol>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-2 text-gray-800">
                                                <Flag country="AU" className="inline-block mr-2" />
                                                {match.teams.away}
                                            </h4>
                                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                                {match.playingXI.away.map((player, index) => (
                                                    <li key={index}>{player}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>

            </div>

        </div>
    );
};

