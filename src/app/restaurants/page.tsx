import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({
    include: { menuItems: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F6ECD9" }}>
      {/* Header */}
      <section
        style={{
          padding: "3rem 1.5rem 1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(82,112,79,0.12)",
              color: "#52704F",
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
            12% commission · Not 30%
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#1a1a1a",
              margin: "0 0 0.5rem",
            }}
          >
            All Restaurants
          </h1>
          <p style={{ color: "#8E9CA3", fontSize: "1rem", margin: 0 }}>
            Browse all restaurants on BiteKaro. Vendors keep more because we
            charge less.
          </p>
        </div>

        {/* Grid */}
        {restaurants.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 0",
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
              No restaurants yet
            </h2>
            <p>Check back soon — vendors are joining!</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: "1.25rem",
              paddingBottom: "4rem",
            }}
          >
            {restaurants.map((r) => (
              <Link
                key={r.id}
                href={`/restaurants/${r.id}`}
                className="restaurant-card-link"
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className="restaurant-card"
                  style={{
                    background: "#fff",
                    border: "1px solid #CBD4D9",
                    borderRadius: 16,
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    cursor: "pointer",
                    height: "100%",
                  }}
                >
                  {/* Restaurant icon placeholder */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "#EFA13B22",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      flexShrink: 0,
                    }}
                  >
                    🏪
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "var(--font-bricolage)",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "#1a1a1a",
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {r.name}
                      </h2>
                      {/* Commission badge */}
                      <span
                        style={{
                          background: "rgba(82,112,79,0.12)",
                          color: "#52704F",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-space-mono)",
                          padding: "0.2rem 0.55rem",
                          borderRadius: 999,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {r.commissionRate}% commission
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "0 0 0.75rem",
                        fontSize: "0.875rem",
                        color: "#555",
                        lineHeight: 1.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {r.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        fontSize: "0.8rem",
                        color: "#8E9CA3",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <span>🍛</span>
                        <span
                          style={{ fontFamily: "var(--font-space-mono)", fontWeight: 700 }}
                        >
                          {r.menuItems.length}
                        </span>{" "}
                        {r.menuItems.length === 1 ? "dish" : "dishes"}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          color: "#C8472E",
                          fontWeight: 600,
                          fontFamily: "var(--font-bricolage)",
                          fontSize: "0.85rem",
                        }}
                      >
                        View menu →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
