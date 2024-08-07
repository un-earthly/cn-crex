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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InternationalFixtures() {
    const [date, setDate] = useState(new Date())

    // Mock data - replace with actual API call
    const fixtures = {
        test: [
            { id: 1, teams: 'India vs Australia', venue: 'Melbourne Cricket Ground', date: '2024-01-15' },
            { id: 2, teams: 'England vs South Africa', venue: 'Lords', date: '2024-01-20' },
        ],
        odi: [
            { id: 3, teams: 'New Zealand vs West Indies', venue: 'Eden Park', date: '2024-01-18' },
            { id: 4, teams: 'Pakistan vs Sri Lanka', venue: 'Gaddafi Stadium', date: '2024-01-22' },
        ],
        t20: [
            { id: 5, teams: 'Bangladesh vs Afghanistan', venue: 'Shere Bangla Stadium', date: '2024-01-17' },
            { id: 6, teams: 'Ireland vs Zimbabwe', venue: 'Clontarf Cricket Club Ground', date: '2024-01-19' },
        ],
    }
    const formattedDate = (date) => format(date || new Date(), 'yyyy-MM-dd')
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">International Fixtures</h1>

            <div className="flex justify-between items-center mb-6">
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
            </div>

            <Tabs defaultValue="test">
                <TabsList>
                    <TabsTrigger value="test">Test</TabsTrigger>
                    <TabsTrigger value="odi">ODI</TabsTrigger>
                    <TabsTrigger value="t20">T20</TabsTrigger>
                </TabsList>
                {Object.entries(fixtures).map(([format, matches]) => (
                    <TabsContent key={format} value={format}>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {matches.map((match) => (
                                <Card key={match.id}>
                                    <CardHeader>
                                        <CardTitle>{match.teams}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{match.venue}</p>
                                        <p className="text-sm font-medium mt-2">{() => formattedDate(match.date)}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}