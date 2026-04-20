"use client";
import {
  Alert,
  Checkbox,
  Button,
  FileUploader,
  Loader,
} from "@openfun/cunningham-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";

export const breadcrumbLabel = "Ajouter une vidéo";

type AddVideoFormValues = {
  acceptTerm: boolean;
  videoFile: File | null;
};

export default function AddVideo() {
  const router = useRouter();
  const { accessToken, refresh } = useAuth();
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
  } = useForm<AddVideoFormValues>({
    defaultValues: {
      acceptTerm: false,
      videoFile: null,
    },
  });

  const [error, setError] = useState<string | null>(null);

  if (!mounted || isInitializing || !isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  const onSubmit = async (data: AddVideoFormValues) => {
    setError(null);
    try {
      if (!data.videoFile) {
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
      const newVid = await requestJson<{ slug: string }>(res);
      router.push(`/video/edit/${newVid.slug}`);
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue.");
    }
  };
  const videoFileRegister = register("videoFile", {
    validate: (value) => value != null || "Veuillez sélectionner un fichier",
  });
  return (
    <div>
      <h1>Ajouter une vidéo</h1>
      {error && (
        <Alert canClose type="error">
          {error}
        </Alert>
      )}
      <Alert
        additional={
          <>
            La taille du fichier doit être{" "}
            <u>
              <b>inférieure à 2 Go</b>
            </u>
            .
            <br />
            Le temps d’envoi dépend de la taille de votre fichier et de votre
            vitesse de téléchargement.
            <br />
            <b>
              Pendant l’envoi de votre fichier, ne fermez pas votre navigateur
              avant d’avoir reçu un message de succès ou d’échec.
            </b>
          </>
        }
      >
        Informations
      </Alert>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FileUploader
          bigText="Vas y Frère balance ton fichier"
          fullWidth={true}
          state={errors.videoFile ? "error" : "default"}
          name={videoFileRegister.name}
          onBlur={videoFileRegister.onBlur}
          ref={videoFileRegister.ref}
          onFilesChange={(event) => {
            const file = event.target.value?.[0] ?? null;
            setValue("videoFile", file, { shouldValidate: Boolean(file) });
            if (!file) {
              clearErrors("videoFile");
            }
          }}
          accept=".3gp, .avi, .divx, .flv, .m2p, .m4v, .mkv,
                .mov, .mp4, .mpeg, .mpg, .mts, .wmv, .mp3, .ogg, .wav, .wma,
                .webm, .ts"
          text={
            errors.videoFile ? (
              errors.videoFile.message
            ) : (
              <>
                <p>
                  Vous pouvez envoyer un fichier audio ou vidéo. <br />
                  Les formats suivants sont supportés : 3gp, avi, divx, flv,
                  m2p, m4v, mkv, mov, mp4, mpeg, mpg, mts, wmv, mp3, ogg, wav,
                  wma, webm, ts
                </p>
              </>
            )
          }
        />
        <p>
          Attention : assurez-vous de respecter le code de la propriété
          intellectuelle avant de publier une vidéo:
        </p>
        <p>
          Je confirme que je dispose des autorisations nécessaires signées par
          les parties concernées par la publication de ce média, en ce compris
          le consentement relatif au droit à l’image et au traitement des
          données personnelles. Je certifie que l’ensemble des personnes
          concernées ont bénéficié d’une information complète relative au
          traitement de leurs données personnelles, conformément aux
          dispositions des articles 13 et 14 du RGPD.
        </p>
        <Checkbox
          label="J'atteste de respecter le code de la propriété intellectuelle en publiant ma vidéo."
          fullWidth
          state={errors.acceptTerm ? "error" : "default"}
          text={errors.acceptTerm?.message}
          {...register("acceptTerm", {
            required: "Veuillez accepter les conditions d'utilisation.",
            validate: (value) =>
              Boolean(value) ||
              "Veuillez accepter les conditions d'utilisation.",
          })}
        />
        <Button fullWidth={true} type="submit" disabled={isSubmitting}>
          Ajouter une vidéo
        </Button>
      </form>
    </div>
  );
}
