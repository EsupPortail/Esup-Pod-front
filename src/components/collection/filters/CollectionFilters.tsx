"use client";

import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { Button } from "@openfun/cunningham-react";
import { getUserDisplayName } from "@/src/constants/user";
import type { Channel, User } from "@/src/types";
import styles from "@/src/components/video/filters/styles.module.css";

export type CollectionFilterMode = "channels" | "playlists" | "themes";

export type CollectionFiltersValue = {
  search: string;
  ordering: string;
  ownerUsernames: string[];
  createdAtGte: string;
  createdAtLte: string;
  channel: number | null;
};

type Props = {
  mode: CollectionFilterMode;
  value: CollectionFiltersValue;
  users?: User[];
  channels?: Channel[];
  showUserFilter?: boolean;
  onChange: (value: CollectionFiltersValue) => void;
};

type SelectOption = {
  label: string;
  value: string;
};

const ORDERING_OPTIONS: SelectOption[] = [
  { label: "Plus récentes", value: "-created_at" },
  { label: "Plus anciennes", value: "created_at" },
  { label: "Titre A-Z", value: "title" },
  { label: "Titre Z-A", value: "-title" },
];

const haveSameValues = <T extends string | number>(
  currentValues: T[],
  nextValues: T[],
) =>
  currentValues.length === nextValues.length &&
  currentValues.every(
    (currentValue, index) => currentValue === nextValues[index],
  );

const FilterChip = ({
  label,
  onDelete,
}: {
  label: string;
  onDelete: () => void;
}) => (
  <Chip
    label={label}
    onDelete={onDelete}
    deleteIcon={<CloseIcon />}
    size="small"
    sx={{ m: 0.25 }}
  />
);

type FilterDropdownProps = {
  title: string;
  options: SelectOption[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  multiple?: boolean;
};

const FilterDropdown = ({
  title,
  options,
  selectedValues,
  onChange,
  multiple = true,
}: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  const selectedCount = selectedValues.length;
  const selectedLabel =
    !multiple && selectedCount === 1
      ? options.find((option) => option.value === selectedValues[0])?.label
      : null;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((currentOpen) => !currentOpen);
  };

  const handleToggle = (optionValue: string) => {
    if (!multiple) {
      onChange(selectedValues.includes(optionValue) ? [] : [optionValue]);
      setOpen(false);
      return;
    }

    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((value) => value !== optionValue));
      return;
    }

    onChange([...selectedValues, optionValue]);
  };

  const popperWidth = isMobile && anchorEl ? anchorEl.clientWidth : 240;

  return (
    <Box className={styles.filterItem}>
      <ListItemButton
        onClick={handleClick}
        className={styles.filterButton}
        aria-expanded={open}
      >
        <ListItemText
          primary={title}
          secondary={selectedLabel ?? undefined}
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: 500,
            noWrap: true,
          }}
          secondaryTypographyProps={{ variant: "caption", noWrap: true }}
        />
        {multiple && selectedCount > 0 && (
          <Chip label={selectedCount} color="primary" size="small" />
        )}
        {open ? (
          <ExpandLessIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
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
          { name: "offset", options: { offset: [0, 8] } },
          { name: "preventOverflow", options: { padding: 16 } },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <Paper elevation={8} className={styles.filterMenu}>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Box>
                  {options.length > 0 && (
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Rechercher..."
                      size="small"
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 1.5 }}
                    />
                  )}

                  <FormGroup className={styles.filterOptions}>
                    {filteredOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={selectedValues.includes(option.value)}
                            onChange={() => handleToggle(option.value)}
                            size="small"
                          />
                        }
                        label={option.label}
                        className={styles.filterOption}
                      />
                    ))}

                    {filteredOptions.length === 0 && (
                      <Typography color="text.secondary" variant="body2">
                        Aucun résultat
                      </Typography>
                    )}
                  </FormGroup>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export const INITIAL_COLLECTION_FILTERS: CollectionFiltersValue = {
  search: "",
  ordering: "",
  ownerUsernames: [],
  createdAtGte: "",
  createdAtLte: "",
  channel: null,
};

export default function CollectionFilters({
  mode,
  value,
  users = [],
  channels = [],
  showUserFilter = true,
  onChange,
}: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const isThemeMode = mode === "themes";
  const hasDateFilters = mode === "channels" || mode === "playlists";
  const hasOwnerFilter = !isThemeMode && showUserFilter;

  const userOptions = useMemo<SelectOption[]>(
    () =>
      users.map((user) => ({
        label: getUserDisplayName(user),
        value: user.username,
      })),
    [users],
  );

  const channelOptions = useMemo<SelectOption[]>(
    () =>
      channels.map((channel) => ({
        label: channel.title,
        value: String(channel.id),
      })),
    [channels],
  );

  const selectedUsers = userOptions.filter((option) =>
    value.ownerUsernames.includes(option.value),
  );

  const selectedChannel =
    channelOptions.find((option) => option.value === String(value.channel)) ??
    null;

  const appliedFiltersCount =
    (hasOwnerFilter ? selectedUsers.length : 0) +
    (hasDateFilters && value.createdAtGte ? 1 : 0) +
    (hasDateFilters && value.createdAtLte ? 1 : 0) +
    (isThemeMode && selectedChannel ? 1 : 0);

  return (
    <div className={styles.filtersContent}>
      <div className={styles.filtersContentHeader}>
        <Box className={styles.filtersButtonRow}>
          <Button
            onClick={() => setShowFilters((prev) => !prev)}
            size={isMobile ? "medium" : "small"}
            fullWidth={isMobile}
            icon={<TuneIcon />}
            variant="bordered"
            color="brand"
          >
            Filtrer
          </Button>
          {appliedFiltersCount > 0 && (
            <Chip
              label={`Filtres appliqués (${appliedFiltersCount})`}
              color="primary"
              size="small"
              onDelete={() => onChange(INITIAL_COLLECTION_FILTERS)}
              deleteIcon={<CloseIcon />}
            />
          )}
        </Box>

        <Box className={styles.searchRow}>
          <FilterDropdown
            title="Tri"
            options={ORDERING_OPTIONS}
            selectedValues={value.ordering ? [value.ordering] : []}
            multiple={false}
            onChange={(nextValues) => {
              const nextOrdering = nextValues[0] ?? "";
              if (nextOrdering === value.ordering) return;

              onChange({ ...value, ordering: nextOrdering });
            }}
          />

          <TextField
            id="collection-filters-search"
            size="small"
            className={styles.searchField}
            label="Rechercher"
            value={value.search}
            onChange={(event) => {
              const nextSearch = event.target.value ?? "";
              if (nextSearch === value.search) return;

              onChange({ ...value, search: nextSearch });
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </div>

      <Paper
        elevation={1}
        className={`${styles.wrapper} ${showFilters ? styles.open : styles.closed}`}
      >
        <Box className={styles.row}>
          {isThemeMode && (
            <FilterDropdown
              title="Chaînes"
              options={channelOptions}
              selectedValues={selectedChannel ? [selectedChannel.value] : []}
              multiple={false}
              onChange={(nextValues) => {
                const nextChannel = nextValues[0]
                  ? Number(nextValues[0])
                  : null;
                if (nextChannel === value.channel) return;

                onChange({ ...value, channel: nextChannel });
              }}
            />
          )}

          {hasOwnerFilter && (
            <FilterDropdown
              title="Utilisateurs"
              options={userOptions}
              selectedValues={value.ownerUsernames}
              onChange={(nextOwnerUsernames) => {
                if (haveSameValues(value.ownerUsernames, nextOwnerUsernames))
                  return;

                onChange({ ...value, ownerUsernames: nextOwnerUsernames });
              }}
            />
          )}

          {hasDateFilters && (
            <>
              <TextField
                label="Créé après"
                type="datetime-local"
                size="small"
                className={styles.field}
                value={value.createdAtGte}
                onChange={(event) =>
                  onChange({ ...value, createdAtGte: event.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Créé avant"
                type="datetime-local"
                size="small"
                className={styles.field}
                value={value.createdAtLte}
                onChange={(event) =>
                  onChange({ ...value, createdAtLte: event.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
        </Box>

        {appliedFiltersCount > 0 && <Divider />}

        {appliedFiltersCount > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Filtres sélectionnés :
            </Typography>

            <Box className={styles.chips}>
              {isThemeMode && selectedChannel && (
                <FilterChip
                  label={`Chaîne : ${selectedChannel.label}`}
                  onDelete={() => onChange({ ...value, channel: null })}
                />
              )}

              {hasOwnerFilter &&
                selectedUsers.map((option) => (
                  <FilterChip
                    key={`user-${option.value}`}
                    label={`Utilisateur : ${option.label}`}
                    onDelete={() =>
                      onChange({
                        ...value,
                        ownerUsernames: value.ownerUsernames.filter(
                          (username) => username !== option.value,
                        ),
                      })
                    }
                  />
                ))}

              {hasDateFilters && value.createdAtGte && (
                <FilterChip
                  label={`Créé après : ${value.createdAtGte}`}
                  onDelete={() => onChange({ ...value, createdAtGte: "" })}
                />
              )}

              {hasDateFilters && value.createdAtLte && (
                <FilterChip
                  label={`Créé avant : ${value.createdAtLte}`}
                  onDelete={() => onChange({ ...value, createdAtLte: "" })}
                />
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
}
