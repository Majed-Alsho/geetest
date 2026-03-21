import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import * as bcrypt from "bcryptjs";

// GET /api/users/[id] - Get a single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Users can only view their own profile unless they're admin
    const isAdmin = session?.user?.role && ["ADMIN", "SUPERADMIN", "OWNER"].includes(session.user.role);
    if (!session?.user?.id || (session.user.id !== id && !isAdmin)) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id },
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
        isSuspended: true,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        lastLoginAt: true,
        loginCount: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: "User not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch user" } },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Users can only update their own profile unless they're admin
    const isAdmin = session?.user?.role && ["ADMIN", "SUPERADMIN", "OWNER"].includes(session.user.role);
    if (!session?.user?.id || (session.user.id !== id && !isAdmin)) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Handle password change action
    if (body.action === "changePassword") {
      const { currentPassword, newPassword } = body;

      const user = await db.user.findUnique({
        where: { id },
        select: { passwordHash: true },
      });

      if (!user?.passwordHash) {
        return NextResponse.json(
          { success: false, error: { message: "User has no password set" } },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: { message: "Current password is incorrect" } },
          { status: 400 }
        );
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await db.user.update({
        where: { id },
        data: { passwordHash: newHash },
      });

      return NextResponse.json({
        success: true,
        data: { message: "Password updated successfully" },
      });
    }

    // Build update data from allowed fields
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "name", "email", "avatar", "bio", "phone", "website",
      "company", "jobTitle", "location"
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Handle JSON fields
    if (body.socialLinks !== undefined) {
      updateData.socialLinks = JSON.stringify(body.socialLinks);
    }
    if (body.preferences !== undefined) {
      updateData.preferences = JSON.stringify(body.preferences);
    }

    // Admin-only fields
    if (isAdmin) {
      const targetUser = await db.user.findUnique({
        where: { id },
        select: { role: true },
      });

      // RBAC safeguard: SuperAdmin cannot modify Owner/SuperAdmin accounts
      if (session.user.role === "SUPERADMIN" && targetUser?.role !== "USER" && targetUser?.role !== "ADMIN") {
        return NextResponse.json(
          { success: false, error: { message: "Cannot modify accounts with equal or higher privileges" } },
          { status: 403 }
        );
      }

      if (body.isSuspended !== undefined) {
        updateData.isSuspended = body.isSuspended;
        updateData.suspensionReason = body.suspensionReason || null;
      }
    }

    const updated = await db.user.update({
      where: { id },
      data: updateData,
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
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to update user" } },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const targetUser = await db.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: { message: "User not found" } },
        { status: 404 }
      );
    }

    // RBAC checks
    const isOwner = session.user.role === "OWNER";
    const isSuperAdmin = session.user.role === "SUPERADMIN";
    const isAdmin = session.user.role === "ADMIN";
    const isSelf = session.user.id === id;

    // Users can delete their own account
    if (!isSelf && !isAdmin && !isSuperAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: { message: "Forbidden" } },
        { status: 403 }
      );
    }

    // SuperAdmin cannot delete Owner/SuperAdmin accounts
    if (isSuperAdmin && (targetUser.role === "OWNER" || targetUser.role === "SUPERADMIN") && !isSelf) {
      return NextResponse.json(
        { success: false, error: { message: "Cannot delete accounts with equal or higher privileges" } },
        { status: 403 }
      );
    }

    // Admin cannot delete elevated accounts
    if (isAdmin && targetUser.role !== "USER" && !isSelf) {
      return NextResponse.json(
        { success: false, error: { message: "Cannot delete elevated accounts" } },
        { status: 403 }
      );
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: { message: "User deleted" },
    });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete user" } },
      { status: 500 }
    );
  }
}
