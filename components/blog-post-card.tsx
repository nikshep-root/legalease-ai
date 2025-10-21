'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Eye, Clock } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-service';
import Link from 'next/link';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft';

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {post.coverImage && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{post.category}</Badge>
            {post.featured && (
              <Badge className="bg-yellow-500">⭐ Featured</Badge>
            )}
          </div>
          
          <h3 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.authorPhoto} alt={post.authorName} />
              <AvatarFallback>{post.authorName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{post.authorName}</p>
              <p className="text-muted-foreground text-xs">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1" title="Reading time">
              <Clock className="w-4 h-4" />
              <span>{readingTime}m</span>
            </div>
            <div className="flex items-center gap-1" title="Views">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center gap-1" title="Likes">
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1" title="Comments">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentsCount}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
