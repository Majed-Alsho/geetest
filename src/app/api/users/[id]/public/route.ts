import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/users/[id]/public - Get public profile data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        company: true,
        jobTitle: true,
        location: true,
        website: true,
        socialLinks: true,
        preferences: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: "User not found" } },
        { status: 404 }
      );
    }

    // Check if profile is public
    const preferences = user.preferences ? JSON.parse(user.preferences) : {};
    if (preferences.showProfile === false) {
      return NextResponse.json(
        { success: false, error: { message: "This profile is private" } },
        { status: 403 }
      );
    }

    // Parse JSON fields
    const publicData = {
      ...user,
      socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : null,
      preferences: {
        showProfile: preferences.showProfile ?? true,
        showContactInfo: preferences.showContactInfo ?? false,
      },
    };

    return NextResponse.json({
      success: true,
      data: publicData,
    });
  } catch (error) {
    console.error("Public profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch profile" } },
      { status: 500 }
    );
  }
}
