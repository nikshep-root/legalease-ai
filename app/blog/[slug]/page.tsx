'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BlogPostViewer } from '@/components/blog-post-viewer';
import { CommentSection } from '@/components/comment-section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { getBlogPostBySlug, toggleLike, hasUserLiked, type BlogPost } from '@/lib/blog-service';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      const data = await getBlogPostBySlug(slug);
      
      if (!data) {
        router.push('/blog');
        return;
      }

      setPost(data);

      // Check if user liked
      if (session?.user?.id) {
        const liked = await hasUserLiked(data.id, session.user.id as string);
        setIsLiked(liked);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      router.push('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!session?.user?.id || !post) return;

    try {
      const newLikedState = await toggleLike(post.id, session.user.id as string);
      setIsLiked(newLikedState);
      
      // Update post likes count
      setPost({
        ...post,
        likes: post.likes + (newLikedState ? 1 : -1),
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded w-32" />
          <div className="h-12 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-64 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const canEdit = session?.user?.id === post.authorId;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/blog">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
        {canEdit && (
          <Link href={`/blog/edit/${post.id}`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Post
            </Button>
          </Link>
        )}
      </div>

      {/* Post Content */}
      <BlogPostViewer
        post={post}
        onLike={session?.user ? handleLike : undefined}
        isLiked={isLiked}
      />

      {/* Comments */}
      <div className="max-w-4xl mx-auto mt-12">
        <CommentSection postId={post.id} initialCommentsCount={post.commentsCount} />
      </div>
    </div>
  );
}
