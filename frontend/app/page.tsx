"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Chip,
  Paper,
  Stack,
  Grid,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  People,
  Security,
  ThumbUp,
  Bolt,
  CheckCircle,
  Visibility,
  Star,
  ArrowForward,
  Shield,
  Verified,
  EmojiEvents,
  Gavel,
  Timeline,
  RocketLaunch,
  Handshake,
  Support,
  ChevronLeft,
  ChevronRight,
  PlayArrow,
  AccessTime,
  WorkspacePremium,
  Groups,
  Add as AddIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { complaintsService, adminService } from "./services/api";

const FEATURES = [
  {
    icon: <Shield sx={{ fontSize: 32 }} />,
    title: "Tam Güvenlik",
    description: "SSL şifreleme ve anonim şikayet sistemi ile verileriniz güvende",
    color: "#1E6E4F",
  },
  {
    icon: <TrendingUp sx={{ fontSize: 32 }} />,
    title: "Etkili Çözüm",
    description: "Binlerce şikayet çözüme kavuştu. Şirketler harekete geçiyor",
    color: "#7C3AED",
  },
  {
    icon: <Groups sx={{ fontSize: 32 }} />,
    title: "Topluluk Gücü",
    description: "Binlerce tüketici tek ses, daha güçlü etki",
    color: "#0EA5E9",
  },
  {
    icon: <RocketLaunch sx={{ fontSize: 32 }} />,
    title: "Hızlı Sonuç",
    description: "Anında şikayet oluştur, dakikalar içinde yayınla",
    color: "#F59E0B",
  },
  {
    icon: <Verified sx={{ fontSize: 32 }} />,
    title: "Doğrulanmış",
    description: "Kanıt onay sistemi ile güvenilir içerik",
    color: "#10B981",
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 32 }} />,
    title: "Puan Sistemi",
    description: "Aktif katılımla rütbe kazan, ödüller kap",
    color: "#EF4444",
  },
];

interface PublicStats {
  totalUsers: number;
  totalComplaints: number;
  totalCategories: number;
  activeUsers: number;
  pendingEvidences: number;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("tr-TR")}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          adminService.getDashboardStats(),
          complaintsService.getTrending(4),
        ]);
        setStats(statsRes.data);
        if (complaintsRes.data && Array.isArray(complaintsRes.data)) {
          const testimonialsFromComplaints: Testimonial[] = complaintsRes.data
            .filter((c: { user?: { firstName?: string; lastName?: string } }) => c.user?.firstName)
            .slice(0, 4)
            .map((c: { user?: { firstName?: string; lastName?: string }; title?: string; content?: string; likeCount?: number }, i: number) => ({
              name: `${c.user?.firstName || "Kullanıcı"} ${c.user?.lastName?.charAt(0) || ""}.`,
              role: "Tüketici",
              avatar: `${c.user?.firstName?.charAt(0) || "K"}${c.user?.lastName?.charAt(0) || "U"}`,
              text: c.content?.substring(0, 100) + (c.content && c.content.length > 100 ? "..." : "") || "Şikayetim var.",
              rating: Math.min(5, Math.max(3, Math.floor((c.likeCount || 0) / 5) + 3)),
            }));
          if (testimonialsFromComplaints.length > 0) {
            setTestimonials(testimonialsFromComplaints);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    void fetchData();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        background: "#FAFAFA",
        overflowX: "hidden",
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            sx={{
              position: "absolute",
              width: 10 + i * 5,
              height: 10 + i * 5,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#1E6E4F" : "#10B981",
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
              filter: "blur(40px)",
            }}
          />
        ))}
      </Box>

      {/* Hero Section */}
      <Box
        component={motion.section}
        style={{ y: heroY, opacity: heroOpacity }}
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F3A2A 0%, #1E6E4F 50%, #145C3F 100%)",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.1) 0%, transparent 70%)
            `,
          },
        }}
      >
        {/* Floating Elements */}
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
            sx={{
              position: "absolute",
              width: 100 + i * 50,
              height: 100 + i * 50,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              left: `${15 + i * 18}%`,
              top: `${10 + i * 15}%`,
            }}
          />
        ))}

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 900, mx: "auto" }}>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Chip
                  icon={<WorkspacePremium sx={{ color: "#FCD34D !important" }} />}
                  label="Türkiye'nin En Güvenilir Platformu"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    fontWeight: 600,
                    px: 2,
                    py: 3,
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                    mb: 4,
                    "& .MuiChip-icon": { color: "#FCD34D" },
                  }}
                />
              </motion.div>

              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                style={{ margin: 0 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", md: "4.5rem", lg: "5.5rem" },
                    color: "#fff",
                    lineHeight: 1.1,
                    mb: 3,
                    letterSpacing: "-0.02em",
                    textShadow: "0 4px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  Şikayetimvar
                </Typography>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: "1.2rem", md: "1.8rem" },
                    color: "rgba(255,255,255,0.9)",
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Tüketici Haklarının
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Güçlü Savunucusu
                  </Box>
                </Typography>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ justifyContent: "center", mb: 6 }}
                >
                  <Button
                    component={Link}
                    href="/complaints/create"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: "#fff",
                      color: "#1E6E4F",
                      fontWeight: 700,
                      px: 5,
                      py: 2,
                      fontSize: "1.1rem",
                      borderRadius: 3,
                      boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                      "&:hover": {
                        bgcolor: "#F9FAFB",
                        transform: "translateY(-3px)",
                        boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Hemen Şikayet Yaz
                  </Button>
                  <Button
                    component={Link}
                    href="/complaints"
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      borderColor: "rgba(255,255,255,0.5)",
                      color: "#fff",
                      fontWeight: 600,
                      px: 5,
                      py: 2,
                      fontSize: "1.1rem",
                      borderRadius: 3,
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderColor: "#fff",
                        transform: "translateY(-3px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Şikayetleri İncele
                  </Button>
                </Stack>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{ justifyContent: "center", flexWrap: "wrap", gap: 2 }}
                >
                  {[
                    { icon: <Shield sx={{ fontSize: 20 }} />, text: "SSL Güvenli" },
                    { icon: <Verified sx={{ fontSize: 20 }} />, text: "Doğrulanmış" },
                    { icon: <AccessTime sx={{ fontSize: 20 }} />, text: "7/24 Destek" },
                  ].map((badge, i) => (
                    <Chip
                      key={i}
                      icon={badge.icon as React.ReactElement}
                      label={badge.text}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: 2,
                        backdropFilter: "blur(10px)",
                        "& .MuiChip-icon": { color: "#34D399" },
                      }}
                    />
                  ))}
                </Stack>
              </motion.div>
            </Box>
          </motion.div>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 50,
              borderRadius: 15,
              border: "2px solid rgba(255,255,255,0.3)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#fff",
              },
            }}
          />
        </motion.div>
      </Box>

      {/* Stats Section */}
      <Box
        component={motion.section}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        sx={{
          py: 8,
          bgcolor: "#fff",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          {statsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#1E6E4F" }} />
            </Box>
          ) : (
            <Grid container spacing={4}>
              <Grid size={{ xs: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: "linear-gradient(90deg, #1E6E4F 0%, #10B981 100%)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ color: "#1E6E4F", mb: 2 }}><People sx={{ fontSize: 40 }} /></Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#1E6E4F", mb: 1, fontSize: { xs: "2rem", md: "2.5rem" } }}>
                        <AnimatedCounter value={stats?.totalUsers || 0} suffix="" />
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#6B7280", fontWeight: 500 }}>Aktif Kullanıcı</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: "linear-gradient(90deg, #10B981 0%, #059669 100%)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ color: "#10B981", mb: 2 }}><CheckCircle sx={{ fontSize: 40 }} /></Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#10B981", mb: 1, fontSize: { xs: "2rem", md: "2.5rem" } }}>
                        <AnimatedCounter value={stats?.totalComplaints || 0} suffix="" />
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#6B7280", fontWeight: 500 }}>Toplam Şikayet</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: "linear-gradient(90deg, #7C3AED 0%, #5B21B6 100%)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ color: "#7C3AED", mb: 2 }}><ThumbUp sx={{ fontSize: 40 }} /></Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#7C3AED", mb: 1, fontSize: { xs: "2rem", md: "2.5rem" } }}>
                        <AnimatedCounter value={stats?.activeUsers || 0} suffix="" />
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#6B7280", fontWeight: 500 }}>Aktif Katılımcı</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      border: "none",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: "linear-gradient(90deg, #F59E0B 0%, #D97706 100%)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ color: "#F59E0B", mb: 2 }}><Gavel sx={{ fontSize: 40 }} /></Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#F59E0B", mb: 1, fontSize: { xs: "2rem", md: "2.5rem" } }}>
                        <AnimatedCounter value={stats?.totalCategories || 0} suffix="" />
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#6B7280", fontWeight: 500 }}>Kategoriler</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        component={motion.section}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        sx={{
          py: 12,
          bgcolor: "#FAFAFA",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="ÖZELLİKLERİMİZ"
                sx={{
                  bgcolor: "#1E6E4F",
                  color: "#fff",
                  fontWeight: 700,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  mb: 3,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: "#1E6E4F",
                  mb: 2,
                }}
              >
                Neden Şikayetimvar?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#6B7280",
                  maxWidth: 600,
                  mx: "auto",
                  fontWeight: 400,
                }}
              >
                Tüketiciler ve şirketler arasında köprü görevi üstlenen, 
                güvenilir ve etkili bir platform.
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {FEATURES.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                <motion.div variants={cardVariants}>
                  <Card
                    component={motion.div}
                    whileHover={{
                      y: -10,
                      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                    }}
                    sx={{
                      height: "100%",
                      border: "none",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: feature.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: 3,
                          bgcolor: `${feature.color}15`,
                          color: feature.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1F2937",
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#6B7280",
                          lineHeight: 1.7,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        component={motion.section}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        sx={{
          py: 12,
          background: "linear-gradient(180deg, #fff 0%, #F0FDF4 100%)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="NASIL ÇALIŞIR"
                sx={{
                  bgcolor: "#7C3AED",
                  color: "#fff",
                  fontWeight: 700,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  mb: 3,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: "#1E6E4F",
                  mb: 2,
                }}
              >
                3 Adımda Çözüme Ulaşın
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            {[
              {
                step: "01",
                title: "Şikayetinizi Yazın",
                description: "Detaylı ve açık bir şekilde şikayetinizi yazın. Kanıtlarınızı ekleyin.",
                icon: <Gavel sx={{ fontSize: 40 }} />,
                color: "#1E6E4F",
              },
              {
                step: "02",
                title: "Toplulukla Paylaşın",
                description: "Şikayetiniz moderasyondan geçtikten sonra yayınlanır ve görünür hale gelir.",
                icon: <People sx={{ fontSize: 40 }} />,
                color: "#7C3AED",
              },
              {
                step: "03",
                title: "Çözüme Kavuşun",
                description: "Şirketler şikayetlerinize yanıt verir ve sorunlarınız çözülür.",
                icon: <CheckCircle sx={{ fontSize: 40 }} />,
                color: "#10B981",
              },
            ].map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    sx={{
                      height: "100%",
                      border: "none",
                      borderRadius: 3,
                      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: -20,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          bgcolor: item.color,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "1.2rem",
                          boxShadow: `0 10px 30px ${item.color}40`,
                        }}
                      >
                        {item.step}
                      </Box>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 3,
                          bgcolor: `${item.color}15`,
                          color: item.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mt: 2,
                          mb: 3,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#1F2937", mb: 2 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#6B7280", lineHeight: 1.7 }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        component={motion.section}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        sx={{
          py: 12,
          background: "#1E6E4F",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: "#fff",
                  mb: 2,
                }}
              >
                Son Şikayetlerden Yorumlar
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ position: "relative", minHeight: 300 }}>
            {testimonials.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      maxWidth: 700,
                      mx: "auto",
                      borderRadius: 4,
                      bgcolor: "#FFFFFF",
                      boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                    }}
                  >
                    <CardContent sx={{ p: 5, textAlign: "center" }}>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center", mb: 3 }}>
                        {[...Array(testimonials[testimonialIndex]?.rating || 5)].map((_, i) => (
                          <Star key={i} sx={{ color: "#F59E0B" }} />
                        ))}
                      </Stack>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#1F2937",
                          fontStyle: "italic",
                          lineHeight: 1.8,
                          mb: 4,
                          fontWeight: 400,
                        }}
                      >
                        &quot;{testimonials[testimonialIndex]?.text}&quot;
                      </Typography>
                      <Avatar
                        sx={{
                          bgcolor: "#1E6E4F",
                          width: 60,
                          height: 60,
                          mx: "auto",
                          mb: 2,
                          fontWeight: 700,
                        }}
                      >
                        {testimonials[testimonialIndex]?.avatar}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "#1F2937", fontWeight: 700 }}
                      >
                        {testimonials[testimonialIndex]?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B7280" }}
                      >
                        {testimonials[testimonialIndex]?.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            ) : (
              <Card sx={{ maxWidth: 700, mx: "auto", bgcolor: "#FFFFFF" }}>
                <CardContent sx={{ p: 5, textAlign: "center" }}>
                  <CommentIcon sx={{ fontSize: 64, color: "#E5E7EB", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#6B7280" }}>
                    Henüz yeterli veri yok, ilk şikayetlerinizi bekliyoruz!
                  </Typography>
                </CardContent>
              </Card>
            )}

            {testimonials.length > 0 && (
              <Stack
                direction="row"
                sx={{ justifyContent: "center", mt: 4 }}
                spacing={2}
              >
                <IconButton
                  onClick={() =>
                    setTestimonialIndex(
                      (prev) => (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  <ChevronLeft />
                </IconButton>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {testimonials.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      sx={{
                        width: testimonialIndex === i ? 30 : 10,
                        height: 10,
                        borderRadius: 5,
                        bgcolor: testimonialIndex === i ? "#fff" : "rgba(255,255,255,0.3)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Box>
                <IconButton
                  onClick={() =>
                    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
                  }
                  sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  <ChevronRight />
                </IconButton>
              </Stack>
            )}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        component={motion.section}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        sx={{
          py: 12,
          bgcolor: "#fff",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="md">
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                borderRadius: 4,
                overflow: "visible",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 6, textAlign: "center", position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 4,
                  }}
                >
                  <Support sx={{ fontSize: 50, color: "#fff" }} />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#fff",
                    mb: 2,
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                  }}
                >
                  Haklarınızı Savunmaya Hazır mısınız?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    mb: 4,
                    fontWeight: 400,
                  }}
                >
                  Binlerce kişi gibi siz de şikayetinizi paylaşın, çözüme kavuşun.
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ justifyContent: "center" }}
                >
                  <Button
                    component={Link}
                    href="/complaints/create"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: "#fff",
                      color: "#1E6E4F",
                      fontWeight: 700,
                      px: 5,
                      py: 2,
                      borderRadius: 3,
                      "&:hover": {
                        bgcolor: "#F9FAFB",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    Şimdi Başla
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "#fff",
                      color: "#fff",
                      fontWeight: 600,
                      px: 5,
                      py: 2,
                      borderRadius: 3,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderColor: "#fff",
                      },
                    }}
                  >
                    Ücretsiz Kayıt Ol
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 1000,
        }}
      >
        <Button
          component={Link}
          href="/complaints/create"
          variant="contained"
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
            boxShadow: "0 10px 30px rgba(30, 110, 79, 0.4)",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 15px 40px rgba(30, 110, 79, 0.5)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <AddIcon sx={{ fontSize: 30 }} />
        </Button>
      </motion.div>
    </Box>
  );
}
