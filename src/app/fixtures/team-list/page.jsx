"use client";
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import Loading from '@/components/global/loading';
import DataNotFound from '@/components/global/notfound';

export default function Page() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_BASE + `/api/fixtures/team-list`, {
                params: {
                    page: currentPage,
                    searchTerm: searchTerm
                }
            });
            setData(prevData => currentPage === 1 ? response.data.teams : [...prevData, ...response.data.teams]);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm]);

    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm, fetchData]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 && !loading) {
            setCurrentPage(prev => prev + 1);
        }
    }, [loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (loading && !data) {
        return <Loading />;
    }
    return (
        <div className="py-8">
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
            </div>
            {!data ? <DataNotFound /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data && data.map((team) => (
                        <Card key={team.name} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 relative">
                                        <img
                                            src={team.flagUrl}
                                            alt={`${team.name} flag`}
                                            layout="fill"
                                            objectFit="contain"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <h2 className="text-lg font-semibold">{team.name}</h2>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
