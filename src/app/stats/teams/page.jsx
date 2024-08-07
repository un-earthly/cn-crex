"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Flag from 'react-flagkit';
import { ArrowLeft, Loader, Loader2, Play } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Container from '@/components/global/container';


const cricketTeams = [
    { name: 'Australia', code: 'AU' },
    { name: 'India', code: 'IN' },
    { name: 'England', code: 'GB' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'West Indies', code: 'WI' },
    { name: 'Afghanistan', code: 'AF' },
    // Add more teams as needed
];

const generateMockData = (startIndex, count) => {
    const teams = cricketTeams.slice(0, count);
    return teams.map((team, index) => {
        const reductionValues = [0.5, 1, 2, 5];
        const reductionFactor = reductionValues[Math.floor(Math.random() * reductionValues.length)];
        const points = Math.max(3000 - (startIndex + index) * reductionFactor, 0);  // Ensure points do not go negative
        return {
            rank: startIndex + index + 1,
            team: team.name,
            rating: 100 - (startIndex + index) * 2,
            points: points,
            matches: Math.floor(Math.random() * 20) + 1,
            code: team.code,
        };
    });
};
const StandingsTable = ({ format, initialStandings }) => {
    const [standings, setStandings] = useState(initialStandings);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchMoreData = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        // Simulate an API call to fetch more data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newStandings = generateMockData(standings.length, 5);
        setStandings((prevStandings) => [...prevStandings, ...newStandings]);
        setLoading(false);
        setPage((prevPage) => prevPage + 1);
    }, [loading, standings]);

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            fetchMoreData();
        }
    };

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader>
                <CardTitle>{format === "t20" ? "T-20 " : format === "test" ? "Test " : "ODI "}</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[50vh] w-full" onScrollCapture={handleScroll}>
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-background">
                            <TableRow>
                                <TableHead className="w-[60px]">Rank</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {standings?.map((team, index) => (
                                <TableRow
                                    key={`${format}-${team.rank}-${index}`}
                                    className={index <= 2 ? "font-medium" : ""}
                                >
                                    <TableCell>
                                        <Badge
                                            variant={index === 0 ? "default" : "secondary"}
                                            className={`
                        ${index === 0 ? 'bg-green-500 hover:bg-green-600' : ''}
                        ${index === 1 ? 'bg-gray-400 hover:bg-gray-500' : ''}
                        ${index === 2 ? 'bg-orange-400 hover:bg-orange-500' : ''}
                      `}
                                        >
                                            {team.rank}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Flag country={team.code} />
                                            <span>{team.team}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{team.rating}</TableCell>
                                    <TableCell>{team.points}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {loading && (
                        <div className="py-4 text-center text-muted-foreground">
                            <Loader2 className="inline animate-spin mr-2" />
                            Loading more data...
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>

    );
};

const TeamStandingsPage = () => {
    const formatStandings = {
        test: [
            { rank: 1, team: 'India', rating: 121, points: 3732, matches: 31, code: 'IN' },
            { rank: 2, team: 'Australia', rating: 116, points: 3572, matches: 31, code: 'AU' },
            { rank: 3, team: 'England', rating: 115, points: 3450, matches: 30, code: 'GB' },
            { rank: 4, team: 'New Zealand', rating: 108, points: 3240, matches: 30, code: 'NZ' },
            { rank: 5, team: 'Pakistan', rating: 102, points: 3060, matches: 30, code: 'PK' },
            { rank: 6, team: 'South Africa', rating: 97, points: 2910, matches: 30, code: 'ZA' },
            { rank: 7, team: 'Sri Lanka', rating: 92, points: 2760, matches: 30, code: 'LK' },
            { rank: 8, team: 'West Indies', rating: 87, points: 2610, matches: 30, code: 'JM' },
            { rank: 9, team: 'Bangladesh', rating: 82, points: 2460, matches: 30, code: 'BD' },
            { rank: 10, team: 'Zimbabwe', rating: 77, points: 2310, matches: 30, code: 'ZW' },
            { rank: 11, team: 'Afghanistan', rating: 72, points: 2160, matches: 30, code: 'AF' },
            { rank: 12, team: 'Ireland', rating: 67, points: 2010, matches: 30, code: 'IR' }
        ],
        odi: [
            { rank: 1, team: 'Australia', rating: 121, points: 2355, matches: 20, code: 'AU' },
            { rank: 2, team: 'India', rating: 116, points: 3089, matches: 27, code: 'IN' },
            { rank: 3, team: 'New Zealand', rating: 114, points: 2745, matches: 24, code: 'NZ' },
            { rank: 4, team: 'England', rating: 112, points: 2800, matches: 25, code: 'GB' },
            { rank: 5, team: 'South Africa', rating: 108, points: 2700, matches: 25, code: 'ZA' },
            { rank: 6, team: 'Pakistan', rating: 104, points: 2600, matches: 25, code: 'PK' },
            { rank: 7, team: 'Sri Lanka', rating: 98, points: 2450, matches: 25, code: 'LK' },
            { rank: 8, team: 'West Indies', rating: 92, points: 2300, matches: 25, code: 'JM' },
            { rank: 9, team: 'Bangladesh', rating: 86, points: 2150, matches: 25, code: 'BD' },
            { rank: 10, team: 'Afghanistan', rating: 82, points: 2050, matches: 25, code: 'AF' },
            { rank: 11, team: 'Zimbabwe', rating: 78, points: 1950, matches: 25, code: 'ZW' },
            { rank: 12, team: 'Ireland', rating: 72, points: 1800, matches: 25, code: 'IR' }
        ],
        t20: [
            { rank: 1, team: 'England', rating: 272, points: 10411, matches: 39, code: 'GB' },
            { rank: 2, team: 'India', rating: 267, points: 11011, matches: 42, code: 'IN' },
            { rank: 3, team: 'Pakistan', rating: 264, points: 9504, matches: 36, code: 'PK' },
            { rank: 4, team: 'Australia', rating: 261, points: 9385, matches: 36, code: 'AU' },
            { rank: 5, team: 'New Zealand', rating: 258, points: 9258, matches: 36, code: 'NZ' },
            { rank: 6, team: 'South Africa', rating: 255, points: 9135, matches: 36, code: 'ZA' },
            { rank: 7, team: 'West Indies', rating: 252, points: 9009, matches: 36, code: 'JM' },
            { rank: 8, team: 'Sri Lanka', rating: 249, points: 8889, matches: 36, code: 'LK' },
            { rank: 9, team: 'Afghanistan', rating: 246, points: 8760, matches: 36, code: 'AF' },
            { rank: 10, team: 'Bangladesh', rating: 243, points: 8649, matches: 36, code: 'BD' },
            { rank: 11, team: 'Zimbabwe', rating: 240, points: 8520, matches: 36, code: 'ZW' },
            { rank: 12, team: 'Ireland', rating: 237, points: 8409, matches: 36, code: 'IR' }
        ]
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.icc-cricket.com/image/upload/t_ratio21_9-size60/prd/tevxytyonxrsx90jpnqq"
                        alt="Cricket match"
                        className="opacity-30 object-cover w-full h-full"
                    />
                </div>
                <Container className="relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center text-green-100 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
                        ICC Team Rankings
                    </h1>
                </Container>
            </header>

            <main className="py-8">
                <Container>
                    <Tabs defaultValue="test" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="test" >Test</TabsTrigger>
                            <TabsTrigger value="odi">ODI</TabsTrigger>
                            <TabsTrigger value="t20">T20</TabsTrigger>
                        </TabsList>
                        <TabsContent value="test">
                            <StandingsTable
                                format="test"
                                initialStandings={formatStandings.test}
                            />
                        </TabsContent>
                        <TabsContent value="odi">
                            <StandingsTable
                                format="odi"
                                initialStandings={formatStandings.odi}
                            />
                        </TabsContent>
                        <TabsContent value="t20">
                            <StandingsTable
                                format="t20"
                                initialStandings={formatStandings.t20}
                            />
                        </TabsContent>
                    </Tabs>
                </Container>
            </main>
        </div>
    );
};

export default TeamStandingsPage;
