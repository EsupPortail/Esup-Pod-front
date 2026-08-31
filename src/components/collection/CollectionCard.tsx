"use client";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { Channel, Theme } from "@/src/types";
import { truncateVideoTitle } from "@/src/constants/string";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import StyleIcon from "@mui/icons-material/Style";

export type CollectionCardType = "channel" | "theme";

type CollectionCardProps =
  | { type: "channel"; channel: Channel }
  | { type: "theme"; theme: Theme; themeHref?: string };

export default function CollectionCard(props: CollectionCardProps) {
  if (props.type === "channel") {
    const { channel } = props;
    const channelVideosCount = (channel as Channel & { videos_count?: number }).videos_count ?? 0;
    const channelThemesCount = (channel as Channel & { themes_count?: number }).themes_count ?? 0;
    const videoLabel = channelVideosCount > 1 ? "vidéos" : "vidéo";
    const themeLabel = channelThemesCount > 1 ? "thèmes" : "thème";

    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",
          position: "relative",
          mb: 4,
          backgroundColor: "var(--c--globals--colors--gray-000)",
          border: "1px solid var(--c--globals--colors--gray-200)",
          borderRadius: "12px",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "var(--c--contextuals--background--semantic--brand--primary)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            transform: "translateY(-2px)",
          }
        }}
      >
        <CardActionArea
          component={Link}
          href={`/channel/${channel.slug}`}
          sx={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
          disableRipple
        >
          <CardMedia
            component="img"
            image={channel.logo || channel.banner || "/default_channel_logo.png"}
            alt={channel.title}
            sx={{
              borderTopLeftRadius: "11px",
              borderTopRightRadius: "11px",
              aspectRatio: "16/9",
              objectFit: "cover",
            }}
          />
          <Box sx={{ p: 2, pt: 1.5 }}>
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
        </CardActionArea>
      </Card>
    );
  }

  const { theme, themeHref } = props;
  const themeItemsCount = theme.items?.length ?? 0;
  const themeChildrenCount = theme.children?.length ?? 0;
  const themeVideoLabel = themeItemsCount > 1 ? "vidéos" : "vidéo";
  const themeChildrenLabel =
    themeChildrenCount > 1 ? "sous-thèmes" : "sous-thème";

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        position: "relative",
        mb: 4,
        backgroundColor: "var(--c--globals--colors--gray-000)",
        border: "1px solid var(--c--globals--colors--gray-200)",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "var(--c--contextuals--background--semantic--brand--primary)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        }
      }}
    >
      <CardActionArea
        component={Link}
        href={themeHref ?? `/themes/${theme.slug}`}
        sx={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
        disableRipple
      >
        <CardMedia
          component="img"
          image={theme.banner || "/default_theme_banner.png"}
          alt={theme.title}
          sx={{
            borderTopLeftRadius: "11px",
            borderTopRightRadius: "11px",
            aspectRatio: "16/9",
            objectFit: "cover",
          }}
        />
        <Box sx={{ p: 2, pt: 1.5 }}>
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
      </CardActionArea>
    </Card>
  );
}
