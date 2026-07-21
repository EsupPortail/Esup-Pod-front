"use client";

import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { Alert, VariantType, Button, Modal, ModalSize, Input } from "@openfun/cunningham-react";
import { useWatermarks } from "@/src/hooks/useDressing";
import { useState, useRef } from "react";
import styles from "./dressing.module.css";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function DressingSettings() {
  const { isAuthenticated, isInitializing } = useRequireAuth("/login");
  const { watermarks, isLoading, error, uploadWatermark, deleteWatermark } = useWatermarks();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isInitializing || !isAuthenticated) {
    return null; // ou loader
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadWatermark(file);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce filigrane ?")) {
      await deleteWatermark(id);
    }
  };

  return (
    <div>
      <h2>Habillages (Dressing)</h2>
      <p style={{ color: "var(--c--globals--colors--gray-500)", marginBottom: "2rem" }}>
        Gérez vos filigranes (watermarks) pour les incruster directement dans vos vidéos.
      </p>

      {error && (
        <div style={{ marginBottom: "1rem" }}>
          <Alert type={VariantType.ERROR}>
            Erreur lors du chargement des filigranes.
          </Alert>
        </div>
      )}

      <div className={styles.headerRow}>
        <h3>Mes Filigranes</h3>
        <input 
          type="file" 
          accept="image/png, image/jpeg" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileChange}
        />
        <Button 
          icon={<AddPhotoAlternateIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Envoi en cours..." : "Ajouter un filigrane"}
        </Button>
      </div>

      {isLoading ? (
        <p>Chargement...</p>
      ) : watermarks.length === 0 ? (
        <Alert type={VariantType.INFO}>
          Vous n'avez pas encore envoyé de filigrane.
        </Alert>
      ) : (
        <div className={styles.watermarkGrid}>
          {watermarks.map((wm) => (
            <div key={wm.id} className={styles.watermarkCard}>
              <div className={styles.watermarkPreview}>
                <Image src={wm.image} alt="Watermark" fill style={{ objectFit: "contain" }} />
              </div>
              <div className={styles.watermarkActions}>
                <span className={styles.dateLabel}>
                  {new Date(wm.created_at).toLocaleDateString()}
                </span>
                <Button 
                  color="error" 
                  icon={<DeleteIcon />} 
                  onClick={() => handleDelete(wm.id)}
                  aria-label="Supprimer"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
