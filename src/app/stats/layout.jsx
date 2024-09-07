"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
const dropdowns = [
    {
        "label": "Most",
        "selected": "Wickets",
        "options": [
            "Runs",
            "Wickets",
            "Fifties",
            "Hundreds",
            "Sixes",
            "Fours",
            "Highest Strike Rate"
        ]
    },
    {
        "label": "In",
        "selected": "T20 WC",
        "options": [
            "IPL",
            "PSL",
            "BBL",
            "Asia Cup",
            "World Cup",
            "T20 WC",
            "CPL",
            "BPL",
            "Abu Dhabi",
            "TNPL",
            "The Hundred",
            "T20 Blast",
            "6IXTY M"
        ]
    },
    {
        "label": "Season",
        "selected": "2024",
        "options": [
            "All",
            "2024",
            "2022",
            "2021",
            "2016",
            "2014",
            "2012",
            "2010",
            "2009",
            "2007"
        ]
    },
    {
        "label": "Playing For",
        "selected": "All",
        "options": [
            "All",
            "Scotland",
            "Netherlands",
            "Oman",
            "Nepal",
            "Namibia",
            "Canada",
            "Papua New Guinea",
            "United States",
            "Uganda",
            "India",
            "South Africa",
            "Australia",
            "New Zealand",
            "England",
            "Sri Lanka",
            "Pakistan",
            "West Indies",
            "Bangladesh",
            "Afghanistan",
            "Ireland"
        ]
    },
    {
        "label": "At Venue",
        "selected": "All",
        "options": [
            "All",
            "Kensington Oval, Bridgetown, Barbados",
            "Arnos Vale Stadium, Kingstown, St Vincent",
            "Daren Sammy National Cricket Stadium, Gros Islet, St. Lucia",
            "Providence Stadium, Guyana",
            "Sir Vivian Richards Stadium, North Sound, Antigua",
            "Central Broward Regional Park Stadium Turf Ground, Lauderhill, Florida",
            "Brian Lara Stadium, Tarouba",
            "Grand Prairie Stadium, Dallas",
            "Nassau County International Cricket Stadium, New York"
        ]
    },
    {
        "label": "In Format",
        "selected": "T20",
        "options": [
            "All",
            "T20",
            "ODI",
            "T10",
            "Hundred"
        ]
    }
]
const StatsLayout = ({ children }) => {
    const [headerTitle, setHeaderTitle] = useState("Stats");

    return (
        <>
            <header className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.icc-cricket.com/image/upload/t_ratio21_9-size60/prd/tevxytyonxrsx90jpnqq"
                        alt="Cricket match"
                        className="opacity-30 object-cover w-full h-full"
                        layout="fill"
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/" className="inline-flex items-center text-green-100 hover:text-white mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-8">{headerTitle}</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {dropdowns.map(e =>

                            <Select key={e} onValueChange={i => console.log(i)}>
                                <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white">
                                    <SelectValue placeholder={e.label} />
                                </SelectTrigger>
                                <SelectContent>
                                    {e.options.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}


                    </div>
                </div>
            </header>
            <div className="min-h-screen ">
                {children}
            </div>

        </>
    );
};

export default StatsLayout;