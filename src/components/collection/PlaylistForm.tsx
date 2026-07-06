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

  return (
    <>
      <div className={styles.form_actions}>
        <div className={styles.form_actions_buttons}>
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

      {/* ---------- Titre ---------- */}
      <Controller
        name="title"
        control={control}
        rules={{ required: "Le titre est obligatoire." }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            label="Titre"
            error={Boolean(errors.title)}
            helperText={
              errors.title?.message ??
              "Donnez un titre court et explicite à votre liste de lecture."
            }
          />
        )}
      />

      {/* ---------- Description ---------- */}
      <Controller
        name="description"
        control={control}
        rules={{ required: "La description est obligatoire." }}
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            multiline
            rows={3}
            label="Description"
            error={Boolean(errors.description)}
            helperText={
              errors.description?.message ??
              "Décrivez le contenu et/ou le contexte de votre liste de lecture."
            }
          />
        )}
      />

      {/* ---------- Visibilité de la playlist ---------- */}
      <fieldset className={styles.restreint_fields}>
        <legend>Restrictions d’accès</legend>
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
              label="Liste de lecture publique"
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
                    label="Protéger ma liste de lecture par un mot de passe"
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
                    "Le mot de passe doit contenir au moins 8 caractères.",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    autoComplete="new-password"
                    label="Mot de passe de la liste de lecture"
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password?.message ??
                      "Ajouter un mot de passe pour accéder à la liste de lecture."
                    }
                  />
                )}
              />
            )}
          </div>
        )}
        {isPublic ? (
          <Alert>
            Votre liste de lecture sera visible par tous les utilisateurs.
          </Alert>
        ) : (
          <Alert>
            Votre liste de lecture sera visible uniquement par vous.
          </Alert>
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
            label="Tri de l'affichage des vidéos par défault."
            helperText="Choisissez l'ordre d'affichage des vidéos. "
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
