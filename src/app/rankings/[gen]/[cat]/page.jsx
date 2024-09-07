"use client"

import Loading from '@/components/global/loading';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TabsContent } from '@/components/ui/tabs';
import axios from 'axios';
import { Flag } from 'lucide-react';
import DataNotFound from '@/components/global/notfound';


export default function Page({ params }) {
    const [rankingsData, setRankingsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_BASE + `/api/rankings/${params.gen}/${params.cat}`);
                setRankingsData(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching rankings data:', error);
                setRankingsData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.gen, params.cat]);

    if (loading) {
        return <Loading />;
    }

    if (!rankingsData || (typeof rankingsData === 'object' && Object.keys(rankingsData).length === 0)) {
        return <DataNotFound />
    }


    const RankingsContent = ({ format }) => {
        const data = rankingsData[format];
        const isTeamRanking = 'top_team' in data;

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{format} Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="">
                        <Card className="flex items-center p-4 mb-4">
                            {isTeamRanking ? (
                                <>
                                    <div className="w-24 h-24 mb-4 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                                        {/* <Flag size={48} /> */}
                                        <img src={data.top_team?.img} alt="" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{data.top_team?.name}</h3>
                                        <p className="text-lg font-bold mt-2">Rating: {data.top_team?.rating}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Avatar className="w-24 h-24 mb-4">
                                        <AvatarImage src={data.topPlayer?.imageUrl} alt={data.topPlayer?.name} />
                                        <AvatarFallback>{data.topPlayer?.name?.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex justify-between items-start w-full'>
                                        <div>
                                            <h3 className="text-xl font-semibold">{data.topPlayer?.name}</h3>
                                            <p className="text-sm text-muted-foreground">{data.topPlayer?.team}</p>
                                        </div>
                                        <p className="text-lg font-bold">Rating: {data.topPlayer?.rating}</p>
                                    </div>
                                </>
                            )}
                        </Card>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>{isTeamRanking ? 'Team' : 'Player'}</TableHead>
                                        {!isTeamRanking && <TableHead>Team</TableHead>}
                                        <TableHead>Rating</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.rankings.map((item) => (
                                        <TableRow key={item.rank}>
                                            <TableCell>{item.rank}</TableCell>
                                            <TableCell>{isTeamRanking ? item.team : item.name}</TableCell>
                                            {!isTeamRanking && <TableCell>{item.team}</TableCell>}
                                            <TableCell>{item.rating}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className='grid grid-cols-1 gap-3 lg:grid-cols-3 '>
            <RankingsContent format="ODI" />
            <RankingsContent format="T20" />
            {params.gen === "men" && <RankingsContent format="Test" />}
        </div>
    );
}