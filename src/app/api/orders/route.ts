import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { calcPoints, getTier } from "../../../lib/tiers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { restaurantId, items, byot } = await req.json();

    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "restaurantId and items are required" },
        { status: 400 }
      );
    }

    // Calculate total from items
    const rawTotal: number = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Apply BYOT discount
    const total = byot ? Math.max(0, rawTotal - 15) : rawTotal;

    // Fetch current user to get tier
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentTier = getTier(user.karoPoints) as "Sprout" | "Bloom" | "Harvest" | "Legacy";
    const pointsEarned = calcPoints(total, currentTier, !!byot);
    const newPoints = user.karoPoints + pointsEarned;
    const newTier = getTier(newPoints);

    const itemIds: string[] = items
      .map((item: { id: string }) => item.id)
      .filter((id: string | undefined): id is string => !!id);

    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          restaurantId,
          items: JSON.stringify(items),
          total,
          byot: !!byot,
          pointsEarned,
          status: "pending",
        },
        include: {
          restaurant: true,
        },
      });

      await tx.loyaltyTransaction.create({
        data: {
          userId: user.id,
          orderId: order.id,
          points: pointsEarned,
          type: "earn",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          karoPoints: newPoints,
          tier: newTier,
          ...(byot ? { byotCount: { increment: 1 } } : {}),
        },
      });

      // Increment ordersCount and royaltyEarned on Recipes linked to ordered MenuItems
      const linkedMenuItems = await tx.menuItem.findMany({
        where: {
          id: { in: itemIds },
          recipeId: { not: null },
        },
        select: { recipeId: true },
      });

      const recipeIds = [...new Set(
        linkedMenuItems
          .map((mi) => mi.recipeId)
          .filter((id): id is string => id !== null)
      )];

      if (recipeIds.length > 0) {
        await tx.recipe.updateMany({
          where: { id: { in: recipeIds } },
          data: {
            ordersCount: { increment: 1 },
            royaltyEarned: { increment: 5 }, // default royalty per order
          },
        });
      }

      return order;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        restaurant: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
