"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const ROLES = [
  { value: "customer", label: "Customer", emoji: "🍽️", desc: "Order food by mood" },
  { value: "vendor", label: "Vendor", emoji: "🏪", desc: "Sell your food" },
  { value: "rider", label: "Rider", emoji: "🛵", desc: "Deliver orders" },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        setError("Account created! Please sign in.");
        setLoading(false);
        window.location.href = "/auth/login";
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6ECD9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Logo/brand */}
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "2rem",
              color: "#C8472E",
              textDecoration: "none",
            }}
          >
            BiteKaro
          </Link>
          <p
            style={{
              color: "#8E9CA3",
              fontSize: "0.9rem",
              marginTop: "0.4rem",
            }}
          >
            Mood-based food, circular economy
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #CBD4D9",
            borderRadius: 20,
            padding: "2.25rem 2rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: "1.6rem",
              color: "#1a1a1a",
              margin: "0 0 0.35rem",
            }}
          >
            Create your account
          </h1>
          <p
            style={{
              color: "#8E9CA3",
              fontSize: "0.875rem",
              margin: "0 0 1.75rem",
            }}
          >
            Join BiteKaro and start your journey
          </p>

          {/* Error message */}
          {error && (
            <div
              style={{
                background: "rgba(200,71,46,0.08)",
                border: "1px solid rgba(200,71,46,0.3)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.875rem",
                color: "#C8472E",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: "0.4rem",
                  fontFamily: "var(--font-bricolage)",
                }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                required
                autoComplete="name"
                style={{
                  width: "100%",
                  padding: "0.7rem 0.9rem",
                  border: "1.5px solid #CBD4D9",
                  borderRadius: 10,
                  fontSize: "0.95rem",
                  color: "#1a1a1a",
                  background: "#F6ECD9",
                  outline: "none",
                  fontFamily: "var(--font-inter)",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLInputElement).style.borderColor = "#EFA13B")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLInputElement).style.borderColor = "#CBD4D9")
                }
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: "0.4rem",
                  fontFamily: "var(--font-bricolage)",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "0.7rem 0.9rem",
                  border: "1.5px solid #CBD4D9",
                  borderRadius: 10,
                  fontSize: "0.95rem",
                  color: "#1a1a1a",
                  background: "#F6ECD9",
                  outline: "none",
                  fontFamily: "var(--font-inter)",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLInputElement).style.borderColor = "#EFA13B")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLInputElement).style.borderColor = "#CBD4D9")
                }
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: "0.4rem",
                  fontFamily: "var(--font-bricolage)",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                style={{
                  width: "100%",
                  padding: "0.7rem 0.9rem",
                  border: "1.5px solid #CBD4D9",
                  borderRadius: 10,
                  fontSize: "0.95rem",
                  color: "#1a1a1a",
                  background: "#F6ECD9",
                  outline: "none",
                  fontFamily: "var(--font-inter)",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLInputElement).style.borderColor = "#EFA13B")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLInputElement).style.borderColor = "#CBD4D9")
                }
              />
            </div>

            {/* Role selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-bricolage)",
                }}
              >
                I am a...
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    style={{
                      padding: "0.75rem 0.5rem",
                      border: `2px solid ${role === r.value ? "#C8472E" : "#CBD4D9"}`,
                      borderRadius: 10,
                      background: role === r.value ? "rgba(200,71,46,0.06)" : "#F6ECD9",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: "1.3rem", marginBottom: "0.25rem" }}>{r.emoji}</div>
                    <div
                      style={{
                        fontFamily: "var(--font-bricolage)",
                        fontWeight: role === r.value ? 700 : 600,
                        fontSize: "0.8rem",
                        color: role === r.value ? "#C8472E" : "#1a1a1a",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {r.label}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#8E9CA3", lineHeight: 1.3 }}>
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.25rem",
                padding: "0.8rem",
                background: loading ? "#CBD4D9" : "#C8472E",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Creating account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #CBD4D9",
              fontSize: "0.875rem",
              color: "#8E9CA3",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              style={{
                color: "#C8472E",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
