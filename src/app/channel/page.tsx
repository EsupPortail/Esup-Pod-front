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
import { useMounted } from "@/src/hooks/useMounted";

export const breadcrumbLabel = "Chaines";

export default function Channels() {
  const { user } = useAuth();
  const mounted = useMounted();
  const { filters, setFilters, channels, channelsCount, themes, users, error, loading } =
    useCollectionListFilters({ mode: "channels" });

  const publicChannels = useMemo(() => {
    return channels.filter((channel) => channel.is_public);
  }, [channels]);

  const hasActiveFilters = useMemo(() => {
    const base: CollectionFiltersValue = filters;

    return (
      base.search.trim().length > 0 ||
      base.ownerUsernames.length > 0 ||
      base.createdAtGte !== "" ||
      base.createdAtLte !== ""
    );
  }, [filters]);

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
        onChange={(newFilters) => {
          if (
            newFilters.search !== filters.search ||
            newFilters.ownerUsernames !== filters.ownerUsernames ||
            newFilters.createdAtGte !== filters.createdAtGte ||
            newFilters.createdAtLte !== filters.createdAtLte
          ) {
            newFilters.page = 1;
          }
          setFilters(newFilters);
        }}
      />

      {publicChannels.length === 0 && !loading ? (
        <Alert>
          {hasActiveFilters
            ? "Aucune chaîne ne correspond à vos filtres."
            : "Aucune chaîne disponible pour le moment."}
        </Alert>
      ) : (
        <CollectionDisplay
          channels={publicChannels}
          themes={themes}
          collectionsCount={channelsCount}
          page={filters.page}
          onPageChange={(page) => setFilters({ ...filters, page })}
          defaultView="cards"
          storageKey="all-channels-view"
          loading={loading}
        />
      )}
    </div>
  );
}
