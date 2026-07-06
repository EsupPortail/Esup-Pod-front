"use client";

import { Alert, VariantType } from "@openfun/cunningham-react";
import BackButton from "@/src/components/BackButton/BackButton";
import { useChannel } from "@/src/hooks/useChannel";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import styles from "./styles.module.css";
import { useVideos } from "@/src/hooks/useVideos";
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

export const breadcrumbLabel = "Chaine";

export default function Channel() {
  const [value, setValue] = useState("themes");
  const mounted = useMounted();
  const didSetInitialTab = useRef(false);

  // Thèmes filtrés pour la chaîne de la page
  const { filters, setFilters, themes, users, channels, error, loading } =
    useCollectionListFilters({ mode: "themes" });

  // Thèmes bruts pour la chaîne de la page
  const { fetchAll: fetchAllThemes } = useTheme();
  const {
    filters: videoFilters,
    setFilters: videoSetFilters,
    videos,
    users: videoUsers,
    types: videoTypes,
    disciplines: videoDisciplines,
    tags: videoTags,
    channels: videoChannels,
    useVideoError,
    useVideoLoading,
  } = useVideoListFilters({ mode: "all" });

  const [baseChannelThemes, setBaseChannelThemes] = useState<typeof themes>([]);
  const [hasLoadedBaseThemes, setHasLoadedBaseThemes] = useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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

  const { fetchAll: fetchVideos } = useVideos();

  const { user } = useAuth();

  const visibleAndPublicVideos = useMemo(
    () =>
      videos.filter(
        (video) =>
          video.channel === channel?.id &&
          (!video.is_auth_required || !!user) &&
          video.status !== "DR" &&
          video.encoding_status === "DO",
      ),
    [videos, channel?.id, user],
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

  // Thèmes de la chaine avec les filtres
  const channelThemes = useMemo(
    () => themes.filter((theme) => theme.channel === channel?.id),
    [themes, channel?.id],
  );

  // Charge une fois tous les thèmes de la chaîne de la page, indépendamment des filtres
  useEffect(() => {
    if (!channel?.id) return;

    const loadBaseThemes = async () => {
      const all = await fetchAllThemes({ channel: channel.id });
      setBaseChannelThemes(all.filter((theme) => theme.channel === channel.id));
      setHasLoadedBaseThemes(true);
    };

    void loadBaseThemes();
  }, [channel?.id, fetchAllThemes]);

  // Thèmes de base pour cette chaîne
  const channelAllThemes = baseChannelThemes;

  const handleTabValue = () => {
    const hasThemes = channelAllThemes.length > 0;
    const hasUnclassifiedVideos = visibleAndPublicVideos.length > 0;

    if (hasThemes) {
      setValue("themes");
      return;
    }

    if (hasUnclassifiedVideos) {
      setValue("unclassified");
    }
  };

  useEffect(() => {
    if (!channel?.default_order) return;
    setFilters((prev) => {
      if (prev.ordering) return prev;
      return { ...prev, ordering: channel.default_order };
    });
  }, [channel?.default_order, setFilters]);

  useEffect(() => {
    if (!channelSlug) return;
    fetchChannel(channelSlug);
  }, [fetchChannel, channelSlug]);

  useEffect(() => {
    if (!channel?.id) return;
    fetchVideos({ channel: channel.id });
  }, [channel?.id, fetchVideos]);

  useEffect(() => {
    if (didSetInitialTab.current) return;
    if (!channel) return;

    handleTabValue();
    didSetInitialTab.current = true;
  }, [channel, channelAllThemes.length, visibleAndPublicVideos.length]);

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
      <BackButton label="Retour" />
      {useChannelLoading ? (
        <CenteredLoader />
      ) : (
        <>
          <img
            src={channel.banner || "/default_channel_banner.png"}
            alt={`${channel.title} banner`}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
          />{" "}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80 }}
              alt={channel.title}
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
                  aria-label="Contenus de la chaine"
                >
                  <Tab
                    disabled={visibleAndPublicVideos.length === 0}
                    label={`Videos non classées (${visibleAndPublicVideos.length})`}
                    value="unclassified"
                  />

                  <Tab
                    disabled={channelAllThemes.length === 0}
                    label={`Thèmes (${channelAllThemes.length})`}
                    value="themes"
                  />
                </Tabs>

                {hasLoadedBaseThemes &&
                !useVideoLoading &&
                !loading &&
                visibleAndPublicVideos.length === 0 &&
                channelAllThemes.length === 0 ? (
                  <Alert type={VariantType.INFO}>
                    Cette chaine n'a aucune vidéo ou thème associé.
                  </Alert>
                ) : (
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
                          types={videoTypes}
                          disciplines={videoDisciplines}
                          tags={videoTags}
                          channels={videoChannels}
                          showUserFilter={!!user}
                          onChange={videoSetFilters}
                        />

                        {useVideoLoading ? (
                          <CenteredLoader />
                        ) : visibleAndPublicVideos.length === 0 ? (
                          <Alert type={VariantType.INFO}>
                            {hasActiveVideoFilters
                              ? "Aucune vidéo ne correspond à vos filtres."
                              : "Aucune vidéo liée à cette chaîne."}
                          </Alert>
                        ) : (
                          <VideoDisplay videos={visibleAndPublicVideos} />
                        )}
                      </div>
                    )}

                    {value === "themes" && (
                      <div>
                        <h2>Thèmes</h2>

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
                          onChange={setFilters}
                        />

                        {!hasLoadedBaseThemes || loading ? (
                          <CenteredLoader />
                        ) : channelAllThemes.length === 0 ? (
                          <Alert type={VariantType.INFO}>
                            Aucun thème lié à cette chaine.
                          </Alert>
                        ) : channelThemes.length === 0 ? (
                          <Alert type={VariantType.INFO}>
                            Aucun thème ne correspond à vos critères de
                            recherche.
                          </Alert>
                        ) : (
                          <CollectionDisplay
                            themes={channelThemes}
                            defaultView="cards"
                            storageKey="channel-theme-view"
                            channelSlug={channelSlug}
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
