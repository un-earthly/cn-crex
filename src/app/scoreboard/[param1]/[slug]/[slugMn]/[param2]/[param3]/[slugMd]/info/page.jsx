"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CloudRain, Thermometer, Droplets } from 'lucide-react'
import axios from 'axios';
import Loading from '@/components/global/loading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import DataNotFound from '@/components/global/notfound';
export default function CricketMatchPage({ params }) {
    const { param1, slug, slugMn, param2, param3, slugMd } = params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE}/api/match/scoreboard/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/info`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [param1, slug, slugMn, param2, param3, slugMd]);

    if (loading) {
        return <Loading />;
    }

    if (!data) {
        return <DataNotFound />
    }

    const { seriesInfo, venueDetails, playerData } = data;
    const teamKeys = Object.keys(playerData.teamsData);

    // Get the first and second teams dynamically
    const firstTeam = teamKeys[0]; // ENG in your example
    const secondTeam = teamKeys[1]; // SL in your example

    // Access the players for the first and second teams
    const firstTeamPlayers = playerData.teamsData[firstTeam];
    const secondTeamPlayers = playerData.teamsData[secondTeam];

    return (
        <div className="container mx-auto p-4">


            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Series Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{seriesInfo.matchFormat}</p>
                    <p>{seriesInfo.seriesName}</p>
                    <img src={seriesInfo.seriesImageUrl} alt="Series" width={100} height={50} />
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Venue Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{venueDetails.venueName}</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">{venueDetails.weather.condition}</Badge>
                        <span className="flex items-center">
                            <Thermometer className="w-4 h-4 mr-1" />
                            {venueDetails.weather.temperature}
                        </span>
                        <span className="flex items-center">
                            <Droplets className="w-4 h-4 mr-1" />
                            {venueDetails.weather.humidity}
                        </span>
                        <span className="flex items-center">
                            <CloudRain className="w-4 h-4 mr-1" />
                            {venueDetails.weather.chanceOfRain}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue={firstTeam} className="mb-4">
                <TabsList>
                    <TabsTrigger value={firstTeam}>{firstTeam}</TabsTrigger>
                    <TabsTrigger value={secondTeam}>{secondTeam}</TabsTrigger>
                </TabsList>
                <TabsContent value={firstTeam}>
                    <TeamSquad players={firstTeamPlayers} />
                </TabsContent>
                <TabsContent value={secondTeam}>
                    <TeamSquad players={secondTeamPlayers} />
                </TabsContent>
            </Tabs>


            <Card>
                <CardHeader>
                    <CardTitle>Toss</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                    <img src={playerData.toss.icon} alt="Toss" width={24} height={24} className="mr-2" />
                    <p>{playerData.toss.text}</p>
                </CardContent>
            </Card>
        </div>
    );
}

function TeamCard({ team }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <img src={team.imageUrl} alt={team.name} width={24} height={24} className="mr-2" />
                    {team.name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{team.score}</p>
                <p>{team.overs} overs</p>
            </CardContent>
        </Card>
    );
}
function TeamSquad({ players }) {
    const playingXI = players?.slice(0, 11);
    const bench = players?.slice(11);

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Playing XI</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {playingXI.map((player, index) => (
                    <PlayerCard key={index} player={player} />
                ))}
            </div>

            {bench.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="bench">
                        <AccordionTrigger>Bench Players</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                {bench.map((player, index) => (
                                    <PlayerCard key={index} player={player} />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    );
}

function PlayerCard({ player }) {
    return (
        <Card>
            <CardContent className="flex items-center p-4">
                <Avatar className="mr-2">
                    <AvatarImage src={player.image} alt={player.name} />
                    <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.title} {player.role}</p>
                </div>
            </CardContent>
        </Card>
    );
}