"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const NAV_LINKS = [
  { label: "Mood Menu", href: "/mood" },
  { label: "Browse", href: "/restaurants" },
  { label: "Karo Circle", href: "/karo-circle" },
  { label: "Recipes", href: "/recipe-royalty" },
];

export function Navbar() {
  const { data: session } = useSession();
  const items = useCart((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const role = user?.role;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(246,236,217,0.85)",
        borderBottom: "1px solid #CBD4D9",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          height: 60,
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-bricolage)",
            fontWeight: 800,
            fontSize: "1.4rem",
            color: "#C8472E",
            textDecoration: "none",
            letterSpacing: "-0.5px",
            flexShrink: 0,
          }}
        >
          BiteKaro
        </Link>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            flex: 1,
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#1a1a1a",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(203,212,217,0.45)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto" }}>
          {/* Cart */}
          <Link
            href="/cart"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "transparent",
              textDecoration: "none",
              color: "#1a1a1a",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(203,212,217,0.45)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                "transparent")
            }
            title="Cart"
          >
            {/* Cart icon SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "#C8472E",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-space-mono)",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* User area */}
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.75rem",
                  borderRadius: 8,
                  border: "1px solid #CBD4D9",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#1a1a1a",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(203,212,217,0.45)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "transparent")
                }
              >
                {/* Avatar circle */}
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#EFA13B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <span className="hidden-mobile">{user.name ?? user.email}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  style={{
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  <path d="M6 8L1 3h10z" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 40,
                    }}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      background: "#F6ECD9",
                      border: "1px solid #CBD4D9",
                      borderRadius: 10,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      minWidth: 180,
                      zIndex: 50,
                      overflow: "hidden",
                    }}
                  >
                    <DropdownItem href="/profile" label="Profile" onClick={() => setDropdownOpen(false)} />
                    {role === "vendor" && (
                      <DropdownItem
                        href="/vendor/dashboard"
                        label="Vendor Dashboard"
                        onClick={() => setDropdownOpen(false)}
                      />
                    )}
                    {role === "rider" && (
                      <DropdownItem
                        href="/rider/dashboard"
                        label="Rider Dashboard"
                        onClick={() => setDropdownOpen(false)}
                      />
                    )}
                    <div style={{ height: 1, background: "#CBD4D9", margin: "4px 0" }} />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "0.6rem 1rem",
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        color: "#C8472E",
                        fontWeight: 500,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.background =
                          "rgba(200,71,46,0.08)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.background =
                          "transparent")
                      }
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link
                href="/login"
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 8,
                  border: "1px solid #CBD4D9",
                  background: "transparent",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#1a1a1a",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(203,212,217,0.45)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent")
                }
              >
                Login
              </Link>
              <Link
                href="/signup"
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 8,
                  border: "none",
                  background: "#C8472E",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#fff",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.87")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
                }
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: 6,
            }}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: "#F6ECD9",
            borderTop: "1px solid #CBD4D9",
            padding: "0.75rem 1.25rem 1rem",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "0.65rem 0.5rem",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "#1a1a1a",
                textDecoration: "none",
                borderBottom: "1px solid rgba(203,212,217,0.5)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function DropdownItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "block",
        padding: "0.6rem 1rem",
        fontSize: "0.875rem",
        color: "#1a1a1a",
        textDecoration: "none",
        fontWeight: 500,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background =
          "rgba(203,212,217,0.45)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")
      }
    >
      {label}
    </Link>
  );
}
