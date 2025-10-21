'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBlogPosts, type BlogPost } from '@/lib/blog-service';
import { BlogPostCard } from '@/components/blog-post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Tag, Hash, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function TagPage() {
  const params = useParams();
  const router = useRouter();
  const tag = decodeURIComponent(params.tag as string);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [relatedTags, setRelatedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'publishedAt' | 'likes' | 'views'>('publishedAt');

  useEffect(() => {
    loadTagPosts();
  }, [tag, sortBy]);

  const loadTagPosts = async () => {
    setIsLoading(true);
    try {
      const result = await getBlogPosts({
        tag: tag,
        orderBy: sortBy,
        limit: 50,
      });
      setPosts(result.posts);

      // Extract related tags from posts
      const allTags = new Set<string>();
      result.posts.forEach(post => {
        post.tags.forEach(t => {
          if (t.toLowerCase() !== tag.toLowerCase()) {
            allTags.add(t);
          }
        });
      });
      setRelatedTags(Array.from(allTags).slice(0, 12));
    } catch (error) {
      console.error('Error loading tag posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Tag Header */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Hash className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold">
                    #{tag}
                  </h1>
                  <Badge className="text-lg px-3 py-1 bg-primary">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Explore all blog posts tagged with <span className="font-semibold">#{tag}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="w-4 h-4" />
            <span>Sort by:</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'publishedAt' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('publishedAt')}
            >
              Latest
            </Button>
            <Button
              variant={sortBy === 'likes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('likes')}
            >
              Most Liked
            </Button>
            <Button
              variant={sortBy === 'views' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('views')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Hash className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Posts with This Tag</h3>
              <p className="text-muted-foreground mb-6">
                There are no blog posts tagged with <span className="font-semibold">#{tag}</span> yet.
              </p>
              <Link href="/blog">
                <Button>Explore All Posts</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Load More (if needed) */}
            {posts.length >= 50 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Posts
                </Button>
              </div>
            )}
          </>
        )}

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Tag className="w-6 h-6" />
              Related Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((relatedTag) => (
                <Link key={relatedTag} href={`/blog/tag/${encodeURIComponent(relatedTag)}`}>
                  <Badge 
                    variant="outline" 
                    className="text-base px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    #{relatedTag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Popular Tags Section */}
        <div className="mt-12">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">💡 Pro Tip</h3>
              <p className="text-muted-foreground">
                Tags help you discover related content quickly. Click any tag on a blog post to see all posts with that tag. 
                You can also add tags when creating your own posts to help others find your content!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
