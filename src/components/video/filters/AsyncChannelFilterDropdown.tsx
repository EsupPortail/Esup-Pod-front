"use client";

import { useMemo, useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useChannel } from "@/src/hooks/useChannel";
import type { Channel } from "@/src/types";
import { debounce } from "@mui/material/utils";

export type AsyncChannelFilterDropdownProps = {
  selectedChannelId: string | null;
  onChange: (newValues: string[]) => void;
};

type Option = { label: string; value: string; channel?: Channel };

export default function AsyncChannelFilterDropdown({
  selectedChannelId,
  onChange,
}: AsyncChannelFilterDropdownProps) {
  const { fetchAll } = useChannel();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    let active = true;
    const loadSelectedChannel = async () => {
      if (!selectedChannelId) {
        setSelectedOption(null);
        return;
      }
      
      const existing = options.find((o) => o.value === selectedChannelId) || (selectedOption?.value === selectedChannelId ? selectedOption : null);
      if (existing) {
        setSelectedOption(existing);
      } else {
        setSelectedOption({ label: `Chaîne ${selectedChannelId}`, value: selectedChannelId });
      }
    };
    loadSelectedChannel();
    return () => { active = false; };
  }, [selectedChannelId]);

  const fetchOptions = useMemo(
    () =>
      debounce(async (search: string) => {
        setLoading(true);
        try {
          const channels = await fetchAll({ search });
          const newOptions = channels.map((channel) => ({
            label: channel.title,
            value: String(channel.id),
            channel,
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
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        getOptionLabel={(option) => option.label}
        options={options}
        loading={loading}
        value={selectedOption}
        onChange={(event, newValue) => {
          setSelectedOption(newValue);
          onChange(newValue ? [newValue.value] : []);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Chaîne"
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
