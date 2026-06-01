"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Input, Select } from "@openfun/cunningham-react";
import { CURSUS_OPTIONS } from "@/src/constants/cursus";
import { getUserDisplayName } from "@/src/constants/user";
import type { Discipline, Tags, Type, User } from "@/src/types/interface";
import styles from "./styles.module.css";

export type VideoFiltersValue = {
  search: string;
  ordering: string;
  channel: number | null;
  userIds: number[];
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

export const INITIAL_VIDEO_FILTERS: VideoFiltersValue = {
  search: "",
  ordering: "",
  channel: null,
  userIds: [],
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
  showUserFilter = false,
  onChange,
}: Props) {
  const userOptions = useMemo<SelectOption[]>(
    () =>
      users.map((user) => ({
        label: getUserDisplayName(user),
        value: String(user.id),
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

  const selectedOrdering =
    ORDERING_OPTIONS.find((option) => option.value === value.ordering) ?? null;

  const selectedChannel =
    channelOptions.find((option) => option.value === String(value.channel)) ??
    null;

  const selectedUsers = userOptions.filter((option) =>
    value.userIds.includes(Number(option.value)),
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Select
          key={`channel-select-${channelOptions.length}`}
          label="Chaîne"
          clearable
          showLabelWhenSelected
          options={channelOptions}
          value={value.channel == null ? undefined : String(value.channel)}
          onChange={(event) => {
            const nextChannel =
              typeof event.target.value === "string"
                ? Number(event.target.value)
                : null;

            if (nextChannel === value.channel) {
              return;
            }

            onChange({
              ...value,
              channel: nextChannel,
            });
          }}
          className={styles.field}
        />

        {showUserFilter && (
          <Select
            key={`user-select-${userOptions.length}`}
            label="Utilisateur"
            multi
            searchable
            clearable
            showLabelWhenSelected
            selectedItemsStyle="text"
            menuOptionsStyle="checkbox"
            options={userOptions}
            value={value.userIds.map(String)}
            onChange={(event) => {
              const nextUserIds = Array.isArray(event.target.value)
                ? event.target.value.map(Number)
                : [];

              if (haveSameValues(value.userIds, nextUserIds)) {
                return;
              }

              onChange({
                ...value,
                userIds: nextUserIds,
              });
            }}
            className={styles.field}
          />
        )}

        <Select
          key={`type-select-${typeOptions.length}`}
          label="Type"
          multi
          clearable
          showLabelWhenSelected
          selectedItemsStyle="text"
          menuOptionsStyle="checkbox"
          options={typeOptions}
          value={value.typeSlugs}
          onChange={(event) => {
            const nextTypeSlugs = Array.isArray(event.target.value)
              ? event.target.value
              : [];

            if (haveSameValues(value.typeSlugs, nextTypeSlugs)) {
              return;
            }

            onChange({
              ...value,
              typeSlugs: nextTypeSlugs,
            });
          }}
          className={styles.field}
        />

        <Select
          key={`discipline-select-${disciplineOptions.length}`}
          label="Discipline"
          multi
          clearable
          showLabelWhenSelected
          selectedItemsStyle="text"
          menuOptionsStyle="checkbox"
          options={disciplineOptions}
          value={value.disciplineIds.map(String)}
          onChange={(event) => {
            const nextDisciplineIds = Array.isArray(event.target.value)
              ? event.target.value.map(Number)
              : [];

            if (haveSameValues(value.disciplineIds, nextDisciplineIds)) {
              return;
            }

            onChange({
              ...value,
              disciplineIds: nextDisciplineIds,
            });
          }}
          className={styles.field}
        />

        <Select
          label="Cursus"
          multi
          clearable
          showLabelWhenSelected
          selectedItemsStyle="text"
          menuOptionsStyle="checkbox"
          options={CURSUS_OPTIONS}
          value={value.cursus}
          onChange={(event) => {
            const nextCursus = Array.isArray(event.target.value)
              ? event.target.value
              : [];

            if (haveSameValues(value.cursus, nextCursus)) {
              return;
            }

            onChange({
              ...value,
              cursus: nextCursus,
            });
          }}
          className={styles.field}
        />

        <Select
          key={`tag-select-${tagOptions.length}`}
          label="Mots-clés"
          multi
          searchable
          clearable
          showLabelWhenSelected
          selectedItemsStyle="text"
          menuOptionsStyle="checkbox"
          options={tagOptions}
          value={value.tagSlugs}
          onChange={(event) => {
            const nextTagSlugs = Array.isArray(event.target.value)
              ? event.target.value
              : [];

            if (haveSameValues(value.tagSlugs, nextTagSlugs)) {
              return;
            }

            onChange({
              ...value,
              tagSlugs: nextTagSlugs,
            });
          }}
          className={styles.field}
        />
      </div>
      <Box className={styles.chips}>
        {value.search.trim() && (
          <Chip
            label={`Recherche : ${value.search}`}
            onDelete={() => onChange({ ...value, search: "" })}
          />
        )}

        {selectedOrdering && (
          <Chip
            label={`Tri : ${selectedOrdering.label}`}
            onDelete={() =>
              onChange({
                ...value,
                ordering: "",
              })
            }
          />
        )}

        {selectedChannel && (
          <Chip
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
            <Chip
              key={`user-${option.value}`}
              label={`Utilisateur : ${option.label}`}
              onDelete={() =>
                onChange({
                  ...value,
                  userIds: removeValue(value.userIds, Number(option.value)),
                })
              }
            />
          ))}

        {selectedTypes.map((option) => (
          <Chip
            key={`type-${option.value}`}
            label={`Type : ${option.label}`}
            onDelete={() =>
              onChange({
                ...value,
                typeSlugs: removeValue(value.typeSlugs, String(option.value)),
              })
            }
          />
        ))}

        {selectedDisciplines.map((option) => (
          <Chip
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
          <Chip
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
          <Chip
            key={`tag-${option.value}`}
            label={`Mot-clé : ${option.label}`}
            onDelete={() =>
              onChange({
                ...value,
                tagSlugs: removeValue(value.tagSlugs, String(option.value)),
              })
            }
          />
        ))}
      </Box>
      <div className={styles.searchRow}>
        <Select
          className={styles.orderingField}
          label="Tri"
          clearable
          showLabelWhenSelected
          options={ORDERING_OPTIONS}
          value={value.ordering || undefined}
          onChange={(event) => {
            const nextOrdering =
              typeof event.target.value === "string" ? event.target.value : "";

            if (nextOrdering === value.ordering) {
              return;
            }

            onChange({
              ...value,
              ordering: nextOrdering,
            });
          }}
        />

        <Input
          label="Recherche"
          icon={<span className="material-icons">search</span>}
          value={value.search}
          onChange={(event) => {
            const nextSearch =
              typeof event.target.value === "string" ? event.target.value : "";

            if (nextSearch === value.search) {
              return;
            }

            onChange({
              ...value,
              search: nextSearch,
            });
          }}
        />
      </div>
    </div>
  );
}
