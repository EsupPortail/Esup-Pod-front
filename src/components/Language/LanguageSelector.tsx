"use client";

import React, { useState } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { SupportedLocale } from "@/src/locales";

interface LanguageSelectorProps {
  variant?: "dropdown" | "compact" | "full";
  className?: string;
}

const FLAG_MAP: Record<string, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
};

export function LanguageSelector({ variant = "dropdown" }: LanguageSelectorProps) {
  const { locale, setLocale, supportedLocales } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (code: SupportedLocale) => {
    setLocale(code);
    handleClose();
  };

  const currentFlag = FLAG_MAP[locale] || "🌐";

  return (
    <>
      <Button
        onClick={handleClick}
        size="small"
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-label="Changer de langue"
        sx={{
          color: "var(--text-color, inherit)",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.85rem",
          borderRadius: "9999px",
          padding: "5px 14px",
          border: "1px solid var(--border-color, rgba(255, 255, 255, 0.15))",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          transition: "all 0.2s ease-in-out",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            borderColor: "rgba(255, 255, 255, 0.3)",
          },
        }}
        endIcon={<ExpandMoreIcon sx={{ fontSize: "1.1rem !important", color: "var(--text-color-muted, #94a3b8)" }} />}
      >
        <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>{currentFlag}</span>
        <span>{locale.toUpperCase()}</span>
      </Button>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              backgroundColor: "var(--c--theme--colors--card-bg, #ffffff)",
              color: "var(--text-color, #0f172a)",
              borderRadius: "10px",
              mt: 1,
              minWidth: "150px",
              border: "1px solid var(--border-color, #e2e8f0)",
            },
          },
        }}
      >
        {supportedLocales.map((loc) => (
          <MenuItem
            key={loc.code}
            selected={loc.code === locale}
            onClick={() => handleSelect(loc.code as SupportedLocale)}
            sx={{
              fontSize: "0.875rem",
              fontWeight: loc.code === locale ? 700 : 500,
              gap: 1.5,
              py: 1,
              px: 2,
              borderRadius: "6px",
              mx: 0.5,
              color: "var(--text-color, #0f172a)",
              "&.Mui-selected": {
                backgroundColor: "rgba(59, 130, 246, 0.15) !important",
                color: "#2563eb !important",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{FLAG_MAP[loc.code] || "🌐"}</span>
            <span>{loc.label}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
