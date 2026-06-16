"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface VendorData {
  restaurant: {
    id: string;
    name: string;
    description: string;
    commissionRate: number;
    menuItems: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      moodTags: string;
      recipeId: string | null;
    }>;
    orders: Array<{
      id: string;
      total: number;
      status: string;
      byot: boolean;
      createdAt: string;
      user: { name: string };
    }>;
  } | null;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  moodTags: string;
  status: string;
  userId: string;
}

const MOODS = ["Stressed", "Heartbroken", "Celebrating", "Lazy Sunday", "Homesick", "Adventurous"];

export default function VendorPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<VendorData | null>(null);
  const [pendingRecipes, setPendingRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: "",
    moodTags: [] as string[],
  });
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState<"menu" | "orders" | "recipes">("menu");

  useEffect(() => {
    if (session) fetchData();
    else if (status !== "loading") setLoading(false);
  }, [session, status]);

  async function fetchData() {
    const [vendorRes, recipesRes] = await Promise.all([
      fetch("/api/vendor"),
      fetch("/api/recipes"),
    ]);
    const vendorData = await vendorRes.json();
    const recipesData = await recipesRes.json();
    setData(vendorData);
    setPendingRecipes((recipesData.recipes || []).filter((r: Recipe) => r.status === "pending"));
    setLoading(false);
  }

  async function addMenuItem(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    await fetch("/api/vendor/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: menuForm.name,
        description: menuForm.description,
        price: parseFloat(menuForm.price),
        moodTags: menuForm.moodTags.join(","),
      }),
    });
    setMenuForm({ name: "", description: "", price: "", moodTags: [] });
    setShowAddMenu(false);
    setAdding(false);
    fetchData();
  }

  async function approveRecipe(id: string) {
    await fetch(`/api/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    fetchData();
  }

  function toggleMood(mood: string) {
    setMenuForm((f) => ({
      ...f,
      moodTags: f.moodTags.includes(mood)
        ? f.moodTags.filter((m) => m !== mood)
        : [...f.moodTags, mood],
    }));
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F6ECD9" }}>
      <div style={{ color: "#8E9CA3" }}>Loading...</div>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F6ECD9" }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-bricolage)" }}>
          Vendor login required
        </h2>
        <Link href="/auth/login?callbackUrl=/vendor" className="px-6 py-3 rounded-full font-semibold" style={{ background: "#C8472E", color: "#fff" }}>
          Login
        </Link>
      </div>
    </div>
  );

  if (session.user?.role !== "vendor") return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F6ECD9" }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>
          Vendor access only
        </h2>
        <Link href="/" className="text-sm mt-3 inline-block" style={{ color: "#C8472E" }}>← Go home</Link>
      </div>
    </div>
  );

  const restaurant = data?.restaurant;
  const totalRevenue = restaurant?.orders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0) || 0;
  const commission = totalRevenue * (restaurant?.commissionRate || 0.12);
  const netRevenue = totalRevenue - commission;

  return (
    <div className="min-h-screen py-8" style={{ background: "#F6ECD9" }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="rounded-3xl p-8 mb-8" style={{ background: "#1a1a1a" }}>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-bricolage)" }}>
            {restaurant?.name || "Vendor Dashboard"}
          </h1>
          <p style={{ color: "#8E9CA3" }}>{restaurant?.description}</p>

          <div className="grid grid-cols-3 gap-6 mt-6">
            {[
              { label: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, color: "#EFA13B" },
              {
                label: `Commission (${((restaurant?.commissionRate || 0.12) * 100).toFixed(0)}% vs 30% industry)`,
                value: `₹${commission.toFixed(0)}`,
                color: "#C8472E",
              },
              { label: "Net Earnings", value: `₹${netRevenue.toFixed(0)}`, color: "#52704F" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xs mb-1" style={{ color: "#8E9CA3" }}>{stat.label}</div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-space-mono)", color: stat.color }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["menu", "orders", "recipes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all"
              style={{
                background: tab === t ? "#C8472E" : "#CBD4D922",
                color: tab === t ? "#fff" : "#555",
              }}
            >
              {t}
              {t === "recipes" && pendingRecipes.length > 0 && (
                <span
                  className="ml-2 px-1.5 py-0.5 rounded-full text-xs"
                  style={{ background: "#EFA13B", color: "#fff" }}
                >
                  {pendingRecipes.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Menu Tab */}
        {tab === "menu" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>
                Menu Items ({restaurant?.menuItems.length || 0})
              </h2>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: "#C8472E", color: "#fff" }}
              >
                + Add Item
              </button>
            </div>

            {showAddMenu && (
              <form
                onSubmit={addMenuItem}
                className="rounded-2xl p-6 mb-6"
                style={{ background: "#fff", border: "2px solid #C8472E33" }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-bricolage)" }}>
                  New Menu Item
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Item name"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm((f) => ({ ...f, name: e.target.value }))}
                    className="px-4 py-3 rounded-xl border text-sm"
                    style={{ borderColor: "#CBD4D9", background: "#F6ECD9" }}
                  />
                  <input
                    required
                    type="number"
                    placeholder="Price (₹)"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm((f) => ({ ...f, price: e.target.value }))}
                    className="px-4 py-3 rounded-xl border text-sm"
                    style={{ borderColor: "#CBD4D9", background: "#F6ECD9" }}
                  />
                  <textarea
                    required
                    placeholder="Description"
                    value={menuForm.description}
                    onChange={(e) => setMenuForm((f) => ({ ...f, description: e.target.value }))}
                    className="px-4 py-3 rounded-xl border text-sm md:col-span-2 resize-none"
                    rows={2}
                    style={{ borderColor: "#CBD4D9", background: "#F6ECD9" }}
                  />
                  <div className="md:col-span-2">
                    <div className="text-sm font-semibold mb-2">Mood Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleMood(m)}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: menuForm.moodTags.includes(m) ? "#EFA13B" : "#EFA13B22",
                            color: menuForm.moodTags.includes(m) ? "#fff" : "#EFA13B",
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={adding}
                    className="px-6 py-2 rounded-xl font-semibold text-sm"
                    style={{ background: "#C8472E", color: "#fff" }}
                  >
                    {adding ? "Adding..." : "Add to Menu"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMenu(false)}
                    className="px-6 py-2 rounded-xl font-semibold text-sm border"
                    style={{ borderColor: "#CBD4D9", color: "#8E9CA3" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurant?.menuItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl p-4"
                  style={{ background: "#fff", border: "1px solid #CBD4D9" }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold" style={{ fontFamily: "var(--font-bricolage)" }}>
                      {item.name}
                    </h3>
                    <span className="font-bold" style={{ fontFamily: "var(--font-space-mono)", color: "#EFA13B" }}>
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: "#555" }}>{item.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.moodTags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: "#EFA13B22", color: "#EFA13B" }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  {item.recipeId && (
                    <div className="mt-2 text-xs font-semibold" style={{ color: "#7A4566" }}>
                      👑 Recipe Royalty active
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-bricolage)" }}>
              Orders ({restaurant?.orders.length || 0})
            </h2>
            <div className="space-y-3">
              {restaurant?.orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl p-4 flex items-center justify-between"
                  style={{ background: "#fff", border: "1px solid #CBD4D9" }}
                >
                  <div>
                    <div className="flex gap-3 items-center">
                      <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "#8E9CA3" }}>
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="font-semibold text-sm">{order.user?.name}</span>
                      {order.byot && <span className="text-xs" style={{ color: "#52704F" }}>🫙 BYOT</span>}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#8E9CA3" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ fontFamily: "var(--font-space-mono)", color: "#1a1a1a" }}>
                      ₹{order.total.toFixed(0)}
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: "#EFA13B22",
                        color: "#EFA13B",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {!restaurant?.orders.length && (
                <div className="text-center py-8" style={{ color: "#8E9CA3" }}>No orders yet.</div>
              )}
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {tab === "recipes" && (
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-bricolage)" }}>
              Pending Recipe Submissions ({pendingRecipes.length})
            </h2>
            {pendingRecipes.length === 0 ? (
              <div className="text-center py-8" style={{ color: "#8E9CA3" }}>
                No pending recipes to review.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRecipes.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl p-5"
                    style={{ background: "#fff", border: "2px solid #7A456633" }}
                  >
                    <h3 className="font-bold mb-1" style={{ fontFamily: "var(--font-bricolage)", color: "#7A4566" }}>
                      {r.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: "#555" }}>{r.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {r.moodTags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: "#7A456622", color: "#7A4566" }}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => approveRecipe(r.id)}
                      className="px-5 py-2 rounded-full text-sm font-semibold"
                      style={{ background: "#52704F", color: "#fff" }}
                    >
                      ✓ Approve & add to menu
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
