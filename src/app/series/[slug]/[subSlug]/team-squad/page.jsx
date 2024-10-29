"use client"
import axios from "axios";
import { CircleDotIcon, SwordIcon, UserIcon, AlertCircleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";

// Error alert component
const ErrorAlert = ({ message }) => (
    <Alert variant="destructive" className="mb-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);

// Empty state component
const EmptyState = ({ message }) => (
    <Card className="p-6 text-center text-gray-500">
        <p>{message}</p>
    </Card>
);

const PlayerCard = ({ name = "Unknown Player", type = "Unknown", role = "Unknown" }) => {
    const getIcon = (playerType) => {
        switch (playerType?.toLowerCase()) {
            case 'batsman':
                return <SwordIcon className="h-5 w-5 text-blue-500" />;
            case 'bowler':
                return <CircleDotIcon className="h-5 w-5 text-green-500" />;
            case 'all rounder':
                return <UserIcon className="h-5 w-5 text-purple-500" />;
            default:
                return <UserIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                    {getIcon(type)}
                    <div>
                        <h3 className="font-semibold">{name}</h3>
                        <p className="text-sm text-gray-600">{role}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const TeamTab = ({ teamName = "Unknown Team", playerCount = 0, players = [] }) => {
    // Safely group players by type with error handling
    const groupedPlayers = players.reduce((acc, player) => {
        if (!player) return acc;

        const type = player.type || "Unknown";
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(player);
        return acc;
    }, {});

    if (Object.keys(groupedPlayers).length === 0) {
        return <EmptyState message={`No players available for ${teamName}`} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{teamName}</h2>
                <Badge variant="secondary">{playerCount || players.length}</Badge>
            </div>
            {Object.entries(groupedPlayers).map(([type, playersList]) => (
                <div key={type} className="space-y-3">
                    <h3 className="text-xl font-semibold mb-3">{type}s</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {playersList.map((player, index) => (
                            <PlayerCard
                                key={player.name || index}
                                name={player.name}
                                type={player.type}
                                role={player.role}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function TeamSquad({ params }) {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null,
        activeTab: ''
    });

    // Safe params destructuring with validation
    const { slug, subSlug } = params ?? {};

    useEffect(() => {
        const fetchSquadData = async () => {
            if (!slug?.trim() || !subSlug?.trim()) {
                setState(prev => ({
                    ...prev,
                    error: 'Invalid parameters provided',
                    loading: false
                }));
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE}/api/series/${slug}/${subSlug}/team-squad`
                );

                if (!response?.data?.data) {
                    throw new Error('Invalid data format received');
                }

                const squadData = response.data.data;

                if (!Array.isArray(squadData) || squadData.length === 0) {
                    throw new Error('No team squad data available');
                }

                setState(prev => ({
                    ...prev,
                    data: squadData,
                    activeTab: squadData[0]?.teamName || '',
                    error: null,
                    loading: false
                }));

            } catch (error) {
                console.error('Error fetching squad data:', error);
                setState(prev => ({
                    ...prev,
                    error: error.response?.data?.message || error.message || 'Failed to load squad data',
                    loading: false
                }));
            }
        };

        fetchSquadData();
    }, [slug, subSlug]);

    const handleTabChange = (value) => {
        setState(prev => ({
            ...prev,
            activeTab: value
        }));
    };

    if (state.loading) {
        return <Loading />;
    }

    if (state.error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorAlert message={state.error} />
            </div>
        );
    }

    if (!state.data || state.data.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState message="No team squad data available" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <main className="container mx-auto px-4 py-8">
                <Tabs
                    value={state.activeTab}
                    onValueChange={handleTabChange}
                    className="space-y-4"
                >
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {state.data.map((team) => (
                            <TabsTrigger
                                key={team.teamName || 'unknown'}
                                value={team.teamName || 'unknown'}
                                className="px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                {team.teamName || 'Unknown Team'}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {state.data.map((team) => (
                        <TabsContent
                            key={team.teamName || 'unknown'}
                            value={team.teamName || 'unknown'}
                        >
                            <TeamTab
                                teamName={team.teamName}
                                playerCount={team.playerCount}
                                players={team.players || []}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    );
}