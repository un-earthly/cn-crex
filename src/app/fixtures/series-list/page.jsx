"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import Loading from "@/components/global/loading"


export default function Component() {
    const [seriesData, setSeriesData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_BASE + `/api/fixtures/series-list`);
            setSeriesData(response.data.seriesData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch series data. Please try again later.')
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    const groupedSeries = seriesData.reduce((acc, series) => {
        if (!acc[series.month]) {
            acc[series.month] = []
        }
        acc[series.month].push(series)
        return acc
    }, {})

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-2xl font-bold mb-6">Upcoming Cricket Series</h1> */}
            {Object.entries(groupedSeries).map(([month, series]) => (
                <div key={month} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{month}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {series.map((s) => (
                            <Card key={s.name} className="overflow-hidden">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg">{s.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <img
                                        src={s.imgSrc}
                                        alt={`${s.name} logo`}
                                        className="w-16 h-16 object-contain mb-2"
                                    />
                                    <p className="text-sm text-muted-foreground mb-2">{s.dateRange}</p>
                                    <a
                                        href={s.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        View Matches
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}