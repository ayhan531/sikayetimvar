"use client";

import { Box, Button, Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Home, ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: "center" }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: "8rem",
                fontWeight: 700,
                color: "#1E6E4F",
                lineHeight: 1,
                mb: 2,
              }}
            >
              404
            </Typography>
          </motion.div>

          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "#1F2937", mb: 2 }}
          >
            Sayfa Bulunamadı
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#4B5563", mb: 4, maxWidth: 400, mx: "auto" }}
          >
            Aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfaya
            dönüp tekrar deneyebilirsiniz.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            <Button
              variant="contained"
              startIcon={<Home />}
              component={Link}
              href="/"
              sx={{
                background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                px: 4,
                py: 1.5,
                "&:hover": {
                  background: "linear-gradient(135deg, #059669 0%, #1E6E4F 100%)",
                },
              }}
            >
              Ana Sayfa
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
              sx={{
                borderColor: "#1E6E4F",
                color: "#1E6E4F",
                px: 4,
                py: 1.5,
                "&:hover": {
                  borderColor: "#059669",
                  backgroundColor: "rgba(30, 110, 79, 0.05)",
                },
              }}
            >
              Geri Dön
            </Button>
          </Stack>
        </Box>
      </motion.div>
    </Container>
  );
}
