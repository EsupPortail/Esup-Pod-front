"use client";

import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { Alert, VariantType, Button } from "@openfun/cunningham-react";
import { useWatermarks } from "@/src/hooks/useDressing";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useState, useRef } from "react";
import styles from "../user-settings/dressing/dressing.module.css";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function DressingPage() {
  const { isAuthenticated, isInitializing } = useRequireAuth("/login");
  const { watermarks, isLoading, error, uploadWatermark, deleteWatermark } = useWatermarks();
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isInitializing || !isAuthenticated) {
    return null;
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
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        {t("dressingPage.title")}
      </h1>
      <p style={{ color: "var(--text-color-muted, #94a3b8)", marginBottom: "2rem", lineHeight: 1.5 }}>
        {t("dressingPage.pageDescription")}
      </p>

      {error && (
        <div style={{ marginBottom: "1rem" }}>
          <Alert type={VariantType.ERROR}>
            {t("dressingPage.loadError")}
          </Alert>
        </div>
      )}

      <div className={styles.headerRow}>
        <h3>{t("dressingPage.myWatermarks")}</h3>
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
          {isUploading ? t("dressingPage.uploading") : t("dressingPage.addWatermark")}
        </Button>
      </div>

      {isLoading ? (
        <p>{t("common.loading")}</p>
      ) : watermarks.length === 0 ? (
        <Alert type={VariantType.INFO}>
          {t("dressingPage.noWatermarks")}
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
