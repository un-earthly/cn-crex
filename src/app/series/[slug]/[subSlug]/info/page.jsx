"use client"
import Loading from "@/components/global/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { CalendarDays, Trophy, Clock, AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ErrorAlert = ({ message }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircleIcon className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const InfoCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value || 'Not Available'}</div>
    </CardContent>
  </Card>
);

export default function Component({ params }) {
    const { slug, subSlug } = params ?? {};
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchSeriesInfo = async () => {
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
                    `${process.env.NEXT_PUBLIC_BASE}/api/series/${slug}/${subSlug}/info`
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
                console.error('Error fetching series info:', err);
                setState(prev => ({
                    ...prev,
                    error: err.response?.data?.message || 'Failed to load series information',
                    loading: false
                }));
            }
        };

        fetchSeriesInfo();
    }, [slug, subSlug]);

    if (state.loading) return <Loading />;

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
                <Card className="p-6 text-center text-gray-500">
                    <p>No series information available</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                {state.data.title || 'Series Information'}
            </h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                    title="Series Name"
                    value={state.data.series}
                    icon={Trophy}
                />
                <InfoCard
                    title="Duration"
                    value={state.data.duration}
                    icon={CalendarDays}
                />
                <InfoCard
                    title="Format"
                    value={state.data.format}
                    icon={Clock}
                />
            </div>
        </div>
    );
}