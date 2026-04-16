"use client";

import { ReactNode, useEffect, useState } from "react";
import { Container, Box, Paper, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1E6E4F 0%, #145C3F 100%)",
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1E6E4F 0%, #145C3F 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)",
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [null, Math.random() * -200 - 100],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              position: "absolute",
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
          />
        ))}
      </motion.div>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Stack spacing={3} sx={{ alignItems: "center", mb: 4 }}>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                component={Link}
                href="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textDecoration: "none",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      fontStyle: "italic",
                    }}
                  >
                    Ş
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1.75rem",
                    letterSpacing: "0.5px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  Şikayetimvar
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 3,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: 2,
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                Tüketici haklarınızı korumak için buradayız
              </Typography>
            </motion.div>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              padding: { xs: 3, sm: 5 },
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(20px)",
              background: "rgba(255, 255, 255, 0.95)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #1E6E4F 0%, #059669 50%, #1E6E4F 100%)",
              },
            }}
          >
            {children}
          </Paper>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 4,
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.75rem",
              }}
            >
              © 2026 Şikayetimvar. Tüm hakları saklıdır.
            </Typography>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
