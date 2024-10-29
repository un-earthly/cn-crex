"use client"
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";

// Error Alert Component
const ErrorAlert = ({ message }) => (
    <Alert variant="destructive" className="my-4">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);

// Empty State Component
const EmptyState = ({ message }) => (
    <Card className="p-6">
        <CardContent className="text-center text-gray-500">
            <p>{message}</p>
        </CardContent>
    </Card>
);

// Safe Image Component
const SafeImage = ({ src, alt, className = "", fallbackSrc = "/placeholder-team.png" }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`w-8 h-8 object-contain ${className}`}
            onError={handleError}
        />
    );
};

// Series Stats Card Component
const SeriesStatsCard = ({ seriesStats }) => {
    if (!seriesStats) return null;

    const {
        team1 = "Team 1",
        team2 = "Team 2",
        format = "Unknown Format",
        scoreMetric = "",
        matchesInfo = "",
        result = "Result pending"
    } = seriesStats;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Current Series</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">{team1} vs {team2}</span>
                        <Badge variant="secondary">{format}</Badge>
                    </div>
                    {(scoreMetric || matchesInfo) && (
                        <div className="text-sm text-muted-foreground">
                            {scoreMetric && <span>{scoreMetric}</span>}
                            {scoreMetric && matchesInfo && <span className="mx-2">•</span>}
                            {matchesInfo && <span>{matchesInfo}</span>}
                        </div>
                    )}
                    <div className="text-sm font-medium">{result}</div>
                </div>
            </CardContent>
        </Card>
    );
};

// Points Table Component
const PointsTable = ({ pointsTableInfo }) => {
    if (!pointsTableInfo?.teams?.length) {
        return <EmptyState message="No points table data available" />;
    }

    const headers = pointsTableInfo.headers || ["Team", "Series", "M", "W", "L", "D", "Pts", "PCT %"];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    {pointsTableInfo.title || "Points Table"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {headers.map((header, index) => (
                                    <TableHead
                                        key={header || index}
                                        className={index === 0 ? "w-[200px]" : "text-center"}
                                    >
                                        {header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pointsTableInfo.teams.map((teamData, index) => {
                                if (!teamData?.team) return null;

                                const stats = teamData.stats || {};
                                return (
                                    <TableRow key={teamData.team.name || index}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative w-8 h-8">
                                                    <SafeImage
                                                        src={teamData.team.imageUrl}
                                                        alt={teamData.team.name || "Team logo"}
                                                    />
                                                </div>
                                                <span>{teamData.team.name || "Unknown Team"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{stats.Series ?? "-"}</TableCell>
                                        <TableCell className="text-center">{stats.M ?? "-"}</TableCell>
                                        <TableCell className="text-center">{stats.W ?? "-"}</TableCell>
                                        <TableCell className="text-center">{stats.L ?? "-"}</TableCell>
                                        <TableCell className="text-center">{stats.D ?? "-"}</TableCell>
                                        <TableCell className="text-center">{stats.Pts ?? "-"}</TableCell>
                                        <TableCell className="text-center font-bold">
                                            {stats["PCT %"]?.value ?? "-"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

// Legend Component
const TableLegend = () => (
    <div className="mt-4 text-sm text-muted-foreground space-y-2">
        <p>
            <strong>M</strong>: Matches, <strong>W</strong>: Won, <strong>L</strong>: Lost,{" "}
            <strong>D</strong>: Drawn, <strong>Pts</strong>: Points, <strong>PCT %</strong>: Points Percentage
        </p>
        <p>* Denotes that the team has played an ongoing series</p>
    </div>
);

export default function SeriesStatsComponent({ params }) {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null
    });

    const { slug, subSlug } = params ?? {};

    useEffect(() => {
        const fetchStats = async () => {
            if (!slug?.trim() || !subSlug?.trim()) {
                setState(prev => ({
                    ...prev,
                    error: 'Invalid series parameters',
                    loading: false
                }));
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE}/api/series/${slug}/${subSlug}/series-stats`
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
                console.error('Error fetching series stats:', err);
                setState(prev => ({
                    ...prev,
                    error: err.response?.data?.message || err.message || 'Failed to load series statistics',
                    loading: false
                }));
            }
        };

        fetchStats();
    }, [slug, subSlug]);

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

    if (!state.data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState message="No series statistics available" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <SeriesStatsCard seriesStats={state.data.seriesStats} />
            <PointsTable pointsTableInfo={state.data.sharedPointsTableInfo} />
            <TableLegend />
        </div>
    );
}