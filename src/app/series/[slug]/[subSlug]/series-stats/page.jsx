"use client"
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";

export default function Component({ params }) {
    const { slug, subSlug } = params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_BASE + '/api/series/' + slug + '/' + subSlug + "/series-stats")
            .then((response) => {
                console.log(response.data);
                setData(response.data.data);
            })
            .catch(err => console.log(err))
            .finally(() => { setLoading(false); });
    }, []);
    if (loading) {
        return <Loading />
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Current Series</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{data.seriesStats.team1} vs {data.seriesStats.team2}</span>
                            <Badge variant="secondary">{data.seriesStats.format}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <span>{data.seriesStats.scoreMetric}</span>
                            <span className="mx-2">•</span>
                            <span>{data.seriesStats.matchesInfo}</span>
                        </div>
                        <div className="text-sm font-medium">{data.seriesStats.result}</div>
                    </div>
                </CardContent>
            </Card>
            <Card >
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">{data.sharedPointsTableInfo.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {data.sharedPointsTableInfo.headers.map((header, index) => (
                                    <TableHead key={index} className={index === 0 ? "w-[200px]" : "text-center"}>
                                        {header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.sharedPointsTableInfo.teams.map((teamData, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative w-8 h-8">
                                                <img
                                                    src={teamData.team.imageUrl}
                                                    alt={teamData.team.name}
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                            <span>{teamData.team.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{teamData.stats.Series}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.M}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.W}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.L}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.D}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.Pts}</TableCell>
                                    <TableCell className="text-center font-bold">
                                        {teamData.stats["PCT %"].value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            

            <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>M</strong>: Matches, <strong>W</strong>: Won, <strong>L</strong>: Lost, <strong>D</strong>: Drawn, <strong>Pts</strong>: Points, <strong>PCT %</strong>: Points Percentage</p>
                <p>* Denotes that the team has played an ongoing series</p>
            </div>
        </div>
    )
}