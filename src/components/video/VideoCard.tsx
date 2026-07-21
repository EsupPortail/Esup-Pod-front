import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import styles from "./VideoCard.module.css";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { setInitial } from "@/src/constants/user";
import { usePathname, useParams } from "next/navigation";
import type { Video } from "@/src/types";
import { formatTime, timeAgo, secondToMinute } from "@/src/constants/date";
import VideoActionMenu from "@/src/components/video/VideoActionMenu";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DownloadingIcon from "@mui/icons-material/Downloading";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import ErrorIcon from "@mui/icons-material/Error";

interface VideosCardProps {
  video: Video;
  isOwner?: boolean;
}

export default function VideoCard(props: VideosCardProps) {
  const { video, isOwner = false } = props;
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

  const initial = setInitial(video.owner_last_name, video.owner_first_name);

  return (
    <Card
      component="article"
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

              <div className={styles.video_icons} style={{ display: "flex", flexShrink: 0, gap: "4px", marginTop: "2px" }}>
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
                {video.status == "DR" && (
                  <Tooltip title="Vidéo privée">
                    <span className="material-icons" style={{ fontSize: "1.1rem", color: "var(--c--globals--colors--gray-500)" }}>visibility_off</span>
                  </Tooltip>
                )}
                {video.has_password && (
                  <Tooltip title="Vidéo protégée par un mot de passe">
                    <span className="material-icons" style={{ fontSize: "1.1rem", color: "var(--c--globals--colors--gray-500)" }}>key</span>
                  </Tooltip>
                )}
                {video.is_auth_required && (
                  <Tooltip title="Vidéo visible pour les utilisateurs authentifiés">
                    <span className="material-icons" style={{ fontSize: "1.1rem", color: "var(--c--globals--colors--gray-500)" }}>verified_user</span>
                  </Tooltip>
                )}
                {isOwner && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ marginLeft: "4px" }}
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
                color: "text.secondary",
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px",
                lineHeight: 1.2
              }}
            >
              <address style={{ display: "inline", fontStyle: "normal" }}>
                {video.owner_first_name} {video.owner_last_name}
              </address>
              <span style={{ fontSize: "10px", opacity: 0.6 }}>•</span>
              <time dateTime={video.created_at}>{timeAgo(video.created_at)}</time>
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
