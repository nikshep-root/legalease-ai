'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BlogPostEditor, type BlogPostData } from '@/components/blog-post-editor';
import { createBlogPost } from '@/lib/blog-service';
import { useEffect } from 'react';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/blog/create');
    }
  }, [status, router]);

  const handleSave = async (data: BlogPostData) => {
    if (!session?.user) return;

    try {
      const postId = await createBlogPost({
        authorId: session.user.id as string,
        authorName: session.user.name || 'Anonymous',
        authorPhoto: session.user.image || '',
        ...data,
      });

      // Redirect to the new post
      if (data.status === 'published') {
        router.push(`/blog/${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
      } else {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/blog');
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <BlogPostEditor onSave={handleSave} onCancel={handleCancel} />;
}
