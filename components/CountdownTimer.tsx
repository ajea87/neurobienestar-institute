"use client";
import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const getMadridMidnight = () => {
      const now = new Date();
      const madridNow = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Madrid" })
      );
      const midnight = new Date(madridNow);
      midnight.setHours(24, 0, 0, 0);
      return midnight.getTime() - madridNow.getTime();
    };

    const updateTimer = () => {
      const msLeft = getMadridMidnight();
      if (msLeft <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(msLeft / (1000 * 60 * 60));
      const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        margin: "0 0 16px",
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
        Precio fundador disponible hasta las 24:00 h de hoy
      </span>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[
          { val: pad(timeLeft.hours), label: "h" },
          { val: pad(timeLeft.minutes), label: "m" },
          { val: pad(timeLeft.seconds), label: "s" },
        ].map((unit, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
          >
            <span
              style={{
                background: "#1C3D50",
                color: "#F4EFE6",
                fontSize: "13px",
                fontWeight: 500,
                padding: "3px 7px",
                borderRadius: "4px",
                fontFamily: "monospace",
                minWidth: "28px",
                textAlign: "center",
              }}
            >
              {unit.val}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "#8E9CA3",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {unit.label}
            </span>
            {i < 2 && (
              <span
                style={{
                  color: "#1C3D50",
                  fontWeight: 500,
                  margin: "0 1px",
                }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
