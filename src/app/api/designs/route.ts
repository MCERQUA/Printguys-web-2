import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GA tracking helper (server-side - sets a flag for client to track)
function trackDesignSaveEvent(productType: string) {
  // This is server-side, so we can't directly call GA
  // The client should handle tracking after successful save
  // Returning info for potential client-side use
  return { tracked: true, productType };
}

// In-memory storage for designs (temporary until database is set up)
// In production, this would use Prisma with the Design model
const designsStore = new Map<string, {
  id: string;
  userId: string;
  name: string;
  frontDecals: unknown[];
  backDecals: unknown[];
  productColor: string;
  productType: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}>();

// GET /api/designs - List user's saved designs
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all designs for this user
    const userDesigns = Array.from(designsStore.values())
      .filter(d => d.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

    const now = new Date().toISOString();
    const design = {
      id: `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name: name || "Untitled Design",
      frontDecals,
      backDecals,
      productColor: productColor || "black",
      productType: productType || "tshirt",
      thumbnail,
      createdAt: now,
      updatedAt: now,
    };

    designsStore.set(design.id, design);

    return NextResponse.json(design, { status: 201 });
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

    const design = designsStore.get(designId);

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    if (design.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    designsStore.delete(designId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json(
      { error: "Failed to delete design" },
      { status: 500 }
    );
  }
}
