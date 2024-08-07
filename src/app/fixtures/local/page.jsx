"use client"
import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from "lucide-react"
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

export default function LocalFixtures() {
    const [date, setDate] = useState(new Date())
    const [selectedSeries, setSelectedSeries] = useState('all')

    // Mock data - replace with actual API call
    const fixtures = [
        { id: 1, series: 'County Championship', teams: 'Yorkshire vs Surrey', venue: 'Headingley', date: '2024-01-15' },
        { id: 2, series: 'Ranji Trophy', teams: 'Mumbai vs Delhi', venue: 'Wankhede Stadium', date: '2024-01-18' },
        { id: 3, series: 'Sheffield Shield', teams: 'Victoria vs New South Wales', venue: 'MCG', date: '2024-01-20' },
        { id: 4, series: 'Plunket Shield', teams: 'Auckland vs Wellington', venue: 'Eden Park', date: '2024-01-22' },
    ]

    const filteredFixtures = selectedSeries === 'all'
        ? fixtures
        : fixtures.filter(fixture => fixture.series === selectedSeries)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Local Series Fixtures</h1>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Select onValueChange={setSelectedSeries} defaultValue={selectedSeries}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Series</SelectItem>
                        <SelectItem value="County Championship">County Championship</SelectItem>
                        <SelectItem value="Ranji Trophy">Ranji Trophy</SelectItem>
                        <SelectItem value="Sheffield Shield">Sheffield Shield</SelectItem>
                        <SelectItem value="Plunket Shield">Plunket Shield</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredFixtures.map((match) => (
                    <Card key={match.id}>
                        <CardHeader>
                            <CardTitle>{match.teams}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">{match.series}</p>
                            <p className="text-sm text-muted-foreground mt-1">{match.venue}</p>
                            <p className="text-sm font-medium mt-2">{format(new Date(match.date), 'MMMM d, yyyy')}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}