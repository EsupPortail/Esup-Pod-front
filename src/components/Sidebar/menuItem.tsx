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
  Tooltip,
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
        margin: sidebarOpen ? "2px 8px" : "4px auto",
        width: sidebarOpen ? "auto" : "44px",
        height: sidebarOpen ? "auto" : "44px",
        padding: sidebarOpen ? "6px 12px !important" : "8px 0 !important",
        justifyContent: sidebarOpen ? "flex-start" : "center",
        backgroundColor: isSelfActive
          ? "rgba(59, 130, 246, 0.15) !important"
          : "transparent",
        "&.Mui-selected": {
          backgroundColor: isSelfActive
            ? "rgba(59, 130, 246, 0.15) !important"
            : "rgba(59, 130, 246, 0.08)",
        },
        "&:hover": {
          backgroundColor: isSelfActive
            ? "rgba(59, 130, 246, 0.22) !important"
            : "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Display an icon if any */}
      {!!Icon && (
        <ListItemIcon
          sx={{
            minWidth: sidebarOpen ? "36px" : "0",
            paddingLeft: sidebarOpen ? "2px" : "0",
            justifyContent: "center",
          }}
        >
          <Icon
            sx={{
              color: isSelfActive
                ? "#3b82f6 !important"
                : "var(--c--contextuals--content--semantic--neutral--secondary)",
            }}
          />
        </ListItemIcon>
      )}
      <ListItemText
        sx={{
          display: sidebarOpen ? "block" : "none",
          ".MuiTypography-root": {
            fontSize: isChildItem ? "0.8rem" : "0.85rem",
            fontWeight: isSelfActive ? 600 : 500,
            color: isSelfActive
              ? "#3b82f6 !important"
              : "var(--c--contextuals--content--semantic--neutral--primary)",
          },
        }}
        primary={name}
        inset={!Icon}
      />
      {/* Display the expand menu if the item has children */}
      {isExpandable && sidebarOpen && !open && (
        <IconExpandMore
          style={{
            color: isChildActive ? "#3b82f6" : "var(--c--contextuals--content--semantic--neutral--primary)",
          }}
        />
      )}
      {isExpandable && sidebarOpen && open && (
        <IconExpandLess
          style={{
            color: isChildActive ? "#3b82f6" : "var(--c--contextuals--content--semantic--neutral--primary)",
          }}
        />
      )}
    </ListItemButton>
  );

  const MenuItemChildren = isExpandable && sidebarOpen ? (
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
      <Tooltip title={!sidebarOpen ? name : ""} placement="right" arrow disableHoverListener={sidebarOpen}>
        <div>{MenuItemRoot}</div>
      </Tooltip>
      {MenuItemChildren}
    </>
  );
};
export default MenuItem;
