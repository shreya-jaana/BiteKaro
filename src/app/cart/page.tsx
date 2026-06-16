"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);
  const total = useCart((s) => s.total);

  const [byot, setByot] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bitekaro-byot") === "true";
    }
    return false;
  });

  const toggleByot = () => {
    const next = !byot;
    setByot(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("bitekaro-byot", String(next));
    }
  };

  const subtotal = total();
  const byotDiscount = byot ? 15 : 0;
  const grandTotal = Math.max(0, subtotal - byotDiscount);

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F6ECD9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "#1a1a1a",
              marginBottom: "0.75rem",
            }}
          >
            Your cart is empty
          </h1>
          <p style={{ color: "#8E9CA3", marginBottom: "2rem", lineHeight: 1.6 }}>
            Looks like you haven&apos;t added any dishes yet. Browse restaurants
            or pick by mood!
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/restaurants"
              style={{
                display: "inline-block",
                padding: "0.7rem 1.5rem",
                background: "#C8472E",
                color: "#fff",
                borderRadius: 10,
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              Browse Restaurants
            </Link>
            <Link
              href="/mood"
              style={{
                display: "inline-block",
                padding: "0.7rem 1.5rem",
                background: "transparent",
                color: "#C8472E",
                border: "2px solid #C8472E",
                borderRadius: 10,
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              Pick by Mood
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F6ECD9" }}>
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "3rem 1.5rem 4rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(200,71,46,0.12)",
              color: "#C8472E",
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
            {items.length} item{items.length !== 1 ? "s" : ""}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              color: "#1a1a1a",
              margin: 0,
            }}
          >
            Your Cart
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr min(340px, 100%)",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Cart items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#fff",
                  border: "1px solid #CBD4D9",
                  borderRadius: 14,
                  padding: "1.1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {/* Item info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      margin: "0 0 0.2rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "#8E9CA3",
                      margin: "0 0 0.35rem",
                    }}
                  >
                    {item.restaurantName}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#1a1a1a",
                    }}
                  >
                    ₹{item.price}
                  </span>
                </div>

                {/* Quantity controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      border: "1.5px solid #CBD4D9",
                      background: "#F6ECD9",
                      color: "#1a1a1a",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      padding: 0,
                    }}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "#1a1a1a",
                      minWidth: 20,
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      border: "1.5px solid #CBD4D9",
                      background: "#F6ECD9",
                      color: "#1a1a1a",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      padding: 0,
                    }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Line total */}
                <div
                  style={{
                    flexShrink: 0,
                    minWidth: 60,
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#1a1a1a",
                    }}
                  >
                    ₹{item.price * item.quantity}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#CBD4D9",
                    padding: "0.2rem",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "#C8472E")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "#CBD4D9")
                  }
                  aria-label={`Remove ${item.name}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order summary sidebar */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #CBD4D9",
              borderRadius: 16,
              padding: "1.5rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              position: "sticky",
              top: "1rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#1a1a1a",
                margin: "0 0 1.25rem",
              }}
            >
              Order Summary
            </h2>

            {/* Subtotal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
                fontSize: "0.9rem",
                color: "#555",
              }}
            >
              <span>Subtotal</span>
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                ₹{subtotal}
              </span>
            </div>

            {/* BYOT toggle */}
            <div
              style={{
                background: byot ? "rgba(82,112,79,0.08)" : "rgba(239,161,59,0.08)",
                border: `1.5px solid ${byot ? "rgba(82,112,79,0.35)" : "rgba(239,161,59,0.35)"}`,
                borderRadius: 12,
                padding: "0.9rem 1rem",
                marginBottom: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={toggleByot}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  marginBottom: "0.35rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>🫙</span>
                  <span
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: byot ? "#52704F" : "#b8720a",
                    }}
                  >
                    Bring Your Own Tiffin
                  </span>
                </div>
                {/* Toggle pill */}
                <div
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 999,
                    background: byot ? "#52704F" : "#CBD4D9",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: byot ? 21 : 3,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.775rem",
                  color: "#8E9CA3",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Save ₹15 + earn bonus Karo Points!
              </p>
            </div>

            {/* BYOT discount row */}
            {byot && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                  fontSize: "0.875rem",
                  color: "#52704F",
                  fontWeight: 600,
                }}
              >
                <span>BYOT discount</span>
                <span style={{ fontFamily: "var(--font-space-mono)" }}>−₹15</span>
              </div>
            )}

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid #CBD4D9",
                margin: "0.75rem 0 1rem",
              }}
            />

            {/* Grand total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#1a1a1a",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "#1a1a1a",
                }}
              >
                ₹{grandTotal}
              </span>
            </div>

            {/* Checkout button */}
            <Link
              href={`/checkout?byot=${byot}`}
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.85rem",
                background: "#C8472E",
                color: "#fff",
                borderRadius: 10,
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.88")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
              }
            >
              Proceed to Checkout →
            </Link>

            <Link
              href="/restaurants"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "0.75rem",
                fontSize: "0.85rem",
                color: "#8E9CA3",
                textDecoration: "none",
              }}
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
