import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine");

    let recipes;

    if (mine === "true") {
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      recipes = await prisma.recipe.findMany({
        where: { userId: session.user.id },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      recipes = await prisma.recipe.findMany({
        where: { status: "approved" },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Recipes GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, ingredients, moodTags } = await req.json();

    if (!title || !description || !ingredients) {
      return NextResponse.json(
        { error: "title, description, and ingredients are required" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        userId: session.user.id,
        title,
        description,
        ingredients: Array.isArray(ingredients)
          ? JSON.stringify(ingredients)
          : ingredients,
        moodTags: Array.isArray(moodTags)
          ? moodTags.join(",")
          : (moodTags ?? ""),
        status: "pending",
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Recipes POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
