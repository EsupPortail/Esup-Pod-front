"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from "@mui/material/Fade";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button } from "@openfun/cunningham-react";
import styles from "@/src/components/video/filters/styles.module.css";

type DateFilterDropdownProps = {
  createdAtGte: string;
  createdAtLte: string;
  onChange: (gte: string, lte: string) => void;
};

export default function DateFilterDropdown({
  createdAtGte,
  createdAtLte,
  onChange,
}: DateFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [localGte, setLocalGte] = useState(createdAtGte);
  const [localLte, setLocalLte] = useState(createdAtLte);
  const isMobile = useMediaQuery("(max-width: 600px)");

  // Sync state if props change outside
  useEffect(() => {
    setLocalGte(createdAtGte);
    setLocalLte(createdAtLte);
  }, [createdAtGte, createdAtLte]);

  const isActive = Boolean(createdAtGte || createdAtLte);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (!open) {
      setLocalGte(createdAtGte);
      setLocalLte(createdAtLte);
    }
    setOpen((currentOpen) => !currentOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = () => {
    onChange(localGte, localLte);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalGte("");
    setLocalLte("");
    onChange("", "");
    setOpen(false);
  };

  const popperWidth = isMobile && anchorEl ? anchorEl.clientWidth : 280;

  return (
    <Box className={styles.filterItem}>
      <ListItemButton
        onClick={handleClick}
        className={`${styles.filterButton} ${isActive ? styles.active : ""}`}
        aria-expanded={open}
      >
        <Typography
          variant="body2"
          fontWeight={isActive ? 600 : 500}
          noWrap
          sx={{ color: isActive ? "var(--c--globals--colors--brand--main)" : "inherit" }}
        >
          {isActive ? "Date (filtre actif)" : "Date de création"}
        </Typography>
        {open ? (
          <ExpandLessIcon fontSize="small" sx={{ color: isActive ? "var(--c--globals--colors--brand--main)" : "inherit", ml: "auto" }} />
        ) : (
          <ExpandMoreIcon fontSize="small" sx={{ color: isActive ? "var(--c--globals--colors--brand--main)" : "inherit", ml: "auto" }} />
        )}
      </ListItemButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        sx={{ zIndex: 1300, width: popperWidth, maxWidth: "100vw" }}
        modifiers={[
          { name: "offset", options: { offset: [0, 8] } },
          { name: "preventOverflow", options: { padding: 16 } },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <Paper elevation={8} className={styles.filterMenu}>
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, px: 1 }}>Sélectionnez une période</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 1 }}>
                    <TextField
                      label="Créé après"
                      type="datetime-local"
                      size="small"
                      fullWidth
                      value={localGte}
                      onChange={(e) => setLocalGte(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Créé avant"
                      type="datetime-local"
                      size="small"
                      fullWidth
                      value={localLte}
                      onChange={(e) => setLocalLte(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      pt: 1.5,
                      borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                      gap: "8px",
                    }}
                  >
                    <Button onClick={handleClear} variant="tertiary" size="small" disabled={!localGte && !localLte}>
                      Effacer
                    </Button>
                    <Button onClick={handleApply} variant="primary" size="small">
                      Afficher
                    </Button>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
