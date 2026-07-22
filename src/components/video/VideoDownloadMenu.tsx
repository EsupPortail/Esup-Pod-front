"use client";

import React, { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HighQualityIcon from "@mui/icons-material/HighQuality";
import type { Video, DownloadOption } from "@/src/types";

type Props = {
  video: Video;
  className?: string;
  onDownloadStreamUrl?: (url: string, resolution: string) => void;
};

export default function VideoDownloadMenu({ video, className, onDownloadStreamUrl }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!video.allow_downloading && !video.video_url) {
    return null;
  }

  const options: DownloadOption[] = React.useMemo(() => {
    if (video.download_options && video.download_options.length > 0) {
      return video.download_options;
    }
    if (video.video_url) {
      return [{ label: "Original", resolution: "Original", url: video.video_url }];
    }
    return [];
  }, [video.download_options, video.video_url]);

  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (options.length === 1 && options[0].url && onDownloadStreamUrl) {
      onDownloadStreamUrl(options[0].url, options[0].resolution);
      return;
    }
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectQuality = (opt: DownloadOption) => {
    handleClose();
    if (onDownloadStreamUrl && opt.url) {
      onDownloadStreamUrl(opt.url, opt.resolution);
    }
  };

  return (
    <>
      <button className={className} onClick={handleClick} type="button">
        <DownloadIcon fontSize="small" /> Télécharger
      </button>

      {options.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{ paper: { sx: { borderRadius: "8px", minWidth: 180 } } }}
        >
          <div style={{ padding: "8px 16px", fontSize: "0.75rem", fontWeight: 700, color: "#6b7280" }}>
            Choisir la qualité :
          </div>
          {options.map((opt, idx) => (
            <MenuItem key={idx} onClick={() => handleSelectQuality(opt)}>
              <ListItemIcon>
                <HighQualityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{opt.label || opt.resolution}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}
