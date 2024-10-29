"use client"
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";

const ErrorAlert = ({ message }) => (
    <Alert variant="destructive" className="mb-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);

const SafeImage = ({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className="w-8 h-8 object-contain"
            onError={() => setImgSrc('/placeholder-team.png')}
        />
    );
};

export default function Component({ params }) {
    const { slug, subSlug } = params ?? {};
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!slug?.trim() || !subSlug?.trim()) {
                setState(prev => ({
                    ...prev,
                    error: 'Invalid parameters',
                    loading: false
                }));
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE}/api/series/${slug}/${subSlug}/points-table`
                );

                if (!response?.data?.data) {
                    throw new Error('Invalid data format received');
                }

                setState(prev => ({
                    ...prev,
                    data: response.data.data,
                    error: null,
                    loading: false
                }));
            } catch (err) {
                console.error('Error:', err);
                setState(prev => ({
                    ...prev,
                    error: err.response?.data?.message || 'Failed to load points table',
                    loading: false
                }));
            }
        };

        fetchData();
    }, [slug, subSlug]);

    if (state.loading) return <Loading />;

    if (state.error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorAlert message={state.error} />
            </div>
        );
    }

    if (!state.data?.teams?.length) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-6 text-center text-gray-500">
                    <p>No points table data available</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {state.data.title || 'Points Table'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {(state.data.headers || ['Team', 'P', 'W', 'L', 'NR', 'NRR', 'Pts']).map((header, index) => (
                                    <TableHead
                                        key={header || index}
                                        className={index === 0 ? "w-[300px]" : "text-center"}
                                    >
                                        {header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {state.data.teams.map((teamData, index) => (
                                <TableRow key={teamData?.team?.name || index}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative w-8 h-8">
                                                <SafeImage
                                                    src={teamData?.team?.imageUrl}
                                                    alt={teamData?.team?.name || 'Team logo'}
                                                />
                                            </div>
                                            <span>{teamData?.team?.name || 'Unknown Team'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{teamData?.stats?.P ?? '-'}</TableCell>
                                    <TableCell className="text-center">{teamData?.stats?.W ?? '-'}</TableCell>
                                    <TableCell className="text-center">{teamData?.stats?.L ?? '-'}</TableCell>
                                    <TableCell className="text-center">{teamData?.stats?.NR ?? '-'}</TableCell>
                                    <TableCell className="text-center">{teamData?.stats?.NRR ?? '-'}</TableCell>
                                    <TableCell className="text-center font-bold">{teamData?.stats?.Pts ?? '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className="mt-4 text-sm text-muted-foreground">
                <p>
                    <strong>P</strong>: Played, <strong>W</strong>: Won, <strong>L</strong>: Lost,{" "}
                    <strong>NR</strong>: No Result, <strong>NRR</strong>: Net Run Rate, <strong>Pts</strong>: Points
                </p>
            </div>
        </div>
    );
}