"use client"
import { useState, useMemo, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Search, ChevronDown, Loader2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import Container from '@/components/global/container'
import Link from 'next/link'

const teamFlags = {
    'Yorkshire': '🟦', // Blue square
    'Surrey': '🟧', // Orange square
    'Essex': '🟥', // Red square
    'Somerset': '🟪', // Purple square
    'Lancashire': '🟩', // Green square
    'Warwickshire': '🟨', // Yellow square
    'Mumbai': '🔵', // Blue circle
    'Delhi': '🟤', // Brown circle
    'Karnataka': '🔴', // Red circle
    'Tamil Nadu': '🟢', // Green circle
    'Bengal': '🟡', // Yellow circle
    'Gujarat': '🟠', // Orange circle
    'Victoria': '🔷', // Blue diamond
    'New South Wales': '🔶', // Orange diamond
    'Queensland': '🔺', // Red triangle
    'Western Australia': '🔻', // Blue triangle
    'South Australia': '🔲', // Black square
    'Tasmania': '🔳', // White square
    'Auckland': '⬛', // Black large square
    'Wellington': '⬜', // White large square
    'Canterbury': '🔲', // Black square
    'Northern Districts': '⬛', // Black large square
    'Otago': '⬜', // White large square
    'Central Districts': '⬛', // Black large square
    'Titans': '🔵', // Blue circle
    'Knights': '🟣', // Purple circle
    'Cape Cobras': '🔷', // Blue diamond
    'Lions': '🦁', // Lion emoji
    'Warriors': '⚔️', // Crossed swords emoji
    'Dolphins': '🐬', // Dolphin emoji
    'Karachi': '🏴', // Black flag
    'Lahore': '🏳️', // White flag
    'Rawalpindi': '🏴', // Black flag
    'Faisalabad': '🏳️', // White flag
    'Multan': '🏴', // Black flag
    'Peshawar': '🏳️', // White flag
    'Mumbai Indians': '🔵', // Blue circle
    'Chennai Super Kings': '🟡', // Yellow square
    'Royal Challengers Bangalore': '🔴', // Red circle
    'Sydney Sixers': '🟣', // Purple square
    'Melbourne Stars': '💚', // Green heart
    'Brisbane Heat': '🔥', // Fire emoji
    'Karachi Kings': '🏴', // Black flag
    'Lahore Qalandars': '🏳️', // White flag
    'Peshawar Zalmi': '💛', // Yellow heart
    'Trinbago Knight Riders': '🟥', // Red square
    'Jamaica Tallawahs': '🟨', // Yellow square
    'Barbados Tridents': '🔵', // Blue circle
    'Dhaka Dynamites': '🟡', // Yellow circle
    'Chittagong Vikings': '🟥', // Red square
    'Khulna Titans': '🔴' // Red circle
};


const series = [
    'County Championship',
    'Ranji Trophy',
    'Sheffield Shield',
    'Plunket Shield',
    'Sunfoil Series',
    'Quaid-e-Azam Trophy',
    "Indian Premier League",
    "Big Bash League",
    "Pakistan Super League",
    "Caribbean Premier League",
    "Bangladesh Premier League"
];

const teams = {
    'County Championship': ['Yorkshire', 'Surrey', 'Essex', 'Somerset', 'Lancashire', 'Warwickshire'],
    'Ranji Trophy': ['Mumbai', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Bengal', 'Gujarat'],
    'Sheffield Shield': ['Victoria', 'New South Wales', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania'],
    'Plunket Shield': ['Auckland', 'Wellington', 'Canterbury', 'Northern Districts', 'Otago', 'Central Districts'],
    'Sunfoil Series': ['Titans', 'Knights', 'Cape Cobras', 'Lions', 'Warriors', 'Dolphins'],
    'Quaid-e-Azam Trophy': ['Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'],
    "Indian Premier League": ["Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore"],
    "Big Bash League": ["Sydney Sixers", "Melbourne Stars", "Brisbane Heat"],
    "Pakistan Super League": ["Karachi Kings", "Lahore Qalandars", "Peshawar Zalmi"],
    "Caribbean Premier League": ["Trinbago Knight Riders", "Jamaica Tallawahs", "Barbados Tridents"],
    "Bangladesh Premier League": ["Dhaka Dynamites", "Chittagong Vikings", "Khulna Titans"]
};

const venues = {
    'County Championship': ['Headingley', 'The Oval', 'Trent Bridge', 'Edgbaston', 'Old Trafford', 'Lords'],
    'Ranji Trophy': ['Wankhede Stadium', 'Feroz Shah Kotla', 'M. Chinnaswamy Stadium', 'Eden Gardens', 'Narendra Modi Stadium', 'Chepauk'],
    'Sheffield Shield': ['MCG', 'SCG', 'WACA', 'The Gabba', 'Adelaide Oval', 'Bellerive Oval'],
    'Plunket Shield': ['Eden Park', 'Basin Reserve', 'Hagley Oval', 'Seddon Park', 'University Oval', 'McLean Park'],
    'Sunfoil Series': ['SuperSport Park', 'St George\'s Park', 'Newlands', 'The Wanderers', 'Kingsmead', 'Buffalo Park'],
    'Quaid-e-Azam Trophy': ['National Stadium', 'Gaddafi Stadium', 'Rawalpindi Cricket Stadium', 'Iqbal Stadium', 'Multan Cricket Stadium', 'Arbab Niaz Stadium'],
    "Indian Premier League": ["Wankhede Stadium", "M. A. Chidambaram Stadium", "M. Chinnaswamy Stadium"],
    "Big Bash League": ["Sydney Cricket Ground", "Melbourne Cricket Ground", "The Gabba"],
    "Pakistan Super League": ["National Stadium", "Gaddafi Stadium", "Rawalpindi Cricket Stadium"],
    "Caribbean Premier League": ["Queen's Park Oval", "Sabina Park", "Kensington Oval"],
    "Bangladesh Premier League": ["Sher-e-Bangla National Stadium", "Zahur Ahmed Chowdhury Stadium", "Sylhet International Cricket Stadium"]
};

function generateRandomFixture(id) {
    const randomSeries = series[Math.floor(Math.random() * series.length)];
    const seriesTeams = teams[randomSeries];
    const seriesVenues = venues[randomSeries];
    const team1 = seriesTeams[Math.floor(Math.random() * seriesTeams.length)];
    let team2 = seriesTeams[Math.floor(Math.random() * seriesTeams.length)];
    while (team2 === team1) {
        team2 = seriesTeams[Math.floor(Math.random() * seriesTeams.length)];
    }

    return {
        id,
        title: `${randomSeries} Match`,   // Adding a descriptive title
        seriesType: randomSeries,
        teams: `${team1} vs ${team2}`,
        venue: seriesVenues[Math.floor(Math.random() * seriesVenues.length)],
        date: format(new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1), 'yyyy-MM-dd'),
        time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    };
}

export default function LocalFixtures() {
    const [date, setDate] = useState(new Date())
    const [selectedSeries, setSelectedSeries] = useState('all')
    const [selectedTeam, setSelectedTeam] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [fixtures, setFixtures] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Generate initial fixtures
        setFixtures(Array.from({ length: 20 }, (_, i) => generateRandomFixture(i + 1)))
    }, [])

    const filteredFixtures = useMemo(() => {
        return fixtures.filter(fixture => {
            const matchTeams = fixture.teams.toLowerCase()
            return (
                (selectedSeries === 'all' || fixture.series === selectedSeries) &&
                (!selectedTeam || matchTeams.includes(selectedTeam.toLowerCase())) &&
                (!searchTerm || matchTeams.includes(searchTerm.toLowerCase()) || fixture.venue.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        })
    }, [fixtures, selectedSeries, selectedTeam, searchTerm])

    const loadMoreFixtures = () => {
        setLoading(true)
        setTimeout(() => {
            const newFixtures = Array.from({ length: 10 }, (_, i) =>
                generateRandomFixture(fixtures.length + i + 1)
            )
            setFixtures(prev => [...prev, ...newFixtures])
            setLoading(false)
        }, 1000) // Simulate network delay
    }

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
        if (bottom && !loading) {
            loadMoreFixtures()
        }
    }

    const formattedDate = (date) => format(new Date(date), 'dd MMM yyyy')
    const formattedTime = (time) => format(new Date(`2000-01-01T${time}`), 'hh:mm a')

    return (<>
        <header className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-12 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.icc-cricket.com/image/upload/t_ratio21_9-size60/prd/tevxytyonxrsx90jpnqq"
                    alt="Cricket match"
                    className="opacity-30 object-cover w-full h-full"
                />
            </div>
            <Container className="relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center text-green-100 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
                    Local Series Fixtures
                </h1>

            </Container>
        </header>
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap gap-4 mb-6">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>

                <Select onValueChange={setSelectedSeries} defaultValue={selectedSeries}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Series</SelectItem>
                        {series.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[200px] justify-between">
                            {selectedTeam || "Select team"}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Input
                            placeholder="Search teams..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-b rounded-t-none focus:ring-0"
                        />
                        <div className="max-h-[300px] overflow-auto">
                            {Object.values(teams).flat().filter(team => team.toLowerCase().includes(searchTerm.toLowerCase())).map(team => (
                                <Button
                                    key={team}
                                    variant="ghost"
                                    className="w-full justify-start font-normal"
                                    onClick={() => {
                                        setSelectedTeam(team)
                                        setSearchTerm('')
                                    }}
                                >
                                    {team}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <Input
                    placeholder="Search fixtures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[300px]"
                />
            </div>

            <ScrollArea className="h-[600px] w-full rounded-md border" onScrollCapture={handleScroll}>
                <div className="p-4">
                    {filteredFixtures.map((match) => (
                        <Card key={match.id} className="mb-4 overflow-hidden">
                            <CardHeader className="bg-gray-50 p-4">
                                <CardTitle className="text-lg font-semibold">{match.title}</CardTitle>
                                <p className="text-sm text-gray-500">{match.seriesType}</p>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2">
                                        {match.teams.split(' vs ').map((team, index) => (
                                            <span key={index} className="flex items-center">
                                                {teamFlags[team]} <span className="ml-1">{team}</span>
                                                {index === 0 && <span className="mx-2 text-gray-400">vs</span>}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {formattedDate(match.date)} at {formattedTime(match.time)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">{match.venue}</p>
                            </CardContent>
                        </Card>
                    ))}
                    {loading && (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    </>
    )
}