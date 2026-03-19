import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// GET /api/listings - List all listings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    
    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};
    
    // Default to showing only approved listings for non-admins
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role && ["ADMIN", "SUPERADMIN", "OWNER"].includes(session.user.role);
    
    if (!isAdmin) {
      where.status = "APPROVED";
    } else if (status) {
      where.status = status;
    }

    if (category) where.category = category;
    if (region) where.region = region;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.askingPrice = {};
      if (minPrice !== undefined) where.askingPrice.gte = minPrice;
      if (maxPrice !== undefined) where.askingPrice.lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          seller: {
            select: { id: true, name: true, company: true },
          },
        },
      }),
      db.listing.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: listings,
      meta: {
        page,
        limit,
        total,
        hasMore: skip + listings.length < total,
      },
    });
  } catch (error) {
    console.error("Listings fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch listings" } },
      { status: 500 }
    );
  }
}
