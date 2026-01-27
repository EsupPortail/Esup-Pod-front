import { ElementType } from "react";

export interface Video {
  id: number;
  title: string;
  time: number;
  thumbnail: string;
  isPrivate: boolean;
}

export interface MenuItemProps {
  name: string;
  link: string;
  Icon: ElementType;
  items: Array<string>;
}
