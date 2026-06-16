"use client";

import { useCart } from "@/lib/cart";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function CheckoutForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const total = useCart((s) => s.total);

  const [byot, setByot] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const fromUrl = searchParams.get("byot");
      if (fromUrl !== null) return fromUrl === "true";
      return localStorage.getItem("bitekaro-byot") === "true";
    }
    return false;
  });

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync byot to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bitekaro-byot", String(byot));
    }
  }, [byot]);

  // Validate all items are from same restaurant
  const restaurantIds = [...new Set(items.map((i) => i.restaurantId))];
  const multiRestaurant = restaurantIds.length > 1;
  const restaurantId = restaurantIds[0] ?? null;

  const subtotal = total();
  const byotDiscount = byot ? 15 : 0;
  const grandTotal = Math.max(0, subtotal - byotDiscount);

  const handlePlaceOrder = async () => {
    if (!session?.user) return;
    if (multiRestaurant) {
      setError("All items must be from the same restaurant.");
      return;
    }
    if (!restaurantId) return;

    setError(null);
    setPlacing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          byot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order.");
        setPlacing(false);
        return;
      }

      clearCart();
      router.push(`/orders/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
      setPlacing(false);
    }
  };

  // Loading auth state
  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F6ECD9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #CBD4D9",
            borderTopColor: "#EFA13B",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Empty cart
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
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "1.6rem",
              color: "#1a1a1a",
              marginBottom: "0.75rem",
            }}
          >
            Your cart is empty
          </h1>
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
              textDecoration: "none",
            }}
          >
            Browse Restaurants
          </Link>
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
            Step 2 of 2
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
            Checkout
          </h1>
        </div>

        {/* Multi-restaurant warning */}
        {multiRestaurant && (
          <div
            style={{
              background: "rgba(239,161,59,0.12)",
              border: "1.5px solid rgba(239,161,59,0.4)",
              borderRadius: 12,
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              gap: "0.6rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠️</span>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#b8720a",
                  margin: "0 0 0.2rem",
                }}
              >
                Items from multiple restaurants
              </p>
              <p style={{ fontSize: "0.8rem", color: "#8E9CA3", margin: 0 }}>
                Orders can only be placed from a single restaurant at a time. Please
                go back to your cart and remove items from other restaurants.
              </p>
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr min(340px, 100%)",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Left: Order summary + auth */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Order items */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #CBD4D9",
                borderRadius: 16,
                padding: "1.5rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#1a1a1a",
                  margin: "0 0 1rem",
                }}
              >
                Order Items
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "#1a1a1a",
                          fontWeight: 500,
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#8E9CA3" }}>
                        {item.restaurantName} ·{" "}
                        <span style={{ fontFamily: "var(--font-space-mono)" }}>
                          x{item.quantity}
                        </span>
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#1a1a1a",
                        flexShrink: 0,
                      }}
                    >
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth status */}
            {!session?.user ? (
              <div
                style={{
                  background: "#fff",
                  border: "1.5px solid #CBD4D9",
                  borderRadius: 16,
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔐</div>
                <h3
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#1a1a1a",
                    marginBottom: "0.5rem",
                  }}
                >
                  Login to checkout
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#8E9CA3",
                    marginBottom: "1.25rem",
                    lineHeight: 1.55,
                  }}
                >
                  You need to be signed in to place an order and earn Karo Points.
                </p>
                <Link
                  href="/auth/login?callbackUrl=/checkout"
                  style={{
                    display: "inline-block",
                    padding: "0.7rem 1.75rem",
                    background: "#C8472E",
                    color: "#fff",
                    borderRadius: 10,
                    fontFamily: "var(--font-bricolage)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                  }}
                >
                  Login to Checkout →
                </Link>
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(82,112,79,0.07)",
                  border: "1.5px solid rgba(82,112,79,0.25)",
                  borderRadius: 14,
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#52704F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "1rem",
                  }}
                >
                  ✓
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#52704F",
                    }}
                  >
                    Signed in as {session.user.name ?? session.user.email}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#8E9CA3" }}>
                    {session.user.tier} tier ·{" "}
                    <span style={{ fontFamily: "var(--font-space-mono)" }}>
                      {session.user.karoPoints}
                    </span>{" "}
                    Karo Points
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Payment summary */}
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
              Payment Summary
            </h2>

            {/* Subtotal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                color: "#555",
                marginBottom: "0.75rem",
              }}
            >
              <span>
                Subtotal (
                <span style={{ fontFamily: "var(--font-space-mono)" }}>
                  {items.length}
                </span>{" "}
                items)
              </span>
              <span style={{ fontFamily: "var(--font-space-mono)", fontWeight: 700, color: "#1a1a1a" }}>
                ₹{subtotal}
              </span>
            </div>

            {/* BYOT toggle */}
            <div
              style={{
                background: byot ? "rgba(82,112,79,0.08)" : "rgba(239,161,59,0.08)",
                border: `1.5px solid ${byot ? "rgba(82,112,79,0.35)" : "rgba(239,161,59,0.35)"}`,
                borderRadius: 12,
                padding: "0.85rem 1rem",
                marginBottom: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => setByot((b) => !b)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>🫙</span>
                  <span
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: byot ? "#52704F" : "#b8720a",
                    }}
                  >
                    Bring Your Own Tiffin
                  </span>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 20,
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
                      top: 2,
                      left: byot ? 18 : 2,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#8E9CA3", margin: "0.3rem 0 0" }}>
                Save ₹15 + earn bonus Karo Points
              </p>
            </div>

            {byot && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                  color: "#52704F",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                }}
              >
                <span>BYOT discount</span>
                <span style={{ fontFamily: "var(--font-space-mono)" }}>−₹15</span>
              </div>
            )}

            <div style={{ borderTop: "1px solid #CBD4D9", margin: "0.75rem 0 1rem" }} />

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

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(200,71,46,0.08)",
                  border: "1px solid rgba(200,71,46,0.3)",
                  borderRadius: 8,
                  padding: "0.6rem 0.75rem",
                  fontSize: "0.8rem",
                  color: "#C8472E",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            {/* Place order button */}
            {session?.user ? (
              <button
                onClick={handlePlaceOrder}
                disabled={placing || multiRestaurant}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  background:
                    placing || multiRestaurant ? "#CBD4D9" : "#C8472E",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: placing || multiRestaurant ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {placing ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Placing Order...
                  </>
                ) : (
                  "Place Order →"
                )}
              </button>
            ) : (
              <Link
                href="/auth/login?callbackUrl=/checkout"
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
                }}
              >
                Login to Place Order →
              </Link>
            )}

            <Link
              href="/cart"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "0.75rem",
                fontSize: "0.85rem",
                color: "#8E9CA3",
                textDecoration: "none",
              }}
            >
              ← Back to cart
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}
