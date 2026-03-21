import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/users/[id]/listings - Get user's public listings
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const listings = await db.listing.findMany({
      where: {
        sellerId: id,
        status: "APPROVED",
      },
      select: {
        id: true,
        title: true,
        category: true,
        region: true,
        location: true,
        askingPrice: true,
        revenue: true,
        images: true,
        isFeatured: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    console.error("User listings fetch error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch listings" } },
      { status: 500 }
    );
  }
}
