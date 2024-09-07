"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BarChart2, Calendar, Info, Newspaper, SquareKanban, Users } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Layout({ children }) {
    const params = useParams()
    const seriesSlug = params.slug
    const seriesSubSlug = params.subSlug

    const seriesName = seriesSubSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')


    const links = [
        { href: `/series/${seriesSlug}/${seriesSubSlug}`, label: 'Overview', icon: SquareKanban },
        { href: `/series/${seriesSlug}/${seriesSubSlug}/matches`, label: 'Matches', icon: Calendar },
        { href: `/series/${seriesSlug}/${seriesSubSlug}/team-squad`, label: 'Squads', icon: Users },
        { href: seriesSubSlug.includes("tour") ? `/series/${seriesSlug}/${seriesSubSlug}/series-stats` : `/series/${seriesSlug}/${seriesSubSlug}/points-table`, label: seriesSubSlug.includes("tour") ? 'Standings' : "Point Table", icon: BarChart2 },
        { href: `/series/${seriesSlug}/${seriesSubSlug}/news`, label: 'News', icon: Newspaper },
        { href: `/series/${seriesSlug}/${seriesSubSlug}/info`, label: 'Info', icon: Info },
    ]
    return (
        <div className="min-h-screen">
            <div className="sticky top-10 z-10">

                <Card className="w-full overflow-hidden">
                    <div className="relative h-48 md:h-64">
                        <img
                            src={"https://wallpapers.com/images/hd/cricket-ground-background-a2rr2mi4xx5wedcl.jpg"}
                            alt={seriesName}
                            objectFit="cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{seriesName}</h1>
                            <div className="flex flex-wrap gap-2">
                                {links.map((link) => (
                                    <Link key={link.href} href={link.href}>
                                        <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                                            <link.icon className="w-4 h-4 mr-2" />
                                            {link.label}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div >
                {children}
            </div>
        </div>
    )
}
