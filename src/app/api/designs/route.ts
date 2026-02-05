import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateShareId } from "@/lib/share-id";

// GET /api/designs - List user's saved designs
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all designs for this user
    const userDesigns = await prisma.design.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        shareId: true,
        name: true,
        thumbnail: true,
        canvasData: true,
        isPublic: true,
        viewCount: true,
        forkCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(userDesigns);
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json(
      { error: "Failed to fetch designs" },
      { status: 500 }
    );
  }
}

// POST /api/designs - Create a new design
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, frontDecals, backDecals, productColor, productType, thumbnail } = body;

    // Validate required fields
    if (!frontDecals || !backDecals) {
      return NextResponse.json(
        { error: "Front and back decals are required" },
        { status: 400 }
      );
    }

    // Generate unique shareId
    let shareId = generateShareId();
    let attempts = 0;
    while (await prisma.design.findUnique({ where: { shareId } }) && attempts < 10) {
      shareId = generateShareId();
      attempts++;
    }

    const origin = request.headers.get('origin') || request.headers.get('host') || '';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    const design = await prisma.design.create({
      data: {
        shareId,
        userId,
        name: name || "Untitled Design",
        canvasData: {
          front: frontDecals,
          back: backDecals,
          color: productColor || "black",
          type: productType || "tshirt",
        },
        thumbnail,
        isPublic: true, // Default to public for sharing
      },
    });

    return NextResponse.json({
      ...design,
      shareUrl: `${baseUrl}/design-studio/shared/${shareId}`,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating design:", error);
    return NextResponse.json(
      { error: "Failed to create design" },
      { status: 500 }
    );
  }
}

// DELETE /api/designs - Delete a design
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const designId = searchParams.get('id');

    if (!designId) {
      return NextResponse.json({ error: "Design ID required" }, { status: 400 });
    }

    const design = await prisma.design.findUnique({
      where: { id: designId },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    if (design.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.design.delete({
      where: { id: designId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json(
      { error: "Failed to delete design" },
      { status: 500 }
    );
  }
}
