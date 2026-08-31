"use client";

import { useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Badge from "@mui/material/Badge";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import { getCursusOptions } from "@/src/constants/cursus";
import { getUserDisplayName } from "@/src/constants/user";
import type { Discipline, Tags, Type, User } from "@/src/types";
import { Button } from "@openfun/cunningham-react";
import styles from "./styles.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUsers } from "@/src/hooks/useUsers";
import { useChannel } from "@/src/hooks/useChannel";
import { useTags as useTagsHook } from "@/src/hooks/useTags";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import FilterDropdown from "./FilterDropdown";
import AsyncFilterDropdown from "./AsyncFilterDropdown";

export type VideoFiltersValue = {
  search: string;
  ordering: string;
  channel: number | null;
  ownerUsernames: string[];
  typeSlugs: string[];
  disciplineIds: number[];
  cursus: string[];
  tagSlugs: string[];
  page: number;
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

const FilterChip = ({
  label,
  onDelete,
}: {
  label: string;
  onDelete: () => void;
}) => (
  <div
    className={`${styles.filterButton} ${styles.active}`}
    onClick={onDelete}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onDelete();
      }
    }}
  >
    <Typography
      variant="body2"
      fontWeight={600}
      noWrap
      sx={{ color: "inherit" }}
    >
      {label}
    </Typography>
    <CloseIcon
      fontSize="small"
      sx={{
        ml: 0.5,
        fontSize: "1.1rem",
        color: "inherit",
        opacity: 0.8,
        transition: "opacity 0.2s ease, color 0.2s ease",
        "&:hover": {
          opacity: 1,
          color: "#ef4444",
        },
      }}
    />
  </div>
);

export const INITIAL_VIDEO_FILTERS: VideoFiltersValue = {
  search: "",
  ordering: "",
  channel: null,
  ownerUsernames: [],
  typeSlugs: [],
  disciplineIds: [],
  cursus: [],
  tagSlugs: [],
  page: 1,
};

import { useTranslation } from "@/src/hooks/useTranslation";

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { t } = useTranslation();
  const { config } = useAppConfig();

  const hideUser = config?.video?.hide_user_filter === true || !showUserFilter;
  const hideTags = config?.video?.hide_tags === true;
  const hideDisciplines = config?.video?.hide_disciplines === true;
  const hideCursus = config?.video?.hide_cursus === true;
  const hideTypes = config?.video?.hide_types === true;

  const { fetchAll: fetchUsers } = useUsers();
  const { fetchAll: fetchChannels } = useChannel();
  const { fetchAll: fetchTags } = useTagsHook();

  const orderingOptions: SelectOption[] = useMemo(
    () => [
      { label: t("filters.newest"), value: "-created_at" },
      { label: t("filters.oldest"), value: "created_at" },
      { label: t("filters.titleAZ"), value: "title" },
      { label: t("filters.titleZA"), value: "-title" },
    ],
    [t]
  );

  const fetchUsersOptions = useCallback(
    async (search: string) => {
      const usersList = await fetchUsers(search);
      return usersList.map((u) => ({
        label: getUserDisplayName(u, config?.authentication, true),
        value: u.username,
      }));
    },
    [fetchUsers]
  );

  const fetchChannelsOptions = useCallback(
    async (search: string) => {
      const channelsList = await fetchChannels({ search });
      return channelsList.map((c) => ({
        label: c.title,
        value: String(c.id),
      }));
    },
    [fetchChannels]
  );

  const fetchTagsOptions = useCallback(
    async (search: string) => {
      const tagsList = await fetchTags(search);
      return tagsList.map((t) => ({
        label: t.name,
        value: t.slug,
      }));
    },
    [fetchTags]
  );

  const cursusOptions = useMemo(
    () => getCursusOptions(t),
    [t]
  );

  const typeOptions = useMemo(
    () =>
      types.map((type) => {
        const translated = t(`type.${type.slug}`);
        return {
          label: translated !== `type.${type.slug}` ? translated : type.title,
          value: type.slug,
        };
      }),
    [types, t],
  );

  const disciplineOptions = useMemo<SelectOption[]>(
    () =>
      disciplines.map((discipline) => {
        const translated = t(`discipline.${discipline.slug}`);
        return {
          label: translated !== `discipline.${discipline.slug}` ? translated : discipline.title,
          value: String(discipline.id),
        };
      }),
    [disciplines, t],
  );

  const selectedChannelLabel = value.channel ? `${t("common.channel")} ${value.channel}` : null;

  const selectedUsers = useMemo(() => {
    return value.ownerUsernames.map((username) => {
      const fullUser = users.find((u) => u.username === username);
      return {
        label: fullUser ? getUserDisplayName(fullUser, config?.authentication, true) : username,
        value: username,
      };
    });
  }, [value.ownerUsernames, users]);

  const selectedTypes = typeOptions.filter((option) =>
    value.typeSlugs.includes(String(option.value)),
  );

  const selectedDisciplines = disciplineOptions.filter((option) =>
    value.disciplineIds.includes(Number(option.value)),
  );

  const selectedCursus = cursusOptions.filter((option) =>
    value.cursus.includes(option.value),
  );

  const selectedTags = useMemo(() => {
    return value.tagSlugs.map((slug) => {
      const fullTag = tags.find((t) => t.slug === slug);
      return {
        label: fullTag ? fullTag.name : slug,
        value: slug,
      };
    });
  }, [value.tagSlugs, tags]);

  const removeValue = <T extends string | number>(
    list: T[],
    target: T,
  ): T[] => {
    return list.filter((item) => item !== target);
  };

  const secondaryFiltersCount =
    (!hideUser ? value.ownerUsernames.length : 0) +
    (!hideDisciplines ? selectedDisciplines.length : 0) +
    (!hideCursus ? selectedCursus.length : 0) +
    (!hideTags ? selectedTags.length : 0);

  const appliedFiltersCount =
    (value.search.trim() ? 1 : 0) +
    (value.channel ? 1 : 0) +
    (!hideTypes ? selectedTypes.length : 0) +
    secondaryFiltersCount;

  return (
    <div className={styles.filtersContent}>
      {/* Primary horizontal filter row */}
      <div className={styles.row}>
        {/* Search bar */}
        <TextField
          id="video-filters-search"
          size="small"
          placeholder={t("filters.searchPlaceholder")}
          value={value.search}
          onChange={(event) => {
            const nextSearch =
              typeof event.target.value === "string"
                ? event.target.value
                : "";

            if (nextSearch === value.search) return;
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
          sx={{
            minWidth: isMobile ? "100%" : "220px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "9999px",
              paddingLeft: "12px",
            },
          }}
        />

        {/* Tri/Ordering Pill */}
        <FilterDropdown
          title={t("filters.sort")}
          options={orderingOptions}
          selectedValues={value.ordering ? [value.ordering] : []}
          multiple={false}
          onChange={(nextValues) => {
            const nextOrdering = nextValues[0] ?? "";
            if (nextOrdering === value.ordering) return;
            onChange({
              ...value,
              ordering: nextOrdering,
            });
          }}
        />

        {/* Channel Pill */}
        {showChannelFilter && (
          <AsyncFilterDropdown
            title={t("common.channel")}
            selectedValues={value.channel ? [String(value.channel)] : []}
            fetchOptions={fetchChannelsOptions}
            multiple={false}
            onChange={(nextValues) => {
              const nextChannel = nextValues[0] ? Number(nextValues[0]) : null;
              if (nextChannel === value.channel) return;
              onChange({ ...value, channel: nextChannel });
            }}
          />
        )}

        {/* Types Pill */}
        {!hideTypes && (
          <FilterDropdown
            title={t("filters.types")}
            options={typeOptions}
            selectedValues={value.typeSlugs}
            onChange={(nextTypeSlugs) => {
              if (haveSameValues(value.typeSlugs, nextTypeSlugs)) return;
              onChange({
                ...value,
                typeSlugs: nextTypeSlugs,
              });
            }}
          />
        )}

        {/* Advanced Filters Toggle Button */}
        <div
          className={`${styles.filterButton} ${showAdvanced || secondaryFiltersCount > 0 ? styles.active : ""}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowAdvanced(!showAdvanced);
            }
          }}
        >
          <Badge
            badgeContent={secondaryFiltersCount}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.7rem",
                height: 18,
                minWidth: 18,
              },
            }}
          >
            <TuneIcon fontSize="small" sx={{ color: "inherit" }} />
          </Badge>
          <Typography variant="body2" fontWeight={600} sx={{ color: "inherit" }}>
            Filtres avancés
          </Typography>
          {showAdvanced ? (
            <ExpandLessIcon fontSize="small" sx={{ color: "inherit" }} />
          ) : (
            <ExpandMoreIcon fontSize="small" sx={{ color: "inherit" }} />
          )}
        </div>
      </div>

      {/* Advanced Secondary Filters Panel */}
      <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 1.5,
            borderRadius: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {/* User Pill (Async multi select) */}
          {!hideUser && (
            <AsyncFilterDropdown
              title={t("filters.author")}
              selectedValues={value.ownerUsernames}
              fetchOptions={fetchUsersOptions}
              onChange={(nextOwnerUsernames) => {
                if (haveSameValues(value.ownerUsernames, nextOwnerUsernames)) return;
                onChange({ ...value, ownerUsernames: nextOwnerUsernames });
              }}
            />
          )}

          {/* Disciplines Pill (Multi select) */}
          {!hideDisciplines && (
            <FilterDropdown
              title={t("common.disciplines")}
              options={disciplineOptions}
              selectedValues={value.disciplineIds.map(String)}
              onChange={(nextValues) => {
                const nextDisciplineIds = nextValues.map(Number);
                if (haveSameValues(value.disciplineIds, nextDisciplineIds)) return;
                onChange({
                  ...value,
                  disciplineIds: nextDisciplineIds,
                });
              }}
            />
          )}

          {/* Cursus Pill (Multi select) */}
          {!hideCursus && (
            <FilterDropdown
              title={t("filters.cursus")}
              options={cursusOptions}
              selectedValues={value.cursus}
              onChange={(nextCursus) => {
                if (haveSameValues(value.cursus, nextCursus)) return;
                onChange({
                  ...value,
                  cursus: nextCursus,
                });
              }}
            />
          )}

          {/* Mots-clés Pill (Async multi select) */}
          {!hideTags && (
            <AsyncFilterDropdown
              title={t("filters.keywords")}
              selectedValues={value.tagSlugs}
              fetchOptions={fetchTagsOptions}
              onChange={(nextTagSlugs) => {
                if (haveSameValues(value.tagSlugs, nextTagSlugs)) return;
                onChange({
                  ...value,
                  tagSlugs: nextTagSlugs,
                });
              }}
            />
          )}
        </Paper>
      </Collapse>

      {/* Active Filter Chips Row with Clear Action */}
      {appliedFiltersCount > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
            gap: "12px",
            pt: 1.5,
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Box className={styles.chips}>
            {value.search.trim() && (
              <FilterChip
                label={`${t("filters.search")} : ${value.search}`}
                onDelete={() => onChange({ ...value, search: "" })}
              />
            )}

            {showChannelFilter && value.channel && (
              <FilterChip
                label={selectedChannelLabel ?? `${t("common.channel")} : ${value.channel}`}
                onDelete={() => onChange({ ...value, channel: null })}
              />
            )}

            {!hideUser && selectedUsers.map((u) => (
              <FilterChip
                key={`user-${u.value}`}
                label={`${t("filters.author")} : ${u.label}`}
                onDelete={() =>
                  onChange({
                    ...value,
                    ownerUsernames: removeValue(value.ownerUsernames, u.value),
                  })
                }
              />
            ))}

            {!hideTypes && selectedTypes.map((option) => (
              <FilterChip
                key={`type-${option.value}`}
                label={`${t("filters.types")} : ${option.label}`}
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

            {!hideDisciplines && selectedDisciplines.map((option) => (
              <FilterChip
                key={`discipline-${option.value}`}
                label={`${t("common.disciplines")} : ${option.label}`}
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

            {!hideCursus && selectedCursus.map((option) => (
              <FilterChip
                key={`cursus-${option.value}`}
                label={`${t("filters.cursus")} : ${option.label}`}
                onDelete={() =>
                  onChange({
                    ...value,
                    cursus: removeValue(value.cursus, option.value),
                  })
                }
              />
            ))}

            {!hideTags && selectedTags.map((option) => (
              <FilterChip
                key={`tag-${option.value}`}
                label={`${t("filters.keywords")} : ${option.label}`}
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

          <Button
            onClick={() => onChange(INITIAL_VIDEO_FILTERS)}
            variant="tertiary"
            size="small"
            className={styles.clearFiltersBtn}
          >
            {t("filters.clearFilters")}
          </Button>
        </Box>
      )}
    </div>
  );
}
