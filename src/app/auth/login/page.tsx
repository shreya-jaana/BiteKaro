"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (result?.url) {
      window.location.href = result.url;
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
      <div style={{ width: "100%", maxWidth: 420 }}>
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
            Welcome back
          </h1>
          <p
            style={{
              color: "#8E9CA3",
              fontSize: "0.875rem",
              margin: "0 0 1.75rem",
            }}
          >
            Sign in to your BiteKaro account
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
                placeholder="••••••••"
                required
                autoComplete="current-password"
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
                  Signing in...
                </>
              ) : (
                "Sign in →"
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
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              style={{
                color: "#C8472E",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
