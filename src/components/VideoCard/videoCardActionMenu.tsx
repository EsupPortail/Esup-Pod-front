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
import { RemoveRedEye } from "@mui/icons-material";
import Link from "next/link";
import { Video } from "@/src/types/interface";

interface VideoCardActionMenuProps {
  video: Video;
}

export default function VideoCardActionMenu({
  video,
}: VideoCardActionMenuProps) {
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
          </ListItemDecorator>{" "}
          Éditer la vidéo
        </MenuItem>
        <MenuItem component={Link} href={`/video/${video.id}`}>
          <ListItemDecorator>
            <RemoveRedEye />
          </ListItemDecorator>{" "}
          Voir la vidéo
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
          Supprimer la vidéo
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
