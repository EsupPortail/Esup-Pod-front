"use client";

import { useMemo, useState } from "react";
import { DataGrid } from "@openfun/cunningham-react";
import type { SortModel } from "@openfun/cunningham-react";
import type { CollectionDisplayRow } from "./types";
import { getCollectionGridColumns } from "./CollectionGridColumns";
import styles from "./styles.module.css";

interface CollectionGridProps {
  rows: CollectionDisplayRow[];
}

export default function CollectionGrid({ rows }: CollectionGridProps) {
  const [sortModel, setSortModel] = useState<SortModel>([]);

  const sortedRows = useMemo(() => {
    const activeSort = sortModel[0];

    if (!activeSort?.field || !activeSort.sort) {
      return rows;
    }

    const direction = activeSort.sort === "asc" ? 1 : -1;

    return [...rows].sort((leftRow, rightRow) => {
      const leftValue = leftRow[activeSort.field as keyof CollectionDisplayRow];
      const rightValue =
        rightRow[activeSort.field as keyof CollectionDisplayRow];

      if (leftValue == null && rightValue == null) return 0;
      if (leftValue == null) return 1;
      if (rightValue == null) return -1;

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return (leftValue - rightValue) * direction;
      }

      return String(leftValue).localeCompare(String(rightValue)) * direction;
    });
  }, [rows, sortModel]);

  return (
    <DataGrid
      className={styles.dataGrid}
      rows={sortedRows}
      columns={getCollectionGridColumns({ rows: sortedRows })}
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      enableSorting
      emptyPlaceholderLabel="Aucune collection trouvée."
    />
  );
}
