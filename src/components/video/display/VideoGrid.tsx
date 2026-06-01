"use client";

import { useMemo, useState } from "react";
import { DataGrid } from "@openfun/cunningham-react";
import type { SortModel } from "@openfun/cunningham-react";
import type { VideoDisplayRow } from "./types";
import { getVideoGridColumns } from "./VideoGridColumns";

interface VideoGridProps {
  rows: VideoDisplayRow[];
}
/* Renderer tableau.
Passe les rows à DataGrid avec les colonnes et tri des données
*/
export default function VideoGrid({ rows }: VideoGridProps) {
  const [sortModel, setSortModel] = useState<SortModel>([]);

  const sortedRows = useMemo(() => {
    const activeSort = sortModel[0];

    if (!activeSort?.field || !activeSort.sort) {
      return rows;
    }

    const direction = activeSort.sort === "asc" ? 1 : -1;

    return [...rows].sort((leftRow, rightRow) => {
      const leftValue = leftRow[activeSort.field as keyof VideoDisplayRow];
      const rightValue = rightRow[activeSort.field as keyof VideoDisplayRow];

      if (leftValue == null && rightValue == null) {
        return 0;
      }

      if (leftValue == null) {
        return 1;
      }

      if (rightValue == null) {
        return -1;
      }

      if (typeof leftValue === "string" && typeof rightValue === "string") {
        return leftValue.localeCompare(rightValue) * direction;
      }

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return (leftValue - rightValue) * direction;
      }

      if (typeof leftValue === "boolean" && typeof rightValue === "boolean") {
        return (Number(leftValue) - Number(rightValue)) * direction;
      }

      return String(leftValue).localeCompare(String(rightValue)) * direction;
    });
  }, [rows, sortModel]);

  return (
    <DataGrid
      rows={sortedRows}
      columns={getVideoGridColumns()}
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      enableSorting
      emptyPlaceholderLabel="Aucune video trouvee."
    />
  );
}
