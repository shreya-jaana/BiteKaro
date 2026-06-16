import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        menuItems: true,
      },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Restaurants route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
