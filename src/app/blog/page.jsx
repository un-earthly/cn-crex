import BlogPost from "@/components/global/blogPost";
import { Loader2 } from "lucide-react";

const BlogListingPage = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const loadMorePosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            // Simulating an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            const newPosts = Array(10).fill().map((_, index) => ({
                id: posts.length + index + 1,
                title: `Blog Post ${posts.length + index + 1}`,
                excerpt: 'This is a sample blog post excerpt...',
                imageUrl: `https://picsum.photos/seed/${posts.length + index + 1}/400/300`,
                author: 'John Doe',
                date: 'June 1, 2024',
            }));
            setPosts(prevPosts => [...prevPosts, ...newPosts]);
            setPage(prevPage => prevPage + 1);
            setHasMore(newPosts.length > 0);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, posts.length]);

    useEffect(() => {
        if (inView) {
            loadMorePosts();
        }
    }, [inView, loadMorePosts]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-green-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl sm:text-4xl font-bold">Cricket Blog</h1>
                    <p className="mt-2">Stay updated with the latest cricket news and analysis</p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <BlogPost key={post.id} post={post} />
                    ))}
                </div>
                {loading && (
                    <div className="flex justify-center mt-8">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                )}
                <div ref={ref} className="h-10" />
            </main>

            <footer className="bg-green-600 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2024 Cricket Blog. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default BlogListingPage;