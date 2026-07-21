"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useUsers } from "@/src/hooks/useUsers";
import { getUserDisplayName } from "@/src/constants/user";
import type { User } from "@/src/types";
import { debounce } from "@mui/material/utils";
import Box from "@mui/material/Box";

export type AsyncUserFilterDropdownProps = {
  selectedUsernames: string[];
  onChange: (newValues: string[]) => void;
};

type Option = { label: string; value: string; user?: User };

export default function AsyncUserFilterDropdown({
  selectedUsernames,
  onChange,
}: AsyncUserFilterDropdownProps) {
  const { fetchAll, fetchUser } = useUsers();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  // Load initial selected users' details
  useEffect(() => {
    let active = true;
    const loadSelectedUsers = async () => {
      // In a real scenario, we might need a fetchUsersByUsernames endpoint.
      // For now, we fall back to usernames if we don't have the full object.
      // But we can try to find them if they exist in the options.
      const currentSelected = selectedUsernames.map((username) => {
        const existing = options.find((o) => o.value === username) || selectedOptions.find((o) => o.value === username);
        return existing || { label: username, value: username };
      });
      setSelectedOptions(currentSelected);
    };
    loadSelectedUsers();
    return () => { active = false; };
  }, [selectedUsernames]);

  const fetchOptions = useMemo(
    () =>
      debounce(async (search: string) => {
        setLoading(true);
        try {
          const users = await fetchAll(search);
          const newOptions = users.map((user) => ({
            label: getUserDisplayName(user),
            value: user.username,
            user,
          }));
          setOptions(newOptions);
        } finally {
          setLoading(false);
        }
      }, 300),
    [fetchAll]
  );

  useEffect(() => {
    let active = true;
    if (open) {
      fetchOptions(inputValue);
    }
    return () => {
      active = false;
    };
  }, [inputValue, open, fetchOptions]);

  return (
    <Box sx={{ minWidth: 200, width: { xs: "100%", sm: "auto" } }}>
      <Autocomplete
        multiple
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={(option) => option.label}
        options={options}
        loading={loading}
        value={selectedOptions}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue);
          onChange(newValue.map((v) => v.value));
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Utilisateurs"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            backgroundColor: "#fff",
          },
        }}
      />
    </Box>
  );
}
