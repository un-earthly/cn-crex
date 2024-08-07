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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import Container from '@/components/global/container'
import Link from 'next/link'

const teamFlags = {
    'India': '🇮🇳',
    'Australia': '🇦🇺',
    'England': '🇬🇧',
    'South Africa': '🇿🇦',
    'New Zealand': '🇳🇿',
    'West Indies': '🇯🇲',
    'Pakistan': '🇵🇰',
    'Sri Lanka': '🇱🇰',
    'Bangladesh': '🇧🇩',
    'Afghanistan': '🇦🇫',
    'Ireland': '🇮🇪',
    'Zimbabwe': '🇿🇼',
}

const allTeams = Object.keys(teamFlags)
const seriesTypes = ['Bilateral', 'Tri-Series', 'Tournament']
const formats = ['test', 'odi', 't20']
const venues = [
    'Melbourne Cricket Ground',
    'Lords',
    'Eden Park',
    'Gaddafi Stadium',
    'Shere Bangla Stadium',
    'Clontarf Cricket Club Ground'
]

function generateRandomFixture(id) {
    const team1 = allTeams[Math.floor(Math.random() * allTeams.length)]
    let team2 = allTeams[Math.floor(Math.random() * allTeams.length)]
    while (team2 === team1) {
        team2 = allTeams[Math.floor(Math.random() * allTeams.length)]
    }

    return {
        id,
        teams: `${team1} vs ${team2}`,
        venue: venues[Math.floor(Math.random() * venues.length)],
        date: format(new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1), 'yyyy-MM-dd'),
        time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        title: `${formats[Math.floor(Math.random() * formats.length)].toUpperCase()} Series`,
        seriesType: seriesTypes[Math.floor(Math.random() * seriesTypes.length)]
    }
}

export default function InternationalFixtures() {
    const [date, setDate] = useState(new Date())
    const [selectedTeam, setSelectedTeam] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedFormat, setSelectedFormat] = useState('all')
    const [selectedSeriesType, setSelectedSeriesType] = useState('all')
    const [fixtures, setFixtures] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Generate initial fixtures
        setFixtures(Array.from({ length: 20 }, (_, i) => generateRandomFixture(i + 1)))
    }, [])

    const formattedDate = (date) => format(new Date(date), 'dd MMM yyyy')
    const formattedTime = (time) => format(new Date(`2000-01-01T${time}`), 'hh:mm a')

    const filteredFixtures = useMemo(() => {
        return fixtures.filter(match => {
            const matchTeams = match.teams.toLowerCase()
            return (
                (selectedFormat === 'all' || match.title.toLowerCase().includes(selectedFormat)) &&
                (selectedSeriesType === 'all' || match.seriesType === selectedSeriesType) &&
                (!selectedTeam || matchTeams.includes(selectedTeam.toLowerCase())) &&
                (!searchTerm || matchTeams.includes(searchTerm.toLowerCase()) || match.venue.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        })
    }, [fixtures, selectedFormat, selectedSeriesType, selectedTeam, searchTerm])

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

    return (
        <>
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
                        International Fixtures</h1>

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

                    <Select onValueChange={setSelectedFormat}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Formats</SelectItem>
                            <SelectItem value="test">Test</SelectItem>
                            <SelectItem value="odi">ODI</SelectItem>
                            <SelectItem value="t20">T20</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setSelectedSeriesType}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select series type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Series Types</SelectItem>
                            <SelectItem value="Bilateral">Bilateral</SelectItem>
                            <SelectItem value="Tri-Series">Tri-Series</SelectItem>
                            <SelectItem value="Tournament">Tournament</SelectItem>
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
                                {Object.keys(teamFlags)
                                    .filter(team => team.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(team => (
                                        <Button
                                            key={team}
                                            variant="ghost"
                                            className="w-full justify-start font-normal"
                                            onClick={() => {
                                                setSelectedTeam(team)
                                                setSearchTerm('')
                                            }}
                                        >
                                            {teamFlags[team]} {team}
                                        </Button>
                                    ))
                                }
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