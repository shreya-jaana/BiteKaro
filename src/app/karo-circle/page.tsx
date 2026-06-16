"use client";

import { TiffinsStack } from "@/components/TiffinsStack";
import { getTier, TIER_THRESHOLDS } from "@/lib/tiers";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Tier = "Sprout" | "Bloom" | "Harvest" | "Legacy";

interface LoyaltyTransaction {
  id: string;
  createdAt: string;
  points: number;
  type: string;
  orderId: string | null;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  karoPoints: number;
  tier: string;
  byotCount: number;
  loyaltyTransactions: LoyaltyTransaction[];
}

const TIER_PERKS: Record<Tier, { emoji: string; color: string; perks: string[] }> = {
  Sprout: {
    emoji: "🌱",
    color: "#8E9CA3",
    perks: ["1× points on every order", "BYOT = +10 bonus points", "Access to mood-based ordering"],
  },
  Bloom: {
    emoji: "🌸",
    color: "#EFA13B",
    perks: ["1.25× points on every order", "BYOT = +20 bonus points", "Priority customer support"],
  },
  Harvest: {
    emoji: "🌾",
    color: "#52704F",
    perks: [
      "1.5× points on every order",
      "BYOT = +30 bonus points",
      "Free delivery on orders over ₹300",
    ],
  },
  Legacy: {
    emoji: "🏆",
    color: "#7A4566",
    perks: [
      "2× points on every order",
      "BYOT = +50 bonus points",
      "Free delivery on all orders",
      "Exclusive dishes unlocked",
    ],
  },
};

const TIER_ORDER: Tier[] = ["Sprout", "Bloom", "Harvest", "Legacy"];

function getNextTier(currentTier: Tier): Tier | null {
  const idx = TIER_ORDER.indexOf(currentTier);
  if (idx < TIER_ORDER.length - 1) return TIER_ORDER[idx + 1];
  return null;
}

function getNextTierThreshold(nextTier: Tier): number {
  const threshold = TIER_THRESHOLDS.find((t) => t.tier === nextTier);
  return threshold?.min ?? Infinity;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function KaroCirclePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) setProfile(data);
        else setFetchError(data.error || "Failed to load profile.");
      })
      .catch(() => setFetchError("Network error."))
      .finally(() => setLoading(false));
  }, [status]);

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
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🌱</div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "#1a1a1a",
              marginBottom: "0.75rem",
            }}
          >
            Join the Karo Circle
          </h1>
          <p
            style={{
              color: "#8E9CA3",
              lineHeight: 1.65,
              marginBottom: "1.75rem",
              fontSize: "0.95rem",
            }}
          >
            Earn Karo Points with every order, climb from Sprout to Legacy tier, and unlock
            exclusive perks like BYOT bonuses and free delivery.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/auth/login?callbackUrl=/karo-circle"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "#C8472E",
                color: "#fff",
                borderRadius: 10,
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign in →
            </Link>
            <Link
              href="/auth/signup"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                background: "transparent",
                color: "#C8472E",
                border: "2px solid #C8472E",
                borderRadius: 10,
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
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
        <div style={{ textAlign: "center", color: "#C8472E" }}>{fetchError}</div>
      </div>
    );
  }

  if (!profile) return null;

  const currentTier = getTier(profile.karoPoints) as Tier;
  const tierPerks = TIER_PERKS[currentTier];
  const nextTier = getNextTier(currentTier);
  const nextThreshold = nextTier ? getNextTierThreshold(nextTier) : Infinity;
  const currentThresholdData = TIER_THRESHOLDS.find((t) => t.tier === currentTier);
  const tierMin = currentThresholdData?.min ?? 0;
  const progressPct =
    nextTier && isFinite(nextThreshold)
      ? Math.min(
          100,
          Math.round(
            ((profile.karoPoints - tierMin) / (nextThreshold - tierMin)) * 100
          )
        )
      : 100;
  const pointsToNext =
    nextTier && isFinite(nextThreshold)
      ? Math.max(0, nextThreshold - profile.karoPoints)
      : 0;

  const nextTierPerks = nextTier ? TIER_PERKS[nextTier] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F6ECD9" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(239,161,59,0.15)",
              color: "#b8720a",
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
            Loyalty Program
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#1a1a1a",
              margin: "0 0 0.4rem",
            }}
          >
            Karo Circle
          </h1>
          <p style={{ color: "#8E9CA3", fontSize: "0.95rem", margin: 0 }}>
            Hey {profile.name?.split(" ")[0] ?? "there"} — keep ordering and climbing the tiers!
          </p>
        </div>

        {/* Big points display + tier badge */}
        <div
          style={{
            background: "#1a1a1a",
            color: "#F6ECD9",
            borderRadius: 20,
            padding: "2rem 2.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#8E9CA3",
                fontFamily: "var(--font-space-mono)",
                letterSpacing: "0.08em",
                marginBottom: "0.35rem",
                textTransform: "uppercase",
              }}
            >
              Karo Points
            </div>
            <div
              style={{
                fontFamily: "var(--font-space-mono)",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                color: "#EFA13B",
                lineHeight: 1,
              }}
            >
              {profile.karoPoints.toLocaleString("en-IN")}
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#CBD4D9",
                marginTop: "0.5rem",
              }}
            >
              🫙 You&apos;ve brought your own tiffin{" "}
              <span style={{ fontFamily: "var(--font-space-mono)", fontWeight: 700 }}>
                {profile.byotCount ?? 0}
              </span>{" "}
              time{(profile.byotCount ?? 0) !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Tier badge */}
          <div
            style={{
              background: `${tierPerks.color}22`,
              border: `2px solid ${tierPerks.color}`,
              borderRadius: 16,
              padding: "1rem 1.5rem",
              textAlign: "center",
              minWidth: 130,
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{tierPerks.emoji}</div>
            <div
              style={{
                fontFamily: "var(--font-bricolage)",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: tierPerks.color,
              }}
            >
              {currentTier}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#8E9CA3",
                fontFamily: "var(--font-space-mono)",
                marginTop: "0.2rem",
              }}
            >
              CURRENT TIER
            </div>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #CBD4D9",
              borderRadius: 16,
              padding: "1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                Progress to {nextTierPerks?.emoji} {nextTier}
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.8rem",
                  color: "#8E9CA3",
                }}
              >
                {pointsToNext.toLocaleString("en-IN")} pts to go
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: 10,
                background: "#F6ECD9",
                borderRadius: 999,
                overflow: "hidden",
                marginBottom: "0.6rem",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "#EFA13B",
                  borderRadius: 999,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "#8E9CA3",
                fontFamily: "var(--font-space-mono)",
              }}
            >
              <span>{profile.karoPoints.toLocaleString("en-IN")} pts</span>
              <span>{nextThreshold.toLocaleString("en-IN")} pts</span>
            </div>

            {/* Next tier perks */}
            {nextTierPerks && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.85rem 1rem",
                  background: `${nextTierPerks.color}0d`,
                  border: `1px solid ${nextTierPerks.color}30`,
                  borderRadius: 10,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: nextTierPerks.color,
                    margin: "0 0 0.4rem",
                  }}
                >
                  {nextTierPerks.emoji} {nextTier} perks you&apos;ll unlock:
                </p>
                <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
                  {nextTierPerks.perks.map((perk) => (
                    <li
                      key={perk}
                      style={{
                        fontSize: "0.8rem",
                        color: "#555",
                        marginBottom: "0.2rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tiffin stack */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #CBD4D9",
            borderRadius: 16,
            padding: "2rem",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#1a1a1a",
              margin: "0 0 1.75rem",
            }}
          >
            Your Tiffin Journey
          </h3>
          <TiffinsStack currentTier={currentTier} points={profile.karoPoints} />
        </div>

        {/* Current tier perks */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #CBD4D9",
            borderRadius: 16,
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#1a1a1a",
              margin: "0 0 1rem",
            }}
          >
            {tierPerks.emoji} Your {currentTier} Perks
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {tierPerks.perks.map((perk) => (
              <div
                key={perk}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  background: "#F6ECD9",
                  borderRadius: 10,
                  border: `1px solid ${tierPerks.color}22`,
                }}
              >
                <span style={{ color: tierPerks.color, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "0.85rem", color: "#333", lineHeight: 1.45 }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #CBD4D9",
            borderRadius: 16,
            padding: "1.5rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#1a1a1a",
              margin: "0 0 1.1rem",
            }}
          >
            Points History
          </h3>

          {profile.loyaltyTransactions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 0",
                color: "#8E9CA3",
                fontSize: "0.9rem",
              }}
            >
              No transactions yet.{" "}
              <Link href="/restaurants" style={{ color: "#EFA13B", fontWeight: 600, textDecoration: "none" }}>
                Place an order →
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Date", "Type", "Points"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.5rem 0.75rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#8E9CA3",
                          fontFamily: "var(--font-space-mono)",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          borderBottom: "1px solid #CBD4D9",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profile.loyaltyTransactions.map((tx, idx) => (
                    <tr key={tx.id} style={{ background: idx % 2 === 0 ? "#fff" : "#faf9f7" }}>
                      <td
                        style={{
                          padding: "0.65rem 0.75rem",
                          fontSize: "0.82rem",
                          color: "#555",
                          fontFamily: "var(--font-space-mono)",
                          borderBottom: "1px solid #F6ECD9",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(tx.createdAt)}
                      </td>
                      <td
                        style={{
                          padding: "0.65rem 0.75rem",
                          borderBottom: "1px solid #F6ECD9",
                        }}
                      >
                        <span
                          style={{
                            padding: "0.2rem 0.6rem",
                            borderRadius: 999,
                            background:
                              tx.type === "earn"
                                ? "rgba(82,112,79,0.1)"
                                : "rgba(200,71,46,0.1)",
                            color: tx.type === "earn" ? "#52704F" : "#C8472E",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            fontFamily: "var(--font-bricolage)",
                          }}
                        >
                          {tx.type === "earn" ? "Earned" : "Redeemed"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.65rem 0.75rem",
                          fontFamily: "var(--font-space-mono)",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: tx.type === "earn" ? "#52704F" : "#C8472E",
                          borderBottom: "1px solid #F6ECD9",
                        }}
                      >
                        {tx.type === "earn" ? "+" : "−"}
                        {Math.abs(tx.points)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
