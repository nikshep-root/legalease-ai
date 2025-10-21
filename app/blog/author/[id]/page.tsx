'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserProfile, type UserProfile } from '@/lib/user-service';
import { getBlogPosts, type BlogPost } from '@/lib/blog-service';
import { BlogPostCard } from '@/components/blog-post-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  Award, 
  FileText, 
  Heart, 
  Eye, 
  Globe, 
  Twitter, 
  Linkedin, 
  Github,
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function AuthorPage() {
  const params = useParams();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'all'>('published');

  useEffect(() => {
    loadAuthorData();
  }, [authorId]);

  const loadAuthorData = async () => {
    setIsLoading(true);
    try {
      const [authorData, postsData] = await Promise.all([
        getUserProfile(authorId),
        getBlogPosts({ authorId, limit: 50 }),
      ]);

      setAuthor(authorData);
      setPosts(postsData.posts);
    } catch (error) {
      console.error('Error loading author data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-64 bg-muted animate-pulse rounded-lg mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Author Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The author you're looking for doesn't exist.
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const publishedPosts = posts.filter(p => p.status === 'published');
  const draftPosts = posts.filter(p => p.status === 'draft');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Author Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 border-4 border-background">
                  <AvatarImage src={author.photoURL} alt={author.displayName} />
                  <AvatarFallback className="text-4xl">
                    {author.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Author Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{author.displayName}</h1>
                
                {author.bio && (
                  <p className="text-muted-foreground mb-4">{author.bio}</p>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {author.website && (
                    <a 
                      href={author.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {author.twitter && (
                    <a 
                      href={`https://twitter.com/${author.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                  {author.linkedin && (
                    <a 
                      href={author.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {author.github && (
                    <a 
                      href={`https://github.com/${author.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>

                {/* Join Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(author.joinedAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{author.postsCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Likes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold">{author.totalLikes}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{author.totalViews}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reputation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">{author.reputation}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {author.displayName.split(' ')[0]}'s Posts
          </h2>

          {publishedPosts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground">
                  {author.displayName} hasn't published any posts yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
