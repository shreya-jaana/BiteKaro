"use client";

import { useEffect, useState, useRef } from "react";

type OrderStatus = "Placed" | "Preparing" | "Out for Delivery" | "Delivered";

const STEPS: OrderStatus[] = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

const STATUS_INDEX: Record<string, number> = {
  Placed: 0,
  Preparing: 1,
  "Out for Delivery": 2,
  Delivered: 3,
};

interface OrderStatusTrackerProps {
  orderId: string;
  initialStatus: string;
}

export function OrderStatusTracker({ orderId, initialStatus }: OrderStatusTrackerProps) {
  const [status, setStatus] = useState<string>(initialStatus);
  const simulatedRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper to PATCH status to the API
  const patchStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
    } catch {
      // silently fail — optimistic UI already updated
      setStatus(newStatus);
    }
  };

  // Simulate progression after mount
  useEffect(() => {
    if (simulatedRef.current) return;
    simulatedRef.current = true;

    const currentIdx = STATUS_INDEX[initialStatus] ?? 0;

    if (currentIdx === 0) {
      // Placed → Preparing after 3s
      const t1 = setTimeout(() => patchStatus("Preparing"), 3000);
      // Preparing → Out for Delivery after 8s
      const t2 = setTimeout(() => patchStatus("Out for Delivery"), 8000);
      // Out for Delivery → Delivered after 15s
      const t3 = setTimeout(() => patchStatus("Delivered"), 15000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    // If already partially progressed, only simulate remaining steps
    if (currentIdx === 1) {
      const t1 = setTimeout(() => patchStatus("Out for Delivery"), 5000);
      const t2 = setTimeout(() => patchStatus("Delivered"), 12000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    if (currentIdx === 2) {
      const t1 = setTimeout(() => patchStatus("Delivered"), 7000);
      return () => clearTimeout(t1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll every 3 seconds to sync with server
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.status && data.status !== status) {
            setStatus(data.status);
          }
        }
      } catch {
        // ignore fetch errors during polling
      }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, status]);

  const currentIdx = STATUS_INDEX[status] ?? 0;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #CBD4D9",
        borderRadius: 14,
        padding: "1.5rem 1.75rem",
        maxWidth: 520,
        width: "100%",
      }}
    >
      <h3
        style={{
          margin: "0 0 1.5rem",
          fontFamily: "var(--font-bricolage)",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        Order Status
        <span
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.72rem",
            color: "#8E9CA3",
            fontWeight: 400,
          }}
        >
          #{orderId.slice(0, 8)}
        </span>
      </h3>

      {/* Step indicators */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 0,
          position: "relative",
        }}
      >
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isFuture = idx > currentIdx;

          return (
            <div
              key={step}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                position: "relative",
              }}
            >
              {/* Connector line (left of dot, skip first) */}
              {idx > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 13,
                    left: 0,
                    right: "50%",
                    height: 3,
                    borderRadius: 2,
                    background:
                      isCompleted || isActive
                        ? "#EFA13B"
                        : "#CBD4D9",
                    transition: "background 0.4s ease",
                  }}
                />
              )}
              {/* Connector line (right of dot, skip last) */}
              {idx < STEPS.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: 13,
                    left: "50%",
                    right: 0,
                    height: 3,
                    borderRadius: 2,
                    background: isCompleted ? "#EFA13B" : "#CBD4D9",
                    transition: "background 0.4s ease",
                  }}
                />
              )}

              {/* Dot */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isCompleted
                    ? "#EFA13B"
                    : isActive
                    ? "#EFA13B"
                    : "#CBD4D9",
                  border: isActive
                    ? "3px solid #EFA13B"
                    : isCompleted
                    ? "3px solid #EFA13B"
                    : "3px solid #CBD4D9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  position: "relative",
                  transition: "all 0.4s ease",
                  boxShadow: isActive ? "0 0 0 4px rgba(239,161,59,0.25)" : "none",
                }}
              >
                {isCompleted ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isActive ? (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#fff",
                      animation: "pulse-dot 1.4s ease-in-out infinite",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: isFuture ? "#CBD4D9" : "#fff",
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  marginTop: "0.55rem",
                  fontSize: "0.7rem",
                  fontWeight: isActive ? 700 : isCompleted ? 600 : 400,
                  color: isActive
                    ? "#EFA13B"
                    : isCompleted
                    ? "#1a1a1a"
                    : "#8E9CA3",
                  textAlign: "center",
                  lineHeight: 1.3,
                  fontFamily: isActive
                    ? "var(--font-bricolage)"
                    : "var(--font-inter)",
                  transition: "color 0.3s ease",
                  maxWidth: 70,
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status message */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1rem",
          borderRadius: 8,
          background:
            status === "Delivered"
              ? "rgba(82,112,79,0.1)"
              : "rgba(239,161,59,0.1)",
          border: `1px solid ${status === "Delivered" ? "rgba(82,112,79,0.3)" : "rgba(239,161,59,0.3)"}`,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: status === "Delivered" ? "#52704F" : "#b8720a",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "1rem" }}>
          {status === "Placed" && "⏳"}
          {status === "Preparing" && "👨‍🍳"}
          {status === "Out for Delivery" && "🛵"}
          {status === "Delivered" && "✅"}
        </span>
        <span>
          {status === "Placed" && "Your order has been placed and is awaiting confirmation."}
          {status === "Preparing" && "The kitchen is preparing your order fresh!"}
          {status === "Out for Delivery" && "Your order is on its way to you!"}
          {status === "Delivered" && "Order delivered! Enjoy your meal 🍽️"}
        </span>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.7); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
