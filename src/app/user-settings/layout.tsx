"use client";

import React from "react";

export default function UserSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem 0" }}>
      {children}
    </div>
  );
}
