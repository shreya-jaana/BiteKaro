"use client";

import { useState } from "react";
import { MoodPicker } from "@/components/MoodPicker";
import { MenuItemCard } from "@/components/MenuItemCard";

const MOOD_EMOJIS: Record<string, string> = {
  Stressed: "😤",
  Heartbroken: "💔",
  Celebrating: "🎉",
  "Lazy Sunday": "😴",
  Homesick: "🏠",
  Adventurous: "🧭",
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  moodTags: string;
  restaurantId: string;
  recipeId: string | null;
  restaurant: { id: string; name: string };
}

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [results, setResults] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSelect = async (mood: string) => {
    setSelectedMood(mood);
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/mood?mood=${encodeURIComponent(mood)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F6ECD9" }}>
      {/* Hero */}
      <section
        style={{
          padding: "3rem 1.5rem 2rem",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(239,161,59,0.15)",
              color: "#EFA13B",
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.3rem 0.9rem",
              borderRadius: 999,
              marginBottom: "1rem",
            }}
          >
            Mood-Based Food
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1a1a1a",
              margin: "0 0 0.75rem",
              lineHeight: 1.15,
            }}
          >
            {selectedMood ? (
              <>
                <span style={{ fontSize: "1.1em" }}>
                  {MOOD_EMOJIS[selectedMood] ?? "🍽️"}
                </span>{" "}
                Food for{" "}
                <span style={{ color: "#C8472E" }}>{selectedMood}</span>
              </>
            ) : (
              <>
                {"What's your "}
                <span style={{ color: "#EFA13B" }}>vibe</span> today?
              </>
            )}
          </h1>
          <p
            style={{
              color: "#8E9CA3",
              fontSize: "1.05rem",
              maxWidth: 540,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Tell us how you feel and we&apos;ll find the dishes that match your
            mood.
          </p>
        </div>

        {/* Mood Picker */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #CBD4D9",
            borderRadius: 18,
            padding: "1.75rem 2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <MoodPicker selected={selectedMood} onSelect={handleSelect} />
        </div>
      </section>

      {/* Results */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 0",
              color: "#8E9CA3",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #CBD4D9",
                borderTopColor: "#EFA13B",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p
              style={{
                fontFamily: "var(--font-bricolage)",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Finding food for your mood...
            </p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "#8E9CA3",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😔</div>
            <h2
              style={{
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "#1a1a1a",
                marginBottom: "0.5rem",
              }}
            >
              No dishes found for this mood yet
            </h2>
            <p style={{ fontSize: "0.9rem" }}>
              Try another mood or check back later as vendors add more dishes.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {results.length} dish{results.length !== 1 ? "es" : ""} for{" "}
                <span style={{ color: "#C8472E" }}>{selectedMood}</span>{" "}
                {MOOD_EMOJIS[selectedMood ?? ""] ?? ""}
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
                gap: "1rem",
              }}
            >
              {results.map((item) => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  moodTags={item.moodTags}
                  restaurantId={item.restaurantId}
                  restaurantName={item.restaurant?.name ?? ""}
                  recipeId={item.recipeId}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
