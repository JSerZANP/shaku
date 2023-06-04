"use client";

import React, { ReactNode, useState } from "react";

export function Reveal({
  children,
  label = "Reveal",
}: {
  children: ReactNode;
  label: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {children}
      {!show && (
        <div
          style={{
            position: "absolute",
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0,0,0,0.4)",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "grid",
            placeContent: "center",
          }}
        >
          <button
            style={{ fontWeight: 600, padding: "0.5rem 1rem" }}
            onClick={() => setShow(true)}
          >
            {label}
          </button>
        </div>
      )}
    </div>
  );
}
