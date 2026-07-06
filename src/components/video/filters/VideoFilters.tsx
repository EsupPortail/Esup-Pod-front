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
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { CURSUS_OPTIONS } from "@/src/constants/cursus";
import { getUserDisplayName } from "@/src/constants/user";
import type { Discipline, Tags, Type, User } from "@/src/types";
import { Button } from "@openfun/cunningham-react";
import TuneIcon from "@mui/icons-material/Tune";
import styles from "./styles.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";

export type VideoFiltersValue = {
  search: string;
  ordering: string;
  channel: number | null;
  ownerUsernames: string[];
  typeSlugs: string[];
  disciplineIds: number[];
  cursus: string[];
  tagSlugs: string[];
};

type Props = {
  value: VideoFiltersValue;
  users: User[];
  types: Type[];
  disciplines: Discipline[];
  tags: Tags[];
  channels: number[];
  showUserFilter?: boolean;
  showChannelFilter?: boolean;
  onChange: (value: VideoFiltersValue) => void;
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

const normalizeValues = <T extends string | number>(values: T[]) =>
  [...values].sort((first, second) =>
    String(first).localeCompare(String(second)),
  );

const sortByOptions = (values: string[], options: SelectOption[]) => {
  const orderByValue = new Map(
    options.map((option, index) => [option.value, index]),
  );

  return [...values].sort(
    (first, second) =>
      (orderByValue.get(first) ?? Number.MAX_SAFE_INTEGER) -
      (orderByValue.get(second) ?? Number.MAX_SAFE_INTEGER),
  );
};

type FilterDropdownProps = {
  title: string;
  options: SelectOption[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  multiple?: boolean;
};

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

  const handleClose = () => {
    setOpen(false);
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
          secondaryTypographyProps={{
            variant: "caption",
            noWrap: true,
          }}
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

export const INITIAL_VIDEO_FILTERS: VideoFiltersValue = {
  search: "",
  ordering: "",
  channel: null,
  ownerUsernames: [],
  typeSlugs: [],
  disciplineIds: [],
  cursus: [],
  tagSlugs: [],
};

export default function VideoFilters({
  value,
  users,
  types,
  disciplines,
  tags,
  channels,
  showUserFilter = true,
  showChannelFilter = true,
  onChange,
}: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleViewFilters = () => {
    setShowFilters((prev) => !prev);
  };
  const userOptions = useMemo<SelectOption[]>(
    () =>
      users.map((user) => ({
        label: getUserDisplayName(user),
        value: user.username,
      })),
    [users],
  );

  const typeOptions = useMemo(
    () =>
      types.map((type) => ({
        label: type.title,
        value: type.slug,
      })),
    [types],
  );

  const disciplineOptions = useMemo<SelectOption[]>(
    () =>
      disciplines.map((discipline) => ({
        label: discipline.title,
        value: String(discipline.id),
      })),
    [disciplines],
  );

  const tagOptions = useMemo<SelectOption[]>(
    () =>
      tags.map((tag) => ({
        label: tag.name,
        value: tag.slug,
      })),
    [tags],
  );

  const channelOptions = useMemo<SelectOption[]>(
    () =>
      channels.map((channel) => ({
        label: `Chaîne ${channel}`,
        value: String(channel),
      })),
    [channels],
  );

  const selectedChannel =
    channelOptions.find((option) => option.value === String(value.channel)) ??
    null;

  const selectedUsers = userOptions.filter((option) =>
    value.ownerUsernames.includes(option.value),
  );

  const selectedTypes = typeOptions.filter((option) =>
    value.typeSlugs.includes(String(option.value)),
  );

  const selectedDisciplines = disciplineOptions.filter((option) =>
    value.disciplineIds.includes(Number(option.value)),
  );

  const selectedCursus = CURSUS_OPTIONS.filter((option) =>
    value.cursus.includes(option.value),
  );

  const selectedTags = tagOptions.filter((option) =>
    value.tagSlugs.includes(String(option.value)),
  );

  const removeValue = <T extends string | number>(
    list: T[],
    target: T,
  ): T[] => {
    return list.filter((item) => item !== target);
  };

  const appliedFiltersCount =
    (value.search.trim() ? 1 : 0) +
    (selectedChannel ? 1 : 0) +
    (showUserFilter ? selectedUsers.length : 0) +
    selectedTypes.length +
    selectedDisciplines.length +
    selectedCursus.length +
    selectedTags.length;

  return (
    <div className={styles.filtersContent}>
      <div className={styles.filtersContentHeader}>
        <Box className={styles.filtersButtonRow}>
          <Button
            onClick={handleViewFilters}
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
              onDelete={() => onChange(INITIAL_VIDEO_FILTERS)}
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

              if (nextOrdering === value.ordering) {
                return;
              }

              onChange({
                ...value,
                ordering: nextOrdering,
              });
            }}
          />

          <TextField
            id="video-filters-search"
            size="small"
            className={styles.searchField}
            label="Rechercher"
            value={value.search}
            onChange={(event) => {
              const nextSearch =
                typeof event.target.value === "string"
                  ? event.target.value
                  : "";

              if (nextSearch === value.search) {
                return;
              }

              onChange({
                ...value,
                search: nextSearch,
              });
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
        className={`${styles.wrapper} ${
          showFilters ? styles.open : styles.closed
        }`}
      >
        <Box className={styles.row}>
          {showChannelFilter && (
            <FilterDropdown
              title="Chaînes"
              options={channelOptions}
              selectedValues={selectedChannel ? [selectedChannel.value] : []}
              multiple={false}
              onChange={(nextValues) => {
                const nextChannel = nextValues[0]
                  ? Number(nextValues[0])
                  : null;

                if (nextChannel === value.channel) {
                  return;
                }

                onChange({
                  ...value,
                  channel: nextChannel,
                });
              }}
            />
          )}

          {showUserFilter && (
            <FilterDropdown
              title="Utilisateurs"
              options={userOptions}
              selectedValues={value.ownerUsernames}
              onChange={(nextOwnerUsernames) => {
                if (haveSameValues(value.ownerUsernames, nextOwnerUsernames)) {
                  return;
                }

                onChange({
                  ...value,
                  ownerUsernames: nextOwnerUsernames,
                });
              }}
            />
          )}

          <FilterDropdown
            title="Types"
            options={typeOptions}
            selectedValues={value.typeSlugs}
            onChange={(nextTypeSlugs) => {
              if (haveSameValues(value.typeSlugs, nextTypeSlugs)) {
                return;
              }
              onChange({
                ...value,
                typeSlugs: nextTypeSlugs,
              });
            }}
          />

          <FilterDropdown
            title="Disciplines"
            options={disciplineOptions}
            selectedValues={value.disciplineIds.map(String)}
            onChange={(nextValues) => {
              const nextDisciplineIds = nextValues.map(Number);

              if (haveSameValues(value.disciplineIds, nextDisciplineIds)) {
                return;
              }

              onChange({
                ...value,
                disciplineIds: nextDisciplineIds,
              });
            }}
          />

          <FilterDropdown
            title="Cursus"
            options={CURSUS_OPTIONS}
            selectedValues={value.cursus}
            onChange={(nextCursus) => {
              console.log(value.cursus);
              if (haveSameValues(value.cursus, nextCursus)) {
                return;
              }

              onChange({
                ...value,
                cursus: nextCursus,
              });
            }}
          />

          <FilterDropdown
            title="Mots-clés"
            options={tagOptions}
            selectedValues={value.tagSlugs}
            onChange={(nextTagSlugs) => {
              const currentNormalized = normalizeValues(value.tagSlugs);
              const nextNormalized = normalizeValues(nextTagSlugs);

              if (haveSameValues(currentNormalized, nextNormalized)) {
                return;
              }

              onChange({
                ...value,
                tagSlugs: sortByOptions(nextTagSlugs, tagOptions),
              });
            }}
          />
        </Box>

        {appliedFiltersCount > 0 && <Divider />}

        {appliedFiltersCount > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Filtres sélectionnés :
            </Typography>

            <Box className={styles.chips}>
              {value.search.trim() && (
                <FilterChip
                  label={`Recherche : ${value.search}`}
                  onDelete={() => onChange({ ...value, search: "" })}
                />
              )}

              {showChannelFilter && selectedChannel && (
                <FilterChip
                  label={`Chaîne : ${selectedChannel.label}`}
                  onDelete={() =>
                    onChange({
                      ...value,
                      channel: null,
                    })
                  }
                />
              )}

              {showUserFilter &&
                selectedUsers.map((option) => (
                  <FilterChip
                    key={`user-${option.value}`}
                    label={`Utilisateur : ${option.label}`}
                    onDelete={() =>
                      onChange({
                        ...value,
                        ownerUsernames: removeValue(
                          value.ownerUsernames,
                          option.value,
                        ),
                      })
                    }
                  />
                ))}

              {selectedTypes.map((option) => (
                <FilterChip
                  key={`type-${option.value}`}
                  label={`Type : ${option.label}`}
                  onDelete={() =>
                    onChange({
                      ...value,
                      typeSlugs: removeValue(
                        value.typeSlugs,
                        String(option.value),
                      ),
                    })
                  }
                />
              ))}

              {selectedDisciplines.map((option) => (
                <FilterChip
                  key={`discipline-${option.value}`}
                  label={`Discipline : ${option.label}`}
                  onDelete={() =>
                    onChange({
                      ...value,
                      disciplineIds: removeValue(
                        value.disciplineIds,
                        Number(option.value),
                      ),
                    })
                  }
                />
              ))}

              {selectedCursus.map((option) => (
                <FilterChip
                  key={`cursus-${option.value}`}
                  label={`Cursus : ${option.label}`}
                  onDelete={() =>
                    onChange({
                      ...value,
                      cursus: removeValue(value.cursus, option.value),
                    })
                  }
                />
              ))}

              {selectedTags.map((option) => (
                <FilterChip
                  key={`tag-${option.value}`}
                  label={`Mot-clé : ${option.label}`}
                  onDelete={() =>
                    onChange({
                      ...value,
                      tagSlugs: removeValue(
                        value.tagSlugs,
                        String(option.value),
                      ),
                    })
                  }
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
}
