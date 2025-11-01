import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const orderBy = searchParams.get('orderBy') || 'publishedAt'
    const limitNum = parseInt(searchParams.get('limit') || '20')

    console.log('=== BLOG LIST API CALLED ===')
    console.log('Fetching blog posts with params:', { category, orderBy, limitNum })

    // First, let's check ALL posts (including drafts) to debug
    const allPostsSnapshot = await db.collection('blog-posts').get()
    console.log(`Total posts in Firestore (all statuses): ${allPostsSnapshot.size}`)
    
    allPostsSnapshot.docs.forEach(doc => {
      const data = doc.data()
      console.log(`Post: ${doc.id}, Title: ${data.title}, Status: ${data.status}, Published: ${data.publishedAt}`)
    })

    let query = db.collection('blog-posts')
      .where('status', '==', 'published')

    if (category && category !== 'all') {
      query = query.where('category', '==', category) as any
    }

    query = query.orderBy(orderBy, 'desc').limit(limitNum) as any

    const snapshot = await query.get()

    console.log(`Found ${snapshot.size} published blog posts`)

    const posts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
        publishedAt: data.publishedAt?.toDate().toISOString(),
      }
    })

    console.log('Returning posts:', posts.length)
    return NextResponse.json({ posts }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
