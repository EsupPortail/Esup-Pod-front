"use client";

import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

export const VideoCardSkeleton = () => {
    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
        >
            {/* Zone de la Miniature (Ratio 16:9) */}
            <Box sx={{ position: "relative", paddingTop: "56.25%", backgroundColor: "background.default" }}>
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
            </Box>

            {/* Contenu textuel */}
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5, p: 2 }}>
                <Skeleton variant="text" animation="wave" width="90%" height={28} />
                <Skeleton variant="text" animation="wave" width="60%" height={20} />

                {/* Méta-données (Avatar + Nom / Date) */}
                <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 1, gap: 1.5 }}>
                    <Skeleton variant="circular" animation="wave" width={32} height={32} />
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 0.5 }}>
                        <Skeleton variant="text" animation="wave" width="50%" height={16} />
                        <Skeleton variant="text" animation="wave" width="30%" height={14} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};