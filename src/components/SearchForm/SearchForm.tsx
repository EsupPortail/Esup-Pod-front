import { Input } from "@openfun/cunningham-react";
import styles from "./styles.module.css";

export function SearchForm() {
  return (
    <form action="/video" method="GET">
      <Input
        className={styles.search_input}
        icon={<span className="material-icons">search</span>}
        fullWidth
        label="Rechercher ..."
        name="search" //?search=...
      />
    </form>
  );
}
