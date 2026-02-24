import Form from "next/form";
import { Input } from "@openfun/cunningham-react";
import styles from "./page.module.css";

const handleSearch = (data: string) => {
  console.log(data);
};

export function SearchForm() {
  return (
    <form onSubmit={() => handleSearch}>
      <Input
        className={styles.search_input}
        icon={<span className="material-icons">search</span>}
        fullWidth
        label="Rechercher ..."
      />
    </form>
  );
}
