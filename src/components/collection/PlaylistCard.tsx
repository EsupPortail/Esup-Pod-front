import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CardActions from "@mui/material/CardActions";
import Link from "next/link";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import type { Playlist } from "@/src/types";
import { timeAgo } from "@/src/constants/date";
import { truncateVideoTitle } from "@/src/constants/string";

import PlaylistActionMenu from "./PlaylistActionMenu";

type PlaylistCardProps = {
  playlist: Playlist;
  href?: string;
  isOwner?: boolean;
};

export default function PlaylistCard({
  playlist,
  href,
  isOwner,
}: PlaylistCardProps) {
  const playlistHref = href ?? `/playlist/${playlist.slug}`;
  const videosCount = playlist.items?.length ?? 0;
  const playlistThumbnail =
    playlist.items?.[0]?.video?.thumbnail_url ?? "/default_playlist_logo.png";
  return (
    <Box
      sx={{
        minWidth: 345,
        position: "relative",

        "& .playlist-stack": {
          transition: "transform .3s ease",
        },

        "& .playlist-menu": {
          transition: "transform .3s ease",
        },

        "&:hover .playlist-stack": {
          transform: "translateY(-5px)",
        },

        "&:hover .playlist-menu": {
          transform: "translateY(-5px)",
        },
      }}
    >
      {isOwner && (
        <CardActions
          className="playlist-menu"
          sx={{
            position: "absolute",
            top: 25,
            left: 8,
            zIndex: 10,
            p: 0,
          }}
        >
          <PlaylistActionMenu slug={playlist.slug} />
        </CardActions>
      )}
      <CardActionArea
        component={Link}
        href={playlistHref}
        disableRipple
        disableTouchRipple
        sx={{
          "& .MuiCardActionArea-focusHighlight": {
            opacity: 0,
          },

          "&:hover .MuiCardActionArea-focusHighlight": {
            opacity: 0,
          },

          "&.Mui-focusVisible": {
            backgroundColor: "transparent",
          },
          textDecoration: "none",

          "& .playlist-stack": {
            transition: "transform 0.3s ease",
          },

          "&:hover .playlist-stack": {
            transform: "translateY(-5px)",
          },

          "& .playlist-back-1": {
            transform: "translate(12px, 10px)",
            transition: "transform 0.3s ease",
          },

          "& .playlist-back-2": {
            transform: "translate(6px, 5px)",
            transition: "transform 0.3s ease",
          },

          "& .playlist-image": {
            transition: "transform 0.3s ease",
          },

          "&:hover .playlist-back-1": {
            transform: "translate(15px, 13px)",
          },

          "&:hover .playlist-back-2": {
            transform: "translate(8px, 7px)",
          },
        }}
      >
        <Box
          className="playlist-stack"
          sx={{
            position: "relative",
            pt: 2,
            pr: 2,
          }}
        >
          <Box
            className="playlist-back-1"
            sx={{
              position: "absolute",
              top: 0,
              left: 22,
              right: 22,
              height: 118,
              borderRadius: 3,
              bgcolor: "grey.200",
              opacity: 0.25,
            }}
          />

          {/* Feuille intermédiaire */}
          <Box
            className="playlist-back-2"
            sx={{
              position: "absolute",
              top: 0,
              left: 12,
              right: 12,
              height: 126,
              borderRadius: 3,
              bgcolor: "grey.400",
              opacity: 0.35,
            }}
          />

          {/* Thumbnail */}
          <Card
            className="playlist-front"
            elevation={4}
            sx={{
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              image={playlistThumbnail}
              alt={playlist.title}
              height="140"
              className="playlist-image"
              sx={{
                height: 140,
                objectFit: "cover",
                filter: "brightness(.95)",
              }}
            />
          </Card>
        </Box>

        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              sx={{
                fontSize: "var(--c--globals--font--sizes--lg)",
                fontWeight: "var(--c--globals--font--weights--bold)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {truncateVideoTitle(playlist.title, 30)}
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              {playlist.is_protected && (
                <Tooltip title="Playlist protégée par mot de passe">
                  <span className="material-icons">key</span>
                </Tooltip>
              )}

              {!playlist.is_public && (
                <Tooltip title="Playlist privée">
                  <span className="material-icons">visibility_off</span>
                </Tooltip>
              )}
            </Box>
          </Box>
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VideoLibraryIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", fontSize: "1rem" }}
                />
                <Typography
                  sx={{
                    fontSize: "var(--c--globals--font--sizes--sm)",
                    color: "text.secondary",
                  }}
                >
                  {videosCount} vidéo{videosCount > 1 ? "s" : ""}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "var(--c--globals--font--sizes--sm)",
                  color: "text.secondary",
                }}
              >
                {timeAgo(playlist.created_at)}
              </Typography>
            </Box>
          </div>
        </CardContent>
      </CardActionArea>
    </Box>
  );
}
