"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  karoPoints: number;
  tier: string;
  byotCount: number;
  orders: Array<{
    id: string;
    total: number;
    byot: boolean;
    pointsEarned: number;
    status: string;
    createdAt: string;
    restaurant: { name: string };
  }>;
  recipes: Array<{
    id: string;
    title: string;
    status: string;
    ordersCount: number;
    royaltyEarned: number;
    royaltyPerOrder: number;
  }>;
  loyaltyTransactions: Array<{
    id: string;
    points: number;
    type: string;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  Placed: "#8E9CA3",
  Preparing: "#EFA13B",
  "Out for Delivery": "#52704F",
  Delivered: "#C8472E",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((d) => {
          setProfile(d.user);
          setLoading(false);
        });
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F6ECD9" }}>
        <div style={{ color: "#8E9CA3" }}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F6ECD9" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-bricolage)" }}>
            Please login to view your profile
          </h2>
          <Link
            href="/auth/login?callbackUrl=/profile"
            className="px-6 py-3 rounded-full font-semibold"
            style={{ background: "#C8472E", color: "#fff" }}
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const totalRoyalties = profile?.recipes.reduce((sum, r) => sum + r.royaltyEarned, 0) || 0;

  return (
    <div className="min-h-screen py-8" style={{ background: "#F6ECD9" }}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="rounded-3xl p-8 mb-8" style={{ background: "#1a1a1a" }}>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: "#C8472E", color: "#fff" }}
            >
              {profile?.name[0] || "?"}
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                {profile?.name}
              </h1>
              <div className="text-sm" style={{ color: "#8E9CA3" }}>{profile?.email}</div>
              <div
                className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                style={{ background: "#EFA13B22", color: "#EFA13B" }}
              >
                {profile?.role}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Karo Points",
              value: profile?.karoPoints || 0,
              unit: "pts",
              color: "#EFA13B",
              icon: "⭕",
            },
            {
              label: "Tier",
              value: profile?.tier || "Sprout",
              unit: "",
              color: "#52704F",
              icon: "🫙",
            },
            {
              label: "BYOT Count",
              value: profile?.byotCount || 0,
              unit: "tiffins",
              color: "#C8472E",
              icon: "♻️",
            },
            {
              label: "Royalties Earned",
              value: `₹${totalRoyalties.toFixed(0)}`,
              unit: "",
              color: "#7A4566",
              icon: "👑",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-center"
              style={{ background: stat.color + "18", border: `2px solid ${stat.color}33` }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-space-mono)", color: stat.color }}
              >
                {stat.value}
              </div>
              {stat.unit && (
                <div className="text-xs" style={{ color: "#8E9CA3" }}>
                  {stat.unit}
                </div>
              )}
              <div className="text-xs font-semibold mt-1" style={{ color: "#555" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex gap-3 flex-wrap mb-8">
          <Link
            href="/karo-circle"
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: "#52704F22", color: "#52704F" }}
          >
            View Karo Circle →
          </Link>
          <Link
            href="/orders"
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: "#EFA13B22", color: "#EFA13B" }}
          >
            Order History →
          </Link>
          {profile?.role === "vendor" && (
            <Link
              href="/vendor"
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: "#C8472E22", color: "#C8472E" }}
            >
              Vendor Dashboard →
            </Link>
          )}
          {profile?.role === "rider" && (
            <Link
              href="/rider"
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: "#7A456622", color: "#7A4566" }}
            >
              Rider Dashboard →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order History */}
          <div>
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
            >
              Order History
            </h2>
            {!profile?.orders.length ? (
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "#fff", border: "1px solid #CBD4D9" }}
              >
                <div className="text-3xl mb-2">🍽️</div>
                <p style={{ color: "#8E9CA3" }}>No orders yet.</p>
                <Link
                  href="/restaurants"
                  className="text-sm font-semibold mt-2 inline-block"
                  style={{ color: "#EFA13B" }}
                >
                  Browse restaurants →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.orders.slice(0, 8).map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block rounded-xl p-4 hover:opacity-90 transition-opacity"
                    style={{ background: "#fff", border: "1px solid #CBD4D9" }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className="text-xs"
                        style={{ fontFamily: "var(--font-space-mono)", color: "#8E9CA3" }}
                      >
                        #{order.id.slice(0, 8)}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: (STATUS_COLORS[order.status] || "#8E9CA3") + "22",
                          color: STATUS_COLORS[order.status] || "#8E9CA3",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="font-semibold text-sm" style={{ color: "#1a1a1a" }}>
                      {order.restaurant?.name}
                    </div>
                    <div className="flex gap-3 mt-1 text-sm" style={{ color: "#8E9CA3" }}>
                      <span style={{ fontFamily: "var(--font-space-mono)" }}>₹{order.total.toFixed(0)}</span>
                      {order.byot && <span style={{ color: "#52704F" }}>🫙 BYOT</span>}
                      <span style={{ color: "#EFA13B" }}>+{order.pointsEarned}pts</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* My Recipes */}
          <div>
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
            >
              My Recipes
            </h2>
            {!profile?.recipes.length ? (
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "#fff", border: "1px solid #CBD4D9" }}
              >
                <div className="text-3xl mb-2">👑</div>
                <p style={{ color: "#8E9CA3" }}>No recipes submitted yet.</p>
                <Link
                  href="/recipe-royalty"
                  className="text-sm font-semibold mt-2 inline-block"
                  style={{ color: "#7A4566" }}
                >
                  Submit a recipe →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.recipes.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl p-4"
                    style={{ background: "#fff", border: "1px solid #CBD4D9" }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className="font-semibold text-sm"
                        style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
                      >
                        {r.title}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: r.status === "approved" ? "#52704F22" : "#EFA13B22",
                          color: r.status === "approved" ? "#52704F" : "#EFA13B",
                        }}
                      >
                        {r.status}
                      </span>
                    </div>
                    {r.status === "approved" && (
                      <div
                        className="flex gap-4 text-sm mt-2"
                        style={{ fontFamily: "var(--font-space-mono)", color: "#8E9CA3" }}
                      >
                        <span>{r.ordersCount} orders</span>
                        <span style={{ color: "#7A4566" }}>₹{r.royaltyEarned.toFixed(0)} earned</span>
                        <span>₹{r.royaltyPerOrder}/order</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
