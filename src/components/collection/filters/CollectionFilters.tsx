"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@openfun/cunningham-react";
import { getUserDisplayName } from "@/src/constants/user";
import type { Channel, User } from "@/src/types";
import styles from "@/src/components/video/filters/styles.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";

import FilterDropdown from "@/src/components/video/filters/FilterDropdown";
import AsyncFilterDropdown from "@/src/components/video/filters/AsyncFilterDropdown";
import { useUsers } from "@/src/hooks/useUsers";
import { useChannel } from "@/src/hooks/useChannel";
import { useCallback } from "react";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import DateFilterDropdown from "./DateFilterDropdown";

export type CollectionFilterMode = "channels" | "playlists" | "themes";

export type CollectionFiltersValue = {
  search: string;
  ordering: string;
  ownerUsernames: string[];
  createdAtGte: string;
  createdAtLte: string;
  channel: number | null;
  page: number;
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
    sx={{
      m: 0.25,
      borderRadius: "16px",
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      color: "var(--text-color, #0f172a)",
      border: "1px solid rgba(59, 130, 246, 0.35)",
      fontWeight: 600,
      fontSize: "0.8rem",
      "html[data-theme='dark'] &": {
        backgroundColor: "rgba(59, 130, 246, 0.25)",
        color: "#ffffff",
        borderColor: "#3b82f6",
        boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
      },
      "& .MuiChip-deleteIcon": {
        color: "rgba(148, 163, 184, 0.9)",
        "&:hover": {
          color: "#ef4444",
        },
      },
    }}
  />
);

export const INITIAL_COLLECTION_FILTERS: CollectionFiltersValue = {
  search: "",
  ordering: "",
  ownerUsernames: [],
  createdAtGte: "",
  createdAtLte: "",
  channel: null,
  page: 1,
};

export default function CollectionFilters({
  mode,
  value,
  users = [],
  channels = [],
  showUserFilter = true,
  onChange,
}: Props) {
  const { config } = useAppConfig();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const isThemeMode = mode === "themes";
  const hasDateFilters = mode === "channels" || mode === "playlists";
  const hasOwnerFilter = !isThemeMode && showUserFilter;

  const { fetchAll: fetchUsers } = useUsers();
  const { fetchAll: fetchChannels } = useChannel();

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

  const selectedUsers = useMemo(() => {
    return value.ownerUsernames.map((username) => {
      const fullUser = users.find((u) => u.username === username);
      return {
        label: fullUser ? getUserDisplayName(fullUser, config?.authentication, true) : username,
        value: username,
      };
    });
  }, [value.ownerUsernames, users]);

  const selectedChannel =
    channels.find((channel) => String(channel.id) === String(value.channel)) ??
    null;

  const appliedFiltersCount =
    (value.search.trim() ? 1 : 0) +
    (hasOwnerFilter ? value.ownerUsernames.length : 0) +
    (hasDateFilters && value.createdAtGte ? 1 : 0) +
    (hasDateFilters && value.createdAtLte ? 1 : 0) +
    (isThemeMode && value.channel ? 1 : 0);

  return (
    <div className={styles.filtersContent}>
      <div className={styles.row}>
        <TextField
          id="collection-filters-search"
          size="small"
          placeholder="Rechercher..."
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
          sx={{
            minWidth: isMobile ? "100%" : "220px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "9999px",
              backgroundColor: "#fff",
              paddingLeft: "12px",
            },
          }}
        />

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

        {isThemeMode && (
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

        {hasOwnerFilter && (
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

        {hasDateFilters && (
          <DateFilterDropdown
            createdAtGte={value.createdAtGte}
            createdAtLte={value.createdAtLte}
            onChange={(gte, lte) => {
              if (gte === value.createdAtGte && lte === value.createdAtLte) return;
              onChange({ ...value, createdAtGte: gte, createdAtLte: lte });
            }}
          />
        )}
      </div>

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

            {isThemeMode && selectedChannel && (
              <FilterChip
                label={`Chaîne : ${selectedChannel.title}`}
                onDelete={() => onChange({ ...value, channel: null })}
              />
            )}

            {hasOwnerFilter &&
              selectedUsers.map((u) => (
                <FilterChip
                  key={`user-${u.value}`}
                  label={`Auteur : ${u.label}`}
                  onDelete={() =>
                    onChange({
                      ...value,
                      ownerUsernames: value.ownerUsernames.filter(
                        (v) => v !== u.value,
                      ),
                    })
                  }
                />
              ))}

            {hasDateFilters && value.createdAtGte && (
              <FilterChip
                label={`Créé après : ${value.createdAtGte.replace("T", " ")}`}
                onDelete={() => onChange({ ...value, createdAtGte: "" })}
              />
            )}

            {hasDateFilters && value.createdAtLte && (
              <FilterChip
                label={`Créé avant : ${value.createdAtLte.replace("T", " ")}`}
                onDelete={() => onChange({ ...value, createdAtLte: "" })}
              />
            )}
          </Box>

          <Button
            onClick={() => onChange(INITIAL_COLLECTION_FILTERS)}
            variant="tertiary"
            size="small"
            className={styles.clearFiltersBtn}
          >
            Effacer les filtres
          </Button>
        </Box>
      )}
    </div>
  );
}
