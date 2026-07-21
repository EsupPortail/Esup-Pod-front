"use client";

import { useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { CURSUS_OPTIONS } from "@/src/constants/cursus";
import { getUserDisplayName } from "@/src/constants/user";
import type { Discipline, Tags, Type, User } from "@/src/types";
import { Button } from "@openfun/cunningham-react";
import styles from "./styles.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUsers } from "@/src/hooks/useUsers";
import { useChannel } from "@/src/hooks/useChannel";
import { useTags as useTagsHook } from "@/src/hooks/useTags";
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
    sx={{
      m: 0.25,
      borderRadius: "16px",
      backgroundColor: "rgba(0, 0, 0, 0.06)",
      fontWeight: 500,
      "& .MuiChip-deleteIcon": {
        color: "rgba(0, 0, 0, 0.4)",
        "&:hover": {
          color: "rgba(0, 0, 0, 0.7)",
        },
      },
    }}
  />
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
  const isMobile = useMediaQuery("(max-width: 600px)");

  const { fetchAll: fetchUsers } = useUsers();
  const { fetchAll: fetchChannels } = useChannel();
  const { fetchAll: fetchTags } = useTagsHook();

  const fetchUsersOptions = useCallback(
    async (search: string) => {
      const usersList = await fetchUsers(search);
      return usersList.map((u) => ({
        label: getUserDisplayName(u),
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

  const selectedChannelLabel = value.channel ? `Chaîne ${value.channel}` : null;

  const selectedUsers = useMemo(() => {
    return value.ownerUsernames.map((username) => {
      const fullUser = users.find((u) => u.username === username);
      return {
        label: fullUser ? getUserDisplayName(fullUser) : username,
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

  const selectedCursus = CURSUS_OPTIONS.filter((option) =>
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

  const appliedFiltersCount =
    (value.search.trim() ? 1 : 0) +
    (value.channel ? 1 : 0) +
    (showUserFilter ? value.ownerUsernames.length : 0) +
    selectedTypes.length +
    selectedDisciplines.length +
    selectedCursus.length +
    selectedTags.length;

  return (
    <div className={styles.filtersContent}>
      {/* Vinted-style horizontal scrollable pill bar */}
      <div className={styles.row}>
        {/* Unified inline search bar */}
        <TextField
          id="video-filters-search"
          size="small"
          placeholder="Rechercher une vidéo..."
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
          sx={{
            minWidth: isMobile ? "100%" : "220px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "9999px",
              backgroundColor: "#fff",
              paddingLeft: "12px",
            },
          }}
        />

        {/* Tri/Ordering Pill (Single selection) */}
        <FilterDropdown
          title="Tri"
          options={ORDERING_OPTIONS}
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

        {/* Channel Pill (Async single select) */}
        {showChannelFilter && (
          <AsyncFilterDropdown
            title="Chaîne"
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

        {/* User Pill (Async multi select) */}
        {showUserFilter && (
          <AsyncFilterDropdown
            title="Auteur"
            selectedValues={value.ownerUsernames}
            fetchOptions={fetchUsersOptions}
            onChange={(nextOwnerUsernames) => {
              if (haveSameValues(value.ownerUsernames, nextOwnerUsernames)) return;
              onChange({ ...value, ownerUsernames: nextOwnerUsernames });
            }}
          />
        )}

        {/* Types Pill (Multi select) */}
        <FilterDropdown
          title="Types"
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

        {/* Disciplines Pill (Multi select) */}
        <FilterDropdown
          title="Disciplines"
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

        {/* Cursus Pill (Multi select) */}
        <FilterDropdown
          title="Cursus"
          options={CURSUS_OPTIONS}
          selectedValues={value.cursus}
          onChange={(nextCursus) => {
            if (haveSameValues(value.cursus, nextCursus)) return;
            onChange({
              ...value,
              cursus: nextCursus,
            });
          }}
        />

        {/* Mots-clés Pill (Async multi select) */}
        <AsyncFilterDropdown
          title="Mots-clés"
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
      </div>

      {/* Selected Chips Row with Clean Clear Action */}
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
                label={`Recherche : ${value.search}`}
                onDelete={() => onChange({ ...value, search: "" })}
              />
            )}

            {showChannelFilter && value.channel && (
              <FilterChip
                label={selectedChannelLabel ?? `Chaîne : ${value.channel}`}
                onDelete={() => onChange({ ...value, channel: null })}
              />
            )}

            {showUserFilter && selectedUsers.map((u) => (
              <FilterChip
                key={`user-${u.value}`}
                label={`Auteur : ${u.label}`}
                onDelete={() =>
                  onChange({
                    ...value,
                    ownerUsernames: removeValue(value.ownerUsernames, u.value),
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

          <Button
            onClick={() => onChange(INITIAL_VIDEO_FILTERS)}
            variant="tertiary"
            size="small"
            style={{ fontWeight: 600, fontSize: "0.85rem" }}
          >
            Effacer les filtres
          </Button>
        </Box>
      )}
    </div>
  );
}
