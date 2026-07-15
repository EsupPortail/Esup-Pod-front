"use client";

import { Alert, Button, Loader, VariantType } from "@openfun/cunningham-react";
import { useEffect, useMemo } from "react";
import BackButton from "@/src/components/BackButton/BackButton";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import Link from "next/link";
import CollectionDisplay from "@/src/components/collection/display/CollectionDisplay";
import CollectionFilters from "@/src/components/collection/filters/CollectionFilters";
import { useCollectionListFilters } from "@/src/hooks/useCollectionListFilters";
import { useAuth } from "@/src/context/AuthProvider";
import styles from "./styles.module.css";

export const breadcrumbLabel = "Mes listes de lecture";

export default function MyPlaylistsPage() {
  const { isAuthenticated, isInitializing, mounted } = useRequireAuth();
  const { user } = useAuth();
  const { filters, setFilters, playlists, playlistsCount, users, error, loading } =
    useCollectionListFilters({ mode: "playlists" });
  const isInitialLoading = loading && playlists.length === 0;

  useEffect(() => {
    if (!user) return;

    // Vérifier si le filtre est activé sur l'utilisateur courant
    if (
      filters.ownerUsernames.length === 1 &&
      filters.ownerUsernames[0] === user.username
    ) {
      return;
    }

    setFilters((current) => ({
      ...current,
      ownerUsernames: [user.username],
    }));
  }, [user, filters.ownerUsernames, setFilters]);

  const myPlaylists = useMemo(
    () =>
      user ? playlists.filter((playlist) => playlist.owner === user.id) : [],
    [playlists, user],
  );

  if (!mounted || isInitializing || !isAuthenticated) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <BackButton label="Retour" />
      <div className={styles.title_row}>
        <h1>Mes listes de lecture</h1>
        <Link href="/playlist/add" className={styles.add_playlist_button}>
          <Button color="brand" variant="primary" size="small">
            Ajouter une liste de lecture
          </Button>
        </Link>
      </div>

      {error && (
        <Alert type={VariantType.ERROR} canClose>
          {error}
        </Alert>
      )}

      <div>
        <CollectionFilters
          mode="playlists"
          value={filters}
          users={user ? users : []}
          showUserFilter={false}
          onChange={(newFilters) => {
          if (
            newFilters.search !== filters.search ||
            newFilters.createdAtGte !== filters.createdAtGte ||
            newFilters.createdAtLte !== filters.createdAtLte
          ) {
            newFilters.page = 1;
          }
          setFilters(newFilters);
        }}
        />

        {loading && playlists.length > 0 && <CenteredLoader />}

        {isInitialLoading ? (
          <CenteredLoader />
        ) : myPlaylists.length === 0 ? (
          <Alert type={VariantType.INFO}>
            {filters.search.trim().length > 0 ||
            filters.createdAtGte !== "" ||
            filters.createdAtLte !== ""
              ? "Aucune liste de lecture ne correspond à vos filtres."
              : "Vous n'avez encore aucune liste de lecture."}
          </Alert>
        ) : (
          <CollectionDisplay
            playlists={myPlaylists}
            collectionsCount={playlistsCount}
            page={filters.page}
            onPageChange={(page) => setFilters({ ...filters, page })}
            defaultView="cards"
            storageKey="my-playlist-view"
            basePath="/playlist"
            currentUserId={user?.id}
          />
        )}
      </div>
    </div>
  );
}
