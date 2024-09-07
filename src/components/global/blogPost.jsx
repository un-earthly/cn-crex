import { Calendar, Play, Tag } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Component({ post }) {
    return (
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
                        <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                </div>
            </div>
            <CardHeader className="pb-1 sm:pb-2 flex-grow">
                <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 transition-colors hover:text-green-600">
                    {post.title}
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mt-2">{post.description}</p>
            </CardHeader>
            <CardContent className="pb-1 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {post.time}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-1 sm:pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-gray-100">
                <Link href={post.link}>
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
    )
}