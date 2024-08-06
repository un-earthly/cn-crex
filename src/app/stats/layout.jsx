import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const StatsLayout = ({ children }) => {


    return (
        <div className="min-h-screen bg-gray-100">

            <header className="bg-green-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <Link href="/" className="inline-flex items-center text-green-100 hover:text-white mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Batting stats</h1>

                </div>
            </header>
            <div className="container mx-auto px-4 py-8 space-y-12 sm:space-y-16">

                <div className="bg-white shadow-md rounded-lg p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default StatsLayout;