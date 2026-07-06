"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, VariantType } from "@openfun/cunningham-react";
import { useRouter } from "next/navigation";
import type { Tags, Video } from "@/src/types";
import { useTags } from "@/src/hooks/useTags";

export type ShowTagsProps = {
  onTagClick?: (tag: Tags) => void;

  // Limite optionnelle du nombre de tags affichés.
  limit?: number;

  // Liste de vidéos optionnelle pour recalculer le nombre de vidéos par tag
  videos?: Video[];
};

// Couleurs variables Cunningham
const CHIP_BACKGROUND_COLORS: string[] = [
  "var(--c--contextuals--background--palette--pink--primary)",
  "var(--c--contextuals--background--palette--purple--primary)",
  "var(--c--contextuals--background--palette--blue-1--primary)",
  "var(--c--contextuals--background--palette--orange--primary)",
  "var(--c--contextuals--background--palette--red--primary)",
];

export default function ShowTags({ onTagClick, limit, videos }: ShowTagsProps) {
  const { tags, fetchAll, useTagsLoading, useTagsError } = useTags();
  const router = useRouter();

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  type TagWithCount = {
    tag: Tags;
    effectiveCount: number | null;
  };

  let tagEntries: TagWithCount[];

  if (videos && videos.length > 0) {
    //  exclure les vidéos statut "DR".
    const tagCountBySlug = new Map<string, number>();

    videos
      .filter((video) => video.status !== "DR")
      .forEach((video) => {
        (video.tags ?? []).forEach((tagSlug) => {
          const current = tagCountBySlug.get(tagSlug) ?? 0;
          tagCountBySlug.set(tagSlug, current + 1);
        });
      });

    tagEntries = tags.map((tag) => ({
      tag,
      effectiveCount: tagCountBySlug.get(tag.slug) ?? 0,
    }));
  } else {
    tagEntries = tags.map((tag) => ({ tag, effectiveCount: tag.count }));
  }

  const tagsWithVideos = tagEntries.filter(
    ({ effectiveCount }) => effectiveCount == null || effectiveCount > 0,
  );

  const displayedTags = limit ? tagsWithVideos.slice(0, limit) : tagsWithVideos;

  if (useTagsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1,
        }}
      >
        <CircularProgress size={20} />
        <p>Chargement des mots-clés...</p>
      </Box>
    );
  }

  if (useTagsError) {
    return (
      <Alert type={VariantType.ERROR} canClose>
        Erreur lors du chargement des mots-clés : {useTagsError}
      </Alert>
    );
  }

  if (!displayedTags.length) {
    return (
      <Alert type={VariantType.INFO}>
        Aucun mot-clé disponible pour le moment.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mt: 1.5,
      }}
    >
      {displayedTags.map(({ tag, effectiveCount }, index) => {
        const backgroundColor =
          CHIP_BACKGROUND_COLORS[index % CHIP_BACKGROUND_COLORS.length];
        const label =
          effectiveCount != null ? `${tag.name} (${effectiveCount})` : tag.name;

        return (
          <Chip
            key={tag.id}
            label={label}
            variant="filled"
            size="medium"
            onClick={() => {
              if (onTagClick) {
                onTagClick(tag);
                return;
              }

              router.push(`/video?tag=${encodeURIComponent(tag.slug)}`);
            }}
            sx={{
              cursor: "pointer",
              fontSize: "0.95rem",
              px: 2.5,
              py: 2.5,
              borderRadius: 9999,
              backgroundColor,
              fontWeight: 700,
              color:
                "var(--c--contextuals--content--semantic--neutral--on-neutral)",
              "&:hover": {
                backgroundColor,
                boxShadow: "none",
              },
            }}
          />
        );
      })}
    </Box>
  );
}
