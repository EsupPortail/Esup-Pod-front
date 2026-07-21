import IconButton from "@mui/joy/IconButton";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Menu from "@mui/joy/Menu";
import MoreVert from "@mui/icons-material/MoreVert";
import Edit from "@mui/icons-material/Edit";
import DeleteForever from "@mui/icons-material/DeleteForever";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Link from "next/link";
import type { Video } from "@/src/types";
import { useDuplicateVideo } from "@/src/hooks/useVideos";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface VideoCardActionMenuProps {
  video: Video;
}

export default function VideoCardActionMenu({
  video,
}: VideoCardActionMenuProps) {
  const { mutateAsync: duplicateVideo } = useDuplicateVideo();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const router = useRouter();

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const newVideo = await duplicateVideo(video.slug);
      // Redirige vers l'édition de la nouvelle vidéo dupliquée
      router.push(`/video/edit/${newVideo.slug}`);
    } catch (e) {
      console.error("Duplication failed", e);
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <Dropdown>
      <MenuButton
        sx={{
          backgroundColor: "white",
          ":hover": {
            backgroundColor:
              "var(--c--contextuals--background--semantic--brand--tertiary)",
          },
        }}
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "outlined" } }}
      >
        <MoreVert />
      </MenuButton>
      <Menu placement="bottom-end">
        <MenuItem component={Link} href={`/video/edit/${video.slug}`}>
          <ListItemDecorator>
            <Edit />
          </ListItemDecorator>
          Éditer la video
        </MenuItem>
        <MenuItem onClick={handleDuplicate} disabled={isDuplicating}>
          <ListItemDecorator>
            <ContentCopy />
          </ListItemDecorator>
          {isDuplicating ? "Duplication..." : "Dupliquer"}
        </MenuItem>
        <ListDivider />
        <MenuItem
          component={Link}
          href={`/video/delete/${video.slug}`}
          variant="soft"
          color="danger"
        >
          <ListItemDecorator sx={{ color: "inherit" }}>
            <DeleteForever />
          </ListItemDecorator>
          Supprimer la video
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
