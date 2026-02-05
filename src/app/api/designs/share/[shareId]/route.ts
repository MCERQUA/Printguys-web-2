import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/designs/share/:shareId
 *
 * Public endpoint to retrieve a shared design by its share ID.
 * No authentication required - accessible by anyone with the link.
 *
 * Increments the view count for analytics.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    // Validate shareId format
    if (!/^[0-9a-z]{8}$/.test(shareId)) {
      return NextResponse.json(
        { error: "Invalid share ID" },
        { status: 400 }
      );
    }

    // Find the design
    const design = await prisma.design.findUnique({
      where: { shareId },
      select: {
        id: true,
        shareId: true,
        name: true,
        description: true,
        canvasData: true,
        thumbnail: true,
        viewCount: true,
        forkCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Design not found or not public
    if (!design) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 }
      );
    }

    // Increment view count (fire and forget)
    prisma.design.update({
      where: { id: design.id },
      data: { viewCount: { increment: 1 } },
    }).catch(console.error);

    return NextResponse.json(design);
  } catch (error) {
    console.error("Error fetching shared design:", error);
    return NextResponse.json(
      { error: "Failed to fetch design" },
      { status: 500 }
    );
  }
}
