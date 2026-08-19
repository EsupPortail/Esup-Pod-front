"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from "@mui/material/Fade";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@openfun/cunningham-react";
import styles from "./styles.module.css";

export type SelectOption = {
  label: string;
  value: string;
};

export type FilterDropdownProps = {
  title: string;
  options: SelectOption[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  multiple?: boolean;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  isAsync?: boolean;
  loading?: boolean;
};

export default function FilterDropdown({
  title,
  options,
  selectedValues,
  onChange,
  multiple = true,
  onSearchChange,
  searchValue,
  isAsync = false,
  loading = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [localSearchText, setLocalSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery("(max-width: 600px)");

  // Local selected state for deferred multi-select updates (Vinted-style commit button)
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues);

  useEffect(() => {
    setLocalSelectedValues(selectedValues);
  }, [selectedValues]);

  const searchText = onSearchChange ? (searchValue ?? "") : localSearchText;

  const matchingOptions = onSearchChange
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase()),
      );

  const matchedSelected = matchingOptions.filter((o) =>
    multiple ? localSelectedValues.includes(o.value) : selectedValues.includes(o.value)
  );
  
  const matchedUnselected = matchingOptions.filter((o) =>
    multiple ? !localSelectedValues.includes(o.value) : !selectedValues.includes(o.value)
  );

  // Take the first 50 unselected to avoid performance issues (10k+ tags)
  const displayUnselected = isAsync ? matchedUnselected : matchedUnselected.slice(0, 50);

  const filteredOptions = [...matchedSelected, ...displayUnselected];

  const selectedCount = selectedValues.length;
  const selectedLabel =
    !multiple && selectedCount === 1
      ? options.find((option) => option.value === selectedValues[0])?.label || selectedValues[0]
      : null;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (!open) {
      setLocalSelectedValues(selectedValues);
      setLocalSearchText("");
    }
    setOpen((currentOpen) => !currentOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (optionValue: string) => {
    if (!multiple) {
      onChange(selectedValues.includes(optionValue) ? [] : [optionValue]);
      setOpen(false);
      return;
    }

    if (localSelectedValues.includes(optionValue)) {
      setLocalSelectedValues(localSelectedValues.filter((value) => value !== optionValue));
    } else {
      setLocalSelectedValues([...localSelectedValues, optionValue]);
    }
  };

  const popperWidth = isMobile && anchorEl ? anchorEl.clientWidth : 260;

  return (
    <Box className={styles.filterItem}>
      <ListItemButton
        onClick={handleClick}
        className={`${styles.filterButton} ${selectedCount > 0 ? styles.active : ""}`}
        aria-expanded={open}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
          <Typography
            variant="body2"
            fontWeight={selectedCount > 0 ? 600 : 500}
            noWrap
            sx={{
              color: "inherit",
            }}
          >
            {!multiple && selectedCount === 1 && selectedLabel
              ? `${title} : ${selectedLabel}`
              : title}
          </Typography>

          {multiple && selectedCount > 0 && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#2563eb",
                color: "#ffffff",
                borderRadius: "9999px",
                px: "6px",
                fontSize: "0.725rem",
                fontWeight: 700,
                minWidth: "18px",
                height: "18px",
                lineHeight: 1,
                flexShrink: 0,
                "html[data-theme='dark'] &": {
                  bgcolor: "#3b82f6",
                },
              }}
            >
              {selectedCount}
            </Box>
          )}
        </Box>

        {open ? (
          <ExpandLessIcon
            fontSize="small"
            sx={{
              color: selectedCount > 0 ? "#2563eb" : "inherit",
              ml: "auto",
              flexShrink: 0,
              "html[data-theme='dark'] &": {
                color: selectedCount > 0 ? "#60a5fa" : "inherit",
              },
            }}
          />
        ) : (
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              color: selectedCount > 0 ? "#2563eb" : "inherit",
              ml: "auto",
              flexShrink: 0,
              "html[data-theme='dark'] &": {
                color: selectedCount > 0 ? "#60a5fa" : "inherit",
              },
            }}
          />
        )}
      </ListItemButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        sx={{
          zIndex: 1300,
          width: popperWidth,
          maxWidth: "100vw",
        }}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
          {
            name: "preventOverflow",
            options: {
              padding: 16,
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <Paper elevation={8} className={styles.filterMenu}>
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  {(options.length > 0 || onSearchChange || isAsync) && (
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Rechercher..."
                      size="small"
                      value={searchText}
                      onChange={(event) => {
                        const val = event.target.value;
                        if (onSearchChange) onSearchChange(val);
                        else setLocalSearchText(val);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: loading ? (
                          <InputAdornment position="end">
                            <CircularProgress color="inherit" size={20} />
                          </InputAdornment>
                        ) : null,
                      }}
                      sx={{ mb: 1.5 }}
                    />
                  )}

                  <FormGroup className={styles.filterOptions}>
                    {filteredOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          multiple ? (
                            <Checkbox
                              checked={localSelectedValues.includes(option.value)}
                              onChange={() => handleToggle(option.value)}
                              size="small"
                            />
                          ) : (
                            <Checkbox
                              checkedIcon={<RadioButtonCheckedIcon />}
                              icon={<RadioButtonUncheckedIcon />}
                              checked={selectedValues.includes(option.value)}
                              onChange={() => handleToggle(option.value)}
                              size="small"
                            />
                          )
                        }
                        label={option.label}
                        className={styles.filterOption}
                      />
                    ))}

                    {!loading && filteredOptions.length === 0 && (
                      <Typography color="text.secondary" variant="body2" sx={{ p: 1 }}>
                        Aucun résultat
                      </Typography>
                    )}
                  </FormGroup>

                  {multiple && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1.5,
                        pt: 1.5,
                        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                        gap: "8px",
                      }}
                    >
                      <Button
                        onClick={() => {
                          setLocalSelectedValues([]);
                        }}
                        variant="tertiary"
                        size="small"
                        disabled={localSelectedValues.length === 0}
                      >
                        Effacer
                      </Button>
                      <Button
                        onClick={() => {
                          onChange(localSelectedValues);
                          setOpen(false);
                        }}
                        variant="primary"
                        size="small"
                      >
                        Afficher
                      </Button>
                    </Box>
                  )}
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
