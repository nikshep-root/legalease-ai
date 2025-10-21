'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BlogPostEditor, type BlogPostData } from '@/components/blog-post-editor';
import { getBlogPostById, updateBlogPost, type BlogPost } from '@/lib/blog-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const postId = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/signin?callbackUrl=/blog/edit/${postId}`);
      return;
    }

    if (status === 'authenticated' && postId) {
      loadPost();
    }
  }, [postId, status]);

  const loadPost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const postData = await getBlogPostById(postId);
      
      if (!postData) {
        setError('Post not found');
        return;
      }

      // Check if user is the author
      if (session?.user?.id !== postData.authorId) {
        setError('You do not have permission to edit this post');
        return;
      }

      setPost(postData);
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: BlogPostData) => {
    if (!post || !session?.user) return;

    setIsSaving(true);
    try {
      await updateBlogPost(post.id, {
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
        coverImage: data.coverImage,
        status: data.status,
      });

      // Redirect based on status
      if (data.status === 'published') {
        router.push(`/blog/${post.slug}`);
      } else {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (post?.slug) {
      router.push(`/blog/${post.slug}`);
    } else {
      router.push('/blog');
    }
  };

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-16 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">Loading post...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <Card className="border-destructive">
            <CardContent className="py-16 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-lg text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Link href="/blog">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
                {post && (
                  <Link href={`/blog/${post.slug}`}>
                    <Button>View Post</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not found
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <Card>
            <CardContent className="py-16 text-center">
              <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
              <p className="text-lg text-muted-foreground mb-6">
                The post you're trying to edit doesn't exist.
              </p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href={`/blog/${post.slug}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Post
          </Button>
        </Link>

        {/* Editor */}
        <BlogPostEditor
          initialData={{
            title: post.title,
            content: post.content,
            category: post.category,
            tags: post.tags,
            coverImage: post.coverImage,
            status: post.status,
          }}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Created:</strong>{' '}
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p>
                <strong>Last Updated:</strong>{' '}
                {new Date(post.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {post.publishedAt && (
                <p>
                  <strong>Published:</strong>{' '}
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              <p>
                <strong>Views:</strong> {post.views.toLocaleString()}
              </p>
              <p>
                <strong>Likes:</strong> {post.likes.toLocaleString()}
              </p>
              <p>
                <strong>Comments:</strong> {post.commentsCount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
