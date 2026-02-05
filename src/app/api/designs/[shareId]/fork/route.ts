import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateShareId } from "@/lib/share-id";

/**
 * POST /api/designs/:shareId/fork
 *
 * Creates a new design based on an existing shared design.
 * Allows users to make someone else's design their own and modify it.
 *
 * - Creates a new design with a unique shareId
 * - Copies the canvasData and thumbnail from the original
 * - Sets parentDesignId to track the relationship
 * - Increments forkCount on the original design
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { userId } = await auth();
    const { shareId } = await params;

    // Validate shareId format
    if (!/^[0-9a-z]{8}$/.test(shareId)) {
      return NextResponse.json(
        { error: "Invalid share ID" },
        { status: 400 }
      );
    }

    // Find the original design
    const originalDesign = await prisma.design.findUnique({
      where: { shareId },
    });

    if (!originalDesign) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 }
      );
    }

    // Generate unique shareId for the fork
    let newShareId = generateShareId();
    let attempts = 0;
    while (await prisma.design.findUnique({ where: { shareId: newShareId } }) && attempts < 10) {
      newShareId = generateShareId();
      attempts++;
    }

    const origin = request.headers.get('origin') || request.headers.get('host') || '';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    // Create the forked design
    const forkedDesign = await prisma.design.create({
      data: {
        shareId: newShareId,
        userId: userId || null, // Allow anonymous forks
        name: `${originalDesign.name} (Copy)`,
        description: originalDesign.description,
        canvasData: originalDesign.canvasData ?? undefined,
        thumbnail: originalDesign.thumbnail,
        isPublic: true,
        parentDesignId: originalDesign.id,
      },
    });

    // Increment fork count on original (fire and forget)
    prisma.design.update({
      where: { id: originalDesign.id },
      data: { forkCount: { increment: 1 } },
    }).catch(console.error);

    return NextResponse.json({
      ...forkedDesign,
      shareUrl: `${baseUrl}/design-studio/shared/${newShareId}`,
    }, { status: 201 });
  } catch (error) {
    console.error("Error forking design:", error);
    return NextResponse.json(
      { error: "Failed to fork design" },
      { status: 500 }
    );
  }
}
