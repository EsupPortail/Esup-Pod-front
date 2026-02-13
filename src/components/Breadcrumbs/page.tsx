"use client";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import { capitalize } from "@/src/utils/helper";

export default function Breadcrumb() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <div>
      <Breadcrumbs className={styles.breadcrumb} aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Accueil
        </Link>
        {pathNames.length > 0}
        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join("/")}`;
          href = capitalize(href);

          return (
            <Link
              underline="hover"
              color="text.primary"
              href={href}
              aria-current="page"
            >
              {link}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
