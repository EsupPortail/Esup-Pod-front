"use client";

import {
  Alert,
  Checkbox,
  Button,
  FileUploader,
  VariantType,
} from "@openfun/cunningham-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LinearProgress from "@mui/material/LinearProgress";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import BackButton from "@/src/components/BackButton/BackButton";
import styles from "./styles.module.css";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import { useAppConfig } from "@/src/hooks/useAppConfig";

export const breadcrumbLabel = "Ajouter une vidéo";

type AddVideoFormValues = {
  acceptTerm: boolean;
  videoFile: File | null;
};

export default function AddVideo() {
  const router = useRouter();
  const { accessToken, refresh } = useAuth();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { config } = useAppConfig();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError: setFieldError,
    clearErrors,
  } = useForm<AddVideoFormValues>({
    defaultValues: {
      acceptTerm: false,
      videoFile: null,
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!mounted || isInitializing || !isAuthenticated) {
    return <CenteredLoader />;
  }

  const onSubmit = async (data: AddVideoFormValues) => {
    setError(null);
    setIsRedirecting(false);

    try {
      if (!data.videoFile) {
        setFieldError("videoFile", {
          type: "required",
          message: "Veuillez sélectionner un fichier.",
        });
        setError("Veuillez sélectionner un fichier vidéo.");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.videoFile.name);
      formData.append("video_file", data.videoFile);

      const res = await authFetch(getRoutes().video.add, {
        method: "POST",
        body: formData,
        accessToken,
        onRefresh: refresh,
      });
      setIsRedirecting(true);

      // Barre de chargement
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 200);
        });
      });

      const newVid = await requestJson<{ slug: string }>(res);

      router.push(`/video/edit/${newVid.slug}`);
    } catch (err: unknown) {
      setIsRedirecting(false);
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  return (
    <div>
      <BackButton label="Retour" />

      <h1>Ajouter une vidéo</h1>

      {/* ---------- Alertes d’erreur ---------- */}
      {error && (
        <Alert canClose type={VariantType.ERROR} aria-live="assertive">
          {error}
        </Alert>
      )}

      {/* ---------- Étape de redirection  ---------- */}
      {isRedirecting ? (
        <div>
          <Alert canClose type={VariantType.SUCCESS} aria-live="polite">
            Votre vidéo est en train d'être téléchargée sur POD. Veuillez ne pas
            fermer la page.
          </Alert>
          <LinearProgress
            sx={{ padding: "5px" }}
            className={styles.linearProgress}
            aria-label="Loading..."
          />
        </div>
      ) : (
        <form
          className={styles.form}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* ---------- Informations générales ---------- */}
          <Alert
            additional={
              <>
                La taille du fichier doit être <b>inférieure à {config?.encoding?.max_upload_size_gb ?? 2} Go</b>.
                <br />
                Le temps d’envoi dépend de la taille de votre fichier et de
                votre vitesse de téléchargement.
                <br />
                <b>
                  Pendant l’envoi de votre fichier, ne fermez pas votre
                  navigateur avant d'avoir reçu un message de succès ou d’échec.
                </b>
              </>
            }
            aria-live="polite"
          >
            Informations
          </Alert>

          {/* ---------- FileUpload ----------*/}
          <FileUploader
            bigText="Choisissez un fichier audio ou vidéo"
            fullWidth={true}
            state={errors.videoFile ? "error" : "default"}
            onFilesChange={(event) => {
              const file = event.target.value?.[0] ?? null;
              setValue("videoFile", file, { shouldValidate: true });
              if (file) {
                clearErrors("videoFile");
              }
            }}
            accept={config?.encoding?.allowed_extensions?.map(ext => `.${ext}`).join(", ") || ".mp4, .avi, .mkv"}
            aria-label="Sélectionner un fichier audio ou vidéo"
            aria-describedby="videoFile-error"
            aria-required="true"
            text={
              errors.videoFile?.message ??
              `Les formats suivants sont supportés : ${config?.encoding?.allowed_extensions?.join(", ") || "mp4, avi, mkv"}.`
            }
          />
          {/* Message d’erreur lié au FileUploader */}
          {errors.videoFile && (
            <p
              id="videoFile-error"
              style={{ color: "red", marginTop: "0.25rem" }}
            >
              {errors.videoFile.message}
            </p>
          )}

          {/* ---------- Conditions d’utilisation ---------- */}
          <fieldset className={styles.bloc_terms}>
            <legend>Conditions d’utilisation</legend>

            <p>
              <b>
                Attention ! Assurez‑vous de respecter le code de la propriété
                intellectuelle avant de publier une vidéo :
              </b>
            </p>

            <p>
              Je confirme que je dispose des autorisations nécessaires signées
              par les parties concernées par la publication de ce média, en ce
              compris le consentement relatif au droit à l’image et au
              traitement des données personnelles. Je certifie que l’ensemble
              des personnes concernées ont bénéficié d’une information complète
              relative au traitement de leurs données personnelles, conformément
              aux dispositions des articles 13 et 14 du RGPD.
            </p>

            <Checkbox
              className={styles.bloc_terms_checkbox}
              label="J'atteste de respecter le code de la propriété intellectuelle en publiant ma vidéo."
              fullWidth
              state={errors.acceptTerm ? "error" : "default"}
              aria-describedby="acceptTerm-error"
              aria-required="true"
              {...register("acceptTerm", {
                required: "Veuillez accepter les conditions d'utilisation.",
                validate: (value) =>
                  Boolean(value) ||
                  "Veuillez accepter les conditions d'utilisation.",
              })}
            />
            {/* Message d’erreur lié à la Checkbox */}
            {errors.acceptTerm && (
              <p
                id="acceptTerm-error"
                style={{ color: "red", marginTop: "0.25rem" }}
              >
                {errors.acceptTerm.message}
              </p>
            )}
          </fieldset>

          {/* ---------- Bouton de soumission ---------- */}
          <Button
            type="submit"
            color="success"
            disabled={isSubmitting || isRedirecting}
          >
            Ajouter une vidéo
          </Button>
        </form>
      )}
    </div>
  );
}
