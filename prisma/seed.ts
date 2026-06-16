import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaLibSql({ url: `file://${dbPath}` });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding BiteKaro...");

  const pw = await bcrypt.hash("demo1234", 12);

  const customer = await prisma.user.upsert({
    where: { email: "priya@bitekaro.in" },
    update: {},
    create: { name: "Priya Sharma", email: "priya@bitekaro.in", passwordHash: pw, role: "customer", karoPoints: 620, tier: "Bloom" },
  });

  const v1 = await prisma.user.upsert({
    where: { email: "ravi@dabbawala.in" },
    update: {},
    create: { name: "Ravi Mehta", email: "ravi@dabbawala.in", passwordHash: pw, role: "vendor", karoPoints: 0, tier: "Sprout" },
  });
  const v2 = await prisma.user.upsert({
    where: { email: "anita@spiceroute.in" },
    update: {},
    create: { name: "Anita Kapoor", email: "anita@spiceroute.in", passwordHash: pw, role: "vendor", karoPoints: 0, tier: "Sprout" },
  });
  const v3 = await prisma.user.upsert({
    where: { email: "arjun@greenleaf.in" },
    update: {},
    create: { name: "Arjun Nair", email: "arjun@greenleaf.in", passwordHash: pw, role: "vendor", karoPoints: 0, tier: "Sprout" },
  });
  await prisma.user.upsert({
    where: { email: "rider@bitekaro.in" },
    update: {},
    create: { name: "Suresh Kumar", email: "rider@bitekaro.in", passwordHash: pw, role: "rider", karoPoints: 0, tier: "Sprout" },
  });

  const r1 = await prisma.restaurant.upsert({
    where: { ownerId: v1.id }, update: {},
    create: { name: "Dabbawala Kitchen", description: "Home-style tiffin meals, just like Amma makes them. Comfort food from Maharashtra & Gujarat.", commissionRate: 0.12, ownerId: v1.id },
  });
  const r2 = await prisma.restaurant.upsert({
    where: { ownerId: v2.id }, update: {},
    create: { name: "Spice Route", description: "Bold South Indian flavors — dosas, curries, and biryanis with a modern twist.", commissionRate: 0.12, ownerId: v2.id },
  });
  const r3 = await prisma.restaurant.upsert({
    where: { ownerId: v3.id }, update: {},
    create: { name: "Green Leaf Bistro", description: "Plant-based comfort food with a conscience. Wholesome bowls for every mood.", commissionRate: 0.12, ownerId: v3.id },
  });

  const rec1 = await prisma.recipe.upsert({
    where: { id: "recipe-dal-makhani" }, update: {},
    create: { id: "recipe-dal-makhani", userId: customer.id, title: "Priya's Comfort Dal Makhani", description: "Slow-cooked black lentils in a rich tomato-butter gravy.", moodTags: "Stressed,Heartbroken,Homesick", ingredients: JSON.stringify(["1 cup urad dal","2 cups tomato puree","3 tbsp butter"]), status: "approved", royaltyPerOrder: 8 },
  });
  const rec2 = await prisma.recipe.upsert({
    where: { id: "recipe-lemon-rice" }, update: {},
    create: { id: "recipe-lemon-rice", userId: customer.id, title: "Sunshine Lemon Rice", description: "Tangy lemon rice with peanuts and curry leaves.", moodTags: "Lazy Sunday,Celebrating,Adventurous", ingredients: JSON.stringify(["2 cups cooked rice","2 tbsp lemon juice","peanuts"]), status: "approved", royaltyPerOrder: 5 },
  });

  const menus: Array<{ id: string; restaurantId: string; name: string; description: string; price: number; moodTags: string; recipeId?: string }> = [
    { id: "menu-dal-makhani", restaurantId: r1.id, name: "Dal Makhani", description: "Rich, slow-cooked black lentils in buttery tomato gravy.", price: 180, moodTags: "Stressed,Heartbroken,Homesick,Celebrating", recipeId: rec1.id },
    { id: "menu-aloo-paratha", restaurantId: r1.id, name: "Aloo Paratha Combo", description: "3 stuffed parathas with white butter and pickle.", price: 160, moodTags: "Homesick,Lazy Sunday,Heartbroken,Stressed" },
    { id: "menu-khichdi", restaurantId: r1.id, name: "Tadka Khichdi", description: "Rice and lentils tempered with ghee and spices.", price: 140, moodTags: "Stressed,Homesick,Lazy Sunday" },
    { id: "menu-thali-special", restaurantId: r1.id, name: "Dabbawala Special Thali", description: "Dal, sabzi, roti, rice, salad & sweet.", price: 280, moodTags: "Celebrating,Heartbroken,Homesick,Adventurous" },
    { id: "menu-poha", restaurantId: r1.id, name: "Indori Poha", description: "Flattened rice with peanuts and pomegranate.", price: 90, moodTags: "Lazy Sunday,Homesick,Celebrating" },
    { id: "menu-masala-dosa", restaurantId: r2.id, name: "Ghee Masala Dosa", description: "Crispy rice crepe with spiced potato filling.", price: 150, moodTags: "Celebrating,Adventurous,Lazy Sunday,Homesick" },
    { id: "menu-biryani", restaurantId: r2.id, name: "Hyderabadi Dum Biryani", description: "Aromatic basmati rice slow-cooked in dum.", price: 320, moodTags: "Celebrating,Adventurous,Heartbroken" },
    { id: "menu-lemon-rice", restaurantId: r2.id, name: "Sunshine Lemon Rice", description: "Tangy peanut-studded lemon rice.", price: 120, moodTags: "Lazy Sunday,Celebrating,Adventurous", recipeId: rec2.id },
    { id: "menu-filter-coffee", restaurantId: r2.id, name: "South Indian Filter Coffee", description: "Strong decoction with frothy milk.", price: 60, moodTags: "Stressed,Lazy Sunday,Adventurous" },
    { id: "menu-chettinad", restaurantId: r2.id, name: "Chettinad Curry", description: "Fiery peppery Chettinad spice blend in coconut gravy.", price: 260, moodTags: "Adventurous,Celebrating,Heartbroken" },
    { id: "menu-buddha-bowl", restaurantId: r3.id, name: "Buddha Bowl", description: "Quinoa, roasted veggies, hummus, avocado, tahini.", price: 290, moodTags: "Celebrating,Adventurous,Stressed" },
    { id: "menu-sprout-salad", restaurantId: r3.id, name: "Mumbai Sprout Salad", description: "Mixed sprouts, pomegranate, chaat masala.", price: 140, moodTags: "Stressed,Lazy Sunday,Adventurous" },
    { id: "menu-oats-idli", restaurantId: r3.id, name: "Oats Idli with Podi", description: "Soft oats idlis with spicy gunpowder podi.", price: 110, moodTags: "Homesick,Lazy Sunday,Stressed" },
    { id: "menu-mango-lassi", restaurantId: r3.id, name: "Alphonso Mango Lassi", description: "Thick lassi made with Alphonso mangoes.", price: 80, moodTags: "Celebrating,Heartbroken,Lazy Sunday,Adventurous" },
    { id: "menu-green-curry", restaurantId: r3.id, name: "Kerala Green Curry", description: "Coconut milk curry with fresh herbs.", price: 220, moodTags: "Homesick,Heartbroken,Adventurous,Celebrating" },
  ];

  for (const item of menus) {
    await prisma.menuItem.upsert({ where: { id: item.id }, update: {}, create: item });
  }

  console.log("✅ Seeded! 5 users, 3 restaurants, 15 items, 2 recipes");
  console.log("\n📧 Demo accounts (password: demo1234):");
  console.log("  Customer: priya@bitekaro.in");
  console.log("  Vendor 1: ravi@dabbawala.in");
  console.log("  Vendor 2: anita@spiceroute.in");
  console.log("  Rider:    rider@bitekaro.in");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
