"use client";

import { useEffect, useState } from "react";
import IconButton from "@mui/joy/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import type { Playlist } from "@/src/types";
import { usePlaylist } from "@/src/hooks/usePlaylist";
import { useFavorites } from "@/src/hooks/useFavorites";
import { Tooltip } from "@mui/material";

interface PlaylistActionMenuProps {
  playlists: Playlist[];
  videoId: number;
}

type InfoKind = "added" | "removed" | "favorite-added" | "favorite-removed";

export default function PlaylistActionMenu({
  playlists,
  videoId,
}: PlaylistActionMenuProps) {
  const { addVideo, deleteVideo } = usePlaylist();
  const {
    favorites,
    fetchAll: fetchAllFavorites,
    addFavorite,
    removeFavoriteForVideo,
    isFavorite,
  } = useFavorites();

  // Ancre Popover (null = fermé)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Etat local : map slug -> bool indiquant si la vidéo est dans la playlist.
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  //Message success qui s’affiche 5 secondes.
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [infoKind, setInfoKind] = useState<InfoKind | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "playlist-action-popover" : undefined;

  useEffect(() => {
    if (!infoMessage) return;
    const timeout = setTimeout(() => {
      setInfoMessage(null);
      setInfoKind(null);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [infoMessage]);

  // Synchro playlists -> checkedMap
  useEffect(() => {
    const next: Record<string, boolean> = {};
    playlists.forEach((playlist) => {
      const contains =
        playlist.items?.some((item) => item.video.id === videoId) ?? false;
      next[playlist.slug] = contains;
    });
    setCheckedMap(next);
  }, [playlists, videoId]);

  useEffect(() => {
    if (!favorites.length) {
      fetchAllFavorites();
    }
  }, [favorites.length, fetchAllFavorites]);

  const handlePlaylistButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((current) => (current ? null : event.currentTarget));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTogglePlaylist = async (playlist: Playlist) => {
    if (pendingSlug) {
      return;
    }

    const isInPlaylist = checkedMap[playlist.slug] === true;
    setPendingSlug(playlist.slug);
    setError(null);
    setInfoMessage(null);
    setInfoKind(null);

    try {
      if (!isInPlaylist) {
        // Ajouter la vidéo à la playlist
        await addVideo(playlist.slug, { video_id: videoId });
        setCheckedMap((prev) => ({
          ...prev,
          [playlist.slug]: true,
        }));
        setInfoKind("added");
        setInfoMessage(`Vidéo ajoutée à la playlist « ${playlist.title} ».`);
      } else {
        // Retirer la vidéo de la playlist
        await deleteVideo(playlist.slug, { video_id: videoId });
        setCheckedMap((prev) => ({
          ...prev,
          [playlist.slug]: false,
        }));
        setInfoKind("removed");
        setInfoMessage(`Vidéo retirée de la playlist « ${playlist.title} ».`);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Une erreur est survenue lors de la mise à jour de la playlist.",
      );
    } finally {
      setPendingSlug(null);
    }
  };

  const handleToggleFavorite = async () => {
    if (!videoId) {
      return;
    }

    setError(null);
    setInfoMessage(null);
    setInfoKind(null);

    const currentlyFavorite = isFavorite(videoId);

    try {
      if (!currentlyFavorite) {
        const res = await addFavorite(videoId);
        if (res) {
          setInfoKind("favorite-added");
          setInfoMessage("Vidéo ajoutée à vos favoris.");
        }
      } else {
        const ok = await removeFavoriteForVideo(videoId);
        if (ok) {
          setInfoKind("favorite-removed");
          setInfoMessage("Vidéo retirée de vos favoris.");
        }
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Une erreur est survenue lors de la mise à jour des favoris.",
      );
    }
  };

  const infoColor =
    infoKind === "added" || infoKind === "favorite-added"
      ? "var(--c--contextuals--text--semantic--success--standard)"
      : infoKind === "removed" || infoKind === "favorite-removed"
        ? "var(--c--contextuals--text--semantic--warning--standard)"
        : "inherit";

  const favorite = isFavorite(videoId);

  return (
    <>
      <div style={{ display: "flex", gap: "0.25rem" }}>
        <Tooltip title="Ajouter la vidéo dans une liste de lecture">
          <IconButton
            aria-describedby={id}
            variant="outlined"
            sx={{
              backgroundColor: "white",
              ":hover": {
                backgroundColor:
                  "var(--c--contextuals--background--semantic--brand--tertiary)",
              },
            }}
            onClick={handlePlaylistButtonClick}
          >
            <PlaylistAddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Ajouter la vidéo en favoris">
          <IconButton
            variant="outlined"
            sx={{
              backgroundColor: "white",
              border: "0px",
              ":hover": {
                backgroundColor:
                  "var(--c--contextuals--background--semantic--brand--tertiary)",
              },
            }}
            onClick={handleToggleFavorite}
          >
            {favorite ? (
              <FavoriteIcon aria-hidden="true" sx={{ color: "red" }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: "red" }} aria-hidden="true" />
            )}
          </IconButton>
        </Tooltip>
      </div>

      {/* Liste des playlists */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { minWidth: 260, maxWidth: 320, p: 0 },
        }}
      >
        <div style={{ padding: "0.5rem 1rem" }}>
          <Typography
            variant="subtitle2"
            component="h4"
            sx={{ fontSize: "0.9rem", m: 0 }}
          >
            Ajouter à une liste de lecture
          </Typography>
          {error && (
            <Typography
              variant="body2"
              sx={{
                color: "red",
                fontSize: "0.75rem",
                mt: 0.5,
              }}
            >
              {error}
            </Typography>
          )}
        </div>

        <MenuList
          dense
          disablePadding
          sx={{
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {playlists.length === 0 && (
            <MenuItem disabled>Aucune playlist disponible</MenuItem>
          )}

          {playlists.map((playlist) => {
            const checked = checkedMap[playlist.slug] === true;
            const loading = pendingSlug === playlist.slug;

            return (
              <MenuItem
                key={playlist.slug}
                onClick={() => handleTogglePlaylist(playlist)}
                disabled={loading}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {loading ? (
                  <CircularProgress size={18} />
                ) : (
                  <Checkbox
                    size="small"
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                    sx={{ padding: 0 }}
                  />
                )}
                <ListItemText
                  primary={playlist.title}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontSize: "0.9rem",
                  }}
                />
              </MenuItem>
            );
          })}
        </MenuList>

        {infoMessage && (
          <div
            style={{
              padding: "0.5rem 1rem",
              borderTop: "1px solid #eee",
              fontSize: "0.75rem",
              color: infoColor,
              maxWidth: 280,
              whiteSpace: "normal",
            }}
          >
            {infoMessage}
          </div>
        )}
      </Popover>
    </>
  );
}
