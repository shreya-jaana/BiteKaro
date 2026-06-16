import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mood = searchParams.get("mood");

    if (!mood) {
      return NextResponse.json(
        { error: "mood query parameter is required" },
        { status: 400 }
      );
    }

    const menuItems = await prisma.menuItem.findMany({
      where: {
        moodTags: {
          contains: mood,
        },
      },
      include: {
        restaurant: true,
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Mood route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
