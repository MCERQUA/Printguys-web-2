import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// In-memory storage for orders/quotes (temporary until database is set up)
// In production, this would use Prisma with the Order model
const ordersStore = new Map<string, {
  id: string;
  orderNumber: string;
  userId?: string;
  design: {
    frontDecals: unknown[];
    backDecals: unknown[];
    productColor: string;
    productType: string;
  };
  sizes: Record<string, number>;
  printMethod: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postal: string;
    country: string;
  };
  notes?: string;
  pricing: {
    unitPrice: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    discountPercent: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}>();

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `PG${year}${month}${day}-${random}`;
}

// GET /api/orders - List user's orders
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all orders for this user
    const userOrders = Array.from(ordersStore.values())
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new quote request
export async function POST(request: NextRequest) {
  try {
    // Auth is optional for guest quotes
    const authResult = await auth();
    const userId = authResult?.userId;

    const body = await request.json();
    const { design, sizes, printMethod, customer, shippingAddress, notes, pricing } = body;

    // Validate required fields
    if (!design || !sizes || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total quantity
    const totalQuantity = Object.values(sizes as Record<string, number>).reduce((a, b) => a + b, 0);
    if (totalQuantity === 0) {
      return NextResponse.json(
        { error: "At least one item must be ordered" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: generateOrderNumber(),
      userId: userId || undefined,
      design,
      sizes,
      printMethod: printMethod || 'dtf',
      customer,
      shippingAddress,
      notes,
      pricing,
      status: 'quote_pending',
      createdAt: now,
      updatedAt: now,
    };

    ordersStore.set(order.id, order);

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email to customer
    // 3. Send notification to admin
    // 4. Optionally create Stripe checkout session for immediate payment

    console.log('New quote request:', {
      orderNumber: order.orderNumber,
      customer: customer.name,
      email: customer.email,
      totalQuantity,
      total: pricing?.total,
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      message: "Quote request submitted successfully. We'll be in touch within 24 hours.",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
