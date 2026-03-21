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
            select: { id: true, name: true, company: true, avatar: true },
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

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["title", "description", "category", "location", "region", "askingPrice", "revenue"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: { message: `Missing required field: ${field}` } },
          { status: 400 }
        );
      }
    }

    const listing = await db.listing.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        industry: body.industry || null,
        location: body.location,
        region: body.region,
        // Location coordinates
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        showExactLocation: body.showExactLocation === true,
        // Financials
        askingPrice: parseFloat(body.askingPrice),
        revenue: parseFloat(body.revenue),
        ebitda: body.ebitda ? parseFloat(body.ebitda) : null,
        growthRate: body.growthRate ? parseFloat(body.growthRate) : null,
        employees: body.employees ? parseInt(body.employees) : null,
        yearEstablished: body.yearEstablished ? parseInt(body.yearEstablished) : null,
        // Images - store as JSON array
        images: body.images && body.images.length > 0 ? JSON.stringify(body.images) : null,
        // Status
        status: "PENDING",
        // Relations
        sellerId: session.user.id,
      },
      include: {
        seller: {
          select: { id: true, name: true, company: true },
        },
      },
    });

    // Create notifications for all admins about the new listing
    try {
      const admins = await db.user.findMany({
        where: {
          role: { in: ["ADMIN", "SUPERADMIN", "OWNER"] },
        },
        select: { id: true },
      });

      // Create notification records for each admin
      await db.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          type: "LISTING_PENDING",
          title: "New Listing Submitted",
          message: `A new listing "${body.title}" has been submitted for review.`,
          link: "/admin",
        })),
      });
    } catch (notificationError) {
      // Log but don't fail the request
      console.error("Failed to create notifications:", notificationError);
    }

    return NextResponse.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Listing creation error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to create listing" } },
      { status: 500 }
    );
  }
}
