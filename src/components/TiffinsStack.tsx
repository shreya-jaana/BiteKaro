"use client";

type Tier = "Sprout" | "Bloom" | "Harvest" | "Legacy";

interface TiffinsStackProps {
  currentTier: Tier;
  points: number;
}

const TIERS: {
  name: Tier;
  color: string;
  dimColor: string;
  label: string;
  range: string;
  emoji: string;
}[] = [
  {
    name: "Legacy",
    color: "#7A4566",
    dimColor: "rgba(122,69,102,0.25)",
    label: "Legacy",
    range: "2000+ pts",
    emoji: "🏆",
  },
  {
    name: "Harvest",
    color: "#52704F",
    dimColor: "rgba(82,112,79,0.25)",
    label: "Harvest",
    range: "1000–1999 pts",
    emoji: "🌾",
  },
  {
    name: "Bloom",
    color: "#EFA13B",
    dimColor: "rgba(239,161,59,0.25)",
    label: "Bloom",
    range: "500–999 pts",
    emoji: "🌸",
  },
  {
    name: "Sprout",
    color: "#8E9CA3",
    dimColor: "rgba(142,156,163,0.25)",
    label: "Sprout",
    range: "0–499 pts",
    emoji: "🌱",
  },
];

const TIER_ORDER: Tier[] = ["Sprout", "Bloom", "Harvest", "Legacy"];

function tierIndex(tier: Tier): number {
  return TIER_ORDER.indexOf(tier);
}

export function TiffinsStack({ currentTier, points }: TiffinsStackProps) {
  const currentIdx = tierIndex(currentTier);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2.5rem",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* SVG Tiffin Stack */}
      <div style={{ position: "relative" }}>
        <svg
          width="120"
          height="300"
          viewBox="0 0 120 300"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`Tiffin carrier showing tier ${currentTier}`}
        >
          <defs>
            <radialGradient id="steelShine" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
            </radialGradient>
          </defs>

          {/* Handle top */}
          <path
            d="M50,18 Q60,5 70,18"
            fill="none"
            stroke="#8E9CA3"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect x="46" y="15" width="28" height="6" rx="3" fill="#CBD4D9" />

          {/* Latch rod */}
          <rect x="56" y="21" width="8" height="220" rx="4" fill="#CBD4D9" opacity="0.6" />

          {/* Tiers rendered top-to-bottom: Legacy(0), Harvest(1), Bloom(2), Sprout(3) */}
          {TIERS.map((tier, i) => {
            const tierIdx = tierIndex(tier.name);
            const isActive = tierIdx === currentIdx;
            const isCompleted = tierIdx < currentIdx;
            const isFuture = tierIdx > currentIdx;

            const y = 28 + i * 58;
            const fillColor = isFuture ? tier.dimColor : tier.color;
            const strokeColor = isFuture ? "rgba(142,156,163,0.3)" : tier.color;
            const textOpacity = isFuture ? 0.4 : 1;

            return (
              <g key={tier.name} className="tiffin-tier">
                {/* Box shadow */}
                <rect
                  x="16"
                  y={y + 3}
                  width="88"
                  height="50"
                  rx="6"
                  fill="rgba(0,0,0,0.1)"
                />
                {/* Box body */}
                <rect
                  x="14"
                  y={y}
                  width="88"
                  height="50"
                  rx="6"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {/* Shine overlay */}
                {!isFuture && (
                  <rect
                    x="14"
                    y={y}
                    width="88"
                    height="50"
                    rx="6"
                    fill="url(#steelShine)"
                  />
                )}
                {/* Active glow */}
                {isActive && (
                  <rect
                    x="12"
                    y={y - 2}
                    width="92"
                    height="54"
                    rx="7"
                    fill="none"
                    stroke={tier.color}
                    strokeWidth="3"
                    opacity="0.4"
                  />
                )}
                {/* Lid ridge */}
                <rect
                  x="14"
                  y={y}
                  width="88"
                  height="8"
                  rx="6"
                  fill={isFuture ? "rgba(142,156,163,0.15)" : "rgba(255,255,255,0.15)"}
                />
                {/* Emoji */}
                <text
                  x="38"
                  y={y + 32}
                  fontSize="20"
                  textAnchor="middle"
                  opacity={textOpacity}
                >
                  {isCompleted ? "✅" : tier.emoji}
                </text>
                {/* Tier name */}
                <text
                  x="68"
                  y={y + 27}
                  fontSize="11"
                  fontWeight="700"
                  fill={isFuture ? "#8E9CA3" : "#fff"}
                  fontFamily="var(--font-bricolage), sans-serif"
                  opacity={textOpacity}
                >
                  {tier.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tier labels on the side */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.9rem",
        }}
      >
        {/* Labels in visual top-to-bottom order: Legacy, Harvest, Bloom, Sprout */}
        {TIERS.map((tier) => {
          const tierIdx = tierIndex(tier.name);
          const isActive = tierIdx === currentIdx;
          const isCompleted = tierIdx < currentIdx;
          const isFuture = tierIdx > currentIdx;

          return (
            <div
              key={tier.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                opacity: isFuture ? 0.45 : 1,
                transition: "opacity 0.3s ease",
              }}
            >
              {/* Color dot */}
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: isFuture ? "#CBD4D9" : tier.color,
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 0 3px ${tier.color}44` : "none",
                  transition: "box-shadow 0.3s ease",
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    fontWeight: isActive ? 700 : 600,
                    fontSize: "0.9rem",
                    color: isActive ? tier.color : isFuture ? "#8E9CA3" : "#1a1a1a",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  {tier.emoji} {tier.name}
                  {isActive && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        background: tier.color,
                        color: "#fff",
                        padding: "0.1rem 0.45rem",
                        borderRadius: 999,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                  {isCompleted && (
                    <span style={{ fontSize: "0.75rem" }}>✅</span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#8E9CA3",
                    fontFamily: "var(--font-space-mono)",
                    marginTop: "0.1rem",
                  }}
                >
                  {tier.range}
                </div>
              </div>
            </div>
          );
        })}

        {/* Points display */}
        <div
          style={{
            marginTop: "0.5rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid #CBD4D9",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#8E9CA3", marginBottom: "0.2rem" }}>
            Your Karo Points
          </div>
          <div
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#EFA13B",
            }}
          >
            {points.toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}
