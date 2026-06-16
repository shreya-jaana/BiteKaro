"use client";

import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const BYOT_DISCOUNT = 15;

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQty = useCart((s) => s.updateQty);
  const router = useRouter();

  const [byot, setByot] = useState(false);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = byot ? BYOT_DISCOUNT : 0;
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    if (byot) {
      localStorage.setItem("bitekaro-byot", "true");
    } else {
      localStorage.removeItem("bitekaro-byot");
    }
    onClose();
    router.push(`/checkout${byot ? "?byot=1" : ""}`);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.38)",
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "#F6ECD9",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
          zIndex: 210,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(.22,.61,.36,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.1rem 1.25rem",
            borderBottom: "1px solid #CBD4D9",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-bricolage)",
              fontWeight: 700,
              fontSize: "1.15rem",
              color: "#1a1a1a",
            }}
          >
            Your Cart
            {items.length > 0 && (
              <span
                style={{
                  marginLeft: "0.5rem",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.8rem",
                  color: "#8E9CA3",
                  fontWeight: 400,
                }}
              >
                ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: 6,
              color: "#8E9CA3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close cart"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(203,212,217,0.45)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1.25rem" }}>
          {items.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "0.75rem",
                color: "#8E9CA3",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#CBD4D9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p style={{ margin: 0, fontWeight: 500, fontSize: "0.95rem" }}>
                Your cart is empty
              </p>
              <p style={{ margin: 0, fontSize: "0.82rem" }}>
                Add some delicious items!
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #CBD4D9",
                    borderRadius: 10,
                    padding: "0.75rem 0.9rem",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        color: "#1a1a1a",
                        fontFamily: "var(--font-bricolage)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        margin: "0.15rem 0 0",
                        fontSize: "0.72rem",
                        color: "#8E9CA3",
                      }}
                    >
                      {item.restaurantName}
                    </p>
                    <p
                      style={{
                        margin: "0.3rem 0 0",
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "#C8472E",
                      }}
                    >
                      ₹{item.price} × {item.quantity} ={" "}
                      <span style={{ color: "#1a1a1a" }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.3rem",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        background: "#F6ECD9",
                        borderRadius: 7,
                        padding: "0.15rem",
                        border: "1px solid #CBD4D9",
                      }}
                    >
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{
                          width: 26,
                          height: 26,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          borderRadius: 5,
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#C8472E",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1,
                        }}
                        aria-label="Decrease quantity"
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(200,71,46,0.1)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "transparent")
                        }
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontFamily: "var(--font-space-mono)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          minWidth: 18,
                          textAlign: "center",
                          color: "#1a1a1a",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{
                          width: 26,
                          height: 26,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          borderRadius: 5,
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#52704F",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1,
                        }}
                        aria-label="Increase quantity"
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(82,112,79,0.1)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "transparent")
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.68rem",
                        color: "#8E9CA3",
                        padding: "0.1rem 0.25rem",
                        borderRadius: 4,
                        textDecoration: "underline",
                        fontFamily: "var(--font-inter)",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color = "#C8472E")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color = "#8E9CA3")
                      }
                      aria-label={`Remove ${item.name}`}
                    >
                      remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer: BYOT + totals + checkout */}
        {items.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #CBD4D9",
              padding: "1rem 1.25rem 1.4rem",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              background: "#F6ECD9",
            }}
          >
            {/* BYOT toggle */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
                padding: "0.75rem 0.9rem",
                borderRadius: 10,
                background: byot ? "rgba(82,112,79,0.1)" : "rgba(203,212,217,0.3)",
                border: `1.5px solid ${byot ? "#52704F" : "#CBD4D9"}`,
                transition: "all 0.2s ease",
              }}
            >
              {/* Custom toggle */}
              <div
                style={{
                  width: 42,
                  height: 24,
                  borderRadius: 12,
                  background: byot ? "#52704F" : "#CBD4D9",
                  position: "relative",
                  flexShrink: 0,
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: byot ? 21 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
              <input
                type="checkbox"
                checked={byot}
                onChange={(e) => setByot(e.target.checked)}
                style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                aria-label="Bring Your Own Tiffin"
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    color: byot ? "#52704F" : "#1a1a1a",
                    fontFamily: "var(--font-bricolage)",
                  }}
                >
                  Bring Your Own Tiffin 🫙
                </p>
                <p
                  style={{
                    margin: "0.15rem 0 0",
                    fontSize: "0.75rem",
                    color: "#8E9CA3",
                  }}
                >
                  Save ₹15 and help the planet!
                </p>
              </div>
            </label>

            {/* Price breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                  color: "#3d3d3d",
                }}
              >
                <span>Subtotal</span>
                <span style={{ fontFamily: "var(--font-space-mono)", fontWeight: 600 }}>
                  ₹{subtotal}
                </span>
              </div>
              {byot && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.875rem",
                    color: "#52704F",
                    fontWeight: 600,
                  }}
                >
                  <span>BYOT Discount 🫙</span>
                  <span style={{ fontFamily: "var(--font-space-mono)" }}>
                    −₹{BYOT_DISCOUNT}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  paddingTop: "0.4rem",
                  borderTop: "1px solid #CBD4D9",
                  marginTop: "0.2rem",
                }}
              >
                <span style={{ fontFamily: "var(--font-bricolage)" }}>Total</span>
                <span style={{ fontFamily: "var(--font-space-mono)", color: "#C8472E" }}>
                  ₹{total}
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: 10,
                border: "none",
                background: "#C8472E",
                color: "#fff",
                fontFamily: "var(--font-bricolage)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "opacity 0.15s ease",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
              }
            >
              Go to Checkout →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
