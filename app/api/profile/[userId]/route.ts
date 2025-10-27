import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/firebase-admin"
import { Timestamp } from "firebase-admin/firestore"

const USERS_COLLECTION = "users"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch the user profile from Firestore
    const userRef = db.collection(USERS_COLLECTION).doc(userId)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const data = userSnap.data()

    return NextResponse.json({
      id: userSnap.id,
      displayName: data?.displayName || 'Anonymous',
      email: data?.email || '',
      photoURL: data?.photoURL,
      bio: data?.bio,
      website: data?.website,
      twitter: data?.twitter,
      linkedin: data?.linkedin,
      github: data?.github,
      postsCount: data?.postsCount || 0,
      totalLikes: data?.totalLikes || 0,
      totalViews: data?.totalViews || 0,
      reputation: data?.reputation || 0,
      joinedAt: data?.joinedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is updating their own profile
    const sessionUserId = session.user.id || session.user.email
    if (sessionUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { displayName, bio, website, twitter, linkedin, github } = body

    const userRef = db.collection(USERS_COLLECTION).doc(userId)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      // Create new profile
      await userRef.set({
        displayName: displayName || 'User',
        email: session.user.email || userId,
        photoURL: session.user.image || '',
        bio: bio || '',
        website: website || '',
        twitter: twitter || '',
        linkedin: linkedin || '',
        github: github || '',
        postsCount: 0,
        totalLikes: 0,
        totalViews: 0,
        reputation: 0,
        joinedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    } else {
      // Update existing profile
      await userRef.update({
        displayName: displayName || userSnap.data()?.displayName || 'User',
        bio: bio || '',
        website: website || '',
        twitter: twitter || '',
        linkedin: linkedin || '',
        github: github || '',
        updatedAt: Timestamp.now(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
