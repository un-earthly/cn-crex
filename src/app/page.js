"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import Flag from 'react-flagkit';
import { Calendar, Clock, Play, RefreshCcw, Tag, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import BlogPost from '@/components/global/blogPost';
import { blogPosts as initialBlogPosts, liveMatches } from '../../data';
import Footer from '@/components/global/footer';

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


const LandingPage = () => {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPosts = [
        {
          id: Math.floor(100000 + Math.random() * 900000).toString(),
          title: `New Blog Post ${page + 1}`,
          excerpt: 'This is a new blog post loaded dynamically...',
          imageUrl: `https://picsum.photos/seed/${page + 1}/400/300`,
          date: 'August 10, 2024',
          category: 'News',
          author: 'John Doe',
          readTime: '5 min read',
          tags: ['Cricket', 'News']
        },
      ];


      setBlogPosts(prev => [...prev, ...newPosts]);
      setPage(prevPage => prevPage + 1);
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    loadMorePosts();
  }, [loadMorePosts, loading]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
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
            {loading && (
              <div className="text-center mt-4">
                <p className="text-gray-600">Loading more posts...</p>
              </div>
            )}
            {!loading && hasMore && (
              <Button
                className="flex gap-2 mx-auto mt-8 sm:mt-10 hover:bg-green-50 hover:text-green-800 text-green-600 duration-300"
                variant="outline"
                onClick={loadMorePosts}
              >
                <RefreshCcw className='h-4 w-4' /> Load More
              </Button>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;