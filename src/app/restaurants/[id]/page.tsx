import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MenuPage } from "./MenuPage";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { menuItems: true },
  });

  if (!restaurant) {
    notFound();
  }

  // Serialize to plain objects (Dates become strings via JSON)
  const serialized = {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    commissionRate: restaurant.commissionRate,
    menuItems: restaurant.menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      moodTags: item.moodTags,
      restaurantId: item.restaurantId,
      recipeId: item.recipeId,
    })),
  };

  return <MenuPage restaurant={serialized} />;
}
