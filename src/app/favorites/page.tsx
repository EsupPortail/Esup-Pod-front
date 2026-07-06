"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, VariantType, Button } from "@openfun/cunningham-react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useAuth } from "@/src/context/AuthProvider";
import BackButton from "@/src/components/BackButton/BackButton";
import VideosDisplay from "@/src/components/video/display/VideoDisplay";
import VideoFilters, {
  type VideoFiltersValue,
} from "@/src/components/video/filters/VideoFilters";
import { useVideoListFilters } from "@/src/hooks/useVideoListFilters";
import { useFavorites } from "@/src/hooks/useFavorites";
import type { Video } from "@/src/types";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import styles from "./styles.module.css";

export const breadcrumbLabel = "Mes vidéos favorites";

export default function FavoritesPlaylistPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isInitializing, mounted } = useRequireAuth();
  const { favorites, fetchAll, useFavoritesError } = useFavorites();

  const { filters, setFilters, users, types, disciplines, tags } =
    useVideoListFilters({ mode: "all", enabled: false });

  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    const loadFavorites = async () => {
      try {
        await fetchAll();
      } finally {
        if (!cancelled) {
          setHasLoadedFavorites(true);
        }
      }
    };

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [fetchAll, user]);

  const favoriteVideos: Video[] = useMemo(() => {
    if (!favorites || favorites.length === 0) {
      return [];
    }
    const byId = new Map<number, Video>();
    favorites.forEach((favorite) => {
      if (favorite.video_details && !byId.has(favorite.video_details.id)) {
        byId.set(favorite.video_details.id, favorite.video_details);
      }
    });
    return Array.from(byId.values());
  }, [favorites]);

  const channels = useMemo(
    () =>
      Array.from(
        new Set(
          favoriteVideos
            .map((video) => video.channel)
            .filter((channel): channel is number => channel != null),
        ),
      ),
    [favoriteVideos],
  );

  // appliquer manuellement les filtres pour les favoris
  const filteredFavoriteVideos: Video[] = useMemo(() => {
    let result = favoriteVideos;

    // Filtre recherche
    if (filters.search.trim() !== "") {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(searchLower) ||
          (video.description ?? "").toLowerCase().includes(searchLower),
      );
    }

    if (filters.ownerUsernames.length > 0) {
      const ownersSet = new Set(filters.ownerUsernames);

      const selectedUserIds = new Set(
        users
          .filter((userItem) => ownersSet.has(userItem.username))
          .map((userItem) => userItem.id),
      );

      result = result.filter((video) => {
        const ownerMatch = ownersSet.has(video.owner ?? "");
        const coOwnerMatch = (video.co_owners ?? []).some((coOwnerId) =>
          selectedUserIds.has(coOwnerId),
        );

        return ownerMatch || coOwnerMatch;
      });
    }

    // Filtre type
    if (filters.typeSlugs.length > 0) {
      const typeSet = new Set(filters.typeSlugs);
      result = result.filter(
        (video) => video.type_name && typeSet.has(video.type_name),
      );
    }

    // Filtre disciplines
    if (filters.disciplineIds.length > 0) {
      const disciplineSet = new Set(filters.disciplineIds);
      result = result.filter((video) =>
        (video.discipline ?? []).some((disciplineId) =>
          disciplineSet.has(disciplineId),
        ),
      );
    }

    // Filtre tags
    if (filters.tagSlugs.length > 0) {
      const tagSet = new Set(filters.tagSlugs);
      result = result.filter((video) =>
        (video.tags ?? []).some((tag) => tagSet.has(tag)),
      );
    }

    // Filtre chaîne
    if (filters.channel != null) {
      result = result.filter(
        (video) => (video.channel as number | null) === filters.channel,
      );
    }

    // Tri filters.ordering
    if (filters.ordering === "-created_at") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else if (filters.ordering === "created_at") {
      result = [...result].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    } else if (filters.ordering === "title") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" }),
      );
    } else if (filters.ordering === "-title") {
      result = [...result].sort((a, b) =>
        b.title.localeCompare(a.title, "fr", { sensitivity: "base" }),
      );
    }

    return result;
  }, [favoriteVideos, filters, users]);

  const hasActiveVideoFilters = useMemo(() => {
    const base: VideoFiltersValue = filters;

    return (
      base.search.trim().length > 0 ||
      base.channel !== null ||
      base.ownerUsernames.length > 0 ||
      base.typeSlugs.length > 0 ||
      base.disciplineIds.length > 0 ||
      base.cursus.length > 0 ||
      base.tagSlugs.length > 0
    );
  }, [filters]);

  const handleStartFavoritesPlaylist = () => {
    const playlistVideos = hasActiveVideoFilters
      ? filteredFavoriteVideos
      : favoriteVideos;

    if (!playlistVideos.length) {
      return;
    }

    const firstVideo = playlistVideos[0];
    if (!firstVideo.slug) {
      return;
    }

    router.push(`/video/${firstVideo.slug}?favorites=1`);
  };

  if (!mounted || isInitializing || !hasLoadedFavorites) {
    return <CenteredLoader />;
  }

  if (useFavoritesError) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert canClose type={VariantType.ERROR}>
          {useFavoritesError}
        </Alert>
        <BackButton label="Retour" />
      </div>
    );
  }

  return (
    <div>
      <BackButton label="Retour" />

      <div>
        <div className={styles.title_row}>
          <h1>Mes vidéos favorites</h1>
          {favoriteVideos.length > 0 && (
            <div className={styles.start_favorites_button}>
              <Button
                color="brand"
                variant="primary"
                size="small"
                onClick={handleStartFavoritesPlaylist}
              >
                <PlayArrowIcon />
                Lancer la liste de lecture
              </Button>
            </div>
          )}
        </div>

        {favoriteVideos.length === 0 ? (
          <Alert type={VariantType.INFO}>
            Aucune vidéo favorite pour le moment.
          </Alert>
        ) : (
          <div>
            <VideoFilters
              value={filters}
              users={user ? users : []}
              types={types}
              disciplines={disciplines}
              tags={tags}
              channels={channels}
              showUserFilter={!!user}
              onChange={setFilters}
            />
            {filteredFavoriteVideos.length === 0 ? (
              <Alert type={VariantType.INFO}>
                {hasActiveVideoFilters
                  ? "Aucune vidéo ne correspond à vos filtres."
                  : "Aucune vidéo favorite pour le moment."}
              </Alert>
            ) : (
              <VideosDisplay
                videos={filteredFavoriteVideos}
                currentUserId={user?.id}
                defaultView="cards"
                storageKey="favorite-videos-view"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
