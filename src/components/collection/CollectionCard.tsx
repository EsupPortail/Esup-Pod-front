"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { Channel, Theme } from "@/src/types";
import { truncateVideoTitle } from "@/src/constants/string";
import { useEffect, useMemo } from "react";
import { useTheme } from "@/src/hooks/useTheme";
import { useVideos } from "@/src/hooks/useVideos";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import StyleIcon from "@mui/icons-material/Style";

export type CollectionCardType = "channel" | "theme";

type CollectionCardProps =
  | { type: "channel"; channel: Channel }
  | { type: "theme"; theme: Theme; themeHref?: string };

export default function CollectionCard(props: CollectionCardProps) {
  const { themes, fetchAll: fetchThemes } = useTheme();
  const { videos, fetchAll: fetchVideos } = useVideos();
  const isChannel = props.type === "channel";
  const channelId = isChannel ? props.channel.id : null;

  useEffect(() => {
    if (!isChannel || channelId == null) return;
    fetchThemes({ channel: channelId });
  }, [channelId, fetchThemes, isChannel]);

  useEffect(() => {
    if (!isChannel || channelId == null) return;
    fetchVideos({ channel: channelId });
  }, [channelId, fetchVideos, isChannel]);

  const themesChannel = useMemo(() => {
    if (!isChannel || channelId == null) return [];
    return themes.filter((theme) => theme.channel === channelId);
  }, [channelId, isChannel, themes]);

  const videosChannel = useMemo(() => {
    if (!isChannel || channelId == null) return [];
    // On garde uniquement les vidéos publiques et encodées.
    return videos.filter(
      (video) => video.status === "PU" && video.encoding_status === "DO",
    );
  }, [channelId, isChannel, videos]);

  const channelVideosCount = isChannel ? videosChannel.length : 0;

  const channelThemesCount = themesChannel.length;
  const videoLabel = channelVideosCount > 1 ? "vidéos" : "vidéo";
  const themeLabel = channelThemesCount > 1 ? "thèmes" : "thème";

  if (props.type === "channel") {
    const { channel } = props;

    return (
      <Box>
        <CardActionArea
          component={Link}
          href={`/channel/${channel.slug}`}
          sx={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Card
            sx={{
              minWidth: 345,
              borderRadius: "12px",
              position: "relative",
              overflow: "visible",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardMedia
              component="img"
              height="150px"
              image={channel.logo || "/default_channel_logo.png"}
              alt={channel.title}
              sx={{
                filter: "brightness(0.9)",
                borderRadius: "8px",
              }}
            />
          </Card>
        </CardActionArea>
        <Box sx={{ mt: 1.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "var(--c--globals--font--sizes--lg)",
              fontWeight: "var(--c--globals--font--weights--bold)",
              mb: 1,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {truncateVideoTitle(channel.title, 40)}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <VideoLibraryIcon
                fontSize="small"
                sx={{ color: "text.secondary", fontSize: "1rem" }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "var(--c--globals--font--sizes--md)" }}
              >
                {channelVideosCount} {videoLabel}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StyleIcon
                fontSize="small"
                sx={{ color: "text.secondary", fontSize: "1rem" }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "var(--c--globals--font--sizes--md)" }}
              >
                {channelThemesCount} {themeLabel}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const { theme, themeHref } = props;
  const themeItemsCount = theme.items?.length ?? 0;
  const themeChildrenCount = theme.children?.length ?? 0;
  const themeVideoLabel = themeItemsCount > 1 ? "vidéos" : "vidéo";
  const themeChildrenLabel =
    themeChildrenCount > 1 ? "sous-thèmes" : "sous-thème";

  return (
    <Box>
      <CardActionArea
        component={Link}
        href={themeHref ?? `/themes/${theme.slug}`}
        sx={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Card
          sx={{
            minWidth: 345,
            borderRadius: "12px",
            position: "relative",
            overflow: "visible",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "translateY(-4px)",
            },
          }}
        >
          <CardMedia
            component="img"
            height="150px"
            image={theme.banner || "/default_theme_banner.png"}
            alt={theme.title}
            sx={{
              filter: "brightness(0.9)",
              borderRadius: "8px",
            }}
          />
        </Card>
      </CardActionArea>
      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            fontSize: "var(--c--globals--font--sizes--lg)",
            fontWeight: "var(--c--globals--font--weights--bold)",
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {truncateVideoTitle(theme.title, 40)}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <VideoLibraryIcon
              fontSize="small"
              sx={{ color: "text.secondary", fontSize: "1rem" }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "var(--c--globals--font--sizes--md)" }}
            >
              {themeItemsCount} {themeVideoLabel}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StyleIcon
              fontSize="small"
              sx={{ color: "text.secondary", fontSize: "1rem" }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "var(--c--globals--font--sizes--md)" }}
            >
              {themeChildrenCount} {themeChildrenLabel}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
