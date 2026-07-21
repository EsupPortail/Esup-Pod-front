"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import FilterDropdown from "./FilterDropdown"; // We'll extract FilterDropdown

export type AsyncFilterDropdownProps = {
  title: string;
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  fetchOptions: (search: string) => Promise<{ label: string; value: string }[]>;
  multiple?: boolean;
};

export default function AsyncFilterDropdown({
  title,
  selectedValues,
  onChange,
  fetchOptions,
  multiple = true,
}: AsyncFilterDropdownProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let active = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchOptions(searchText);
        if (active) {
          setOptions(results);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchText, fetchOptions]);

  return (
    <FilterDropdown
      title={title}
      options={options}
      selectedValues={selectedValues}
      onChange={onChange}
      multiple={multiple}
      loading={loading}
      onSearchChange={setSearchText}
      searchValue={searchText}
      isAsync={true}
    />
  );
}
