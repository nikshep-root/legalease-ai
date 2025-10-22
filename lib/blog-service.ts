import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  increment,
  setDoc,
  serverTimestamp,
  Timestamp,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';

// Types
export interface BlogPost {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  likes: number;
  views: number;
  commentsCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  likes: number;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  reputation: number;
  postsCount: number;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

// Helper: Generate URL-friendly slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Helper: Generate excerpt
export function generateExcerpt(content: string, length: number = 200): string {
  const text = content.replace(/[#*`_~]/g, ''); // Remove markdown
  return text.substring(0, length) + (text.length > length ? '...' : '');
}

// Create blog post
export async function createBlogPost(data: {
  authorId: string;
  authorName: string;
  authorPhoto: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  status: 'draft' | 'published';
  featured?: boolean;
}): Promise<string> {
  const slug = generateSlug(data.title);
  const excerpt = generateExcerpt(data.content);
  
  const postsRef = collection(db, 'blog-posts');
  const docRef = await addDoc(postsRef, {
    ...data,
    slug,
    excerpt,
    likes: 0,
    views: 0,
    commentsCount: 0,
    featured: data.featured || false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: data.status === 'published' ? serverTimestamp() : null,
  });

  // Update user post count (create user doc if doesn't exist)
  try {
    const userRef = doc(db, 'users', data.authorId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        postsCount: increment(1),
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        id: data.authorId,
        displayName: data.authorName,
        email: '',
        photoURL: data.authorPhoto,
        bio: '',
        reputation: 0,
        postsCount: 1,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error updating user post count:', error);
    // Don't fail the whole operation if user count update fails
  }

  // Update category count
  try {
    await updateCategoryCount(data.category, 1);
  } catch (error) {
    console.error('Error updating category count:', error);
    // Don't fail the whole operation if category count update fails
  }

  return docRef.id;
}

// Update blog post
export async function updateBlogPost(
  postId: string, 
  data: Partial<BlogPost>
): Promise<void> {
  const postRef = doc(db, 'blog-posts', postId);
  
  // Update slug if title changed
  if (data.title) {
    data.slug = generateSlug(data.title);
  }
  
  // Update excerpt if content changed
  if (data.content) {
    data.excerpt = generateExcerpt(data.content);
  }

  // Set published date if publishing
  if (data.status === 'published') {
    const postDoc = await getDoc(postRef);
    const currentData = postDoc.data();
    if (currentData?.status === 'draft') {
      (data as any).publishedAt = serverTimestamp();
    }
  }

  await updateDoc(postRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete blog post
export async function deleteBlogPost(postId: string, authorId: string): Promise<void> {
  const postRef = doc(db, 'blog-posts', postId);
  const postDoc = await getDoc(postRef);
  
  if (!postDoc.exists()) {
    throw new Error('Post not found');
  }

  const postData = postDoc.data();

  await deleteDoc(postRef);

  // Update user post count
  const userRef = doc(db, 'users', authorId);
  await updateDoc(userRef, {
    postsCount: increment(-1),
  });

  // Update category count
  await updateCategoryCount(postData.category, -1);
}

// Get single blog post by ID
export async function getBlogPostById(postId: string): Promise<BlogPost | null> {
  const postRef = doc(db, 'blog-posts', postId);
  const postDoc = await getDoc(postRef);

  if (!postDoc.exists()) {
    return null;
  }

  const data = postDoc.data();
  return {
    id: postDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    publishedAt: data.publishedAt?.toDate(),
  } as BlogPost;
}

// Get blog post by slug (and increment views)
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(
    collection(db, 'blog-posts'),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }

  const postDoc = snapshot.docs[0];
  
  // Increment view count
  await updateDoc(postDoc.ref, { views: increment(1) });

  const data = postDoc.data();
  return {
    id: postDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    publishedAt: data.publishedAt?.toDate(),
  } as BlogPost;
}

// Get blog posts (with filters and pagination)
export async function getBlogPosts(options: {
  category?: string;
  tag?: string;
  authorId?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  orderBy?: 'createdAt' | 'likes' | 'views' | 'publishedAt';
  limit?: number;
  lastDoc?: QueryDocumentSnapshot;
}): Promise<{ posts: BlogPost[], lastDoc: QueryDocumentSnapshot | null }> {
  let q = query(collection(db, 'blog-posts'));

  // Filters
  if (options.status) {
    q = query(q, where('status', '==', options.status));
  } else {
    q = query(q, where('status', '==', 'published')); // Default to published only
  }

  if (options.category) {
    q = query(q, where('category', '==', options.category));
  }

  if (options.tag) {
    q = query(q, where('tags', 'array-contains', options.tag));
  }

  if (options.authorId) {
    q = query(q, where('authorId', '==', options.authorId));
  }

  if (options.featured !== undefined) {
    q = query(q, where('featured', '==', options.featured));
  }

  // Ordering
  const orderByField = options.orderBy || 'publishedAt';
  q = query(q, orderBy(orderByField, 'desc'));

  // Pagination
  if (options.lastDoc) {
    q = query(q, startAfter(options.lastDoc));
  }

  q = query(q, limit(options.limit || 10));

  const snapshot = await getDocs(q);

  const posts = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate(),
    } as BlogPost;
  });

  const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { posts, lastDoc };
}

// Like/Unlike post
export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  const likeRef = doc(db, `blog-posts/${postId}/likes/${userId}`);
  const likeDoc = await getDoc(likeRef);

  if (likeDoc.exists()) {
    // Unlike
    await deleteDoc(likeRef);
    await updateDoc(doc(db, 'blog-posts', postId), {
      likes: increment(-1),
    });
    return false;
  } else {
    // Like
    await setDoc(likeRef, { likedAt: serverTimestamp() });
    await updateDoc(doc(db, 'blog-posts', postId), {
      likes: increment(1),
    });
    return true;
  }
}

// Check if user liked post
export async function hasUserLiked(postId: string, userId: string): Promise<boolean> {
  const likeRef = doc(db, `blog-posts/${postId}/likes/${userId}`);
  const likeDoc = await getDoc(likeRef);
  return likeDoc.exists();
}

// Add comment
export async function addComment(
  postId: string,
  userId: string,
  userName: string,
  userPhoto: string,
  content: string
): Promise<string> {
  const commentsRef = collection(db, `blog-posts/${postId}/comments`);
  const docRef = await addDoc(commentsRef, {
    postId,
    userId,
    userName,
    userPhoto,
    content,
    likes: 0,
    createdAt: serverTimestamp(),
  });

  // Increment comment count
  await updateDoc(doc(db, 'blog-posts', postId), {
    commentsCount: increment(1),
  });

  return docRef.id;
}

// Get comments for post
export async function getComments(postId: string): Promise<Comment[]> {
  const q = query(
    collection(db, `blog-posts/${postId}/comments`),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Comment;
  });
}

// Delete comment
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await deleteDoc(doc(db, `blog-posts/${postId}/comments/${commentId}`));
  
  await updateDoc(doc(db, 'blog-posts', postId), {
    commentsCount: increment(-1),
  });
}

// Get/Create user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data();
  return {
    id: userDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as UserProfile;
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(collection(db, 'categories'));
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Category));
}

// Update category post count
async function updateCategoryCount(categoryName: string, delta: number): Promise<void> {
  const categorySlug = generateSlug(categoryName);
  const categoryRef = doc(db, 'categories', categorySlug);
  const categoryDoc = await getDoc(categoryRef);

  if (categoryDoc.exists()) {
    await updateDoc(categoryRef, {
      postCount: increment(delta),
    });
  } else {
    await setDoc(categoryRef, {
      name: categoryName,
      slug: categorySlug,
      description: '',
      postCount: Math.max(0, delta),
    });
  }
}

// Search posts (simple text search - for better search, integrate Algolia)
export async function searchBlogPosts(searchTerm: string): Promise<BlogPost[]> {
  const q = query(
    collection(db, 'blog-posts'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  
  const posts = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate(),
    } as BlogPost;
  });

  // Client-side filtering (not ideal for large datasets)
  const searchLower = searchTerm.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchLower) ||
    post.content.toLowerCase().includes(searchLower) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
}
