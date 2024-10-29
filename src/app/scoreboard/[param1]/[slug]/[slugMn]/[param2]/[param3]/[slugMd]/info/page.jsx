"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CloudRain, Thermometer, Droplets, AlertCircleIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import axios from 'axios';
import Loading from '@/components/global/loading';
import DataNotFound from '@/components/global/notfound';

const ErrorAlert = ({ message }) => (
    <Alert variant="destructive" className="mb-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);

const SafeImage = ({ src, alt, width, height, className = "", fallbackSrc = "/placeholder.png" }) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={() => setImgSrc(fallbackSrc)}
        />
    );
};

const PlayerCard = ({ player = {} }) => {
    const { name = "Unknown Player", image = "", title = "", role = "" } = player;
    const initials = name.split(' ').map(n => n[0]).join('');

    return (
        <Card>
            <CardContent className="flex items-center p-4">
                <Avatar className="mr-2">
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">{title} {role}</p>
                </div>
            </CardContent>
        </Card>
    );
};

const TeamSquad = ({ players = [] }) => {
    const playingXI = players?.slice(0, 11) || [];
    const bench = players?.slice(11) || [];

    if (!players.length) {
        return <p className="text-center text-gray-500">No player data available</p>;
    }

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
};

export default function CricketMatchPage({ params }) {
    const { param1, slug, slugMn, param2, param3, slugMd } = params ?? {};
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchMatchData = async () => {
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
                    `${process.env.NEXT_PUBLIC_BASE}/api/match/scoreboard/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/info`
                );

                if (!response?.data) {
                    throw new Error('Invalid data format received');
                }

                setState(prev => ({
                    ...prev,
                    data: response.data,
                    error: null,
                    loading: false
                }));
            } catch (err) {
                console.error('Error fetching match data:', err);
                setState(prev => ({
                    ...prev,
                    error: err.response?.data?.message || 'Failed to load match information',
                    loading: false
                }));
            }
        };

        fetchMatchData();
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

    const { seriesInfo = {}, venueDetails = {}, playerData = {} } = state.data;
    const teamKeys = Object.keys(playerData.teamsData || {});
    const firstTeam = teamKeys[0] || 'Team 1';
    const secondTeam = teamKeys[1] || 'Team 2';

    return (
        <div className="container mx-auto p-4">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Series Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{seriesInfo.matchFormat || 'Format not available'}</p>
                    <p>{seriesInfo.seriesName || 'Series name not available'}</p>
                    <SafeImage
                        src={seriesInfo.seriesImageUrl}
                        alt="Series"
                        width={100}
                        height={50}
                    />
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Venue Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{venueDetails.venueName || 'Venue not available'}</p>
                    {venueDetails.weather && (
                        <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary">{venueDetails.weather.condition || 'N/A'}</Badge>
                            <span className="flex items-center">
                                <Thermometer className="w-4 h-4 mr-1" />
                                {venueDetails.weather.temperature || 'N/A'}
                            </span>
                            <span className="flex items-center">
                                <Droplets className="w-4 h-4 mr-1" />
                                {venueDetails.weather.humidity || 'N/A'}
                            </span>
                            <span className="flex items-center">
                                <CloudRain className="w-4 h-4 mr-1" />
                                {venueDetails.weather.chanceOfRain || 'N/A'}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Tabs defaultValue={firstTeam} className="mb-4">
                <TabsList>
                    <TabsTrigger value={firstTeam}>{firstTeam}</TabsTrigger>
                    <TabsTrigger value={secondTeam}>{secondTeam}</TabsTrigger>
                </TabsList>
                <TabsContent value={firstTeam}>
                    <TeamSquad players={playerData.teamsData?.[firstTeam]} />
                </TabsContent>
                <TabsContent value={secondTeam}>
                    <TeamSquad players={playerData.teamsData?.[secondTeam]} />
                </TabsContent>
            </Tabs>

            {playerData.toss && (
                <Card>
                    <CardHeader>
                        <CardTitle>Toss</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center">
                        <SafeImage
                            src={playerData.toss.icon}
                            alt="Toss"
                            width={24}
                            height={24}
                            className="mr-2"
                        />
                        <p>{playerData.toss.text || 'Toss information not available'}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}