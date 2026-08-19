"use client";

import React, { useState } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import type { SupportedLocale } from "@/src/locales";

interface LanguageSelectorProps {
  variant?: "dropdown" | "compact" | "full";
  className?: string;
}

export function LanguageSelector({ variant = "dropdown", className }: LanguageSelectorProps) {
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

  return (
    <>
      <Button
        onClick={handleClick}
        size="small"
        className={className}
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-label="Changer de langue"
        startIcon={<LanguageIcon sx={{ fontSize: "1.1rem !important" }} />}
        endIcon={<ExpandMoreIcon sx={{ fontSize: "1rem !important", opacity: 0.7 }} />}
        sx={{
          color: "var(--text-color, inherit)",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.825rem",
          borderRadius: "8px",
          height: "36px",
          padding: "0 10px",
          border: "1px solid var(--border-color, rgba(140, 140, 140, 0.25))",
          backgroundColor: "rgba(128, 128, 128, 0.05)",
          transition: "all 0.2s ease-in-out",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          "&:hover": {
            backgroundColor: "rgba(128, 128, 128, 0.12)",
            borderColor: "rgba(128, 128, 128, 0.4)",
          },
        }}
      >
        <span>{locale.toUpperCase()}</span>
      </Button>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              backgroundColor: "var(--background, #ffffff)",
              color: "var(--text-color, #0f172a)",
              borderRadius: "8px",
              mt: 1,
              minWidth: "140px",
              border: "1px solid var(--border-color, rgba(140, 140, 140, 0.2))",
              padding: "4px",
            },
          },
        }}
      >
        {supportedLocales.map((loc) => {
          const isSelected = loc.code === locale;
          return (
            <MenuItem
              key={loc.code}
              selected={isSelected}
              onClick={() => handleSelect(loc.code as SupportedLocale)}
              sx={{
                fontSize: "0.85rem",
                fontWeight: isSelected ? 700 : 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.75,
                px: 1.5,
                borderRadius: "6px",
                color: "var(--text-color, #0f172a)",
                "&.Mui-selected": {
                  backgroundColor: "var(--c--contextuals--background--semantic--brand--secondary, rgba(59, 130, 246, 0.1)) !important",
                  color: "var(--c--contextuals--background--semantic--brand--primary, #2563eb) !important",
                },
                "&:hover": {
                  backgroundColor: "rgba(128, 128, 128, 0.08)",
                },
              }}
            >
              <span>{loc.label}</span>
              {isSelected && <CheckIcon sx={{ fontSize: "1rem", color: "var(--c--contextuals--background--semantic--brand--primary, #2563eb)", ml: 1 }} />}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

