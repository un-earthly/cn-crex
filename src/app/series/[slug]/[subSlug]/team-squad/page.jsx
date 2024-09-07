"use client"
import axios from "axios";
import { CircleDotIcon, SwordIcon, UserIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";

export default function TeamSquad({ params }) {
    const { slug, subSlug } = params;
    const [activeTab, setActiveTab] = useState('')
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_BASE + '/api/series/' + slug + '/' + subSlug + "/team-squad")
            .then((response) => {
                console.log(response.data);
                setData(response.data.data);
                console.log(response.data.data)
                setActiveTab(response.data.data[0].teamName)
            })
            .catch(err => console.log(err))
            .finally(() => { setLoading(false); });
    }, []);
    if (loading) {
        return <Loading />
    }
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <main className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {data.map((team) => (
                            <TabsTrigger
                                key={team.teamName}
                                value={team.teamName}
                                className="px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                {team.teamName}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {data.map((team) => (
                        <TabsContent key={team.teamName} value={team.teamName}>
                            <TeamTab {...team} />
                        </TabsContent>
                    ))}
                </Tabs>
            </main>

        </div>
    )
}

const TeamTab = ({ teamName, playerCount, players }) => {
    const groupedPlayers = players.reduce((acc, player) => {
        if (!acc[player.type]) {
            acc[player.type] = [];
        }
        acc[player.type].push(player);
        return acc;
    }, {});
    console.log(groupedPlayers)
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{teamName}</h2>
                <Badge variant="secondary">{playerCount}</Badge>
            </div>
            {Object.entries(groupedPlayers).map(([type, players]) => (
                <div key={type}>
                    <h3 className="text-xl font-semibold mb-3">{type}s</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {players.map((player, index) => (
                            <PlayerCard key={index} {...player} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}



const PlayerCard = ({ name, type, role }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'Batsman':
                return <SwordIcon className="h-5 w-5 text-blue-500" />
            case 'Bowler':
                return <CircleDotIcon className="h-5 w-5 text-green-500" />
            case 'All Rounder':
                return <UserIcon className="h-5 w-5 text-purple-500" />
            default:
                return null
        }
    }

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
    )
}