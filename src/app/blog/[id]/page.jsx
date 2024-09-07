import React from 'react';
import { ArrowLeft, Calendar, Clock, Share2, ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Footer from '@/components/global/footer';

const BlogDetailsPage = ({
    post = {
        title: "The Evolution of T20 Cricket: A Game-Changing Format",
        author: "Jane Doe",
        date: "June 15, 2024",
        readTime: "10 min read",
        imageUrl: "https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        excerpt: "Explore how T20 cricket has revolutionized the sport, influencing player strategies and global appeal.",
        content: {
            paragraph1: "T20 cricket has dramatically altered the landscape of the sport since its inception...",
            quote: "T20 is not just a game, it's a spectacle that has brought a new generation of fans to cricket.",
            videoUrl: "https://www.youtube.com/watch?v=bWtF02dbwjY",
            paragraph2: "The impact of T20 on player skills and strategies has been profound...",
            conclusion: "As we look to the future, T20 cricket continues to evolve, promising even more excitement for fans worldwide."
        },
        relatedPosts: [
            { title: "Top 10 T20 Moments of the Decade", slug: "top-10-t20-moments" },
            { title: "How T20 is Shaping the Future of Cricket", slug: "t20-future-of-cricket" },
            { title: "T20 World Cup 2024: Preview and Predictions", slug: "t20-world-cup-2024-preview" }
        ]
    } }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-green-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <Link href="/" className="inline-flex items-center text-green-100 hover:text-white mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {post.author}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {post.date}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {post.readTime}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />

                    <div className="p-6 sm:p-8">
                        <div className="prose max-w-none">
                            <p className="lead">{post.excerpt}</p>

                            <h2>Key Highlights</h2>
                            <p>{post.content.paragraph1}</p>

                            <blockquote className="border-l-4 border-green-500 pl-4 italic my-6">
                                {post.content.quote}
                            </blockquote>

                            <h2>Video Analysis</h2>
                            <div className="aspect-w-16 aspect-h-9 my-6">
                                <iframe
                                    src={post.content.videoUrl}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full rounded-lg"
                                ></iframe>
                            </div>

                            <p>{post.content.paragraph2}</p>

                            <h2>Conclusion</h2>
                            <p>{post.content.conclusion}</p>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Like
                            </Button>
                            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                </article>

                <Card className="mt-8 max-w-3xl mx-auto">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Related Posts</h3>
                        <ul className="space-y-4">
                            {post.relatedPosts.map((relatedPost, index) => (
                                <li key={index}>
                                    <Link href={`/blog/${relatedPost.slug}`} className="text-green-600 hover:text-green-800">
                                        {relatedPost.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetailsPage;