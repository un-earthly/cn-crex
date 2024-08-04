"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import Flag from 'react-flagkit';

const MatchDetailsPage = ({ matchId }) => {
    const [match, setMatch] = useState(null);
    const [commentary, setCommentary] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch match details
        fetchMatchDetails(matchId);
    }, [matchId]);

    useEffect(() => {
        // Fetch initial commentary
        fetchCommentary(matchId, 1);
    }, [matchId]);

    const fetchMatchDetails = async (id) => {
        // Simulate API call
        const mockMatch = {
            id: id,
            teams: { home: "India", away: "Australia" },
            score: { home: "280/4", away: "" },
            overs: { home: "45.0", away: "0.0" },
            toss: "India won the toss and elected to bat",
            venue: "Melbourne Cricket Ground",
            date: "August 15, 2024",
            playingXI: {
                home: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"],
                away: ["Player A", "Player B", "Player C", "Player D", "Player E", "Player F", "Player G", "Player H", "Player I", "Player J", "Player K"]
            },
            battingSummary: [
                { name: "Player 1", runs: 85, balls: 94, fours: 8, sixes: 2 },
                { name: "Player 2", runs: 65, balls: 70, fours: 6, sixes: 1 },
                { name: "Player 3", runs: 45, balls: 40, fours: 4, sixes: 1 },
            ],
            bowlingSummary: [
                { name: "Player A", overs: "10", maidens: 1, runs: 52, wickets: 1 },
                { name: "Player B", overs: "9", maidens: 0, runs: 48, wickets: 2 },
                { name: "Player C", overs: "8", maidens: 0, runs: 45, wickets: 1 },
            ],
            oversSummary: [
                { over: 45, runs: 8, wickets: 0 },
                { over: 44, runs: 12, wickets: 1 },
                { over: 43, runs: 6, wickets: 0 },
                // ... more overs
            ]
        };
        setMatch(mockMatch);
    };

    const fetchCommentary = async (id, page) => {
        setLoading(true);
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newCommentary = [
            { ball: "44.6", text: "FOUR! Brilliant shot through the covers." },
            { ball: "44.5", text: "Good length delivery, defended back to the bowler." },
            { ball: "44.4", text: "Short ball, pulled away for a single." },
            // ... more commentary
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
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {match.teams.home} vs {match.teams.away}
                    </CardTitle>
                    <p className="text-gray-600">{match.venue} • {match.date}</p>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <div>
                            <Flag country="IN" className="w-10 h-10 inline-block mr-2" />
                            <span className="font-bold">{match.teams.home}</span>
                            <p className="text-xl font-semibold">{match.score.home} ({match.overs.home} overs)</p>
                        </div>
                        <div className="text-right">
                            <Flag country="AU" className="w-10 h-10 inline-block ml-2" />
                            <span className="font-bold">{match.teams.away}</span>
                            <p className="text-xl font-semibold">{match.score.away} ({match.overs.away} overs)</p>
                        </div>
                    </div>
                    <p className="mt-4 text-center text-gray-600">{match.toss}</p>
                </CardContent>
            </Card>

            <Tabs defaultValue="scorecard">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
                    <TabsTrigger value="commentary">Commentary</TabsTrigger>
                    <TabsTrigger value="overs">Overs</TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>

                <TabsContent value="scorecard">
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

                <TabsContent value="commentary">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Commentary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full" onScrollCapture={handleScroll}>
                                {commentary.map((item, index) => (
                                    <div key={index} className="mb-4">
                                        <span className="font-bold">{item.ball}</span>: {item.text}
                                    </div>
                                ))}
                                {loading && <p>Loading more...</p>}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="overs">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overs Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Over</TableHead>
                                        <TableHead>Runs</TableHead>
                                        <TableHead>Wickets</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {match.oversSummary.map((over, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{over.over}</TableCell>
                                            <TableCell>{over.runs}</TableCell>
                                            <TableCell>{over.wickets}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Match Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-bold mb-2">Venue</h3>
                            <p className="mb-4">{match.venue}</p>
                            <h3 className="font-bold mb-2">Date</h3>
                            <p className="mb-4">{match.date}</p>
                            <h3 className="font-bold mb-2">Toss</h3>
                            <p className="mb-4">{match.toss}</p>
                            <h3 className="font-bold mb-2">Playing XI</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">{match.teams.home}</h4>
                                    <ul className="list-disc list-inside">
                                        {match.playingXI.home.map((player, index) => (
                                            <li key={index}>{player}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">{match.teams.away}</h4>
                                    <ul className="list-disc list-inside">
                                        {match.playingXI.away.map((player, index) => (
                                            <li key={index}>{player}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MatchDetailsPage;