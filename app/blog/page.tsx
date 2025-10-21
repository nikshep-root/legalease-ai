'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogPostCard } from '@/components/blog-post-card';
import { getBlogPosts, getCategories, type BlogPost, type Category } from '@/lib/blog-service';
import { PenSquare, Search, TrendingUp, Clock, Heart } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'publishedAt' | 'likes' | 'views'>('publishedAt');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory, sortBy]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [postsData, categoriesData] = await Promise.all([
        getBlogPosts({
          category: selectedCategory || undefined,
          orderBy: sortBy,
          limit: 20,
        }),
        getCategories(),
      ]);

      setPosts(postsData.posts);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = searchQuery
    ? posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : posts;

  const featuredPosts = posts.filter(p => p.featured).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">📝 Legal Insights Blog</h1>
          <p className="text-muted-foreground">
            Expert legal advice, contract tips, and industry insights from the LegalEase AI community
          </p>
        </div>
        {session && (
          <Link href="/blog/create">
            <Button size="lg">
              <PenSquare className="w-4 h-4 mr-2" />
              Write a Post
            </Button>
          </Link>
        )}
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Featured Posts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name} ({cat.postCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publishedAt">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Latest
                </div>
              </SelectItem>
              <SelectItem value="likes">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Most Liked
                </div>
              </SelectItem>
              <SelectItem value="views">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Most Viewed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to write!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredPosts.length > 0 && filteredPosts.length % 20 === 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}
