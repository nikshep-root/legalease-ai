'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBlogPosts, type BlogPost } from '@/lib/blog-service';
import { BlogPostCard } from '@/components/blog-post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Filter, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Category descriptions
const CATEGORY_INFO: Record<string, { description: string; icon: string }> = {
  'Contract Law': {
    description: 'Essential insights on contract drafting, negotiation, and enforcement. Learn about terms, conditions, and legal obligations.',
    icon: '📜',
  },
  'Intellectual Property': {
    description: 'Protecting your creative works, patents, trademarks, and copyrights. Stay informed on IP law and best practices.',
    icon: '💡',
  },
  'Employment Law': {
    description: 'Navigate workplace rights, employee contracts, and labor regulations. From hiring to termination and everything in between.',
    icon: '👔',
  },
  'Real Estate': {
    description: 'Property transactions, lease agreements, and real estate law. Expert guidance on buying, selling, and property management.',
    icon: '🏡',
  },
  'Corporate Law': {
    description: 'Business formation, governance, compliance, and corporate transactions. Essential knowledge for companies and executives.',
    icon: '🏢',
  },
  'Privacy & Data': {
    description: 'Data protection, GDPR, CCPA, and privacy compliance. Stay compliant in the digital age.',
    icon: '🔒',
  },
  'Compliance': {
    description: 'Regulatory compliance, industry standards, and legal requirements. Keep your business on the right side of the law.',
    icon: '✅',
  },
  'General Legal': {
    description: 'Broad legal topics, news, and updates. General legal knowledge for everyone.',
    icon: '⚖️',
  },
  'Tips & Guides': {
    description: 'Practical legal tips, how-to guides, and best practices. Actionable advice for common legal situations.',
    icon: '📚',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = decodeURIComponent(params.slug as string);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'publishedAt' | 'likes' | 'views'>('publishedAt');

  useEffect(() => {
    loadCategoryPosts();
  }, [categorySlug, sortBy]);

  const loadCategoryPosts = async () => {
    setIsLoading(true);
    try {
      const result = await getBlogPosts({
        category: categorySlug,
        orderBy: sortBy,
        limit: 50,
      });
      setPosts(result.posts);
    } catch (error) {
      console.error('Error loading category posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryInfo = CATEGORY_INFO[categorySlug] || {
    description: `Explore all posts in the ${categorySlug} category.`,
    icon: '📁',
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

        {/* Category Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="text-6xl">{categoryInfo.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold">{categorySlug}</h1>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {categoryInfo.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
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
              Most Viewed
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
              <div className="text-6xl mb-4">{categoryInfo.icon}</div>
              <h3 className="text-xl font-semibold mb-2">No Posts in This Category Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to write about {categorySlug}!
              </p>
              <Link href="/blog/create">
                <Button>Write a Post</Button>
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

        {/* Related Categories */}
        {posts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Explore Other Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(CATEGORY_INFO)
                .filter(([cat]) => cat !== categorySlug)
                .slice(0, 8)
                .map(([category, info]) => (
                  <Link key={category} href={`/blog/category/${encodeURIComponent(category)}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="text-3xl mb-2">{info.icon}</div>
                        <h3 className="font-semibold text-sm">{category}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
