"use client";

import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress
            sx={{ color: "#1E6E4F" }}
            size={48}
            thickness={4}
          />
          <Typography
            variant="body2"
            sx={{ color: "#4B5563", fontWeight: 500 }}
          >
            Yükleniyor...
          </Typography>
        </Stack>
      </motion.div>
    </Box>
  );
}
