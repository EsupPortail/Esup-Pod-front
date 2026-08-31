"use client";

import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";

export default function PlaylistCardSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 345,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          pt: 2,
          pr: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 22,
            right: 22,
            height: 118,
            borderRadius: 3,
            bgcolor: "grey.200",
            opacity: 0.25,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 12,
            right: 12,
            height: 126,
            borderRadius: 3,
            bgcolor: "grey.400",
            opacity: 0.35,
          }}
        />

        <Card
          elevation={4}
          sx={{
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
            height: 140,
            bgcolor: "background.default",
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ width: "100%", height: "100%" }}
          />
        </Card>
      </Box>

      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Skeleton variant="text" animation="wave" width="70%" height={24} />
          <Skeleton variant="circular" animation="wave" width={20} height={20} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Skeleton variant="text" animation="wave" width="30%" height={16} />
          <Skeleton variant="text" animation="wave" width="40%" height={16} />
        </Box>
      </CardContent>
    </Box>
  );
}
