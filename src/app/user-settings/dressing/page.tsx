"use client";

import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { Alert, VariantType, Button } from "@openfun/cunningham-react";
import { useWatermarks } from "@/src/hooks/useDressing";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useState, useRef } from "react";
import styles from "./dressing.module.css";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function DressingSettings() {
  const { isAuthenticated, isInitializing } = useRequireAuth("/login");
  const { watermarks, isLoading, error, uploadWatermark, deleteWatermark } =
    useWatermarks();
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isInitializing || !isAuthenticated) {
    return null; // ou loader
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
    if (confirm(t("dressingPage.deleteConfirm"))) {
      await deleteWatermark(id);
    }
  };

  return (
    <div>
      <h2>Habillages (Dressing)</h2>
      <p
        style={{
          color: "var(--c--globals--colors--gray-500)",
          marginBottom: "2rem",
        }}
      >
        Gérez vos filigranes (watermarks) pour les incruster directement dans
        vos vidéos.
      </p>

      {error && (
        <div style={{ marginBottom: "1rem" }}>
          <Alert type={VariantType.ERROR}>
            {t("dressingPage.loadError")}
          </Alert>
        </div>
      )}

      <div className={styles["header-row"]}>
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
          {isUploading ? "Envoi en cours..." : t("dressingPage.addWatermark")}
        </Button>
      </div>

      {isLoading ? (
        <p>Chargement...</p>
      ) : watermarks.length === 0 ? (
        <Alert type={VariantType.INFO}>
          Vous n'avez pas encore envoyé de filigrane.
        </Alert>
      ) : (
        <div className={styles["watermark-grid"]}>
          {watermarks.map((wm) => (
            <div key={wm.id} className={styles["watermark-card"]}>
              <div className={styles["watermark-preview"]}>
                <Image
                  src={wm.image}
                  alt={t("a11y.watermark")}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles["watermark-actions"]}>
                <span className={styles["date-label"]}>
                  {new Date(wm.created_at).toLocaleDateString()}
                </span>
                <Button
                  color="error"
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(wm.id)}
                  aria-label={t("common.delete")}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
