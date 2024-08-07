import Footer from '@/components/global/footer'
import React from 'react'

export default function layout({ children }) {
    return (
        <div>
            <div className="min-h-screen ">
                {children}
            </div>
            <Footer />
        </div>
    )
}
