import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { sidebarOpen, handleFixSidebar } = useSidebar();
  const { name, link, Icon, items = [] } = props;
  const isExpandable = items && items.length > 0;

  const isChildActive = isExpandable && items.some(item =>
    Boolean(item.link) && (pathname === item.link || (Boolean(item.link) && item.link !== "/" && Boolean(pathname?.startsWith(item.link!))))
  );

  const [open, setOpen] = useState(isChildActive);
  const isNavigable = !isExpandable && Boolean(link);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const isSelfActive = isNavigable && Boolean(link) && (
    pathname === link || (Boolean(link) && link !== "/" && Boolean(pathname?.startsWith(link!)))
  );

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
    if (!sidebarOpen) {
      setOpen(false);
    } else if (isChildActive) {
      setOpen(true);
    }
  }, [sidebarOpen, isChildActive]);

  const isChildItem = !Icon;

  const MenuItemRoot = (
    <ListItemButton
      key={name}
      className={styles.menu_item}
      onClick={handleClick}
      component={isNavigable ? Link : "div"}
      href={isNavigable ? link : undefined}
      selected={isSelfActive || (isExpandable && open)}
      sx={{
        position: "relative",
        transition: "all 0.2s ease",
        borderRadius: "8px",
        margin: "2px 8px",
        backgroundColor: isSelfActive
          ? "rgba(59, 130, 246, 0.18) !important"
          : "transparent",
        borderLeft: isSelfActive ? "4px solid #3b82f6 !important" : "4px solid transparent",
        "&.Mui-selected": {
          backgroundColor: isSelfActive
            ? "rgba(59, 130, 246, 0.22) !important"
            : "rgba(59, 130, 246, 0.08)",
        },
        "&:hover": {
          backgroundColor: isSelfActive
            ? "rgba(59, 130, 246, 0.25) !important"
            : "rgba(255, 255, 255, 0.05)",
        },
      }}
    >
      {/* Display an icon if any */}
      {!!Icon && (
        <ListItemIcon sx={{ minWidth: "36px", paddingLeft: "2px" }}>
          <Icon
            sx={{
              color: isSelfActive
                ? "#60a5fa !important"
                : "var(--c--contextuals--content--semantic--neutral--secondary)",
            }}
          />
        </ListItemIcon>
      )}
      <ListItemText
        sx={{
          ".MuiTypography-root": {
            fontSize: isChildItem ? "0.8rem" : "0.85rem",
            fontWeight: isSelfActive ? 700 : 500,
            color: isSelfActive
              ? "#60a5fa !important"
              : "var(--c--contextuals--content--semantic--neutral--primary)",
          },
        }}
        primary={name}
        inset={!Icon}
      />
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && (
        <IconExpandMore
          style={{
            color: isChildActive ? "#60a5fa" : "var(--c--contextuals--content--semantic--neutral--primary)",
          }}
        />
      )}
      {isExpandable && open && (
        <IconExpandLess
          style={{
            color: isChildActive ? "#60a5fa" : "var(--c--contextuals--content--semantic--neutral--primary)",
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
