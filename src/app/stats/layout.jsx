import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/global/footer';

const StatsLayout = ({ children }) => {
    return (
        <>
            <div className="min-h-screen ">
                {children}
            </div>
            <Footer />

        </>
    );
};

export default StatsLayout;