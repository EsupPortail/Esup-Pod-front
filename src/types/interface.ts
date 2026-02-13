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

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  affiliation: string;
  establishment: string;
  userpicture: string;
}
