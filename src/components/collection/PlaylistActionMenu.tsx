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
import Link from "next/link";

interface PlaylistCardActionMenuProps {
  slug: string | null;
}

export default function PlaylistCardActionMenu({
  slug,
}: PlaylistCardActionMenuProps) {
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
        <MenuItem component={Link} href={`/playlist/edit/${slug}`}>
          <ListItemDecorator>
            <Edit />
          </ListItemDecorator>
          Éditer la liste de lecture
        </MenuItem>
        <ListDivider />
        <MenuItem
          component={Link}
          href={`/playlist/delete/${slug}`}
          variant="soft"
          color="danger"
        >
          <ListItemDecorator sx={{ color: "inherit" }}>
            <DeleteForever />
          </ListItemDecorator>
          Supprimer la liste de lecture
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
