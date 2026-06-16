import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, menuItemId } = body;

    // Status updates: any vendor or admin can approve/reject submissions
    if (status !== undefined) {
      const isAdmin = session.user.role === "admin";
      const isVendor = session.user.role === "vendor";

      if (!isAdmin && !isVendor) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const updated = await prisma.recipe.update({
        where: { id },
        data: { status },
      });

      return NextResponse.json(updated);
    }

    // Attach recipe to a menu item
    if (menuItemId !== undefined) {
      const isAdmin = session.user.role === "admin";
      const isVendor = session.user.role === "vendor";

      if (!isAdmin && !isVendor) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Verify the menu item belongs to the vendor's restaurant
      if (isVendor) {
        const vendor = await prisma.restaurant.findUnique({
          where: { ownerId: session.user.id },
        });

        if (!vendor) {
          return NextResponse.json(
            { error: "No restaurant found for vendor" },
            { status: 404 }
          );
        }

        const menuItem = await prisma.menuItem.findUnique({
          where: { id: menuItemId },
        });

        if (!menuItem || menuItem.restaurantId !== vendor.id) {
          return NextResponse.json(
            { error: "MenuItem does not belong to your restaurant" },
            { status: 403 }
          );
        }
      }

      const updated = await prisma.menuItem.update({
        where: { id: menuItemId },
        data: { recipeId: id },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  } catch (error) {
    console.error("Recipe PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
