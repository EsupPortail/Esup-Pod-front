"use client";

import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Link from "next/link";
import type { Video } from "@/src/types";
import { useDuplicateVideo } from "@/src/hooks/useVideos";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import { useAuth } from "@/src/context/AuthProvider";

interface VideoCardActionMenuProps {
  video: Video;
}

export default function VideoCardActionMenu({
  video,
}: VideoCardActionMenuProps) {
  const { t } = useTranslation();
  const { config } = useAppConfig();
  const { user } = useAuth();
  const useDuplicate = config?.video?.use_duplicate !== false;
  const restrictEditToStaff = config?.video?.restrict_edit_to_staff === true;
  const canEdit = !restrictEditToStaff || user?.is_staff === true;
  const { mutateAsync: duplicateVideo } = useDuplicateVideo();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleClose();
    setIsDuplicating(true);
    try {
      const newVideo = await duplicateVideo(video.slug);
      router.push(`/video/edit/${newVideo.slug}`);
    } catch (err) {
      console.error("Duplication failed", err);
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-label="Actions vidéo"
        aria-controls={open ? "video-action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          color: "var(--text-color, inherit)",
          padding: "4px",
          borderRadius: "6px",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
          },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        id="video-action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              backgroundColor: "var(--c--theme--colors--card-bg, #ffffff)",
              color: "var(--text-color, #0f172a)",
              borderRadius: "10px",
              mt: 0.5,
              minWidth: "170px",
              border: "1px solid var(--border-color, #e2e8f0)",
            },
          },
        }}
      >
        {canEdit && (
          <MenuItem
            component={Link}
            href={`/video/edit/${video.slug}`}
            onClick={handleClose}
            sx={{
              fontSize: "0.875rem",
              gap: 1.5,
              py: 1,
              px: 2,
              color: "var(--text-color, #0f172a)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "var(--text-color-muted, #64748b)", minWidth: "auto !important" }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            {t("videoAction.edit")}
          </MenuItem>
        )}

        {useDuplicate && (
          <MenuItem
            onClick={handleDuplicate}
            disabled={isDuplicating}
            sx={{
              fontSize: "0.875rem",
              gap: 1.5,
              py: 1,
              px: 2,
              color: "var(--text-color, #0f172a)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "var(--text-color-muted, #64748b)", minWidth: "auto !important" }}>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            {isDuplicating ? t("videoAction.duplicating") : t("videoAction.duplicate")}
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5, borderColor: "var(--border-color, #e2e8f0)" }} />

        {canEdit && (
          <MenuItem
            component={Link}
            href={`/video/delete/${video.slug}`}
            onClick={handleClose}
            sx={{
              fontSize: "0.875rem",
              gap: 1.5,
              py: 1,
              px: 2,
              color: "#ef4444 !important",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.12) !important",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#ef4444 !important", minWidth: "auto !important" }}>
              <DeleteForeverIcon fontSize="small" />
            </ListItemIcon>
            {t("videoAction.delete")}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
