import { ThaliHero } from "@/components/ThaliHero";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#F6ECD9" }}>
      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <div
              className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
              style={{
                background: "#EFA13B22",
                color: "#EFA13B",
                fontFamily: "var(--font-space-mono)",
              }}
            >
              Commission 12% · Industry 30%
            </div>
            <h1
              className="text-5xl md:text-7xl font-extrabold leading-tight mb-4"
              style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
            >
              Food for every{" "}
              <span style={{ color: "#C8472E" }}>mood.</span>
              <br />A circle of{" "}
              <span style={{ color: "#52704F" }}>good.</span>
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: "#8E9CA3" }}
            >
              Order by how you feel, earn Karo Points, bring your own tiffin
              for rewards, and submit recipes that feed your community.
            </p>
          </div>
          <ThaliHero />
        </div>
      </section>

      {/* Why BiteKaro */}
      <section className="py-16" style={{ background: "#fff8f0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
          >
            The Circular Economy of Food
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: "🎭",
                title: "Mood Menu",
                desc: "Not sure what to eat? Let your mood choose. We match food to feelings.",
                color: "#EFA13B",
                href: "/mood",
              },
              {
                icon: "⭕",
                title: "Karo Circle",
                desc: "Every order earns points. Grow from Sprout to Legacy and unlock rewards.",
                color: "#52704F",
                href: "/karo-circle",
              },
              {
                icon: "👑",
                title: "Recipe Royalty",
                desc: "Submit a recipe. If vendors adopt it, you earn royalties every time it's ordered.",
                color: "#7A4566",
                href: "/recipe-royalty",
              },
              {
                icon: "🫙",
                title: "BYOT",
                desc: "Bring Your Own Tiffin — get ₹15 off + bonus points. Zero waste, full reward.",
                color: "#C8472E",
                href: "/restaurants",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="block rounded-2xl p-6 transition-transform duration-200 hover:scale-105"
                style={{
                  background: item.color + "18",
                  border: `2px solid ${item.color}33`,
                }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-bricolage)", color: item.color }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "#555" }}>
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Commission callout */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            className="rounded-3xl p-8 md:p-12"
            style={{ background: "#C8472E", color: "#F6ECD9" }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              We charge 12%. Not 30%.
            </h2>
            <p className="text-lg mb-6" style={{ opacity: 0.9 }}>
              Vendors keep more. Prices stay fair. Food stays good. That&apos;s
              the BiteKaro promise.
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div>
                <div
                  className="text-5xl font-bold"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  12%
                </div>
                <div className="text-sm" style={{ opacity: 0.8 }}>
                  BiteKaro commission
                </div>
              </div>
              <div style={{ color: "#EFA13B" }}>
                <div
                  className="text-5xl font-bold line-through"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  30%
                </div>
                <div className="text-sm" style={{ opacity: 0.8 }}>
                  Industry standard
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2
          className="text-3xl font-bold mb-6"
          style={{ fontFamily: "var(--font-bricolage)", color: "#1a1a1a" }}
        >
          Ready to eat with intention?
        </h2>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/mood"
            className="px-8 py-4 rounded-full text-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: "#EFA13B",
              color: "#1a1a1a",
              fontFamily: "var(--font-bricolage)",
            }}
          >
            Start with your mood →
          </Link>
          <Link
            href="/restaurants"
            className="px-8 py-4 rounded-full text-lg font-semibold border-2 transition-all hover:opacity-90"
            style={{
              borderColor: "#C8472E",
              color: "#C8472E",
              background: "transparent",
            }}
          >
            Browse all restaurants
          </Link>
        </div>
      </section>
    </div>
  );
}
