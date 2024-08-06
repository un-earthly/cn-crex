import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import Flag from 'react-flagkit';
import { Calendar, Clock, Play, RefreshCcw, Tag, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';

const LiveStreamingSection = () => (
    <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Cricket Stadium"
                className="w-full h-full object-cover opacity-30"
            />
        </div>
        <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Live Streaming</h2>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                    <div className="bg-red-600 rounded-full p-2 mr-4">
                        <Play className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">India vs Australia</h3>
                        <p className="text-sm text-green-200">ICC World Cup 2024 - Final</p>
                    </div>
                </div>
                <Button className="bg-white text-green-800 hover:bg-green-100 transition-colors duration-300">
                    Watch Now
                </Button>
            </div>
        </div>
    </section>
);

const ScoreCard = ({ match }) => (
    <Link href={`match-details/${match.matchId}`}>
        <Card className="h-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-md rounded-lg overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-200">
            <CardHeader className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Flag country={match.team1Code} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-sm" />
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">vs</span>
                        <Flag country={match.team2Code} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-sm" />
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${match.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {match.status}
                    </div>
                </div>
                <CardTitle className="text-sm sm:text-base font-bold mt-2 text-gray-800">{match.teams}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-2 sm:px-4 sm:py-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <p className="text-sm sm:text-base font-semibold text-gray-800">{match.score}</p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{match.time}</span>
                    </div>
                </div>
                {match.recentEvents && (
                    <div className="text-xs sm:text-sm bg-gray-100 p-1 sm:p-2 rounded-md">
                        <span className="font-medium text-gray-700">Recent:</span> {match.recentEvents}
                    </div>
                )}
            </CardContent>
        </Card>
    </Link>
);

const BlogPost = ({ post }) => (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden group">
            <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Play className='h-6 w-6 sm:h-8 sm:w-8 text-white' />
                </div>
            </div>
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {post.category}
            </div>
        </div>
        <CardHeader className="pb-1 sm:pb-2 flex-grow">
            <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 transition-colors hover:text-green-600">
                {post.title}
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mt-2">{post.excerpt}</p>
        </CardHeader>
        <CardContent className="pb-1 sm:pb-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {post.date}
                </div>
                <div className="flex items-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {post.author}
                </div>
                <div className="flex items-center">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {post.readTime}
                </div>
            </div>
        </CardContent>
        <CardFooter className="pt-1 sm:pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-gray-100">
            <Link href={`/blog/${post.id}`}>

                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800 transition-colors text-xs sm:text-sm">
                    Read More
                </Button>
            </Link>

            <div className="flex flex-wrap gap-1 sm:gap-2">
                {post.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                        {tag}
                    </span>
                ))}
            </div>
        </CardFooter>
    </Card>

);

const Footer = () => (
    <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4">
            <p className="text-center text-gray-600">© 2024 Cricket Live. All rights reserved.</p>
        </div>
    </footer>
);
const LandingPage = () => {
    const liveMatches = [
        {
            teams: 'India vs Australia',
            score: 'IND 280/4 (45 ov)',
            status: 'Live',
            team1Code: 'IN',
            team2Code: 'AU',
            matchId: 1
        },
        {
            teams: 'England vs South Africa',
            score: 'ENG 220/7 (38 ov)',
            status: 'Live',
            team1Code: 'GB',
            team2Code: 'ZA',
            matchId: 2
        },
        {
            teams: 'New Zealand vs West Indies',
            score: 'NZ 180/3 (30 ov)',
            status: 'Live',
            team1Code: 'NZ',
            team2Code: 'WI',
            matchId: 5
        },
        {
            teams: 'Pakistan vs Sri Lanka',
            score: 'PAK 150/2 (25 ov)',
            status: 'Live',
            team1Code: 'PK',
            team2Code: 'LK',
            matchId: 3
        },
        {
            teams: 'Bangladesh vs Afghanistan',
            score: 'BAN 200/5 (35 ov)',
            status: 'Live',
            team1Code: 'BD',
            team2Code: 'AF',
            matchId: 4
        },
        {
            teams: 'Zimbabwe vs Ireland',
            score: 'ZIM 120/1 (20 ov)',
            status: 'Live',
            team1Code: 'ZW',
            team2Code: 'IE',
            matchId: 8
        },
        {
            teams: 'Netherlands vs Scotland',
            score: 'NED 90/3 (15 ov)',
            status: 'Live',
            team1Code: 'NL',
            team2Code: 'GB-SCT',
            matchId: 7
        },
    ];


    const blogPosts = [
        {
            title: 'Top 10 Cricket Moments of 2024',
            excerpt: 'Relive the most exciting moments from this year\'s cricket matches, from stunning catches to nail-biting finishes. We\'ve compiled the very best that the cricketing world has offered in 2024.',
            imageUrl: 'https://imgs.search.brave.com/si4Y-HfJpxcUG4SvKJ8umugj19dr8UTXeW7qQXT5H7M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE1/OTg0NTI5Mi9waG90/by9icmlkZ2V0b3du/LWJhcmJhZG9zLXBs/YXllcnMtb2YtaW5k/aWEtY2VsZWJyYXRl/LWFmdGVyLXRoZXkt/ZGVmZWF0ZWQtc291/dGgtYWZyaWNhLXRv/LXdpbi10aGUuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPUpm/UHVoUklYXy1qNGVo/QUhiODNqeUFHay11/eXl0NEpyQWR2X1R2/eE8zaUE9',
            date: 'May 15, 2024',
            category: 'Highlights',
            author: 'John Smith',
            readTime: '8 min read',
            tags: ['Cricket', '2024', 'Highlights', 'Top Moments']
        },
        {
            title: 'Rising Stars: Young Cricketers to Watch',
            excerpt: 'Meet the upcoming talent that\'s set to take the cricket world by storm. These young players are making waves with their exceptional skills and are poised to become the next generation of cricket superstars.',
            imageUrl: 'https://imgs.search.brave.com/P2bgXmthOJF_pN6w2jTGjurIu5RonzCsvuK5O_lTjRQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YWxqYXplZXJhLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/NC8wNi9BRlBfXzIw/MjQwNjI5X18zNFpW/M0UzX192MV9fSGln/aFJlc19fQ3JpY2tl/dE1lblNUMjBXb3Js/ZEN1cEZpbmFsSW5k/aWFWU291dGhBZnJp/Y2EtMTcxOTY4NjI0/OC5qcGc_dz03NzAm/cmVzaXplPTc3MCw1/MTM',
            date: 'May 12, 2024',
            category: 'Player Spotlight',
            author: 'Sarah Johnson',
            readTime: '6 min read',
            tags: ['Young Talent', 'Future Stars', 'Cricket']
        },
        {
            title: 'The Evolution of T20 Cricket',
            excerpt: 'How the shortest format of the game has changed cricket forever. Explore the impact of T20 on player skills, strategies, and the sport\'s global appeal. We dive deep into the transformation of cricket in the T20 era.',
            imageUrl: 'https://imgs.search.brave.com/XV5LeSfLR5vj9R6p6VtWzJ0pQlU3N91vh8iZ3CzHr4E/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaWNjLWNyaWNr/ZXQuY29tL2ltYWdl/L3VwbG9hZC90X3Jh/dGlvM180LXNpemUy/MC92MTcxOTg2MDU4/Mi9wcmQvanVrY20y/ZnVvaWViank3aXJ4/Zjg.jpeg',
            date: 'May 10, 2024',
            category: 'Analysis',
            author: 'Michael Lee',
            readTime: '10 min read',
            tags: ['T20', 'Cricket Evolution', 'Strategy']
        },
    ];
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <LiveStreamingSection />

                <div className="container mx-auto px-4 py-8 space-y-12 sm:space-y-16">
                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Live Scores</h2>
                        <Carousel className="w-full">
                            <CarouselContent className="-ml-2 sm:-ml-4">
                                {liveMatches.map((match, index) => (
                                    <CarouselItem key={index} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                        <div className="p-1">
                                            <ScoreCard match={match} />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5" />
                            <CarouselNext className="hidden sm:flex -right-4 sm:-right-5" />
                        </Carousel>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Latest Cricket News</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {blogPosts.map((post, index) => (
                                <BlogPost key={index} post={post} />
                            ))}
                        </div>
                        <Button className="flex gap-2 mx-auto mt-8 sm:mt-10 hover:bg-green-50 hover:text-green-800 text-green-600 duration-300" variant="outline">
                            <RefreshCcw className='h-4 w-4' /> Load More
                        </Button>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;