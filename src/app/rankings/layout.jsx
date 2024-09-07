"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from 'lucide-react'

const menuItems = [
    { parent: "men", slug: "/rankings/men/teams", title: "Team" },
    { parent: "men", slug: "/rankings/men/batter", title: "Batter" },
    { parent: "men", slug: "/rankings/men/bowler", title: "Bowler" },
    { parent: "men", slug: "/rankings/men/allrounder", title: "All Rounder" },
    { parent: "women", slug: "/rankings/women/teams", title: "Team" },
    { parent: "women", slug: "/rankings/women/batter", title: "Batter" },
    { parent: "women", slug: "/rankings/women/bowler", title: "Bowler" },
    { parent: "women", slug: "/rankings/women/allrounder", title: "All Rounder" }
]

export default function Component({ children }) {
    const [activeTab, setActiveTab] = useState('men')
    const [activeMenuItem, setActiveMenuItem] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const gender = pathname.includes('/women') ? 'women' : 'men'
        setActiveTab(gender)

        const currentMenuItem = menuItems.find(item => pathname.includes(item.slug))
        if (currentMenuItem) {
            setActiveMenuItem(currentMenuItem.slug)
        }
    }, [pathname])

    const filteredMenus = menuItems.filter(item => item.parent === activeTab)

    const handleTabChange = (value) => {
        setActiveTab(value)
        const newPath = value === 'men' ? '/rankings/men/teams' : '/rankings/women/teams'
        router.push(newPath)
    }

    const handleSubNavChange = (value) => {
        setActiveMenuItem(value)
        router.push(value)
    }

    const getTitle = () => {
        const currentItem = menuItems.find(item => item.slug === activeMenuItem)
        if (currentItem) {
            const genderText = activeTab === 'men' ? "Men's" : "Women's"
            return `${genderText} ${currentItem.title} Rankings`
        }
        return 'Cricket Rankings'
    }

    return (
        <div className="container px-4 py-8 flex">
            <aside className="w-64 mr-8">
                <Card className="sticky top-8">
                    <CardHeader>
                        <CardTitle>
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {activeTab === 'men' ? "Men's Rankings" : "Women's Rankings"}
                                <ChevronDownIcon className="h-4 w-4 ml-2" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    {isOpen && (
                        <CardContent>
                            <nav className="flex flex-col space-y-1">
                                <Button
                                    variant={activeTab === 'men' ? 'default' : 'ghost'}
                                    className="justify-start"
                                    onClick={() => handleTabChange('men')}
                                >
                                    Men&apos;s Rankings
                                </Button>
                                <Button
                                    variant={activeTab === 'women' ? 'default' : 'ghost'}
                                    className="justify-start"
                                    onClick={() => handleTabChange('women')}
                                >
                                    Women&apos;s Rankings
                                </Button>
                            </nav>
                        </CardContent>
                    )}
                    <CardContent>
                        <nav className="flex flex-col space-y-1">
                            {filteredMenus.map(item => (
                                <Button
                                    key={item.slug}
                                    variant={activeMenuItem === item.slug ? 'default' : 'ghost'}
                                    className="justify-start"
                                    onClick={() => handleSubNavChange(item.slug)}
                                >
                                    {item.title}
                                </Button>
                            ))}
                        </nav>
                    </CardContent>
                </Card>
            </aside>
            <main className="flex-1">
                {/* <h1 className="text-4xl font-bold mb-8 text-center text-primary">{getTitle()}</h1> */}
                <Card>
                    <CardContent className="p-6">
                        {children}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}