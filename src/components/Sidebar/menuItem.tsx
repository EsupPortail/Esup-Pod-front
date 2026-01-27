import { useState, useContext, useEffect } from "react";
import { SidebarContext } from "../../context/SidebarProvider";
import styles from "./page.module.css";
import { MenuItemProps } from "@/src/types/interface";
import {
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  ListItemButton,
} from "@mui/material";
import IconExpandLess from "@mui/icons-material/ExpandLess";
import IconExpandMore from "@mui/icons-material/ExpandMore";

const MenuItem = (props: MenuItemProps) => {
  const { sidebarOpen } = useContext(SidebarContext);
  const { name, link, Icon, items = [] } = props;
  const isExpandable = items && items.length > 0;
  const [open, setOpen] = useState(false);

  function handleClick() {
    sidebarOpen && setOpen(!open);
  }

  useEffect(() => {
    !sidebarOpen && setOpen(false);
  }, [sidebarOpen]);

  const MenuItemRoot = (
    <ListItemButton
      key={name}
      className={styles.menu_item}
      onClick={handleClick}
      selected={isExpandable && open ? true : false}
      sx={{
        "&.Mui-selected": {
          backgroundColor: "rgb(from #1167d4  r g b / 30%)",
        },
      }}
    >
      {/* Display an icon if any */}
      {!!Icon && (
        <ListItemIcon sx={{ paddingLeft: "6px" }}>
          <Icon />
        </ListItemIcon>
      )}
      <ListItemText
        sx={{
          ".MuiTypography-root": {
            fontSize: "0.825rem",
            color: "black",
          },
        }}
        primary={name}
        inset={!Icon}
      />
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && <IconExpandMore style={{ color: "black" }} />}
      {isExpandable && open && <IconExpandLess style={{ color: "black" }} />}
    </ListItemButton>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Divider />
      <List component="div" disablePadding>
        {items.map((item, index) => (
          <MenuItem {...item} key={index} />
        ))}
      </List>
    </Collapse>
  ) : null;

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  );
};
export default MenuItem;
