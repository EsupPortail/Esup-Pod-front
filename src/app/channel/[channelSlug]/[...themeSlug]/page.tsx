"use client";

import { Alert, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";
import { useTheme } from "@/src/hooks/useTheme";
import { useChannel } from "@/src/hooks/useChannel";
import type { Theme } from "@/src/types";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
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
import Image from "next/image";
import { useTranslation } from "@/src/hooks/useTranslation";

export const breadcrumbLabel = "Thème";

export default function Theme() {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | null>(null);
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
    users: videoUsers,
    types,
    disciplines,
    tags,
    channels,
    useVideoError,
    useVideoLoading,
  } = useVideoListFilters({ mode: "all", enabled: false });

  // Filters collections (themes)
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
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          case "created_at":
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
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

  const baseChildThemes = useMemo(
    () => (theme?.children ?? []) as Theme[],
    [theme?.children],
  );

  const defaultTab =
    baseChildThemes.length > 0 ? "childThemes" : "unclassified";
  const selectedTab = value ?? defaultTab;

  const parentTheme = theme?.parent
    ? (allThemes.find((item) => item.id === theme.parent) ?? null)
    : null;

  // True if the user has actually applied at least one video filter
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

  // Child themes after applying filters
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

  useEffect(() => {
    if (!theme?.default_order) return;

    setCollectionFilters((prev) => {
      if (prev.ordering) return prev;
      return { ...prev, ordering: theme.default_order };
    });
  }, [theme?.default_order, setCollectionFilters]);

  useEffect(() => {
    if (!slug) return;
    void fetchTheme(slug);
  }, [fetchTheme, slug]);

  useEffect(() => {
    if (!theme) return;
    void fetchThemes();
  }, [fetchThemes, theme]);

  useEffect(() => {
    if (!channelSlug) return;
    void fetchChannel(channelSlug);
  }, [channelSlug, fetchChannel]);

  if (!theme || !mounted || !themeItemVideos) {
    return <CenteredLoader />;
  }

  if (useThemeError && !theme && !channel) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Alert canClose type={VariantType.ERROR}>
          {useThemeError ?? `${t("errors.unableToTheme")}`}
        </Alert>
        <BackButton label={t("common.back")} />
      </div>
    );
  }

  return (
    <div>
      <BackButton label={t("common.back")} />
      <div>
        {useThemeError && (
          <Alert canClose type={VariantType.ERROR}>
            {useThemeError}
          </Alert>
        )}
        <Image
          unoptimized
          width={1200}
          height={300}
          src={theme.banner || "/default_theme_banner.png"}
          alt={t("a11y.themeBanner", { title: theme.title })}
          className="pod-image-banner"
          fill
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
          <Alert type={VariantType.INFO}>{t("common.noResults")}</Alert>
        ) : (
          <Box sx={{ width: "100%", typography: "body1" }}>
            <Tabs
              value={selectedTab}
              onChange={handleChange}
              aria-label={t("channels.content")}
            >
              <Tab
                disabled={themeItemVideos.length === 0}
                label={`${t("channels.unclassified")} (${themeItemVideos.length})`}
                value="unclassified"
              />

              <Tab
                disabled={baseChildThemes.length === 0}
                label={`${t("common.subtopics")} (${baseChildThemes.length})`}
                value="childThemes"
              />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {selectedTab === "unclassified" && (
                <div>
                  <h2>{t("channels.unclassified")}</h2>
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
                        newFilters.ownerUsernames !==
                          videoFilters.ownerUsernames ||
                        newFilters.typeSlugs !== videoFilters.typeSlugs ||
                        newFilters.disciplineIds !==
                          videoFilters.disciplineIds ||
                        newFilters.cursus !== videoFilters.cursus ||
                        newFilters.tagSlugs !== videoFilters.tagSlugs
                      ) {
                        newFilters.page = 1;
                      }
                      setVideoFilters(newFilters);
                    }}
                  />

                  {visibleAndPublicThemeVideos.length === 0 &&
                  !useVideoLoading ? (
                    <Alert type={VariantType.INFO}>
                      {hasActiveVideoFilters
                        ? t("common.noResults")
                        : t("common.noResults")}
                    </Alert>
                  ) : (
                    <VideosDisplay
                      videos={visibleAndPublicThemeVideos}
                      page={videoFilters.page}
                      onPageChange={(page) =>
                        setVideoFilters({ ...videoFilters, page })
                      }
                      loading={useVideoLoading}
                    />
                  )}
                </div>
              )}

              {selectedTab === "childThemes" && (
                <div>
                  <h2>{t("common.subtopics")}</h2>

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
                        newFilters.ownerUsernames !==
                          collectionFilters.ownerUsernames ||
                        newFilters.createdAtGte !==
                          collectionFilters.createdAtGte ||
                        newFilters.createdAtLte !==
                          collectionFilters.createdAtLte
                      ) {
                        newFilters.page = 1;
                      }
                      setCollectionFilters(newFilters);
                    }}
                  />

                  {baseChildThemes.length === 0 ? (
                    <Alert type={VariantType.INFO}>
                      {t("common.noResults")}
                    </Alert>
                  ) : filteredChildThemes.length === 0 ? (
                    <Alert type={VariantType.INFO}>
                      {t("common.noResults")}
                    </Alert>
                  ) : (
                    <CollectionDisplay
                      themes={filteredChildThemes}
                      defaultView="cards"
                      storageKey="theme-subtheme-view"
                      channelSlug={channelSlug}
                      page={collectionFilters.page}
                      onPageChange={(page) =>
                        setCollectionFilters({ ...collectionFilters, page })
                      }
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
