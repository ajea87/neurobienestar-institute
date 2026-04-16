"use client";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  onExpire?: () => void;
}

const DURATION = 25 * 60;

export default function CountdownTimer({ onExpire }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (typeof window === "undefined") return DURATION;
    const stored = sessionStorage.getItem("ien_timer_end");
    if (stored) {
      const remaining = Math.floor((parseInt(stored) - Date.now()) / 1000);
      if (remaining > 0) return remaining;
      // Si expiró, limpiar y empezar de nuevo
      sessionStorage.removeItem("ien_timer_end");
    }
    const endTime = Date.now() + DURATION * 1000;
    sessionStorage.setItem("ien_timer_end", endTime.toString());
    return DURATION;
  });

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: "#8E9CA3",
          fontFamily: "var(--font-dm-sans)",
        }}
      >
        Precio disponible durante:
      </span>
      <div
        style={{
          background: "#1C3D50",
          color: "#F4EFE6",
          fontFamily: "monospace",
          fontSize: "14px",
          fontWeight: 600,
          padding: "3px 10px",
          borderRadius: "4px",
          letterSpacing: "0.05em",
        }}
      >
        {pad(minutes)}:{pad(seconds)}
      </div>
    </div>
  );
}
