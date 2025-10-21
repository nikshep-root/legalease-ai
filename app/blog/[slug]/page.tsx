'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
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

  // SEO: Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage || "https://legalease.ai/og-image.png",
    "datePublished": post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.authorName,
      "url": `https://legalease.ai/blog/author/${post.authorId}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "LegalEase AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://legalease.ai/logo.png"
      }
    },
    "description": post.excerpt,
    "articleBody": post.content,
    "keywords": post.tags.join(", "),
    "wordCount": post.content.split(' ').length,
    "commentCount": post.commentsCount,
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/LikeAction",
        "userInteractionCount": post.likes
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": post.commentsCount
      }
    ]
  };

  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://legalease.ai/blog/${post.slug}`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>{post.title} | LegalEase AI Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta name="author" content={post.authorName} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage || "https://legalease.ai/og-image.png"} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="LegalEase AI" />
        <meta property="article:published_time" content={post.publishedAt?.toISOString() || post.createdAt.toISOString()} />
        <meta property="article:modified_time" content={post.updatedAt.toISOString()} />
        <meta property="article:author" content={post.authorName} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage || "https://legalease.ai/og-image.png"} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

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
    </>
  );
}
