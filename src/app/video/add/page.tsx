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
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
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
  emptyTitle: string;
};

export default function AddVideo() {
  const router = useRouter();
  const { accessToken, refresh } = useAuth();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { config } = useAppConfig();

  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError: setFieldError,
    clearErrors,
  } = useForm<AddVideoFormValues>({
    defaultValues: { acceptTerm: false, videoFile: null, emptyTitle: "" },
  });

  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!mounted || isInitializing || !isAuthenticated) {
    return <CenteredLoader />;
  }

  /* ---- Submit import with video file ---- */
  const onSubmitImport = async (data: AddVideoFormValues) => {
    setError(null);
    setIsRedirecting(false);

    try {
      if (!data.videoFile) {
        setFieldError("videoFile", { type: "required", message: "Veuillez sélectionner un fichier." });
        setError("Veuillez sélectionner un fichier vidéo.");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.videoFile.name);
      formData.append("video_file", data.videoFile);

      const res = await authFetch(getRoutes().video.add, {
        method: "POST", body: formData, accessToken, onRefresh: refresh,
      });
      setIsRedirecting(true);

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => setTimeout(resolve, 200));
      });

      const newVid = await requestJson<{ slug: string }>(res);
      router.push(`/video/edit/${newVid.slug}`);
    } catch (err: unknown) {
      setIsRedirecting(false);
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  /* ---- Submit empty card (no file) ---- */
  const onSubmitEmptyCard = async (data: AddVideoFormValues) => {
    setError(null);
    setIsRedirecting(false);

    if (!data.emptyTitle.trim()) {
      setFieldError("emptyTitle", { type: "required", message: "Le titre est obligatoire." });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.emptyTitle.trim());

      const res = await authFetch(getRoutes().video.add, {
        method: "POST", body: formData, accessToken, onRefresh: refresh,
      });
      setIsRedirecting(true);
      setIsEmptyModalOpen(false);

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => setTimeout(resolve, 200));
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
      <BackButton label="Retour" onClick={() => router.back()} />
      <h1 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 16 }}>Importer une vidéo</h1>

      {error && <Alert canClose type={VariantType.ERROR} aria-live="assertive">{error}</Alert>}

      {isRedirecting ? (
        <div>
          <Alert canClose type={VariantType.SUCCESS} aria-live="polite">
            Votre vidéo est en cours de traitement sur POD. Ne fermez pas la page...
          </Alert>
          <LinearProgress sx={{ padding: "5px" }} className={styles.linearProgress} aria-label="Loading..." />
        </div>
      ) : (
        <form className={styles.form} style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSubmit(onSubmitImport)}>
          <Alert
            additional={
              <>
                La taille du fichier doit être <b>inférieure à {config?.encoding?.max_upload_size_gb ?? 2} Go</b>.
                <br />Le temps d&apos;envoi dépend de la taille de votre fichier et de votre vitesse de téléchargement.
                <br /><b>Pendant l&apos;envoi, ne fermez pas votre navigateur avant d&apos;avoir reçu un message de succès ou d&apos;échec.</b>
              </>
            }
            aria-live="polite"
          >
            Informations
          </Alert>

          <FileUploader
            bigText="Choisissez un fichier audio ou vidéo"
            fullWidth={true}
            state={errors.videoFile ? "error" : "default"}
            onFilesChange={(event) => {
              const file = event.target.value?.[0] ?? null;
              setValue("videoFile", file, { shouldValidate: true });
              if (file) clearErrors("videoFile");
            }}
            accept={config?.encoding?.allowed_extensions?.map((ext: string) => `.${ext}`).join(", ") || ".mp4, .avi, .mkv"}
            aria-label="Sélectionner un fichier audio ou vidéo"
            aria-describedby="videoFile-error"
            aria-required="true"
            text={errors.videoFile?.message ?? `Les formats suivants sont supportés : ${config?.encoding?.allowed_extensions?.join(", ") || "mp4, avi, mkv"}.`}
          />
          {errors.videoFile && <p id="videoFile-error" style={{ color: "red", marginTop: "0.25rem" }}>{errors.videoFile.message}</p>}

          <fieldset className={styles.bloc_terms}>
            <legend>Conditions d&apos;utilisation</legend>
            <p><b>Attention ! Assurez‑vous de respecter le code de la propriété intellectuelle avant de publier une vidéo :</b></p>
            <p>Je confirme que je dispose des autorisations nécessaires signées par les parties concernées par la publication de ce média, en ce compris le consentement relatif au droit à l&apos;image et au traitement des données personnelles. Je certifie que l&apos;ensemble des personnes concernées ont bénéficié d&apos;une information complète relative au traitement de leurs données personnelles, conformément aux dispositions des articles 13 et 14 du RGPD.</p>
            <Checkbox
              className={styles.bloc_terms_checkbox}
              label="J'atteste de respecter le code de la propriété intellectuelle en publiant ma vidéo."
              fullWidth
              state={errors.acceptTerm ? "error" : "default"}
              aria-describedby="acceptTerm-error"
              aria-required="true"
              {...register("acceptTerm", {
                required: "Veuillez accepter les conditions d'utilisation.",
                validate: (value) => Boolean(value) || "Veuillez accepter les conditions d'utilisation.",
              })}
            />
            {errors.acceptTerm && <p id="acceptTerm-error" style={{ color: "red", marginTop: "0.25rem" }}>{errors.acceptTerm.message}</p>}
          </fieldset>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
            <Button type="submit" color="success" disabled={isSubmitting || isRedirecting}>
              Importer la vidéo
            </Button>
            <Button
              type="button"
              color="neutral"
              variant="secondary"
              disabled={isSubmitting || isRedirecting}
              onClick={() => setIsEmptyModalOpen(true)}
            >
              <NoteAddIcon fontSize="small" style={{ marginRight: 6 }} />
              Passer l&apos;importation (Créer une fiche vide)
            </Button>
          </div>
        </form>
      )}

      {/* Modal pour créer une fiche vide */}
      <Dialog
        open={isEmptyModalOpen}
        onClose={() => setIsEmptyModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <NoteAddIcon sx={{ color: "#00818a" }} />
          Créer une fiche vide
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
              Vous vous apprêtez à créer une fiche vidéo sans fichier média source. Vous pourrez ajouter la vidéo source ultérieurement depuis l&apos;étape <b>&ldquo;Importation&rdquo;</b> de la page d&apos;édition.
            </p>
            <TextField
              label="Titre de la vidéo *"
              fullWidth
              error={Boolean(errors.emptyTitle)}
              helperText={errors.emptyTitle?.message ?? "Saisissez un titre clair et descriptif."}
              InputProps={{ style: { borderRadius: 10 } }}
              {...register("emptyTitle")}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="secondary" color="neutral" onClick={() => setIsEmptyModalOpen(false)}>
            Annuler
          </Button>
          <Button type="button" color="brand" disabled={isSubmitting} onClick={handleSubmit(onSubmitEmptyCard)}>
            Créer la fiche vide
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
