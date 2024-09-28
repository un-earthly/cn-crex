"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, Clock, MapPin, Play, Radio, RefreshCcw, Shield, Tag, TrendingUp, Trophy, User } from 'lucide-react';
import BlogPost from '@/components/global/blogPost';
import Footer from '@/components/global/footer';
import axios from 'axios';
import Loading from '@/components/global/loading';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';

const ScoreCard = ({ match }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'live': return 'bg-red-500';
      case 'upcoming': return 'bg-teal-500';
      case 'finished': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'live': return <Radio className="h-4 w-4 animate-pulse" />;
      case 'upcoming': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };


  return (
    <Link href={match?.link}>
      <div
        style={{ backgroundImage: "url('/bg-stedium.jpg')" }}
        className="bg-black h-96 w-80 bg-cover bg-center p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-white">

        <div className="flex justify-between">
          <div className="div">
            <img className='h-24 w-24' src={match.team1.logo} alt="" />
          </div>
          <div className="mt-14">
            <img className='h-24 w-24' src={match.team2.logo} alt="" />
          </div>
        </div>

        <div className="bg-black bg-opacity-40 p-4 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="font-bold">{match.team1.name}</span>
            <span>{match.team1.score} ({match.team1.overs} overs)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">{match.team2.name}</span>
            <span>{match.team2.score || 'Yet to bat'}</span>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">{match.result}</p>
          </div>
        </div>

      </div>
    </Link>
  );
};

const EventCard = ({ event }) => {
  const eventDate = new Date(event.TimeStart);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Link href={`/stream?chid=${event.Channel}`} passHref>
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardHeader className="bg-gray-50 border-b">
          <h3 className="text-lg font-semibold">{event.Name}</h3>
          <p className="text-sm text-gray-500">{event.League}</p>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{event.Home}</span>
            <span className="text-sm text-gray-500">vs</span>
            <span className="font-medium">{event.Away}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formattedTime}</span>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-3">
          <div className="w-full text-center text-sm font-medium">
            {event.IsLive ? (
              <span className="text-green-600">Live Now</span>
            ) : (
              <span className="text-blue-600">Upcoming</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [newses, setNewses] = useState([]);
  const [page, setPage] = useState(0);
  const [liveMatches, setLiveMatches] = useState([]);
  const [matches, setmatches] = useState([])

  useEffect(() => {
    const fetchmatches = async () => {
      try {
        const response = await axios.get('/api/get-matches')
        setmatches(response.data.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching matches:', error)
      }
    }

    fetchmatches()
  }, [])
  const fetchNewses = useCallback(async () => {
    try {
      setLoading2(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE}/api/news-blogs?clicks=${page}`);
      console.log('API Response:', response.data);
      setNewses(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading2(false);
    }
  }, [page]);


  const fetchCurrentMatches = useCallback(async (pageNumber = 1) => {
    try {
      console.log(`Fetching page: ${pageNumber}`);
      // setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE}/api/match/all`);
      console.log('API Response:', response.data);

      setLiveMatches(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchCurrentMatches()
  }, []);
  useEffect(() => {
    console.log(page)
    fetchNewses();
  }, [page])
  if (loading || loading2) {
    return <Loading />
  }
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">

        <div className="mx-auto relative z-10">
          <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
            <SwiperSlide>
              <div style={{
                backgroundImage: `url('https://img.b112j.com/upload/announcement/image_154217.jpg')`,

                height: '420px',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
              </div>
            </SwiperSlide>
            <SwiperSlide>


              <div style={{
                backgroundImage: `url('https://img.b112j.com/upload/announcement/image_162506.jpg')`,
                height: '420px',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
              </div>
            </SwiperSlide>
            <SwiperSlide>


              <div style={{
                backgroundImage: `url('https://img.b112j.com/upload/announcement/image_132015.jpg')`,

                height: '420px',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>

              </div>
            </SwiperSlide>
          </Swiper>

        </div>

        <div className="container mx-auto px-4 py-8 space-y-12 sm:space-y-16">
          {/* <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Live Scores</h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 sm:-ml-4">
                {loading ? (
                  [0, 1, 2, 3].map(index => (
                    <CarouselItem key={index} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <div className="p-1">
                        <Card className=" bg-white shadow-md animate-pulse">
                          <CardHeader className="border-b border-gray-200 p-4 space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              {[0, 1].map((index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-6 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                  </div>
                                  <div className="text-right">
                                    <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                                    {index === 0 && <div className="h-4 bg-gray-200 rounded w-12"></div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
                            <div className="w-full flex justify-center">
                              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  liveMatches?.map((match, index) => (
                    <CarouselItem key={index} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <ScoreCard match={match} />
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5" />
              <CarouselNext className="hidden sm:flex -right-4 sm:-right-5" />
            </Carousel>
          </section> */}

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Matches</h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 sm:-ml-4">
                {matches.length > 0 ? (
                  matches.map((event, index) => (
                    <CarouselItem key={index} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <EventCard event={event} />
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="pl-2 sm:pl-4 basis-full">
                    <Card className="p-6">
                      <p className="text-center text-gray-500">No upcoming matches found.</p>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5" />
              <CarouselNext className="hidden sm:flex -right-4 sm:-right-5" />
            </Carousel>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Latest Cricket News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {newses?.map((post, index) => (
                <BlogPost key={index} post={post} />
              ))}
            </div>
            {loading && (
              <div className="text-center mt-4">
                <p className="text-gray-600">Loading more posts...</p>
              </div>
            )}
            <Button
              className="flex gap-2 mx-auto mt-8 sm:mt-10 hover:bg-green-50 hover:text-green-800 text-green-600 duration-300"
              variant="outline"
              onClick={() => setPage(prev => prev + 1)}
              disabled={loading}
            >
              <RefreshCcw className='h-4 w-4' /> Load More News
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;