"use client";

import React from "react";
import type { BlockConfig } from "@/src/types";

interface CustomTextBlockProps {
  block: BlockConfig;
}

export default function CustomTextBlock({ block }: CustomTextBlockProps) {
  const title = block.display_title;
  const content = block.subtitle_or_text || (block.extra_config?.content as string) || "";

  return (
    <section
      style={{
        backgroundColor: block.background_color || "#ffffff",
        color: block.text_color || "#111111",
        padding: "1.25rem",
        borderRadius: "4px",
        marginBottom: "2rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
      }}
    >
      {title && (
        <h3 style={{ margin: "0 0 0.8rem 0", fontWeight: 700, fontSize: "1.1rem" }}>
          {title}
        </h3>
      )}
      <div
        style={{ fontSize: "0.95rem", lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
