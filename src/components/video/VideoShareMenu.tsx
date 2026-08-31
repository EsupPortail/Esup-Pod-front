"use client";

import React, { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageIcon from "@mui/icons-material/Language";
import { useSocialNetworks } from "@/src/hooks/useSocialNetworks";
import type { Video, SocialNetwork } from "@/src/types";

type Props = {
  video: Video;
  className?: string;
};

export default function VideoShareMenu({ video, className }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { socialNetworks } = useSocialNetworks();

  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    handleClose();
  };

  // Determine active networks for this video
  const availableNetworks: SocialNetwork[] = React.useMemo(() => {
    if (video.social_network_details && video.social_network_details.length > 0) {
      return video.social_network_details;
    }
    return socialNetworks;
  }, [video.social_network_details, socialNetworks]);

  const handleShareToNetwork = (net: SocialNetwork) => {
    const pageUrl = window.location.href;
    const title = video.title || "";
    const shareUrl = net.share_url_template
      ? net.share_url_template
          .replace("{url}", encodeURIComponent(pageUrl))
          .replace("{title}", encodeURIComponent(title))
      : "";

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    }
    handleClose();
  };

  const getIcon = (iconName: string) => {
    const name = iconName.toLowerCase();
    if (name.includes("x") || name.includes("twitter")) return <XIcon fontSize="small" />;
    if (name.includes("facebook")) return <FacebookIcon fontSize="small" />;
    if (name.includes("linkedin")) return <LinkedInIcon fontSize="small" />;
    if (name.includes("whatsapp")) return <WhatsAppIcon fontSize="small" />;
    return <LanguageIcon fontSize="small" />;
  };

  return (
    <>
      <button className={className} onClick={handleClick} type="button">
        <ShareIcon fontSize="small" /> {isCopied ? "Lien copié !" : "Partager"}
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { sx: { borderRadius: "8px", minWidth: 200 } } }}
      >
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copier le lien</ListItemText>
        </MenuItem>

        {availableNetworks.map((net) => (
          <MenuItem key={net.id} onClick={() => handleShareToNetwork(net)}>
            <ListItemIcon>{getIcon(net.icon_name || net.name)}</ListItemIcon>
            <ListItemText>Partager sur {net.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
