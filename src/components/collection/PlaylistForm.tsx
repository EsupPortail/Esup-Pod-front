"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { Alert, Button } from "@openfun/cunningham-react";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import {
  PLAYLIST_ORDER_OPTIONS,
  type CollectionOrder,
} from "@/src/constants/collection";
import styles from "@/src/app/playlist/edit/[slug]/styles.module.css";
import { useTranslation } from "@/src/hooks/useTranslation";

export type PlaylistFormValues = {
  title: string;
  description: string;
  is_public: boolean;
  is_password_required: boolean;
  password: string;
  default_order: CollectionOrder;
};

type PlaylistFormProps = {
  control: Control<PlaylistFormValues>;
  errors: FieldErrors<PlaylistFormValues>;
  isSubmitting: boolean;
  isMobile: boolean;
  isLoading: boolean;
  submitLabel: string;
  secondaryActions?: React.ReactNode;
};

export function PlaylistForm({
  control,
  errors,
  isSubmitting,
  isMobile,
  isLoading,
  submitLabel,
  secondaryActions,
}: PlaylistFormProps) {
  const isPublic = useWatch({ control, name: "is_public" });
  const isPasswordRequired = useWatch({
    control,
    name: "is_password_required",
  });
  const { t } = useTranslation();

  return (
    <>
      <div className={styles["form-actions"]}>
        <div className={styles["form-actions-buttons"]}>
          {secondaryActions}
          <Button
            fullWidth={isMobile}
            size="small"
            type="submit"
            color="success"
            variant="primary"
            disabled={isSubmitting || isLoading}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
      <Divider />

      {/* ---------- Title ---------- */}
      <Controller
        name="title"
        control={control}
        rules={{ required: t("common.titleRequired") }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            label={t("table.title")}
            error={Boolean(errors.title)}
            helperText={errors.title?.message ?? t("playlists.titleHelper")}
          />
        )}
      />

      {/* ---------- Description ---------- */}
      <Controller
        name="description"
        control={control}
        rules={{ required: t("common.descRequired") }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            multiline
            rows={3}
            label={t("videoEdit.descriptionLabel")}
            error={Boolean(errors.description)}
            helperText={
              errors.description?.message ?? t("playlists.descriptionHelper")
            }
          />
        )}
      />

      {/* ---------- Playlist visibility ---------- */}
      <fieldset className={styles["restreint-fields"]}>
        <legend>{t("playlists.accessRestrictions")}</legend>
        <Controller
          name="is_public"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(field.value)}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
              label={t("playlists.publicPlaylist")}
            />
          )}
        />

        {isPublic && (
          <div>
            <Controller
              name="is_password_required"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(_, checked) => field.onChange(checked)}
                      />
                    }
                    label={t("playlists.protectWithPassword")}
                  />
                </FormControl>
              )}
            />

            {isPasswordRequired && (
              <Controller
                name="password"
                control={control}
                rules={{
                  validate: (value) =>
                    value.trim().length === 0 ||
                    value.trim().length >= 8 ||
                    t("auth.passwordMinLength", { length: 8 }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    autoComplete="new-password"
                    label={t("playlists.passwordLabel")}
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password?.message ?? t("playlists.passwordHelper")
                    }
                  />
                )}
              />
            )}
          </div>
        )}
        {isPublic ? (
          <Alert>{t("playlists.visibleToAll")}</Alert>
        ) : (
          <Alert>{t("playlists.visibleToOwner")}</Alert>
        )}
      </fieldset>

      {/* ---------- Order playlist ---------- */}
      <Controller
        name="default_order"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            fullWidth
            label={t("playlists.defaultSortLabel")}
            helperText={t("playlists.defaultSortHelper")}
          >
            {PLAYLIST_ORDER_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </>
  );
}
