import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// GET /api/users/profile - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        phone: true,
        website: true,
        company: true,
        jobTitle: true,
        location: true,
        socialLinks: true,
        preferences: true,
        role: true,
        clientNumber: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: "User not found" } },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const userData = {
      ...user,
      socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : null,
      preferences: user.preferences ? JSON.parse(user.preferences) : null,
    };

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch profile" } },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Basic fields
    if (body.name !== undefined) updateData.name = body.name;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.jobTitle !== undefined) updateData.jobTitle = body.jobTitle;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;

    // JSON fields
    if (body.socialLinks !== undefined) {
      updateData.socialLinks = JSON.stringify(body.socialLinks);
    }
    if (body.preferences !== undefined) {
      updateData.preferences = JSON.stringify(body.preferences);
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        phone: true,
        website: true,
        company: true,
        jobTitle: true,
        location: true,
        socialLinks: true,
        preferences: true,
        role: true,
        clientNumber: true,
      },
    });

    // Parse JSON fields for response
    const userData = {
      ...updatedUser,
      socialLinks: updatedUser.socialLinks ? JSON.parse(updatedUser.socialLinks) : null,
      preferences: updatedUser.preferences ? JSON.parse(updatedUser.preferences) : null,
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to update profile" } },
      { status: 500 }
    );
  }
}

// PATCH /api/users/profile - Partial update (alias for PUT)
export async function PATCH(request: NextRequest) {
  return PUT(request);
}
