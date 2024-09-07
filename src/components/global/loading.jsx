'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function Loading() {
    const [loadingMessage, setLoadingMessage] = useState('Loading awesome content')
    const messages = [
        'Loading awesome content',
        'Preparing your experience',
        'Almost there',
        'Just a moment more',
        'Fetching the latest data'
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingMessage(prevMessage => {
                const currentIndex = messages.indexOf(prevMessage)
                return messages[(currentIndex + 1) % messages.length]
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [messages])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary">
            <div className="text-center space-y-8">
                <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{loadingMessage}</h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                        We&apos;re working hard to get everything ready for you.
                    </p>
                </div>
                <div className="w-full max-w-md mx-auto">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '75%' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}