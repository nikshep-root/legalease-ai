import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  increment,
  serverTimestamp 
} from 'firebase/firestore';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  postsCount: number;
  totalLikes: number;
  totalViews: number;
  reputation: number;
  joinedAt: Date;
  updatedAt: Date;
}

export interface CreateUserProfileData {
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
}

export interface UpdateUserProfileData {
  displayName?: string;
  photoURL?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

/**
 * Create a new user profile
 */
export async function createUserProfile(
  userId: string, 
  data: CreateUserProfileData
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  // Check if profile already exists
  const existingProfile = await getDoc(userRef);
  if (existingProfile.exists()) {
    console.log('User profile already exists');
    return;
  }

  await setDoc(userRef, {
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL || '',
    bio: data.bio || '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
    postsCount: 0,
    totalLikes: 0,
    totalViews: 0,
    reputation: 0,
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`/api/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      displayName: data.displayName || 'Anonymous',
      email: data.email || '',
      photoURL: data.photoURL,
      bio: data.bio,
      website: data.website,
      twitter: data.twitter,
      linkedin: data.linkedin,
      github: data.github,
      postsCount: data.postsCount || 0,
      totalLikes: data.totalLikes || 0,
      totalViews: data.totalViews || 0,
      reputation: data.reputation || 0,
      joinedAt: data.joinedAt ? new Date(data.joinedAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string, 
  data: UpdateUserProfileData
): Promise<void> {
  try {
    const response = await fetch(`/api/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Increment user post count (called when publishing a post)
 */
export async function incrementUserPostCount(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      postsCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error incrementing post count:', error);
  }
}

/**
 * Decrement user post count (called when deleting a post)
 */
export async function decrementUserPostCount(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      postsCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error decrementing post count:', error);
  }
}

/**
 * Update user stats (likes and views)
 */
export async function updateUserStats(
  userId: string, 
  likes: number, 
  views: number
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalLikes: likes,
      totalViews: views,
      reputation: Math.floor(likes * 10 + views * 0.5), // Custom reputation formula
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

/**
 * Get top authors by reputation
 */
export async function getTopAuthors(limitCount: number = 10): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('reputation', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        displayName: data.displayName,
        email: data.email,
        photoURL: data.photoURL,
        bio: data.bio,
        website: data.website,
        twitter: data.twitter,
        linkedin: data.linkedin,
        github: data.github,
        postsCount: data.postsCount || 0,
        totalLikes: data.totalLikes || 0,
        totalViews: data.totalViews || 0,
        reputation: data.reputation || 0,
        joinedAt: data.joinedAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error fetching top authors:', error);
    return [];
  }
}

/**
 * Search users by name
 */
export async function searchUsers(searchTerm: string): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const searchLower = searchTerm.toLowerCase();
    const results = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL,
          bio: data.bio,
          website: data.website,
          twitter: data.twitter,
          linkedin: data.linkedin,
          github: data.github,
          postsCount: data.postsCount || 0,
          totalLikes: data.totalLikes || 0,
          totalViews: data.totalViews || 0,
          reputation: data.reputation || 0,
          joinedAt: data.joinedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      })
      .filter(user => 
        user.displayName.toLowerCase().includes(searchLower) ||
        user.bio?.toLowerCase().includes(searchLower)
      );

    return results;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

/**
 * Create or update user profile (useful for auth callbacks)
 */
export async function createOrUpdateUserProfile(user: {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.id);
    const existingProfile = await getDoc(userRef);

    if (existingProfile.exists()) {
      // Update only if data has changed
      const data = existingProfile.data();
      if (
        data.displayName !== user.name ||
        data.email !== user.email ||
        data.photoURL !== user.image
      ) {
        await updateDoc(userRef, {
          displayName: user.name || data.displayName,
          email: user.email || data.email,
          photoURL: user.image || data.photoURL,
          updatedAt: serverTimestamp(),
        });
      }
    } else {
      // Create new profile
      await createUserProfile(user.id, {
        displayName: user.name || 'Anonymous User',
        email: user.email || '',
        photoURL: user.image || '',
      });
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
  }
}
