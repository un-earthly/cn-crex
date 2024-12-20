// "use client"
// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { CalendarIcon, TrophyIcon, UserIcon, BarChart2Icon } from 'lucide-react'
// import Link from 'next/link';
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// import Loading from '@/components/global/loading';
// export default function Page({ params }) {
//     const { slug, subSlug } = params;
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     useEffect(() => {
//         axios
//             .get(process.env.NEXT_PUBLIC_BASE + '/api/series/' + slug + '/' + subSlug)
//             .then((response) => {
//                 console.log(response.data);
//                 setData(response.data.data)
//             })
//             .catch(err => console.log(err))
//             .finally(() => { setLoading(false); });
//     }, []);
//     if (loading) {
//         return <Loading />
//     }
//     return (
//         <div className="min-h-screen bg-gray-100 text-gray-900">
//             <main className="container mx-auto px-4 py-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     <div className="lg:col-span-2">
//                         <section className="mb-8">
//                             <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">Featured Matches</h2>
//                             <div className="space-y-4">
//                                 {data.featuredMatches.map((match, index) => (
//                                     <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
//                                         <Link href={match.link}>
//                                             <CardHeader className="bg-gray-50">
//                                                 <CardTitle className="flex justify-between items-center">
//                                                     <span className="text-xl">{match.teams.join(" vs ")}</span>
//                                                     <Badge variant={match.status === "Not Started" ? "secondary" : "default"} className="text-sm">
//                                                         {match.status}
//                                                     </Badge>
//                                                 </CardTitle>
//                                             </CardHeader>
//                                             <CardContent className="pt-4">
//                                                 {match.scores.length > 0 ? (
//                                                     <div>
//                                                         <p className="font-semibold text-lg">{match.scores.join(" ")}</p>
//                                                         <p className="text-sm text-gray-600 mt-2">{match.result}</p>
//                                                     </div>
//                                                 ) : (
//                                                     <p className="text-lg"><span className="font-semibold">{match.date}</span> {match.time}</p>
//                                                 )}
//                                             </CardContent>
//                                         </Link>
//                                     </Card>
//                                 ))}
//                             </div>
//                         </section>

//                         <section className="mb-8">
//                             <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">Series Info</h2>
//                             <Card className="bg-white shadow-lg">
//                                 <CardContent className="pt-6">
//                                     <h3 className="text-xl font-semibold mb-3">{data.seriesInfo.name}</h3>
//                                     <p className="flex items-center text-gray-600 mb-2">
//                                         <CalendarIcon className="mr-2 h-5 w-5 text-green-700" />
//                                         {data.seriesInfo.duration}
//                                     </p>
//                                     <p className="flex items-center text-gray-600">
//                                         <TrophyIcon className="mr-2 h-5 w-5 text-green-700" />
//                                         {data.seriesInfo.format}
//                                     </p>
//                                 </CardContent>
//                             </Card>
//                         </section>

//                         <section className="mb-8">
//                             <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">Team Squads</h2>
//                             <ScrollArea className="w-full">
//                                 <div className="flex gap-4 pb-4">
//                                     {data.teamSquads.map((team, index) => (
//                                         <Link key={index} href={'/series/' + slug + '/' + subSlug + `/team-squad`}>
//                                             <Card key={index} className="bg-white shadow-lg w-40 hover:shadow-xl transition-shadow duration-300">
//                                                 <CardContent className="flex flex-col items-center p-6">
//                                                     <img src={team.imageUrl} alt={`${team.team} logo`} className="w-24 h-24 mb-4" />
//                                                     <span className="text-xl font-semibold">{team.team}</span>
//                                                 </CardContent>
//                                             </Card>
//                                         </Link>
//                                     ))}
//                                 </div>
//                                 <ScrollBar orientation="horizontal" />
//                             </ScrollArea>
//                         </section>
//                     </div>

//                     <div>
//                         {data.pointsTable?.teams?.length > 0 && <section className="mb-8">
//                             <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">Points Table</h2>
//                             <Card className="bg-white shadow-lg">
//                                 <CardContent>
//                                     <Table>
//                                         <TableHeader>
//                                             <TableRow>
//                                                 <TableHead>Team</TableHead>
//                                                 <TableHead className="text-right">P</TableHead>
//                                                 <TableHead className="text-right">W</TableHead>
//                                                 <TableHead className="text-right">L</TableHead>
//                                                 <TableHead className="text-right">Pts</TableHead>
//                                             </TableRow>
//                                         </TableHeader>
//                                         <TableBody>
//                                             {data.pointsTable.teams.map((team, index) => (
//                                                 <TableRow key={index}>
//                                                     <TableCell className="font-medium">{team.name}</TableCell>
//                                                     <TableCell className="text-right">{team.played}</TableCell>
//                                                     <TableCell className="text-right">{team.won}</TableCell>
//                                                     <TableCell className="text-right">{team.lost}</TableCell>
//                                                     <TableCell className="text-right font-bold">{team.points}</TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </CardContent>
//                             </Card>
//                         </section>}

//                         <section className="mb-8">
//                             <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">Key Stats</h2>
//                             <div className="space-y-4">
//                                 {data.keyStats.map((stat, index) => (
//                                     <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
//                                         <CardHeader className="pb-2">
//                                             <CardTitle className="text-lg flex items-center">
//                                                 <BarChart2Icon className="mr-2 h-5 w-5 text-green-700" />
//                                                 {stat.title}
//                                             </CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                             <p className="font-semibold text-xl">{stat.value}</p>
//                                             <p className="text-sm text-gray-600">{stat.playerName}</p>
//                                             <p className="text-xs text-gray-500">{stat.teamName}</p>
//                                         </CardContent>
//                                     </Card>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>
//                 </div>

//                 <section className="mb-8">
//                     <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">Top Headlines</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {data.topHeadlines.map((headline, index) => (
//                             <Card key={index} className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
//                                 <img src={headline.imageUrl} alt={headline.title} className="w-full h-48 object-cover" />
//                                 <CardContent className="p-4">
//                                     <h3 className="font-semibold mb-2 line-clamp-2">{headline.title}</h3>
//                                     <p className="text-sm text-gray-600">{headline.time}</p>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 </section>
//             </main>
//         </div>
//     )
// }

"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, TrophyIcon, UserIcon, BarChart2Icon, AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Loading from '@/components/global/loading';

const ErrorAlert = ({ message }) => (
    <Alert variant="destructive" className="mb-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);

const NoDataMessage = ({ message }) => (
    <Card className="bg-white shadow p-4 text-center text-gray-600">
        <p>{message}</p>
    </Card>
);

export default function Page({ params }) {
    const { slug, subSlug } = params ?? {};
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !subSlug) {
                setError('Invalid series parameters');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE}/api/series/${slug}/${subSlug}`
                );

                if (!response.data?.data) {
                    throw new Error('Invalid data format received');
                }

                setData(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching series data:', err);
                setError(err.response?.data?.message || 'Failed to load series data');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, subSlug]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorAlert message={error} />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <NoDataMessage message="No series data available" />
            </div>
        );
    }

    const renderFeaturedMatches = () => {
        if (!data.featuredMatches?.length) {
            return <NoDataMessage message="No featured matches available" />;
        }

        return (
            <div className="space-y-4">
                {data.featuredMatches.map((match, index) => (
                    <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Link href={match.link || '#'}>
                            <CardHeader className="bg-gray-50">
                                <CardTitle className="flex justify-between items-center">
                                    <span className="text-xl">{match.teams?.join(" vs ") || "Teams TBD"}</span>
                                    <Badge
                                        variant={match.status === "Not Started" ? "secondary" : "default"}
                                        className="text-sm"
                                    >
                                        {match.status || "Status Unknown"}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {match.scores?.length > 0 ? (
                                    <div>
                                        <p className="font-semibold text-lg">{match.scores.join(" ")}</p>
                                        <p className="text-sm text-gray-600 mt-2">{match.result || "Result pending"}</p>
                                    </div>
                                ) : (
                                    <p className="text-lg">
                                        <span className="font-semibold">{match.date || "Date TBA"}</span>
                                        {" "}{match.time || "Time TBA"}
                                    </p>
                                )}
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        );
    };

    const renderSeriesInfo = () => {
        const seriesInfo = data.seriesInfo ?? {};
        return (
            <Card className="bg-white shadow-lg">
                <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-3">{seriesInfo.name || "Series Name Not Available"}</h3>
                    <p className="flex items-center text-gray-600 mb-2">
                        <CalendarIcon className="mr-2 h-5 w-5 text-green-700" />
                        {seriesInfo.duration || "Duration Not Available"}
                    </p>
                    <p className="flex items-center text-gray-600">
                        <TrophyIcon className="mr-2 h-5 w-5 text-green-700" />
                        {seriesInfo.format || "Format Not Available"}
                    </p>
                </CardContent>
            </Card>
        );
    };

    const renderTeamSquads = () => {
        if (!data.teamSquads?.length) {
            return <NoDataMessage message="No team squads available" />;
        }

        return (
            <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                    {data.teamSquads.map((team, index) => (
                        <Link
                            key={index}
                            href={`/series/${slug}/${subSlug}/team-squad`}
                        >
                            <Card className="bg-white shadow-lg w-40 hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="flex flex-col items-center p-6">
                                    <img
                                        src={team.imageUrl || '/placeholder-team.png'}
                                        alt={`${team.team || 'Team'} logo`}
                                        className="w-24 h-24 mb-4"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-team.png';
                                        }}
                                    />
                                    <span className="text-xl font-semibold">{team.team || "Team Name"}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        );
    };

    const renderPointsTable = () => {
        if (!data.pointsTable?.teams?.length) {
            return null;
        }

        return (
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">Points Table</h2>
                <Card className="bg-white shadow-lg">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Team</TableHead>
                                    <TableHead className="text-right">P</TableHead>
                                    <TableHead className="text-right">W</TableHead>
                                    <TableHead className="text-right">L</TableHead>
                                    <TableHead className="text-right">Pts</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.pointsTable.teams.map((team, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{team.name || "Team Name"}</TableCell>
                                        <TableCell className="text-right">{team.played ?? 0}</TableCell>
                                        <TableCell className="text-right">{team.won ?? 0}</TableCell>
                                        <TableCell className="text-right">{team.lost ?? 0}</TableCell>
                                        <TableCell className="text-right font-bold">{team.points ?? 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>
        );
    };

    const renderKeyStats = () => {
        if (!data.keyStats?.length) {
            return <NoDataMessage message="No key stats available" />;
        }

        return (
            <div className="space-y-4">
                {data.keyStats.map((stat, index) => (
                    <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                                <BarChart2Icon className="mr-2 h-5 w-5 text-green-700" />
                                {stat.title || "Stat Title"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold text-xl">{stat.value || "N/A"}</p>
                            <p className="text-sm text-gray-600">{stat.playerName || "Player Unknown"}</p>
                            <p className="text-xs text-gray-500">{stat.teamName || "Team Unknown"}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    const renderTopHeadlines = () => {
        if (!data.topHeadlines?.length) {
            return <NoDataMessage message="No headlines available" />;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.topHeadlines.map((headline, index) => (
                    <Card key={index} className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <img
                            src={headline.imageUrl || '/placeholder-news.png'}
                            alt={headline.title || "News"}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.target.src = '/placeholder-news.png';
                            }}
                        />
                        <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2">
                                {headline.title || "Headline Not Available"}
                            </h3>
                            <p className="text-sm text-gray-600">{headline.time || "Time Not Available"}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">
                                Featured Matches
                            </h2>
                            {renderFeaturedMatches()}
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">
                                Series Info
                            </h2>
                            {renderSeriesInfo()}
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">
                                Team Squads
                            </h2>
                            {renderTeamSquads()}
                        </section>
                    </div>

                    <div>
                        {renderPointsTable()}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">
                                Key Stats
                            </h2>
                            {renderKeyStats()}
                        </section>
                    </div>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-green-800">
                        Top Headlines
                    </h2>
                    {renderTopHeadlines()}
                </section>
            </main>
        </div>
    );
}