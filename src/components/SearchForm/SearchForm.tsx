"use client";

import React, { useState } from "react";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/hooks/useTranslation";

export function SearchForm() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/video?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
          height: "40px",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          borderRadius: "9999px",
          border: "1px solid var(--border-color, rgba(0, 0, 0, 0.15))",
          padding: "0 14px",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <SearchIcon sx={{ color: "var(--text-color-muted, #94a3b8)", fontSize: "1.2rem", mr: 1 }} />
        <InputBase
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("navbar.searchPlaceholder")}
          inputProps={{ "aria-label": t("navbar.searchPlaceholder") }}
          sx={{
            flex: 1,
            color: "var(--text-color, inherit)",
            fontSize: "0.9rem",
            "& input::placeholder": {
              color: "var(--text-color-muted, #94a3b8)",
              opacity: 0.8,
            },
          }}
        />
        {query && (
          <IconButton size="small" onClick={() => setQuery("")} sx={{ color: "var(--text-color-muted, #94a3b8)" }}>
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </form>
  );
}
