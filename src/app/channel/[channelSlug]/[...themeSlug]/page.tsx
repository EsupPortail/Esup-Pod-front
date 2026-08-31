"use client";

import { Alert, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";
import { useTheme } from "@/src/hooks/useTheme";
import { useChannel } from "@/src/hooks/useChannel";
import type { Theme } from "@/src/types";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import styles from "../styles.module.css";
import CollectionFilters from "@/src/components/collection/filters/CollectionFilters";
import CollectionDisplay from "@/src/components/collection/display/CollectionDisplay";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import VideosDisplay from "@/src/components/video/display/VideoDisplay";
import { useCollectionListFilters } from "@/src/hooks/useCollectionListFilters";
import { useVideoListFilters } from "@/src/hooks/useVideoListFilters";
import VideoFilters, {
  type VideoFiltersValue,
} from "@/src/components/video/filters/VideoFilters";
import { useAuth } from "@/src/context/AuthProvider";
import { useMounted } from "@/src/hooks/useMounted";

export const breadcrumbLabel = "Thème";

export default function Theme() {
  const [value, setValue] = useState("childThemes");
  const didSetInitialTab = useRef(false);
  const { user } = useAuth();
  const mounted = useMounted();

  const {
    themes: allThemes,
    theme,
    fetchAll: fetchThemes,
    fetchOne: fetchTheme,
    useThemeError,
  } = useTheme();
  const { channel, fetchOne: fetchChannel } = useChannel();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const params = useParams();
  const slug = Array.isArray(params.themeSlug)
    ? params.themeSlug[params.themeSlug.length - 1]
    : params.themeSlug;
  const channelSlug = Array.isArray(params.channelSlug)
    ? params.channelSlug[0]
    : params.channelSlug;

  const {
    filters: videoFilters,
    setFilters: setVideoFilters,
    videos,
    users: videoUsers,
    types,
    disciplines,
    tags,
    channels,
    useVideoError,
    useVideoLoading,
  } = useVideoListFilters({ mode: "all", enabled: false });

  // Filtres collections (thèmes)
  const {
    filters: collectionFilters,
    setFilters: setCollectionFilters,
    users: collectionUsers,
    channels: collectionChannels,
  } = useCollectionListFilters({
    mode: "themes",
    enabled: false,
  });

  const themeItems = theme?.items ?? [];
  const themeItemVideos = themeItems
    .map((item) => item.video)
    .filter((video) => video != null);

  const filteredThemeVideos = useMemo(() => {
    if (!themeItemVideos.length) {
      return [];
    }

    let result = themeItemVideos;
    const search = videoFilters.search?.trim().toLowerCase();
    if (search) {
      result = result.filter((video) =>
        video.title.toLowerCase().includes(search),
      );
    }
    
    // Sort
    const ordering = videoFilters.ordering;
    if (ordering) {
      result = [...result].sort((a, b) => {
        switch (ordering) {
          case "-created_at":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "created_at":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case "-title":
            return b.title.localeCompare(a.title);
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [themeItemVideos, videoFilters.search, videoFilters.ordering]);

  const visibleAndPublicThemeVideos = useMemo(
    () =>
      filteredThemeVideos.filter(
        (video) =>
          (!video.is_auth_required || !!user) &&
          video.status !== "DR" &&
          (video.encoding_status === "DO" || !!video.has_video_file),
      ),
    [filteredThemeVideos, user],
  );

  const baseChildThemes = (theme?.children ?? []) as Theme[];

  const parentTheme = theme?.parent
    ? (allThemes.find((item) => item.id === theme.parent) ?? null)
    : null;

  // True si l'utilisateur a réellement appliqué au moins un filtre vidéo
  const hasActiveVideoFilters = useMemo(() => {
    const base: VideoFiltersValue = videoFilters;

    return (
      base.search.trim().length > 0 ||
      base.channel !== null ||
      base.ownerUsernames.length > 0 ||
      base.typeSlugs.length > 0 ||
      base.disciplineIds.length > 0 ||
      base.cursus.length > 0 ||
      base.tagSlugs.length > 0
    );
  }, [videoFilters]);

  // Sous-thèmes après application des filtres
  const filteredChildThemes = useMemo<Theme[]>(() => {
    if (!baseChildThemes.length) return [];

    const search = collectionFilters.search.trim().toLowerCase();
    const ordering = collectionFilters.ordering;
    const selectedChannel = collectionFilters.channel;

    let result = baseChildThemes;

    if (selectedChannel != null) {
      result = result.filter((child) => child.channel === selectedChannel);
    }

    if (search) {
      result = result.filter((child) =>
        child.title.toLowerCase().includes(search),
      );
    }

    if (ordering) {
      result = [...result].sort((a, b) => {
        switch (ordering) {
          case "created_at":
            return a.created_at.localeCompare(b.created_at);
          case "-created_at":
            return b.created_at.localeCompare(a.created_at);
          case "title":
            return a.title.localeCompare(b.title);
          case "-title":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [
    baseChildThemes,
    collectionFilters.search,
    collectionFilters.ordering,
    collectionFilters.channel,
  ]);

  const handleTabValue = () => {
    const hasVideos = themeItems.length > 0;
    const hasChildren = baseChildThemes.length > 0;
    if (hasChildren) {
      setValue("childThemes");
    } else if (hasVideos) {
      setValue("unclassified");
    }
  };

  useEffect(() => {
    if (!theme?.default_order) return;

    setCollectionFilters((prev) => {
      if (prev.ordering) return prev;
      return { ...prev, ordering: theme.default_order };
    });
  }, [theme?.default_order, setCollectionFilters]);

  useEffect(() => {
    if (!slug) return;
    fetchTheme(slug);
  }, [fetchTheme, slug]);

  useEffect(() => {
    if (!theme) return;
    fetchThemes();
  }, [fetchThemes, theme]);

  useEffect(() => {
    if (didSetInitialTab.current) return;
    if (!theme) return;

    handleTabValue();
    didSetInitialTab.current = true;
  }, [theme, themeItems.length, baseChildThemes.length]);

  useEffect(() => {
    if (!channelSlug) return;
    fetchChannel(channelSlug);
  }, [channelSlug, fetchChannel]);

  if (!theme || !mounted || !themeItemVideos) {
    return <CenteredLoader />;
  }

  if (useThemeError && !theme && !channel) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert canClose type={VariantType.ERROR}>
          {useThemeError ?? "Impossible de charger ce thème."}
        </Alert>
        <BackButton label="Retour" />
      </div>
    );
  }

  return (
    <div>
      <BackButton label="Retour" />
      <div>
        {useThemeError && (
          <Alert canClose type={VariantType.ERROR}>
            {useThemeError}
          </Alert>
        )}
        <img
          src={theme.banner || "/default_theme_banner.png"}
          alt={`${theme.title} banner`}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        />{" "}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            {channel && <h1>{channel.title}</h1>}
            {parentTheme ? (
              <h2>
                {parentTheme.title} / {theme.title}
              </h2>
            ) : (
              <h2>{theme?.title}</h2>
            )}

            <p>{theme.description}</p>
          </Box>
        </Box>
      </div>

      <div>
        {baseChildThemes.length === 0 && themeItems.length === 0 ? (
          <Alert type={VariantType.INFO}>
            Ce thème n'a aucune vidéo ou sous-thème associé.
          </Alert>
        ) : (
          <Box sx={{ width: "100%", typography: "body1" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Contenus de la chaine"
            >
              <Tab
                disabled={themeItemVideos.length === 0}
                label={`Videos non classées (${themeItemVideos.length})`}
                value="unclassified"
              />

              <Tab
                disabled={baseChildThemes.length === 0}
                label={`Sous-thèmes (${baseChildThemes.length})`}
                value="childThemes"
              />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {value === "unclassified" && (
                <div>
                  <h2>Videos non classées</h2>
                  {useVideoError && (
                    <Alert canClose type={VariantType.ERROR}>
                      {useVideoError}
                    </Alert>
                  )}

                  <VideoFilters
                    value={videoFilters}
                    users={user ? videoUsers : []}
                    types={types}
                    disciplines={disciplines}
                    tags={tags}
                    channels={channels}
                    showUserFilter={!!user}
                    onChange={(newFilters) => {
                      if (
                        newFilters.search !== videoFilters.search ||
                        newFilters.channel !== videoFilters.channel ||
                        newFilters.ordering !== videoFilters.ordering ||
                        newFilters.ownerUsernames !== videoFilters.ownerUsernames ||
                        newFilters.typeSlugs !== videoFilters.typeSlugs ||
                        newFilters.disciplineIds !== videoFilters.disciplineIds ||
                        newFilters.cursus !== videoFilters.cursus ||
                        newFilters.tagSlugs !== videoFilters.tagSlugs
                      ) {
                        newFilters.page = 1;
                      }
                      setVideoFilters(newFilters);
                    }}
                  />

                  {visibleAndPublicThemeVideos.length === 0 && !useVideoLoading ? (
                    <Alert type={VariantType.INFO}>
                      {hasActiveVideoFilters
                        ? "Aucune vidéo ne correspond à vos filtres."
                        : "Aucune vidéo liée à ce thème."}
                    </Alert>
                  ) : (
                    <VideosDisplay
                      videos={visibleAndPublicThemeVideos}
                      page={videoFilters.page}
                      onPageChange={(page) => setVideoFilters({ ...videoFilters, page })}
                      loading={useVideoLoading}
                    />
                  )}
                </div>
              )}

              {value === "childThemes" && (
                <div>
                  <h2>Sous-thèmes</h2>

                  <CollectionFilters
                    mode="themes"
                    value={collectionFilters}
                    users={user ? collectionUsers : []}
                    channels={
                      channel
                        ? [
                            channel,
                            ...collectionChannels.filter(
                              (item) => item.id !== channel.id,
                            ),
                          ]
                        : collectionChannels
                    }
                    showUserFilter={!!user}
                    onChange={(newFilters) => {
                      if (
                        newFilters.search !== collectionFilters.search ||
                        newFilters.ordering !== collectionFilters.ordering ||
                        newFilters.channel !== collectionFilters.channel ||
                        newFilters.ownerUsernames !== collectionFilters.ownerUsernames ||
                        newFilters.createdAtGte !== collectionFilters.createdAtGte ||
                        newFilters.createdAtLte !== collectionFilters.createdAtLte
                      ) {
                        newFilters.page = 1;
                      }
                      setCollectionFilters(newFilters);
                    }}
                  />

                  {baseChildThemes.length === 0 ? (
                    <Alert type={VariantType.INFO}>
                      Aucun sous-thème lié à ce thème.
                    </Alert>
                  ) : filteredChildThemes.length === 0 ? (
                    <Alert type={VariantType.INFO}>
                      Aucun sous-thème ne correspond à vos critères de
                      recherche.
                    </Alert>
                  ) : (
                    <CollectionDisplay
                      themes={filteredChildThemes}
                      defaultView="cards"
                      storageKey="theme-subtheme-view"
                      channelSlug={channelSlug}
                      page={collectionFilters.page}
                      onPageChange={(page) => setCollectionFilters({ ...collectionFilters, page })}
                      basePath={
                        Array.isArray(params.themeSlug)
                          ? params.themeSlug.join("/")
                          : params.themeSlug
                      }
                      loading={false} // theme is loaded at page level
                    />
                  )}
                </div>
              )}
            </Box>
          </Box>
        )}
      </div>
    </div>
  );
}
