"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Loading from "@/components/global/loading";
import axios from "axios";
import DataNotFound from "@/components/global/notfound";



export default function Component() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE}/api/stats-corner/suffle`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    if (loading) {
        return <Loading />;
    }

    if (!data) {
        return <DataNotFound />
    }
    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-2xl font-bold mb-4">T20 World Cup 2024 Player Statistics</h1> */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Player Rankings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Strike Rate</TableHead>
                                    <TableHead>Matches</TableHead>
                                    <TableHead>Innings</TableHead>
                                    <TableHead>Highest Score</TableHead>
                                    <TableHead>Average</TableHead>
                                    <TableHead>Runs</TableHead>
                                    <TableHead>100s</TableHead>
                                    <TableHead>50s</TableHead>
                                    <TableHead>4s</TableHead>
                                    <TableHead>6s</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.tableData?.slice(0, -1).map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.rank}</TableCell>
                                        <TableCell className="flex items-center">
                                            <img src={row.player.image} alt={row.player.name} width={24} height={24} className="mr-2 rounded-full" />
                                            {row.player.name}
                                        </TableCell>
                                        <TableCell className="flex items-center">
                                            <img src={row.team.image} alt={row.team.name} width={24} height={24} className="mr-2" />
                                            {row.team.name}
                                        </TableCell>
                                        <TableCell>{row.strikeRate}</TableCell>
                                        <TableCell>{row.matches}</TableCell>
                                        <TableCell>{row.innings}</TableCell>
                                        <TableCell>{row.highestScore}</TableCell>
                                        <TableCell>{row.average}</TableCell>
                                        <TableCell>{row.runs}</TableCell>
                                        <TableCell>{row.hundreds}</TableCell>
                                        <TableCell>{row.fifties}</TableCell>
                                        <TableCell>{row.fours}</TableCell>
                                        <TableCell>{row.sixes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="h-max">
                    <CardHeader>
                        <CardTitle>{data?.statsCornerData?.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.statsCornerData?.players.map((player, index) => (
                            <div key={index} className="flex items-center mb-4">
                                <img src={player.image} alt={player.name} width={48} height={48} className="mr-4 rounded-full" />
                                <div>
                                    <p className="font-semibold">{player.name}</p>
                                    <p className="text-sm text-gray-600">Runs: {player.score}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}