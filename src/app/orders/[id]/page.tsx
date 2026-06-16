"use client";

import { OrderStatusTracker } from "@/components/OrderStatusTracker";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

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

function parseItems(itemsStr: string): OrderItem[] {
  try {
    return JSON.parse(itemsStr);
  } catch {
    return [];
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/orders/${orderId}`);
      return;
    }
    if (status !== "authenticated") return;

    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) setOrder(data);
        else setFetchError(data.error || "Order not found.");
      })
      .catch(() => setFetchError("Network error."))
      .finally(() => setLoading(false));
  }, [status, orderId, router]);

  if (status === "loading" || loading) {
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

  if (fetchError) {
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
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
          <h2
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
            }}
          >
            {fetchError}
          </h2>
          <Link
            href="/orders"
            style={{
              color: "#C8472E",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            ← Back to orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const items = parseItems(order.items);
  const subtotalFromItems = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F6ECD9" }}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        {/* Back link */}
        <Link
          href="/orders"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            color: "#8E9CA3",
            fontSize: "0.85rem",
            textDecoration: "none",
            marginBottom: "1.5rem",
            fontWeight: 500,
          }}
        >
          ← All orders
        </Link>

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
              marginBottom: "0.75rem",
            }}
          >
            Order Detail
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              color: "#1a1a1a",
              margin: "0 0 0.3rem",
            }}
          >
            Order{" "}
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "0.9em" }}>
              #{order.id.slice(0, 8)}
            </span>
          </h1>
          <p style={{ color: "#8E9CA3", fontSize: "0.875rem", margin: 0 }}>
            {formatDate(order.createdAt)} · {order.restaurant.name}
          </p>
        </div>

        {/* Status tracker */}
        <div style={{ marginBottom: "1.75rem" }}>
          <OrderStatusTracker orderId={order.id} initialStatus={order.status} />
        </div>

        {/* BYOT callout */}
        {order.byot && (
          <div
            style={{
              background: "rgba(82,112,79,0.08)",
              border: "1.5px solid rgba(82,112,79,0.3)",
              borderRadius: 14,
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🫙</span>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#52704F",
                  margin: "0 0 0.2rem",
                }}
              >
                You brought your own tiffin! −₹15 + bonus points
              </p>
              <p style={{ fontSize: "0.8rem", color: "#8E9CA3", margin: 0 }}>
                Thank you for choosing the sustainable option. Keep it up!
              </p>
            </div>
          </div>
        )}

        {/* Order items */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #CBD4D9",
            borderRadius: 16,
            padding: "1.5rem",
            marginBottom: "1.25rem",
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
            Items Ordered
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {items.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem 0",
                  borderBottom: idx < items.length - 1 ? "1px solid #F6ECD9" : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#1a1a1a",
                      display: "block",
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#8E9CA3",
                      fontFamily: "var(--font-space-mono)",
                    }}
                  >
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#1a1a1a",
                  }}
                >
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            style={{
              borderTop: "1px solid #CBD4D9",
              marginTop: "1rem",
              paddingTop: "0.85rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
                color: "#555",
              }}
            >
              <span>Subtotal</span>
              <span style={{ fontFamily: "var(--font-space-mono)" }}>₹{subtotalFromItems}</span>
            </div>
            {order.byot && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                  color: "#52704F",
                  fontWeight: 600,
                }}
              >
                <span>BYOT discount</span>
                <span style={{ fontFamily: "var(--font-space-mono)" }}>−₹15</span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1a1a1a",
                marginTop: "0.2rem",
              }}
            >
              <span style={{ fontFamily: "var(--font-bricolage)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "1.1rem" }}>
                ₹{order.total}
              </span>
            </div>
          </div>
        </div>

        {/* Points earned */}
        <div
          style={{
            background: "rgba(239,161,59,0.1)",
            border: "1.5px solid rgba(239,161,59,0.35)",
            borderRadius: 14,
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#EFA13B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "1.2rem",
            }}
          >
            ⭐
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#b8720a",
              }}
            >
              You earned{" "}
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "1.05rem" }}>
                {order.pointsEarned}
              </span>{" "}
              Karo Points!
            </div>
            <div style={{ fontSize: "0.78rem", color: "#8E9CA3", marginTop: "0.15rem" }}>
              Points added to your Karo Circle account.{" "}
              <Link
                href="/karo-circle"
                style={{ color: "#EFA13B", fontWeight: 600, textDecoration: "none" }}
              >
                View circle →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
