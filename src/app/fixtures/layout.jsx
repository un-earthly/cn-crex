import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, Users, Activity } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Layout({ children }) {
    const navigationItems = [
        { label: 'Days', value: 'match-list', icon: Calendar },
        { label: 'Series', value: 'series-list', icon: Trophy },
        { label: 'Teams', value: 'team-list', icon: Users },
    ];

    return (
        <div className="h-screen flex flex-col">
            <div className="w-full h-60 bg-gradient-to-br flex flex-col justify-end from-green-100 to-green-200 shadow-md py-6 px-4 sm:px-6 lg:px-8">
                <div className="container h-full flex justify-end items-start flex-col">
                    <div className="flex items-center justify-between mb-4 w-full">
                        <div className="flex items-center w-full">
                            <Activity className="w-8 h-8 text-green-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-gray-800">Fixtures</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {navigationItems.map((item) => (
                            <Link key={item.value} href={`/fixtures/${item.value}`} passHref>
                                <Button
                                    variant="outline"
                                    className="w-full py-2 px-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-300 rounded-md transition-colors duration-150 ease-in-out flex items-center justify-center"
                                >
                                    <item.icon className="w-5 h-5 mr-2" />
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-hidden" >
                <div className="container mx-auto relative" >
                    <ScrollArea className="h-[700px] rounded-lg" >
                        <div className="rounded-lg p-6 my-8">
                            {children}
                        </div>
                    </ScrollArea>
                </div>
            </div>

        </div>
    )
}