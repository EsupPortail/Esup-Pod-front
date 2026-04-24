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
import LinearProgress from "@mui/material/LinearProgress";
import { getRoutes } from "@/src/api/routes";
import { useAuth } from "@/src/context/AuthProvider";
import { authFetch } from "@/src/api/authFetch";
import { requestJson } from "@/src/utils/requestJson";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";

export const breadcrumbLabel = "Ajouter une video";

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
    setIsRedirecting(false);

    try {
      if (!data.videoFile) {
        setFieldError("videoFile", {
          type: "required",
          message: "Veuillez selectionner un fichier.",
        });
        setError("Veuillez selectionner un fichier video.");
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
      setIsRedirecting(true);

      // Laisse le temps a React d'afficher la barre avant la navigation.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 200);
        });
      });

      router.push(`/video/edit/${newVid.slug}`);
    } catch (err: unknown) {
      setIsRedirecting(false);
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  return (
    <div>
      <h1>Ajouter une video</h1>
      {error && (
        <Alert canClose type="error">
          {error}
        </Alert>
      )}

      <Alert
        additional={
          <>
            La taille du fichier doit etre{" "}
            <u>
              <b>inferieure a 2 Go</b>
            </u>
            .
            <br />
            Le temps d&apos;envoi depend de la taille de votre fichier et de
            votre vitesse de telechargement.
            <br />
            <b>
              Pendant l&apos;envoi de votre fichier, ne fermez pas votre
              navigateur avant d&apos;avoir recu un message de succes ou
              d&apos;echec.
            </b>
          </>
        }
      >
        Informations
      </Alert>

      {isRedirecting ? (
        <div>
          <LinearProgress aria-label="Loading..." />
          <p>
            Votre video est en train d&apos;etre televersee sur POD. Veuillez ne
            pas fermer la page.
          </p>
        </div>
      ) : (
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FileUploader
            bigText="Choisissez un fichier audio ou video"
            fullWidth={true}
            state={errors.videoFile ? "error" : "default"}
            onFilesChange={(event) => {
              const file = event.target.value?.[0] ?? null;
              setValue("videoFile", file, { shouldValidate: true });
              if (file) {
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
                    Vous pouvez envoyer un fichier audio ou video. <br />
                    Les formats suivants sont supportes : 3gp, avi, divx, flv,
                    m2p, m4v, mkv, mov, mp4, mpeg, mpg, mts, wmv, mp3, ogg, wav,
                    wma, webm, ts
                  </p>
                </>
              )
            }
          />
          <p>
            Attention : assurez-vous de respecter le code de la propriete
            intellectuelle avant de publier une video:
          </p>
          <p>
            Je confirme que je dispose des autorisations necessaires signees par
            les parties concernees par la publication de ce media, en ce compris
            le consentement relatif au droit a l&apos;image et au traitement des
            donnees personnelles. Je certifie que l&apos;ensemble des personnes
            concernees ont beneficie d&apos;une information complete relative au
            traitement de leurs donnees personnelles, conformement aux
            dispositions des articles 13 et 14 du RGPD.
          </p>
          <Checkbox
            label="J'atteste de respecter le code de la propriete intellectuelle en publiant ma video."
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
          <Button
            fullWidth
            type="submit"
            disabled={isSubmitting || isRedirecting}
          >
            Ajouter une video
          </Button>
        </form>
      )}
    </div>
  );
}
