import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/firebase-admin"
import { Timestamp, FieldValue } from "firebase-admin/firestore"

const BLOG_POSTS_COLLECTION = "blog-posts"
const USERS_COLLECTION = "users"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateExcerpt(content: string, length: number = 200): string {
  const text = content.replace(/[#*`_~]/g, ''); // Remove markdown
  return text.substring(0, length) + (text.length > length ? '...' : '');
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category, tags, coverImage, status, featured } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, category" },
        { status: 400 }
      )
    }

    const authorId = session.user.id || session.user.email
    if (!authorId) {
      return NextResponse.json({ error: "Unable to identify user" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const excerpt = generateExcerpt(content)

    // Prepare post data
    const postData: any = {
      authorId,
      authorName: session.user.name || 'Anonymous',
      authorPhoto: session.user.image || '',
      title,
      content,
      category,
      tags: tags || [],
      status: status || 'draft',
      slug,
      excerpt,
      likes: 0,
      views: 0,
      commentsCount: 0,
      featured: featured || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      publishedAt: status === 'published' ? Timestamp.now() : null,
    }

    if (coverImage) {
      postData.coverImage = coverImage
    }

    // Create blog post
    const docRef = await db.collection(BLOG_POSTS_COLLECTION).add(postData)

    // Update user post count
    try {
      const userRef = db.collection(USERS_COLLECTION).doc(authorId)
      const userSnap = await userRef.get()

      if (userSnap.exists) {
        await userRef.update({
          postsCount: FieldValue.increment(1),
        })
      } else {
        // Create user document if it doesn't exist
        await userRef.set({
          id: authorId,
          displayName: session.user.name || 'Anonymous',
          email: session.user.email || '',
          photoURL: session.user.image || '',
          bio: '',
          website: '',
          twitter: '',
          linkedin: '',
          github: '',
          postsCount: 1,
          totalLikes: 0,
          totalViews: 0,
          reputation: 0,
          joinedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
      }
    } catch (userError) {
      console.error('Error updating user post count:', userError)
      // Don't fail the request if user update fails
    }

    return NextResponse.json({
      success: true,
      postId: docRef.id,
      slug,
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}
