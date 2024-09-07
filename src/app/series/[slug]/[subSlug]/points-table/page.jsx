"use client"
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";
export default function Component({ params }) {
    const { slug, subSlug } = params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_BASE + '/api/series/' + slug + '/' + subSlug + "/points-table")
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
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">{data.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {data.headers.map((header, index) => (
                                    <TableHead key={index} className={index === 0 ? "w-[300px]" : "text-center"}>
                                        {header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.teams.map((teamData, index) => (
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
                                    <TableCell className="text-center">{teamData.stats.P}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.W}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.L}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.NR}</TableCell>
                                    <TableCell className="text-center">{teamData.stats.NRR}</TableCell>
                                    <TableCell className="text-center font-bold">{teamData.stats.Pts}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>P</strong>: Played, <strong>W</strong>: Won, <strong>L</strong>: Lost, <strong>NR</strong>: No Result, <strong>NRR</strong>: Net Run Rate, <strong>Pts</strong>: Points</p>
            </div>
        </div>
    )
}