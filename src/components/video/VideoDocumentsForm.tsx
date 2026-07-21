import React, { useState } from "react";
import { useDocuments } from "@/src/hooks/useDocuments";
import {
  Alert,
  Button,
  FileUploader,
  VariantType,
} from "@openfun/cunningham-react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

interface VideoDocumentsFormProps {
  videoId: number;
}

export function VideoDocumentsForm({ videoId }: VideoDocumentsFormProps) {
  const {
    documents,
    isLoading,
    error,
    uploadDocument,
    isUploading,
    deleteDocument,
    isDeleting,
  } = useDocuments(videoId);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!title.trim() || !file) {
      setLocalError("Veuillez renseigner un titre et sélectionner un fichier.");
      return;
    }
    setLocalError(null);
    try {
      await uploadDocument({ title, file, is_private: isPrivate });
      setTitle("");
      setFile(null);
      setIsPrivate(false);
    } catch (e: any) {
      setLocalError(e.message || "Erreur lors de l'upload du document.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce document ?")) {
      try {
        await deleteDocument(id);
      } catch (e: any) {
        setLocalError(e.message || "Erreur lors de la suppression.");
      }
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Documents joints
      </Typography>

      {(error || localError) && (
        <Alert type={VariantType.ERROR} canClose={true}>
          {localError || "Impossible de charger les documents."}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
          border: "1px solid var(--c--globals--colors--gray-200)",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="subtitle1">Ajouter un document</Typography>
        <TextField
          label="Titre du document"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
        />
        <FileUploader
          text="Glissez et déposez un fichier ici"
          onChange={(e: any) => setFile(e?.target?.files?.[0] || e || null)}
          accept="" // Accepter tout type de document
        />
        {file && (
          <Typography variant="body2" color="textSecondary">
            Fichier sélectionné : {file.name}
          </Typography>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          }
          label="Document privé (visible uniquement par le propriétaire et les co-propriétaires)"
        />
        <Button
          onClick={handleUpload}
          disabled={isUploading || !title.trim() || !file}
          variant="primary"
          style={{ alignSelf: "flex-start" }}
        >
          {isUploading ? "Envoi en cours..." : "Ajouter le document"}
        </Button>
      </Box>

      {isLoading ? (
        <Typography>Chargement des documents...</Typography>
      ) : documents && documents.length > 0 ? (
        <List>
          {documents.map((doc) => (
            <ListItem
              key={doc.id}
              sx={{
                border: "1px solid var(--c--globals--colors--gray-200)",
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary={doc.title}
                secondary={`${doc.is_private ? "🔒 Privé" : "🌐 Public"} - Ajouté le ${new Date(doc.created_at).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(doc.id)}
                  disabled={isDeleting}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary">
          Aucun document n'est rattaché à cette vidéo pour le moment.
        </Typography>
      )}
    </Box>
  );
}
