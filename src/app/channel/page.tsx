"use client";

import { Alert, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";
import CollectionFilters, {
  type CollectionFiltersValue,
} from "@/src/components/collection/filters/CollectionFilters";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import { useAuth } from "@/src/context/AuthProvider";
import { useCollectionListFilters } from "@/src/hooks/useCollectionListFilters";
import { useEffect, useMemo } from "react";
import CollectionDisplay from "@/src/components/collection/display/CollectionDisplay";
import { useVideos } from "@/src/hooks/useVideos";
import { useMounted } from "@/src/hooks/useMounted";

export const breadcrumbLabel = "Chaines";

export default function Channels() {
  const { user } = useAuth();
  const mounted = useMounted();
  const { filters, setFilters, channels, themes, users, error, loading } =
    useCollectionListFilters({ mode: "channels" });

  const { videos, fetchAll: fetchVideos } = useVideos();

  const publicChannels = useMemo(() => {
    return channels.filter((channel) => channel.is_public);
  }, [channels]);

  const publicChannelVideos = useMemo(
    () =>
      videos.filter(
        (video) => video.status === "PU" && video.encoding_status === "DO",
      ),
    [videos],
  );

  const hasActiveFilters = useMemo(() => {
    const base: CollectionFiltersValue = filters;

    return (
      base.search.trim().length > 0 ||
      base.ownerUsernames.length > 0 ||
      base.createdAtGte !== "" ||
      base.createdAtLte !== ""
    );
  }, [filters]);

  useEffect(() => {
    if (!mounted) return;
    fetchVideos();
  }, [fetchVideos, mounted]);

  if (!mounted) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <BackButton label="Retour" />
      <h1>Chaines</h1>

      {error && (
        <Alert canClose type={VariantType.ERROR}>
          {error}
        </Alert>
      )}

      <CollectionFilters
        mode="channels"
        value={filters}
        users={user ? users : []}
        showUserFilter={!!user}
        onChange={setFilters}
      />

      {loading && channels.length === 0 ? (
        <CenteredLoader />
      ) : publicChannels.length === 0 ? (
        <Alert>
          {hasActiveFilters
            ? "Aucune chaîne ne correspond à vos filtres."
            : "Aucune chaîne disponible pour le moment."}
        </Alert>
      ) : (
        <CollectionDisplay
          channels={publicChannels}
          themes={themes}
          videos={publicChannelVideos}
          defaultView="cards"
          storageKey="all-channels-view"
        />
      )}
    </div>
  );
}
