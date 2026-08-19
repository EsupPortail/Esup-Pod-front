import { getThumbnailUrl } from "@/src/utils/url";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Checkbox } from "@openfun/cunningham-react";
import styles from "./VideoCard.module.css";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { setInitial, getVideoOwnerDisplayName } from "@/src/constants/user";
import { usePathname, useParams } from "next/navigation";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import type { Video } from "@/src/types";
import { formatTime, timeAgo, secondToMinute } from "@/src/constants/date";
import VideoActionMenu from "@/src/components/video/VideoActionMenu";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DownloadingIcon from "@mui/icons-material/Downloading";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useTranslation } from "@/src/hooks/useTranslation";

interface VideosCardProps {
  video: Video;
  isOwner?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelectToggle?: (checked: boolean) => void;
}

export default function VideoCard(props: VideosCardProps) {
  const { video, isOwner = false, selectable = false, selected = false, onSelectToggle } = props;
  const { locale } = useTranslation();
  const time = secondToMinute(video.duration || 0);

  // Détection du contexte : playlist ou favoris
  const pathname = usePathname();
  const params = useParams();

  let href = `/video/${video.slug}`;

  //  Si on est dans une page de type /playlist/[slug]
  if (pathname?.startsWith("/playlist/") && "slug" in params) {
    const rawSlug = (params as { slug?: string | string[] }).slug;
    const playlistSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    if (playlistSlug) {
      href = `/video/${video.slug}?playlist=${playlistSlug}`;
    }
  }

  // Si on est sur la page des favoris (/playlist/favorites)
  if (pathname === "/playlist/favorites") {
    href = `/video/${video.slug}?favorites=1`;
  }

  const { config } = useAppConfig();
  const displayName = getVideoOwnerDisplayName(video, config?.authentication, true);
  const isAnonymous = displayName === "Anonyme";
  const initial = isAnonymous ? "A" : setInitial(video.owner_last_name, video.owner_first_name);

  return (
    <Card
      component="article"
      elevation={0}
      sx={{
        width: "100%",
        position: "relative",
        mb: 4,
        backgroundColor: selected
          ? "rgba(10, 89, 219, 0.04)"
          : "var(--c--globals--colors--gray-000)",
        border: selected
          ? "2px solid var(--c--contextuals--background--semantic--brand--primary)"
          : "1px solid var(--c--globals--colors--gray-200)",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "var(--c--contextuals--background--semantic--brand--primary)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        }
      }}
    >
      {selectable && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 10,
            lineHeight: 0,
            transform: "scale(0.85)",
            transformOrigin: "top left",
            backgroundColor: selected
              ? "var(--c--contextuals--background--semantic--brand--primary, #3b82f6)"
              : "var(--c--theme--colors--card-bg, #ffffff)",
            border: selected ? "1px solid #2563eb" : "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "6px",
            padding: "2px 4px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Checkbox
            label=""
            checked={selected}
            onChange={(e) => {
              onSelectToggle?.((e.target as HTMLInputElement).checked);
            }}
            aria-label="Sélectionner cette vidéo"
          />
        </div>
      )}

      <CardActionArea
        component={Link}
        href={href}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          textDecoration: "none",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
        disableRipple
      >
        <div style={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={video.thumbnail_url || video.thumbnail || "/default_thumbnail.svg"}
            alt={video.title}
            sx={{
              borderTopLeftRadius: "11px",
              borderTopRightRadius: "11px",
              aspectRatio: "16/9",
              objectFit: "cover",
            }}
          />
          <time dateTime={`PT${video.duration}S`} className={styles.video_duration}>
            {formatTime(time)}
          </time>
        </div>
        <CardContent sx={{ padding: "12px 16px", display: "flex", gap: "12px", alignItems: "flex-start", paddingBottom: "16px !important" }}>
          <Avatar sx={{ width: 36, height: 36, mt: 0.5 }}>{initial}</Avatar>

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
              <Typography
                component="div"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  color: "var(--text-color)",
                }}
              >
                {video.title}
              </Typography>

              <div className={styles.video_icons} style={{ display: "flex", flexShrink: 0, gap: "6px", alignItems: "center", marginTop: "2px" }}>
                {video.encoding_status == "ER" && isOwner && (
                  <Tooltip title="Erreur d'encodage">
                    <ErrorIcon color="error" sx={{ fontSize: "1.1rem" }} />
                  </Tooltip>
                )}
                {video.encoding_status == "PE" && isOwner && (
                  <Tooltip title="Vidéo en attente d'encodage">
                    <PauseCircleFilledIcon color="warning" sx={{ fontSize: "1.1rem" }} />
                  </Tooltip>
                )}
                {video.encoding_status == "PR" && isOwner && (
                  <Tooltip title="Vidéo en cours d'encodage">
                    <DownloadingIcon sx={{ color: "var(--background-brand)", fontSize: "1.1rem" }} />
                  </Tooltip>
                )}
                {video.encoding_status == "DO" && isOwner && (
                  <Tooltip title="Encodage terminé">
                    <CheckCircleOutlinedIcon color="success" sx={{ fontSize: "1.1rem" }} />
                  </Tooltip>
                )}
                {video.status === "DR" && (
                  <Tooltip title="Vidée privée / Brouillon">
                    <VisibilityOffOutlinedIcon sx={{ fontSize: "1.1rem", color: "var(--text-color-muted, #94a3b8)" }} />
                  </Tooltip>
                )}
                {video.has_password && (
                  <Tooltip title="Vidéo protégée par mot de passe">
                    <LockOutlinedIcon sx={{ fontSize: "1.1rem", color: "var(--text-color-muted, #94a3b8)" }} />
                  </Tooltip>
                )}
                {video.is_auth_required && (
                  <Tooltip title="Réservé aux utilisateurs authentifiés">
                    <ShieldOutlinedIcon sx={{ fontSize: "1.1rem", color: "var(--text-color-muted, #94a3b8)" }} />
                  </Tooltip>
                )}
                {isOwner && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ marginLeft: "2px" }}
                  >
                    <VideoActionMenu video={video} />
                  </div>
                )}
              </div>
            </div>

            <Typography
              component="div"
              sx={{
                fontSize: "0.85rem",
                color: "var(--text-color-muted, #94a3b8)",
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px",
                lineHeight: 1.2
              }}
            >
              <address style={{ display: "inline", fontStyle: "normal", color: "var(--text-color-muted, #94a3b8)" }}>
                {displayName}
              </address>
              <span style={{ fontSize: "10px", opacity: 0.8, color: "var(--text-color-muted, #94a3b8)" }}>•</span>
              <time dateTime={video.created_at} style={{ color: "var(--text-color-muted, #94a3b8)", fontWeight: 500 }}>
                {timeAgo(video.created_at, locale)}
              </time>
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
