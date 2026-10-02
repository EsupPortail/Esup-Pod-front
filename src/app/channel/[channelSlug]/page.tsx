"use client";

import { Alert, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";
import { useChannel } from "@/src/hooks/useChannel";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import CollectionDisplay from "@/src/components/collection/display/CollectionDisplay";
import VideoDisplay from "@/src/components/video/display/VideoDisplay";
import CenteredLoader from "@/src/components/Loader/CenteredLoader";
import { useAuth } from "@/src/context/AuthProvider";
import { useCollectionListFilters } from "@/src/hooks/useCollectionListFilters";
import CollectionFilters from "@/src/components/collection/filters/CollectionFilters";
import { useVideoListFilters } from "@/src/hooks/useVideoListFilters";
import VideoFilters, {
  type VideoFiltersValue,
} from "@/src/components/video/filters/VideoFilters";
import { useTheme } from "@/src/hooks/useTheme";
import { useMounted } from "@/src/hooks/useMounted";
import Image from "next/image";
import { useTranslation } from "@/src/hooks/useTranslation";

export const breadcrumbLabel = "Chaine";

export default function Channel() {
  const { t } = useTranslation();
  const [value, setValue] = useState("themes");
  const mounted = useMounted();
  const didSetInitialTab = useRef(false);

  const params = useParams();
  const channelSlug = Array.isArray(params.channelSlug)
    ? params.channelSlug[0]
    : params.channelSlug;

  const {
    channel,
    fetchOne: fetchChannel,
    useChannelError,
    useChannelLoading,
  } = useChannel();

  // Filtered themes for channel pages
  const {
    filters,
    setFilters,
    themes,
    themesCount,
    users,
    channels,
    error,
    loading,
  } = useCollectionListFilters({ mode: "themes", enabled: !!channel?.id });

  // Raw themes for the page channel
  const { fetchAll: fetchAllThemes } = useTheme();
  const {
    filters: videoFilters,
    setFilters: videoSetFilters,
    videos,
    videosCount,
    users: videoUsers,
    types: videoTypes,
    disciplines: videoDisciplines,
    tags: videoTags,
    channels: videoChannels,
    useVideoError,
    useVideoLoading,
  } = useVideoListFilters({ mode: "all", enabled: !!channel?.id });

  const [baseChannelThemes, setBaseChannelThemes] = useState<typeof themes>([]);
  const [hasLoadedBaseThemes, setHasLoadedBaseThemes] = useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { user } = useAuth();

  const visibleAndPublicVideos = useMemo(
    () =>
      videos.filter(
        (video) =>
          (video.channel === channel?.id || video.channel === channel?.slug) &&
          (!video.is_auth_required || !!user) &&
          video.status !== "DR" &&
          (video.encoding_status === "DO" || !!video.has_video_file),
      ),
    [videos, channel?.id, channel?.slug, user],
  );

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

  // Channel's themes with filters applied
  const channelThemes = useMemo(
    () => themes.filter((theme) => theme.channel === channel?.id),
    [themes, channel?.id],
  );

  // Load once all themes of the page channel, regardless of filters
  useEffect(() => {
    if (!channel?.id) return;

    const loadBaseThemes = async () => {
      const all = await fetchAllThemes({ channel: channel.id });
      setBaseChannelThemes(all.filter((theme) => theme.channel === channel.id));
      setHasLoadedBaseThemes(true);
    };

    void loadBaseThemes();
  }, [channel?.id, fetchAllThemes]);

  // Base themes for this channel
  const channelAllThemes = baseChannelThemes;

  const handleTabValue = useCallback(() => {
    const hasThemes = channelAllThemes.length > 0;
    const hasUnclassifiedVideos = visibleAndPublicVideos.length > 0;

    if (hasThemes) {
      setValue("themes");
      return;
    }

    if (hasUnclassifiedVideos) {
      setValue("unclassified");
    }
  }, [channelAllThemes.length, visibleAndPublicVideos.length]);

  useEffect(() => {
    if (!channel?.id) return;
    setFilters((prev) => {
      const newOrdering = prev.ordering || channel.default_order;
      if (prev.channel === channel.id && prev.ordering === newOrdering)
        return prev;
      return { ...prev, channel: channel.id, ordering: newOrdering };
    });
    videoSetFilters((prev) => {
      const newOrdering = prev.ordering || channel.default_order;
      if (prev.channel === channel.id && prev.ordering === newOrdering)
        return prev;
      return { ...prev, channel: channel.id, ordering: newOrdering };
    });
  }, [channel?.id, channel?.default_order, setFilters, videoSetFilters]);

  useEffect(() => {
    if (!channelSlug) return;
    void fetchChannel(channelSlug);
  }, [fetchChannel, channelSlug]);

  useEffect(() => {
    if (didSetInitialTab.current) return;
    if (!channel || !hasLoadedBaseThemes || useVideoLoading) return;

    const timeoutId = window.setTimeout(() => {
      handleTabValue();
      didSetInitialTab.current = true;
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [channel, hasLoadedBaseThemes, useVideoLoading, handleTabValue]);

  if (
    !channel ||
    !channelThemes ||
    !visibleAndPublicVideos ||
    !channelAllThemes ||
    !mounted
  ) {
    return <CenteredLoader />;
  }

  return (
    <div>
      <BackButton label={t("common.back")} />
      {useChannelLoading ? (
        <CenteredLoader />
      ) : (
        <>
          <Image
            unoptimized
            src={
              channel.banner || channel.logo || "/default_channel_banner.png"
            }
            alt={t("a11y.channelBanner", { title: channel.title })}
            className="pod-image-banner"
            width={0}
            height={0}
            loading={"eager"}
          />{" "}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80 }}
              alt={t("a11y.channelLogo", { title: channel.title })}
              src={channel.logo || "/default_channel_logo.png"}
            ></Avatar>{" "}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}
            >
              <h1>{channel.title}</h1>
              <p>{channel.description}</p>
            </Box>
          </Box>
          {useChannelError && (
            <Alert canClose type={VariantType.ERROR}>
              {useChannelError}
            </Alert>
          )}
          <div>
            <div>
              <Box sx={{ width: "100%", typography: "body1" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label={t("channels.content")}
                >
                  <Tab
                    disabled={visibleAndPublicVideos.length === 0}
                    label={`${t("channels.unclassified")} (${videosCount})`}
                    value="unclassified"
                  />

                  <Tab
                    disabled={channelAllThemes.length === 0}
                    label={` ${t("common.themes")} (${channelAllThemes.length})`}
                    value="themes"
                  />
                </Tabs>

                {hasLoadedBaseThemes &&
                !useVideoLoading &&
                !loading &&
                visibleAndPublicVideos.length === 0 &&
                channelAllThemes.length === 0 ? (
                  <Alert type={VariantType.INFO}>
                    {t("channels.noContent")}
                  </Alert>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    {value === "unclassified" && (
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
                          types={videoTypes}
                          disciplines={videoDisciplines}
                          tags={videoTags}
                          channels={videoChannels}
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
                            videoSetFilters(newFilters);
                          }}
                        />

                        {visibleAndPublicVideos.length === 0 &&
                        !useVideoLoading ? (
                          <Alert type={VariantType.INFO}>
                            {hasActiveVideoFilters
                              ? t("favorites.noMatchingFilters")
                              : t("channels.noVideos")}
                          </Alert>
                        ) : (
                          <VideoDisplay
                            videos={visibleAndPublicVideos}
                            videosCount={videosCount}
                            page={videoFilters.page}
                            onPageChange={(page) =>
                              videoSetFilters({ ...videoFilters, page })
                            }
                            loading={useVideoLoading}
                          />
                        )}
                      </div>
                    )}

                    {value === "themes" && (
                      <div>
                        <h2>{t("common.themes")}</h2>

                        {error && (
                          <Alert canClose type={VariantType.ERROR}>
                            {error}
                          </Alert>
                        )}

                        <CollectionFilters
                          mode="themes"
                          value={filters}
                          users={user ? users : []}
                          channels={
                            channel
                              ? [
                                  channel,
                                  ...channels.filter(
                                    (item) => item.id !== channel.id,
                                  ),
                                ]
                              : channels
                          }
                          showUserFilter={!!user}
                          onChange={(newFilters) => {
                            if (
                              newFilters.search !== filters.search ||
                              newFilters.channel !== filters.channel ||
                              newFilters.ordering !== filters.ordering ||
                              newFilters.ownerUsernames !==
                                filters.ownerUsernames ||
                              newFilters.createdAtGte !==
                                filters.createdAtGte ||
                              newFilters.createdAtLte !== filters.createdAtLte
                            ) {
                              newFilters.page = 1;
                            }
                            setFilters(newFilters);
                          }}
                        />

                        {channelAllThemes.length === 0 &&
                        !loading &&
                        hasLoadedBaseThemes ? (
                          <Alert type={VariantType.INFO}>
                            {t("themes.noThemes")}
                          </Alert>
                        ) : channelThemes.length === 0 &&
                          !loading &&
                          hasLoadedBaseThemes ? (
                          <Alert type={VariantType.INFO}>
                            {t("playlists.noMatchingFilters")}
                          </Alert>
                        ) : (
                          <CollectionDisplay
                            themes={channelThemes}
                            collectionsCount={themesCount}
                            page={filters.page}
                            onPageChange={(page) =>
                              setFilters({ ...filters, page })
                            }
                            defaultView="cards"
                            storageKey="channel-theme-view"
                            channelSlug={channelSlug}
                            loading={loading || !hasLoadedBaseThemes}
                          />
                        )}
                      </div>
                    )}
                  </Box>
                )}
              </Box>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
