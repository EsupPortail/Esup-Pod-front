import type { ElementType } from "react";

export interface MenuItemProps {
  name: string;
  link?: string;
  Icon?: ElementType;
  items?: MenuItemProps[];
}
