"use client";

import { MenuItemCard } from "@/components/MenuItemCard";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  moodTags: string;
  restaurantId: string;
  recipeId: string | null;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  commissionRate: number;
  menuItems: MenuItem[];
}

interface MenuPageProps {
  restaurant: Restaurant;
}

// Collect unique moods across all items
function getMoods(items: MenuItem[]): string[] {
  const moodSet = new Set<string>();
  for (const item of items) {
    if (item.moodTags) {
      item.moodTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => moodSet.add(t));
    }
  }
  return Array.from(moodSet).sort();
}

const MOOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Stressed: { bg: "#C8472E18", text: "#C8472E", border: "#C8472E44" },
  Heartbroken: { bg: "#7A456618", text: "#7A4566", border: "#7A456644" },
  Celebrating: { bg: "#EFA13B18", text: "#b8720a", border: "#EFA13B44" },
  "Lazy Sunday": { bg: "#52704F18", text: "#52704F", border: "#52704F44" },
  Homesick: { bg: "#CBD4D940", text: "#555", border: "#CBD4D9" },
  Adventurous: { bg: "#EFA13B18", text: "#b8720a", border: "#EFA13B44" },
};

function getMoodStyle(mood: string) {
  return (
    MOOD_COLORS[mood] ?? {
      bg: "rgba(239,161,59,0.15)",
      text: "#b8720a",
      border: "rgba(239,161,59,0.35)",
    }
  );
}

export function MenuPage({ restaurant }: MenuPageProps) {
  const allMoods = getMoods(restaurant.menuItems);

  return (
    <div style={{ minHeight: "100vh", background: "#F6ECD9" }}>
      {/* Restaurant Hero */}
      <section
        style={{
          background: "#1a1a1a",
          color: "#F6ECD9",
          padding: "3rem 1.5rem 2.5rem",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(82,112,79,0.25)",
              color: "#7dc87a",
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.3rem 0.9rem",
              borderRadius: 999,
              marginBottom: "0.85rem",
            }}
          >
            {restaurant.commissionRate}% commission · BiteKaro partner
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              margin: "0 0 0.6rem",
              lineHeight: 1.15,
            }}
          >
            {restaurant.name}
          </h1>
          <p
            style={{
              color: "#CBD4D9",
              fontSize: "1rem",
              margin: "0 0 1.25rem",
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            {restaurant.description}
          </p>

          {/* Mood tag chips */}
          {allMoods.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#8E9CA3",
                  alignSelf: "center",
                  marginRight: "0.25rem",
                }}
              >
                Moods served:
              </span>
              {allMoods.map((m) => {
                const style = getMoodStyle(m);
                return (
                  <span
                    key={m}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.7rem",
                      borderRadius: 999,
                      background: style.bg,
                      color: style.text,
                      border: `1px solid ${style.border}`,
                    }}
                  >
                    {m}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* BYOT Banner */}
      <div
        style={{
          background: "#C8472E",
          color: "#F6ECD9",
          padding: "0.75rem 1.5rem",
          textAlign: "center",
          fontSize: "0.9rem",
          fontFamily: "var(--font-bricolage)",
          fontWeight: 600,
        }}
      >
        🫙 Bring Your Own Tiffin and save ₹15 + earn bonus Karo Points!
      </div>

      {/* Menu */}
      <section
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "2.5rem 1.5rem 4rem",
        }}
      >
        {restaurant.menuItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "#8E9CA3",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
            <h2
              style={{
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "#1a1a1a",
              }}
            >
              No menu items yet
            </h2>
            <p>This restaurant is preparing their menu.</p>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#1a1a1a",
                marginBottom: "1.25rem",
              }}
            >
              Menu{" "}
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.9rem",
                  color: "#8E9CA3",
                  fontWeight: 400,
                }}
              >
                ({restaurant.menuItems.length} items)
              </span>
            </h2>

            {/* Group by mood */}
            {allMoods.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {allMoods.map((mood) => {
                  const moodItems = restaurant.menuItems.filter((item) =>
                    item.moodTags
                      ? item.moodTags
                          .split(",")
                          .map((t) => t.trim())
                          .includes(mood)
                      : false
                  );
                  if (moodItems.length === 0) return null;
                  const moodStyle = getMoodStyle(mood);
                  return (
                    <div key={mood}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-bricolage)",
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            color: moodStyle.text,
                            background: moodStyle.bg,
                            border: `1.5px solid ${moodStyle.border}`,
                            padding: "0.3rem 0.9rem",
                            borderRadius: 999,
                          }}
                        >
                          {mood}
                        </span>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#8E9CA3",
                            fontFamily: "var(--font-space-mono)",
                          }}
                        >
                          {moodItems.length} item{moodItems.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
                          gap: "1rem",
                        }}
                      >
                        {moodItems.map((item) => (
                          <MenuItemCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            moodTags={item.moodTags}
                            restaurantId={item.restaurantId}
                            restaurantName={restaurant.name}
                            recipeId={item.recipeId}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
                {/* Items with no matching moods */}
                {(() => {
                  const untagged = restaurant.menuItems.filter(
                    (item) => !item.moodTags || item.moodTags.trim() === ""
                  );
                  if (untagged.length === 0) return null;
                  return (
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-bricolage)",
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#8E9CA3",
                          marginBottom: "1rem",
                        }}
                      >
                        Other Items
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
                          gap: "1rem",
                        }}
                      >
                        {untagged.map((item) => (
                          <MenuItemCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            moodTags={item.moodTags}
                            restaurantId={item.restaurantId}
                            restaurantName={restaurant.name}
                            recipeId={item.recipeId}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
                  gap: "1rem",
                }}
              >
                {restaurant.menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    moodTags={item.moodTags}
                    restaurantId={item.restaurantId}
                    restaurantName={restaurant.name}
                    recipeId={item.recipeId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
