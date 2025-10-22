'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Eye, Bookmark, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ShareButtons } from '@/components/share-buttons';
import type { BlogPost } from '@/lib/blog-service';
import Link from 'next/link';

interface BlogPostViewerProps {
  post: BlogPost;
  onLike?: () => Promise<void>;
  isLiked?: boolean;
  showComments?: boolean;
}

export function BlogPostViewer({ post, onLike, isLiked = false, showComments = true }: BlogPostViewerProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!onLike || isLiking) return;

    setIsLiking(true);
    try {
      await onLike();
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Draft';

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-primary">{post.category}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt?.toISOString()}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center justify-between">
          <Link href={`/blog/author/${post.authorId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.authorPhoto} alt={post.authorName} />
              <AvatarFallback>{post.authorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.authorName}</p>
              <p className="text-sm text-muted-foreground">Author</p>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{likeCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentsCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog/tag/${tag}`}>
              <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-8">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Action Buttons */}
      <Card className="mb-8">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex gap-2">
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'} ({likeCount})
            </Button>
            <ShareButtons 
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={post.title}
              description={post.excerpt}
            />
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount} Comments</span>
          </div>
        </CardContent>
      </Card>

      {/* Author Bio */}
      <Card className="mb-8 bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={post.authorPhoto} alt={post.authorName} />
              <AvatarFallback>{post.authorName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Written by {post.authorName}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Legal expert sharing insights on contract law, compliance, and document best practices.
              </p>
              <Link href={`/blog/author/${post.authorId}`}>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
