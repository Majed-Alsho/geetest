import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// GET /api/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const listing = await db.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, company: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: { message: "Listing not found" } },
        { status: 404 }
      );
    }

    // Check access permissions
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role && ["ADMIN", "SUPERADMIN", "OWNER"].includes(session.user.role);
    const isOwner = session?.user?.id === listing.sellerId;

    // Non-admins can only see approved listings (unless they own it)
    if (!isAdmin && !isOwner && listing.status !== "APPROVED") {
      return NextResponse.json(
        { success: false, error: { message: "Listing not found" } },
        { status: 404 }
      );
    }

    // Increment view count
    await db.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      data: { ...listing, viewCount: listing.viewCount + 1 },
    });
  } catch (error) {
    console.error("Listing fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch listing" } },
      { status: 500 }
    );
  }
}

// PATCH /api/listings/[id] - Update a listing
export async function PATCH(
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

    const listing = await db.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: { message: "Listing not found" } },
        { status: 404 }
      );
    }

    // Check permissions
    const isAdmin = ["ADMIN", "SUPERADMIN", "OWNER"].includes(session.user.role as string);
    const isOwner = session.user.id === listing.sellerId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: { message: "Forbidden" } },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Fields that can be updated
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "title", "description", "category", "industry", "location", "region",
      "askingPrice", "revenue", "ebitda", "growthRate", "employees", 
      "yearEstablished", "images", "ndaRequired"
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Admin-only fields
    if (isAdmin) {
      if (body.status !== undefined) updateData.status = body.status;
      if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
      if (body.isVerified !== undefined) updateData.isVerified = body.isVerified;
    }

    const updated = await db.listing.update({
      where: { id },
      data: updateData,
      include: {
        seller: {
          select: { id: true, name: true, company: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Listing update error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to update listing" } },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id] - Delete a listing
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

    const listing = await db.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: { message: "Listing not found" } },
        { status: 404 }
      );
    }

    // Check permissions
    const isAdmin = ["ADMIN", "SUPERADMIN", "OWNER"].includes(session.user.role as string);
    const isOwner = session.user.id === listing.sellerId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: { message: "Forbidden" } },
        { status: 403 }
      );
    }

    await db.listing.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Listing deleted" },
    });
  } catch (error) {
    console.error("Listing delete error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete listing" } },
      { status: 500 }
    );
  }
}
