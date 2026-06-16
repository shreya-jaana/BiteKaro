import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "vendor" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "No restaurant found for this vendor" },
        { status: 404 }
      );
    }

    const { name, description, price, moodTags, imageUrl } = await req.json();

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: "name, description, and price are required" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        name,
        description,
        price: Number(price),
        moodTags: Array.isArray(moodTags)
          ? moodTags.join(",")
          : (moodTags ?? ""),
        imageUrl: imageUrl ?? "",
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Vendor menu POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
