"use client";

import { Alert, VariantType } from "@openfun/cunningham-react";
import { useMemo } from "react";
import BackButton from "@/src/components/BackButton/BackButton";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import CollectionFilters from "@/src/components/collection/filters/CollectionFilters";
import { useCollectionListFilters } from "@/src/hooks/useCollectionListFilters";
import { useMounted } from "@/src/hooks/useMounted";
import { useAuth } from "@/src/context/AuthProvider";
import CollectionDisplay from "@/src/components/collection/display/CollectionDisplay";

export const breadcrumbLabel = "Listes de lectures";

export default function PlaylistsPage() {
  const { filters, setFilters, playlists, users, error, loading } =
    useCollectionListFilters({ mode: "playlists" });
  const mounted = useMounted();
  const { user } = useAuth();

  const publicPlaylists = useMemo(
    () => playlists.filter((playlist) => playlist.is_public),
    [playlists],
  );

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.trim().length > 0 ||
      filters.ownerUsernames.length > 0 ||
      filters.createdAtGte !== "" ||
      filters.createdAtLte !== ""
    );
  }, [filters]);

  if (!mounted) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <BackButton label="Retour" />
      <h1>Listes de lecture</h1>

      {error && (
        <Alert canClose type={VariantType.ERROR}>
          {error}
        </Alert>
      )}

      <CollectionFilters
        mode="playlists"
        value={filters}
        users={user ? users : []}
        showUserFilter={!!user}
        onChange={setFilters}
      />

      {loading ? (
        <CenteredLoader />
      ) : publicPlaylists.length === 0 ? (
        <Alert type={VariantType.INFO}>
          {hasActiveFilters
            ? "Aucune playlist ne correspond à vos filtres."
            : "Aucune playlist disponible pour le moment."}
        </Alert>
      ) : (
        <CollectionDisplay
          playlists={publicPlaylists}
          defaultView="cards"
          storageKey="all-playlist-view"
        />
      )}
    </div>
  );
}
