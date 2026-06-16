"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

const MOCK_DELIVERIES = [
  {
    id: "del-001",
    restaurant: "Dabbawala Kitchen",
    customer: "Priya Sharma",
    address: "14B, Andheri West, Mumbai 400058",
    items: "Thali Special × 1, Aloo Paratha × 2",
    total: 600,
    distance: "2.4 km",
    earning: "₹48",
    status: "available",
  },
  {
    id: "del-002",
    restaurant: "Spice Route",
    customer: "Rahul Verma",
    address: "3rd Floor, Koramangala Block 5, Bangalore 560095",
    items: "Hyderabadi Biryani × 1, Filter Coffee × 2",
    total: 440,
    distance: "1.8 km",
    earning: "₹36",
    status: "available",
  },
  {
    id: "del-003",
    restaurant: "Green Leaf Bistro",
    customer: "Neha Joshi",
    address: "Flat 201, Banjara Hills Road 12, Hyderabad 500034",
    items: "Buddha Bowl × 2, Mango Lassi × 1",
    total: 660,
    distance: "3.1 km",
    earning: "₹52",
    status: "available",
  },
];

export default function RiderPage() {
  const { data: session, status } = useSession();
  const [accepted, setAccepted] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F6ECD9" }}>
      <div style={{ color: "#8E9CA3" }}>Loading...</div>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen" style={{ background: "#F6ECD9" }}>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🛵</div>
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}>
            Ride with BiteKaro
          </h1>
          <p className="text-lg" style={{ color: "#8E9CA3" }}>
            Join our rider network. Flexible hours, fair pay, and the satisfaction of
            getting good food to good people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "💰", title: "Earn More", desc: "Keep 88% of delivery earnings. Industry-leading rates." },
            { icon: "⏰", title: "Flex Hours", desc: "Log in when you want. No minimum hours required." },
            { icon: "🫙", title: "BYOT Bonus", desc: "Extra bonus when customers bring their own tiffins." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-5 text-center"
              style={{ background: "#EFA13B18", border: "2px solid #EFA13B33" }}
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-bold mb-1" style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}>
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: "#555" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/auth/signup?role=rider"
            className="px-8 py-4 rounded-full text-lg font-semibold"
            style={{ background: "#EFA13B", color: "#1a1a1a", fontFamily: "var(--font-bricolage)" }}
          >
            Sign up as a Rider →
          </Link>
          <div className="mt-3">
            <Link href="/auth/login?callbackUrl=/rider" className="text-sm" style={{ color: "#8E9CA3" }}>
              Already registered? Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (session.user?.role !== "rider") return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F6ECD9" }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>
          Rider access only
        </h2>
        <Link href="/" className="text-sm mt-3 inline-block" style={{ color: "#C8472E" }}>← Go home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8" style={{ background: "#F6ECD9" }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl p-8 mb-8" style={{ background: "#1a1a1a" }}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🛵</div>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
                Welcome, {session.user?.name}
              </h1>
              <p style={{ color: "#8E9CA3" }}>Available deliveries in your area</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div>
              <div className="text-xs mb-1" style={{ color: "#8E9CA3" }}>Today&apos;s Deliveries</div>
              <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-mono)", color: "#EFA13B" }}>
                {accepted ? 1 : 0}
              </div>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "#8E9CA3" }}>Today&apos;s Earnings</div>
              <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-mono)", color: "#52704F" }}>
                {accepted ? deliveries.find((d) => d.id === accepted)?.earning || "₹0" : "₹0"}
              </div>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "#8E9CA3" }}>Status</div>
              <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-mono)", color: accepted ? "#EFA13B" : "#52704F" }}>
                {accepted ? "On delivery" : "Online"}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-bricolage)" }}>
          Available Deliveries
        </h2>

        {accepted && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: "#52704F22", border: "2px solid #52704F" }}
          >
            <div className="flex items-center gap-2 font-semibold" style={{ color: "#52704F" }}>
              <span>✅</span>
              <span>
                You&apos;ve accepted the delivery from{" "}
                {deliveries.find((d) => d.id === accepted)?.restaurant}.
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: "#555" }}>
              Pick up the order and deliver to {deliveries.find((d) => d.id === accepted)?.address}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {deliveries
            .filter((d) => d.id !== accepted)
            .map((delivery) => (
              <div
                key={delivery.id}
                className="rounded-2xl p-5"
                style={{ background: "#fff", border: "1px solid #CBD4D9" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold" style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}>
                      {delivery.restaurant}
                    </h3>
                    <div className="text-sm mt-1" style={{ color: "#555" }}>{delivery.items}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ fontFamily: "var(--font-space-mono)", color: "#52704F" }}>
                      {delivery.earning}
                    </div>
                    <div className="text-xs" style={{ color: "#8E9CA3" }}>{delivery.distance}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm" style={{ color: "#8E9CA3" }}>
                    📍 {delivery.address}
                  </div>
                  <button
                    onClick={() => setAccepted(delivery.id)}
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: "#EFA13B", color: "#1a1a1a" }}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          {deliveries.filter((d) => d.id !== accepted).length === 0 && (
            <div className="text-center py-8" style={{ color: "#8E9CA3" }}>
              No more deliveries available right now. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
