"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  byot: boolean;
  pointsEarned: number;
  items: string; // JSON string
  restaurant: { id: string; name: string };
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Placed: {
    bg: "rgba(203,212,217,0.3)",
    text: "#5c6e78",
    border: "rgba(142,156,163,0.4)",
    label: "Placed",
  },
  pending: {
    bg: "rgba(203,212,217,0.3)",
    text: "#5c6e78",
    border: "rgba(142,156,163,0.4)",
    label: "Placed",
  },
  Preparing: {
    bg: "rgba(239,161,59,0.12)",
    text: "#b8720a",
    border: "rgba(239,161,59,0.4)",
    label: "Preparing",
  },
  "Out for Delivery": {
    bg: "rgba(82,112,79,0.1)",
    text: "#52704F",
    border: "rgba(82,112,79,0.35)",
    label: "Out for Delivery",
  },
  Delivered: {
    bg: "rgba(200,71,46,0.1)",
    text: "#C8472E",
    border: "rgba(200,71,46,0.3)",
    label: "Delivered",
  },
};

function getStatusStyle(status: string) {
  return (
    STATUS_STYLES[status] ?? {
      bg: "rgba(203,212,217,0.3)",
      text: "#5c6e78",
      border: "rgba(142,156,163,0.4)",
      label: status,
    }
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseItems(itemsStr: string): { name: string; quantity: number }[] {
  try {
    return JSON.parse(itemsStr);
  } catch {
    return [];
  }
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") return;
    if (status !== "authenticated") return;

    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else setFetchError(data.error || "Failed to load orders.");
      })
      .catch(() => setFetchError("Network error."))
      .finally(() => setLoading(false));
  }, [status]);

  // Auth loading
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

  // Not logged in
  if (status === "unauthenticated") {
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
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "1.7rem",
              color: "#1a1a1a",
              marginBottom: "0.75rem",
            }}
          >
            Sign in to view orders
          </h1>
          <p
            style={{
              color: "#8E9CA3",
              marginBottom: "1.75rem",
              lineHeight: 1.6,
            }}
          >
            Track your orders, see your history, and monitor your Karo Points.
          </p>
          <Link
            href="/auth/login?callbackUrl=/orders"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              background: "#C8472E",
              color: "#fff",
              borderRadius: 10,
              fontFamily: "var(--font-bricolage)",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Sign in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F6ECD9" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
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
            My Orders
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
            Order History
          </h1>
          <p style={{ color: "#8E9CA3", marginTop: "0.4rem", fontSize: "0.9rem" }}>
            Hey {session?.user?.name?.split(" ")[0] ?? "there"}, here are all your BiteKaro orders.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#8E9CA3" }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: "3px solid #CBD4D9",
                borderTopColor: "#EFA13B",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontFamily: "var(--font-bricolage)", fontWeight: 600 }}>
              Loading orders...
            </p>
          </div>
        )}

        {/* Error */}
        {fetchError && (
          <div
            style={{
              background: "rgba(200,71,46,0.08)",
              border: "1px solid rgba(200,71,46,0.3)",
              borderRadius: 12,
              padding: "1rem 1.25rem",
              color: "#C8472E",
              fontSize: "0.9rem",
            }}
          >
            {fetchError}
          </div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#8E9CA3" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🍽️</div>
            <h2
              style={{
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "#1a1a1a",
                marginBottom: "0.5rem",
              }}
            >
              No orders yet
            </h2>
            <p style={{ marginBottom: "1.5rem" }}>
              You haven&apos;t placed any orders. Start eating!
            </p>
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
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              const parsedItems = parseItems(order.items);

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #CBD4D9",
                      borderRadius: 16,
                      padding: "1.25rem 1.5rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)";
                      el.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "1rem",
                        marginBottom: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-space-mono)",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: "#1a1a1a",
                            }}
                          >
                            #{order.id.slice(0, 8)}
                          </span>
                          {/* Status badge */}
                          <span
                            style={{
                              padding: "0.2rem 0.7rem",
                              borderRadius: 999,
                              background: statusStyle.bg,
                              color: statusStyle.text,
                              border: `1px solid ${statusStyle.border}`,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              fontFamily: "var(--font-bricolage)",
                            }}
                          >
                            {statusStyle.label}
                          </span>
                          {order.byot && (
                            <span
                              style={{
                                padding: "0.2rem 0.6rem",
                                borderRadius: 999,
                                background: "rgba(82,112,79,0.1)",
                                color: "#52704F",
                                border: "1px solid rgba(82,112,79,0.3)",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                              }}
                            >
                              🫙 BYOT
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            margin: "0.3rem 0 0",
                            fontSize: "0.78rem",
                            color: "#8E9CA3",
                            fontFamily: "var(--font-space-mono)",
                          }}
                        >
                          {formatDate(order.createdAt)} · {order.restaurant.name}
                        </p>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-space-mono)",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            color: "#1a1a1a",
                          }}
                        >
                          ₹{order.total}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#EFA13B",
                            fontWeight: 600,
                            marginTop: "0.1rem",
                          }}
                        >
                          +{order.pointsEarned} pts
                        </div>
                      </div>
                    </div>

                    {/* Items summary */}
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#555",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {parsedItems.map((it) => `${it.name} x${it.quantity}`).join(", ")}
                    </div>

                    <div
                      style={{
                        marginTop: "0.65rem",
                        fontSize: "0.78rem",
                        color: "#C8472E",
                        fontWeight: 600,
                        fontFamily: "var(--font-bricolage)",
                      }}
                    >
                      View details →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
