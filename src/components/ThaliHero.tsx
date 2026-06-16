"use client";

import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";

const KATORI_BUTTONS = [
  {
    label: "Mood Menu",
    emoji: "🎭",
    href: "/mood",
    bg: "#EFA13B",
    color: "#fff",
  },
  {
    label: "Karo Circle",
    emoji: "⭕",
    href: "/karo-circle",
    bg: "#52704F",
    color: "#fff",
  },
  {
    label: "Recipe Royalty",
    emoji: "👑",
    href: "/recipe-royalty",
    bg: "#7A4566",
    color: "#fff",
  },
  {
    label: "The Loop",
    emoji: "🔄",
    href: "/restaurants",
    bg: "#C8472E",
    color: "#fff",
  },
];

export function ThaliHero() {
  const thaliRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tilt, setTilt] = useState({ x: 18, y: -10 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = thaliRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({
      x: 18 - dy * 10,
      y: -10 + dx * 10,
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    setTilt({ x: 18, y: -10 });
  };

  const thaliTransform = reducedMotion
    ? "none"
    : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1.25rem 2rem",
        gap: "2.5rem",
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", maxWidth: 560 }}>
        <h1
          style={{
            fontFamily: "var(--font-bricolage)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            color: "#1a1a1a",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Order by{" "}
          <span style={{ color: "#C8472E" }}>Mood</span>.{" "}
          Eat with{" "}
          <span style={{ color: "#52704F" }}>Purpose</span>.
        </h1>
        <p
          style={{
            marginTop: "0.85rem",
            fontSize: "1.05rem",
            color: "#8E9CA3",
            lineHeight: 1.6,
          }}
        >
          Mood-based food ordering, 12% platform fee, bring your own tiffin, earn Karo Points.
        </p>
      </div>

      {/* Thali + Katori grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gridTemplateRows: "1fr auto 1fr",
          alignItems: "center",
          justifyItems: "center",
          gap: "1rem",
        }}
      >
        {/* Top-left katori */}
        <KatoriButton btn={KATORI_BUTTONS[0]} />

        {/* Top center spacer */}
        <div />

        {/* Top-right katori */}
        <KatoriButton btn={KATORI_BUTTONS[1]} />

        {/* Left spacer */}
        <div />

        {/* Thali SVG */}
        <div
          ref={thaliRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: thaliTransform,
            transformStyle: "preserve-3d",
            transition: "transform 0.45s cubic-bezier(.22,.61,.36,1)",
            willChange: "transform",
            cursor: "default",
          }}
        >
          <ThaliSVG />
        </div>

        {/* Right spacer */}
        <div />

        {/* Bottom-left katori */}
        <KatoriButton btn={KATORI_BUTTONS[2]} />

        {/* Bottom center spacer */}
        <div />

        {/* Bottom-right katori */}
        <KatoriButton btn={KATORI_BUTTONS[3]} />
      </div>
    </section>
  );
}

function KatoriButton({ btn }: { btn: typeof KATORI_BUTTONS[number] }) {
  return (
    <Link
      href={btn.href}
      className="katori-btn"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.3rem",
        width: 120,
        height: 90,
        borderRadius: 14,
        background: btn.bg,
        color: btn.color,
        textDecoration: "none",
        fontWeight: 700,
        fontSize: "0.82rem",
        fontFamily: "var(--font-bricolage)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
        textAlign: "center",
        padding: "0.5rem",
      }}
    >
      <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{btn.emoji}</span>
      <span>{btn.label}</span>
    </Link>
  );
}

function ThaliSVG() {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Steel thali plate with katori bowls"
    >
      <defs>
        {/* Brushed steel plate gradient */}
        <radialGradient id="plateGrad" cx="40%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#E2EAED" />
          <stop offset="40%" stopColor="#CBD4D9" />
          <stop offset="75%" stopColor="#8E9CA3" />
          <stop offset="100%" stopColor="#CBD4D9" />
        </radialGradient>

        {/* Plate rim gradient */}
        <radialGradient id="rimGrad" cx="40%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#d0dce2" />
          <stop offset="50%" stopColor="#8E9CA3" />
          <stop offset="100%" stopColor="#b0bfc5" />
        </radialGradient>

        {/* Katori shadow */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.25)" />
        </filter>

        {/* Dal katori gradient - orange */}
        <radialGradient id="dalGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f4ba6e" />
          <stop offset="100%" stopColor="#e07b1a" />
        </radialGradient>

        {/* Sabzi katori gradient - green */}
        <radialGradient id="sabziGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7aaa77" />
          <stop offset="100%" stopColor="#3b6039" />
        </radialGradient>

        {/* Rice katori gradient - cream */}
        <radialGradient id="riceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f9f2e3" />
          <stop offset="100%" stopColor="#dfd0b0" />
        </radialGradient>

        {/* Curry katori gradient - red */}
        <radialGradient id="curryGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e06050" />
          <stop offset="100%" stopColor="#9b2b1b" />
        </radialGradient>

        {/* Katori bowl fill */}
        <radialGradient id="katoriBowlSteel" cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#e8f0f3" />
          <stop offset="60%" stopColor="#CBD4D9" />
          <stop offset="100%" stopColor="#8E9CA3" />
        </radialGradient>
      </defs>

      {/* Plate outer rim shadow */}
      <ellipse cx="150" cy="158" rx="133" ry="12" fill="rgba(0,0,0,0.13)" />

      {/* Plate outer rim */}
      <circle cx="150" cy="150" r="133" fill="url(#rimGrad)" />

      {/* Plate inner surface */}
      <circle cx="150" cy="150" r="122" fill="url(#plateGrad)" />

      {/* Plate inner ring (decorative) */}
      <circle cx="150" cy="150" r="110" fill="none" stroke="#8E9CA3" strokeWidth="1.5" opacity="0.5" />
      <circle cx="150" cy="150" r="108" fill="none" stroke="#CBD4D9" strokeWidth="0.5" opacity="0.7" />

      {/* Plate highlight (brushed effect) */}
      <ellipse cx="120" cy="115" rx="55" ry="28" fill="rgba(255,255,255,0.18)" transform="rotate(-20,120,115)" />

      {/* === 4 Katori bowls === */}

      {/* Top katori - DAL (orange) */}
      <g filter="url(#shadow)" transform="translate(150,72)">
        <ellipse cx="0" cy="6" rx="32" ry="10" fill="url(#katoriBowlSteel)" />
        <ellipse cx="0" cy="0" rx="32" ry="11" fill="url(#katoriBowlSteel)" />
        <ellipse cx="0" cy="0" rx="27" ry="9" fill="url(#dalGrad)" />
        <text x="0" y="5" textAnchor="middle" fontSize="16">🫕</text>
        <ellipse cx="0" cy="0" rx="27" ry="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </g>

      {/* Right katori - SABZI (green) */}
      <g filter="url(#shadow)" transform="translate(222,150)">
        <ellipse cx="0" cy="6" rx="32" ry="10" fill="url(#katoriBowlSteel)" />
        <ellipse cx="0" cy="0" rx="32" ry="11" fill="url(#katoriBowlSteel)" />
        <ellipse cx="0" cy="0" rx="27" ry="9" fill="url(#sabziGrad)" />
        <text x="0" y="5" textAnchor="middle" fontSize="16">🥦</text>
        <ellipse cx="0" cy="0" rx="27" ry="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </g>

      {/* Bottom katori - CURRY (red) */}
      <g filter="url(#shadow)" transform="translate(150,228)">
        <ellipse cx="0" cy="6" rx="32" ry="10" fill="url(#katoriBowlSteel)" />
        <ellipse cx="0" cy="0" rx="32" ry="11" fill="url(#katoriBowlSteel)" />
        <ellipse cx="0" cy="0" rx="27" ry="9" fill="url(#curryGrad)" />
        <text x="0" y="5" textAnchor="middle" fontSize="16">🍛</text>
        <ellipse cx="0" cy="0" rx="27" ry="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </g>

      {/* Left katori - RICE (cream) */}
      <g filter="url(#shadow)" transform="translate(78,150)">
        <ellipse cx="0" cy="6" rx="32" ry="10" fill="url(#katoriBowlSteel)" />
        <ellipse cx="0" cy="0" rx="32" ry="11" fill="url(#katoriBowlSteel)" />
        <ellipse cx="0" cy="0" rx="27" ry="9" fill="url(#riceGrad)" />
        <text x="0" y="5" textAnchor="middle" fontSize="16">🍚</text>
        <ellipse cx="0" cy="0" rx="27" ry="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </g>

      {/* Centre roti / bread */}
      <g transform="translate(150,150)">
        <ellipse cx="0" cy="2" rx="24" ry="8" fill="rgba(0,0,0,0.1)" />
        <circle cx="0" cy="0" r="23" fill="#d4a84b" />
        <circle cx="0" cy="0" r="20" fill="#c9943a" />
        <circle cx="0" cy="0" r="16" fill="#e8b966" opacity="0.6" />
        <text x="0" y="6" textAnchor="middle" fontSize="18">🫓</text>
      </g>
    </svg>
  );
}
