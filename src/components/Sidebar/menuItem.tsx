import { useState, useEffect } from "react";
import { useSidebar } from "../../context/SidebarProvider";
import styles from "./styles.module.css";
import type { MenuItemProps } from "@/src/types";
import Link from "next/link";
import {
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  ListItemButton,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconExpandLess from "@mui/icons-material/ExpandLess";
import IconExpandMore from "@mui/icons-material/ExpandMore";

const MenuItem = (props: MenuItemProps) => {
  const { sidebarOpen, handleFixSidebar } = useSidebar();
  const { name, link, Icon, items = [] } = props;
  const isExpandable = items && items.length > 0;
  const [open, setOpen] = useState(false);
  const isNavigable = !isExpandable && Boolean(link);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  function handleClick() {
    if (isExpandable && sidebarOpen) {
      setOpen(!open);
      return;
    }

    if (isNavigable && isMobile && sidebarOpen) {
      handleFixSidebar();
    }
  }

  useEffect(() => {
    !sidebarOpen && setOpen(false);
  }, [sidebarOpen]);

  const MenuItemRoot = (
    <ListItemButton
      key={name}
      className={styles.menu_item}
      onClick={handleClick}
      component={isNavigable ? Link : "div"}
      href={isNavigable ? link : undefined}
      selected={isExpandable && open ? true : false}
      sx={{
        "&.Mui-selected": {
          backgroundColor:
            "rgb(from var(--c--contextuals--background--semantic--brand--primary)  r g b / 30%)",
        },
      }}
    >
      {/* Display an icon if any */}
      {!!Icon && (
        <ListItemIcon sx={{ paddingLeft: "6px" }}>
          <Icon
            sx={{
              color:
                "var(--c--contextuals--content--semantic--neutral--secondary)",
            }}
          />
        </ListItemIcon>
      )}
      <ListItemText
        sx={{
          ".MuiTypography-root": {
            fontSize: "0.825rem",
            color:
              "var(  --c--contextuals--content--semantic--neutral--primary)",
          },
        }}
        primary={name}
        inset={!Icon}
      />
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && (
        <IconExpandMore
          style={{
            color:
              "var(  --c--contextuals--content--semantic--neutral--primary)",
          }}
        />
      )}
      {isExpandable && open && (
        <IconExpandLess
          style={{
            color:
              "var(  --c--contextuals--content--semantic--neutral--primary)",
          }}
        />
      )}
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
