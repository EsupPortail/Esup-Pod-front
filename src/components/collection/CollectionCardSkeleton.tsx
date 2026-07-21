"use client";

import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";

export default function CollectionCardSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 345,
        position: "relative",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 345,
          borderRadius: "12px",
          position: "relative",
          height: 150,
          bgcolor: "background.default",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "100%", borderRadius: "8px" }}
        />
      </Card>
      <Box sx={{ mt: 1.5 }}>
        <Skeleton variant="text" animation="wave" width="80%" height={24} sx={{ mb: 1 }} />
        <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: "30%" }}>
            <Skeleton variant="circular" animation="wave" width={16} height={16} />
            <Skeleton variant="text" animation="wave" width="80%" height={16} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: "30%" }}>
            <Skeleton variant="circular" animation="wave" width={16} height={16} />
            <Skeleton variant="text" animation="wave" width="80%" height={16} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
