import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import * as bcrypt from "bcryptjs";

// GET /api/users/profile - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Strict check - NextAuth always provides email reliably
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    // Find user by email (more reliable than ID from session)
    const user = await db.user.findUnique({
      where: { email: session.user.email },
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

// PUT /api/users/profile - Update user profile (supports partial updates)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Strict check - NextAuth always provides email reliably
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    // First, find the user by email to get their ID
    const existingUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: { message: "User not found" } },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Handle password change action
    if (body.action === "changePassword") {
      const { currentPassword, newPassword } = body;

      // Get user with password hash
      const userWithPassword = await db.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, passwordHash: true },
      });

      if (!userWithPassword?.passwordHash) {
        return NextResponse.json(
          { success: false, error: { message: "User has no password set" } },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, userWithPassword.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: { message: "Current password is incorrect" } },
          { status: 400 }
        );
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await db.user.update({
        where: { id: userWithPassword.id },
        data: { passwordHash: newHash },
      });

      return NextResponse.json({
        success: true,
        data: { message: "Password updated successfully" },
      });
    }

    // Handle save listing action
    if (body.action === "saveListing") {
      const { listingId } = body;
      if (!listingId) {
        return NextResponse.json(
          { success: false, error: { message: "Listing ID is required" } },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { savedListings: true },
      });

      const savedListings: string[] = user?.savedListings ? JSON.parse(user.savedListings) : [];
      if (!savedListings.includes(listingId)) {
        savedListings.push(listingId);
        await db.user.update({
          where: { email: session.user.email },
          data: { savedListings: JSON.stringify(savedListings) },
        });
      }

      return NextResponse.json({ success: true, data: { savedListings } });
    }

    // Handle unsave listing action
    if (body.action === "unsaveListing") {
      const { listingId } = body;
      if (!listingId) {
        return NextResponse.json(
          { success: false, error: { message: "Listing ID is required" } },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { savedListings: true },
      });

      const savedListings: string[] = (user?.savedListings ? JSON.parse(user.savedListings) : []).filter(
        (id: string) => id !== listingId
      );
      await db.user.update({
        where: { email: session.user.email },
        data: { savedListings: JSON.stringify(savedListings) },
      });

      return NextResponse.json({ success: true, data: { savedListings } });
    }

    // Handle add alert action
    if (body.action === "addAlert") {
      const { alert } = body;
      if (!alert) {
        return NextResponse.json(
          { success: false, error: { message: "Alert data is required" } },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { alerts: true },
      });

      const alerts: Array<{ category?: string; region?: string; maxPrice?: number }> = user?.alerts
        ? JSON.parse(user.alerts)
        : [];
      alerts.push(alert);
      await db.user.update({
        where: { email: session.user.email },
        data: { alerts: JSON.stringify(alerts) },
      });

      return NextResponse.json({ success: true, data: { alerts } });
    }

    // Handle remove alert action
    if (body.action === "removeAlert") {
      const { alertIndex } = body;
      if (typeof alertIndex !== "number") {
        return NextResponse.json(
          { success: false, error: { message: "Alert index is required" } },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { alerts: true },
      });

      const alerts: Array<{ category?: string; region?: string; maxPrice?: number }> = user?.alerts
        ? JSON.parse(user.alerts)
        : [];
      alerts.splice(alertIndex, 1);
      await db.user.update({
        where: { email: session.user.email },
        data: { alerts: JSON.stringify(alerts) },
      });

      return NextResponse.json({ success: true, data: { alerts } });
    }

    // Handle enable 2FA action
    if (body.action === "enable2FA") {
      const { secret } = body;
      if (!secret) {
        return NextResponse.json(
          { success: false, error: { message: "Secret is required" } },
          { status: 400 }
        );
      }

      await db.user.update({
        where: { email: session.user.email },
        data: { twoFactorEnabled: true, twoFactorSecret: secret },
      });

      return NextResponse.json({ success: true, data: { message: "2FA enabled" } });
    }

    // Handle disable 2FA action
    if (body.action === "disable2FA") {
      await db.user.update({
        where: { email: session.user.email },
        data: { twoFactorEnabled: false, twoFactorSecret: null },
      });

      return NextResponse.json({ success: true, data: { message: "2FA disabled" } });
    }

    // Handle export data action (GDPR)
    if (body.action === "exportData") {
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          clientNumber: true,
          avatar: true,
          bio: true,
          phone: true,
          website: true,
          company: true,
          jobTitle: true,
          location: true,
          socialLinks: true,
          preferences: true,
          createdAt: true,
          lastLoginAt: true,
          twoFactorEnabled: true,
        },
      });

      return NextResponse.json({ success: true, data: user });
    }

    // Prepare update data - only include fields that are explicitly provided
    // This enables true partial updates without overwriting existing data
    const updateData: Record<string, unknown> = {};

    // Basic fields - only include if explicitly provided in request
    // Use null to explicitly clear a field, undefined means "don't change"
    const basicFields = ['name', 'bio', 'phone', 'website', 'company', 'jobTitle', 'location', 'avatar'] as const;
    
    for (const field of basicFields) {
      if (body[field] !== undefined) {
        // Only update if value is not an empty string (empty strings should be saved as null for cleaner data)
        // Exception: bio, phone, website etc. can be empty strings if user intentionally clears them
        updateData[field] = body[field];
      }
    }

    // JSON fields - only include if explicitly provided
    if (body.socialLinks !== undefined) {
      updateData.socialLinks = JSON.stringify(body.socialLinks);
    }
    if (body.preferences !== undefined) {
      updateData.preferences = JSON.stringify(body.preferences);
    }

    // If no fields to update, just return the current user data
    if (Object.keys(updateData).length === 0) {
      const currentUser = await db.user.findUnique({
        where: { id: existingUser.id },
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

      const userData = {
        ...currentUser,
        socialLinks: currentUser?.socialLinks ? JSON.parse(currentUser.socialLinks) : null,
        preferences: currentUser?.preferences ? JSON.parse(currentUser.preferences) : null,
      };

      return NextResponse.json({
        success: true,
        data: userData,
        message: "No changes detected",
      });
    }

    // Update user using the ID we looked up by email
    const updatedUser = await db.user.update({
      where: { id: existingUser.id },
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
    console.error('PROFILE UPDATE ERROR:', error);
    // Return the actual error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json(
      { success: false, error: { message: errorMessage } },
      { status: 400 }
    );
  }
}

// PATCH /api/users/profile - Partial update (alias for PUT)
export async function PATCH(request: NextRequest) {
  return PUT(request);
}
