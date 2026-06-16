"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Recipe {
  id: string;
  title: string;
  description: string;
  moodTags: string;
  ingredients: string;
  status: string;
  ordersCount: number;
  royaltyEarned: number;
  royaltyPerOrder: number;
  createdAt: string;
  userId: string;
}

const MOODS = ["Stressed", "Heartbroken", "Celebrating", "Lazy Sunday", "Homesick", "Adventurous"];

export default function RecipeRoyaltyPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    moodTags: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, [session]);

  async function fetchRecipes() {
    setLoading(true);
    const [publicRes, mineRes] = await Promise.all([
      fetch("/api/recipes"),
      session ? fetch("/api/recipes?mine=true") : Promise.resolve(null),
    ]);
    const publicData = await publicRes.json();
    setRecipes(publicData.recipes || []);
    if (mineRes) {
      const mineData = await mineRes.json();
      setMyRecipes(mineData.recipes || []);
    }
    setLoading(false);
  }

  async function submitRecipe(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        ingredients: form.ingredients,
        moodTags: form.moodTags.join(","),
      }),
    });
    if (res.ok) {
      setSuccessMsg("Recipe submitted! A vendor will review it soon. 🎉");
      setForm({ title: "", description: "", ingredients: "", moodTags: [] });
      setShowForm(false);
      fetchRecipes();
    }
    setSubmitting(false);
  }

  function toggleMood(mood: string) {
    setForm((f) => ({
      ...f,
      moodTags: f.moodTags.includes(mood)
        ? f.moodTags.filter((m) => m !== mood)
        : [...f.moodTags, mood],
    }));
  }

  return (
    <div className="min-h-screen" style={{ background: "#F6ECD9" }}>
      {/* Hero */}
      <div className="py-16 text-center px-4" style={{ background: "#7A4566" }}>
        <div className="text-6xl mb-4">👑</div>
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-bricolage)" }}
        >
          Recipe Royalty
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "#F6ECD9", opacity: 0.9 }}>
          Submit your recipe. If a vendor puts it on their menu, you earn royalties
          every time someone orders it. Your kitchen wisdom, your earnings.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { step: "01", title: "Submit", desc: "Share your recipe with mood tags and ingredients.", icon: "✍️" },
            { step: "02", title: "Get Approved", desc: "A vendor reviews and adds it to their menu.", icon: "✅" },
            { step: "03", title: "Earn Royalties", desc: "Every order earns you ₹5–₹10 in royalties.", icon: "💰" },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl p-6"
              style={{ background: "#7A456618", border: "2px solid #7A456633" }}
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <div
                className="text-xs font-bold mb-1"
                style={{ color: "#7A4566", fontFamily: "var(--font-space-mono)" }}
              >
                STEP {s.step}
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
              >
                {s.title}
              </h3>
              <p className="text-sm" style={{ color: "#555" }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl text-center font-semibold" style={{ background: "#52704F22", color: "#52704F" }}>
            {successMsg}
          </div>
        )}

        {/* Submit Recipe */}
        {session ? (
          <div className="mb-12">
            {!showForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 rounded-full text-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: "#7A4566", color: "#F6ECD9", fontFamily: "var(--font-bricolage)" }}
                >
                  + Submit Your Recipe
                </button>
              </div>
            ) : (
              <form
                onSubmit={submitRecipe}
                className="rounded-2xl p-8 max-w-2xl mx-auto"
                style={{ background: "#fff", border: "2px solid #7A456633" }}
              >
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-bricolage)", color: "#7A4566" }}
                >
                  Share Your Recipe
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Recipe Title *</label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Grandma's Dal Tadka"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: "#CBD4D9", background: "#F6ECD9" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="What makes this recipe special?"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                      style={{ borderColor: "#CBD4D9", background: "#F6ECD9" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Ingredients *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.ingredients}
                      onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
                      placeholder="List each ingredient on a new line..."
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                      style={{ borderColor: "#CBD4D9", background: "#F6ECD9" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mood Tags *</label>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => toggleMood(mood)}
                          className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                          style={{
                            background: form.moodTags.includes(mood) ? "#7A4566" : "#7A456622",
                            color: form.moodTags.includes(mood) ? "#fff" : "#7A4566",
                          }}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting || form.moodTags.length === 0}
                      className="flex-1 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: "#7A4566", color: "#fff" }}
                    >
                      {submitting ? "Submitting..." : "Submit Recipe"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 rounded-xl font-semibold border"
                      style={{ borderColor: "#CBD4D9", color: "#8E9CA3" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="text-center mb-12 p-8 rounded-2xl" style={{ background: "#7A456618" }}>
            <p className="text-lg mb-4" style={{ color: "#7A4566" }}>
              Login to submit your recipes and start earning royalties
            </p>
            <Link
              href="/auth/login?callbackUrl=/recipe-royalty"
              className="px-6 py-3 rounded-full font-semibold"
              style={{ background: "#7A4566", color: "#fff" }}
            >
              Login to Submit
            </Link>
          </div>
        )}

        {/* My Recipes */}
        {session && myRecipes.length > 0 && (
          <div className="mb-12">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
            >
              Your Recipes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRecipes.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl p-6"
                  style={{ background: "#fff", border: "2px solid #7A456633" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-lg font-bold"
                      style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
                    >
                      {r.title}
                    </h3>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: r.status === "approved" ? "#52704F22" : "#EFA13B22",
                        color: r.status === "approved" ? "#52704F" : "#EFA13B",
                      }}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "#555" }}>{r.description}</p>
                  <div className="flex gap-4 text-sm" style={{ fontFamily: "var(--font-space-mono)" }}>
                    <div>
                      <span style={{ color: "#8E9CA3" }}>Orders: </span>
                      <span className="font-bold">{r.ordersCount}</span>
                    </div>
                    <div>
                      <span style={{ color: "#8E9CA3" }}>Earned: </span>
                      <span className="font-bold" style={{ color: "#52704F" }}>₹{r.royaltyEarned.toFixed(0)}</span>
                    </div>
                    <div>
                      <span style={{ color: "#8E9CA3" }}>Per order: </span>
                      <span className="font-bold">₹{r.royaltyPerOrder}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Recipes */}
        <div>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
          >
            Community Recipes on Menus
          </h2>
          {loading ? (
            <div className="text-center py-8" style={{ color: "#8E9CA3" }}>Loading recipes...</div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-8" style={{ color: "#8E9CA3" }}>No approved recipes yet. Be the first!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl p-6"
                  style={{ background: "#fff", border: "1px solid #CBD4D9" }}
                >
                  <div className="text-2xl mb-2">👑</div>
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
                  >
                    {r.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: "#555" }}>{r.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.moodTags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: "#EFA13B22", color: "#EFA13B" }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <div
                    className="text-xs pt-3"
                    style={{ borderTop: "1px solid #F0E8D9", color: "#8E9CA3", fontFamily: "var(--font-space-mono)" }}
                  >
                    {r.ordersCount} orders · ₹{r.royaltyPerOrder}/order royalty
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
