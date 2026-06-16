"use client";

import { useCart } from "@/lib/cart";
import { useState } from "react";

interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  moodTags: string; // comma-separated
  restaurantId: string;
  restaurantName: string;
  recipeId?: string | null;
}

export function MenuItemCard({
  id,
  name,
  description,
  price,
  moodTags,
  restaurantId,
  restaurantName,
  recipeId,
}: MenuItemCardProps) {
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.id === id);
  const inCart = !!cartItem;

  const tags = moodTags
    ? moodTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const handleAdd = () => {
    addItem({ id, name, price, restaurantId, restaurantName });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #CBD4D9",
        borderRadius: 14,
        padding: "1.1rem 1.2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        position: "relative",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 6px 22px rgba(0,0,0,0.11)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 10px rgba(0,0,0,0.06)")
      }
    >
      {/* Recipe Royalty badge */}
      {recipeId && (
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#7A4566",
            color: "#fff",
            fontSize: "0.68rem",
            fontWeight: 700,
            fontFamily: "var(--font-bricolage)",
            padding: "0.2rem 0.55rem",
            borderRadius: 999,
            letterSpacing: "0.03em",
          }}
        >
          👑 Recipe Royalty
        </span>
      )}

      {/* Name */}
      <h3
        style={{
          fontFamily: "var(--font-bricolage)",
          fontWeight: 700,
          fontSize: "1.05rem",
          color: "#1a1a1a",
          margin: 0,
          paddingRight: recipeId ? "7rem" : 0,
          lineHeight: 1.25,
        }}
      >
        {name}
      </h3>

      {/* Restaurant name */}
      <p
        style={{
          margin: 0,
          fontSize: "0.75rem",
          color: "#8E9CA3",
          fontWeight: 500,
        }}
      >
        {restaurantName}
      </p>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: "0.875rem",
          color: "#3d3d3d",
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>

      {/* Mood tag chips */}
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                padding: "0.2rem 0.6rem",
                borderRadius: 999,
                background: "rgba(239,161,59,0.15)",
                color: "#b8720a",
                border: "1px solid rgba(239,161,59,0.35)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Price + Add to Cart */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "0.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#1a1a1a",
          }}
        >
          ₹{price}
        </span>

        <button
          onClick={handleAdd}
          style={{
            padding: "0.45rem 1.1rem",
            borderRadius: 8,
            border: "none",
            background: added ? "#52704F" : inCart ? "#EFA13B" : "#C8472E",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.85rem",
            fontFamily: "var(--font-bricolage)",
            cursor: "pointer",
            transition: "background 0.2s ease, transform 0.1s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
          onMouseDown={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)")
          }
          onMouseUp={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")
          }
          aria-label={`Add ${name} to cart`}
        >
          {added ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Added!
            </>
          ) : inCart ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add More
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
