"use client";

import React, { useState, useMemo } from "react";
import {
  useContributions,
  useContributorsSearch,
  Contributor,
} from "@/src/hooks/useContributors";
import { useAppConfig } from "@/src/hooks/useAppConfig";
import { Alert, Button, VariantType } from "@openfun/cunningham-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "../../app/video/edit/[slug]/styles.module.css";

// Custom debounce
function debounce(func: Function, timeout = 300) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export default function VideoContributorsForm({ videoId }: { videoId: number }) {
  const {
    contributions,
    isLoading: contributionsLoading,
    addContribution,
    removeContribution,
  } = useContributions(videoId);
  const { config } = useAppConfig();

  const roleChoices =
    (config as any)?.completion?.role_choices || [
      ["actor", "Acteur"],
      ["author", "Auteur"],
      ["consultant", "Consultant"],
      ["contributor", "Contributeur"],
      ["director", "Réalisateur"],
      ["speaker", "Intervenant"],
      ["technician", "Technicien"],
      ["voice-over", "Voix off"],
    ];

  const [searchInputValue, setSearchInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: searchResults, isLoading: searchLoading } = useContributorsSearch(
    debouncedSearch
  );

  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [selectedRole, setSelectedRole] = useState("author");
  const [jobTitle, setJobTitle] = useState("");

  const [error, setError] = useState<string | null>(null);

  const debouncedSetSearch = useMemo(
    () => debounce((v: string) => setDebouncedSearch(v), 400),
    []
  );

  const handleAdd = async () => {
    if (!selectedContributor) return;
    setError(null);
    try {
      await addContribution.mutateAsync({
        video: videoId,
        contributor_id: selectedContributor.id,
        role: selectedRole,
        job_title: selectedRole === "speaker" ? jobTitle : undefined,
      });
      setSelectedContributor(null);
      setSearchInputValue("");
      setJobTitle("");
    } catch (err: any) {
      setError(
        err.message || "Impossible d'ajouter ce contributeur (peut-être déjà ajouté avec ce rôle ?)"
      );
    }
  };

  const getRoleLabel = (roleId: string) => {
    const choice = roleChoices.find((c: any) => c[0] === roleId);
    return choice ? choice[1] : roleId;
  };

  return (
    <div className={styles.element_card}>
      <div className={styles.element_card_info}>
        <span className={styles.element_card_title}>Contributeurs & Intervenants</span>
        <span className={styles.element_card_desc}>
          Ajoutez des auteurs, réalisateurs ou intervenants à votre vidéo.
        </span>
      </div>
      <div style={{ width: "100%", padding: "1rem" }}>
        {error && (
          <Alert type={VariantType.ERROR} canClose onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
            <Autocomplete
              sx={{ flexGrow: 1, minWidth: "250px" }}
              options={searchResults || []}
              getOptionLabel={(opt) => `${opt.first_name} ${opt.last_name}`}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              value={selectedContributor}
              onChange={(e, val) => setSelectedContributor(val)}
              inputValue={searchInputValue}
              onInputChange={(e, val) => {
                setSearchInputValue(val);
                debouncedSetSearch(val);
              }}
              loading={searchLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rechercher un contributeur..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <TextField
              select
              label="Rôle"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              size="small"
              sx={{ minWidth: "150px" }}
            >
              {roleChoices.map((choice: any) => (
                <MenuItem key={choice[0]} value={choice[0]}>
                  {choice[1]}
                </MenuItem>
              ))}
            </TextField>

            {(selectedRole as any) === "speaker" && (config as any)?.completion?.use_speaker !== false && (
              <TextField
                label="Fonction / Titre"
                size="small"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            )}

            <Button
              color="brand"
              onClick={handleAdd}
              disabled={!selectedContributor || addContribution.isPending}
            >
              {addContribution.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </div>

          <Box sx={{ mt: 2 }}>
            {contributionsLoading ? (
              <CircularProgress size={24} />
            ) : contributions.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {contributions.map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      border: "1px solid var(--c--globals--colors--gray-200)",
                      borderRadius: "8px",
                      background: "var(--c--globals--colors--gray-000)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <PersonIcon color="action" />
                      <Box>
                        <div style={{ fontWeight: 600 }}>
                          {c.contributor_details.first_name} {c.contributor_details.last_name}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--c--globals--colors--gray-600)" }}>
                          {getRoleLabel(c.role)}
                          {c.role === "speaker" && c.job_title ? ` - ${c.job_title}` : ""}
                        </div>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeContribution.mutate(c.id)}
                      disabled={removeContribution.isPending}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <span style={{ fontSize: "0.9rem", color: "gray" }}>
                Aucun contributeur associé.
              </span>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}
