"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Pagination,
  Stack,
  CircularProgress,
  Container,
  Chip,
  InputAdornment,
  Avatar,
  alpha,
  Skeleton,
} from "@mui/material";
import type { ChipProps } from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility,
  Favorite,
  ChatBubble,
  CalendarToday,
  TrendingUp,
  Verified,
  ArrowForward,
  FilterList,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { complaintsService } from "@/app/services/api";
import { useToastContext } from "@/app/components/ToastContainer";
import { useAuthStore } from "@/app/store/authStore";
import { AuthGuard } from "@/app/components/guards/AuthGuard";
import { Complaint } from "@/app/types";
import { containerVariants, itemVariants } from "@/app/utils/animations";

export default function ComplaintsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const { loadFromLocalStorage } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (searchQuery.trim()) {
        response = await complaintsService.search(searchQuery, page);
      } else {
        response = await complaintsService.getAll(page);
      }
      setComplaints(response.data.data);
      setTotalPages(response.data.pages || 1);
    } catch {
      showToast("Şikayetler yüklenirken hata oluştu", "error");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, showToast]);

  useEffect(() => {
    loadFromLocalStorage();
    void fetchComplaints();
  }, [loadFromLocalStorage, fetchComplaints]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bgcolor: string; color: string; label: string; border: string }> = {
      open: { bgcolor: "#3B82F6", color: "#fff", label: "Açık", border: "#3B82F6" },
      pending: { bgcolor: "#F59E0B", color: "#fff", label: "Beklemede", border: "#F59E0B" },
      approved: { bgcolor: "#10B981", color: "#fff", label: "Onaylandı", border: "#10B981" },
      resolved: { bgcolor: "#059669", color: "#fff", label: "Çözüldü", border: "#059669" },
      rejected: { bgcolor: "#EF4444", color: "#fff", label: "Reddedildi", border: "#EF4444" },
    };
    return configs[status?.toLowerCase()] || { bgcolor: "#6B7280", color: "#fff", label: status, border: "#6B7280" };
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      Recruit: "#6B7280",
      Officer: "#3B82F6",
      Manager: "#8B5CF6",
      Director: "#F59E0B",
    };
    return colors[rank] || "#6B7280";
  };

  return (
    <AuthGuard>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "400px",
            background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
            borderRadius: "0 0 50% 50%",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ py: 6, position: "relative", zIndex: 1 }}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: "#fff",
                      mb: 1,
                      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    Şikayetler
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 400 }}
                  >
                    Tüm tüketici şikayetlerini görüntüleyin
                  </Typography>
                </motion.div>

                  <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 1, sm: 2 },
                      px: { xs: 2, sm: 3 },
                      py: 1,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {[
                      { icon: <Verified sx={{ fontSize: 18 }} />, text: "Doğrulanmış" },
                      { icon: <TrendingUp sx={{ fontSize: 18 }} />, text: "Güncel" },
                      { icon: <Visibility sx={{ fontSize: 18 }} />, text: "Şeffaf" },
                    ].map((badge, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "#fff",
                        }}
                      >
                        {badge.icon}
                        <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}>
                          {badge.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/complaints/create")}
                    sx={{
                      background: "#fff",
                      color: "#1E6E4F",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: "1rem",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                      "&:hover": {
                        background: "#F9FAFB",
                        boxShadow: "0 15px 50px rgba(0,0,0,0.25)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Yeni Şikayet Oluştur
                  </Button>
                </motion.div>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  maxWidth: 600,
                  mx: "auto",
                  mb: 5,
                  position: "relative",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Şikayetlerde arayın..."
                  value={searchQuery}
                  onChange={handleSearch}
                  size="medium"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#1E6E4F", fontSize: 22 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            startIcon={<FilterList />}
                            sx={{
                              color: "#6B7280",
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Filtrele
                          </Button>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "#fff",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 8px 30px rgba(30,110,79,0.2)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1E6E4F",
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </motion.div>

            {isLoading ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
                  gap: 3,
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    height={280}
                    sx={{ borderRadius: 3 }}
                  />
                ))}
              </Box>
            ) : complaints.length === 0 ? (
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 10,
                    px: 4,
                    bgcolor: "#fff",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: alpha("#1E6E4F", 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 40, color: "#1E6E4F" }} />
                  </Box>
                  <Typography variant="h5" sx={{ color: "#1F2937", mb: 1, fontWeight: 700 }}>
                    Şikayet bulunamadı
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#6B7280", mb: 3 }}>
                    Arama kriterlerinizi değiştirmeyi deneyin veya yeni bir şikayet oluşturun
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/complaints/create")}
                    sx={{
                      background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                      px: 3,
                      py: 1.2,
                      borderRadius: 2,
                      fontWeight: 700,
                    }}
                  >
                    Yeni Şikayet Oluştur
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {complaints.map((complaint, idx) => {
                      const statusConfig = getStatusConfig(complaint.status);
                      return (
                        <motion.div
                          key={complaint.id}
                          variants={itemVariants}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: idx * 0.05 }}
                          onMouseEnter={() => setHoveredId(complaint.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <Card
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              cursor: "pointer",
                              borderRadius: 3,
                              border: "1px solid",
                              borderColor: hoveredId === complaint.id ? "#1E6E4F" : "#E5E7EB",
                              transition: "all 0.3s ease",
                              transform: hoveredId === complaint.id ? "translateY(-8px)" : "none",
                              boxShadow: hoveredId === complaint.id
                                ? "0 20px 50px rgba(30,110,79,0.15)"
                                : "0 4px 20px rgba(0,0,0,0.05)",
                              "&:hover": {
                                borderColor: "#1E6E4F",
                              },
                            }}
                            onClick={() => router.push(`/complaints/${complaint.id}`)}
                          >
                            <Box
                              sx={{
                                height: 6,
                                background: `linear-gradient(90deg, ${statusConfig.bgcolor} 0%, ${alpha(statusConfig.bgcolor, 0.5)} 100%)`,
                              }}
                            />
                            <CardContent sx={{ flex: 1, p: 3 }}>
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
                              >
                                <Chip
                                  label={complaint.category?.name}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha("#1E6E4F", 0.1),
                                    color: "#1E6E4F",
                                    fontWeight: 700,
                                    border: "1px solid",
                                    borderColor: alpha("#1E6E4F", 0.3),
                                  }}
                                />
                                <Chip
                                  label={statusConfig.label}
                                  size="small"
                                  sx={{
                                    bgcolor: statusConfig.bgcolor,
                                    color: statusConfig.color,
                                    fontWeight: 600,
                                  }}
                                />
                              </Stack>

                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  mb: 1.5,
                                  color: "#1F2937",
                                  lineHeight: 1.4,
                                  fontSize: "1.1rem",
                                }}
                              >
                                {complaint.title}
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#6B7280",
                                  mb: 2.5,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  lineHeight: 1.6,
                                }}
                              >
                                {complaint.content}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                  p: 1.5,
                                  borderRadius: 2,
                                  bgcolor: "#F9FAFB",
                                  mb: 2,
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    bgcolor: getRankColor(complaint.user?.rank || "Recruit"),
                                  }}
                                >
                                  {complaint.user?.firstName?.charAt(0)}
                                  {complaint.user?.lastName?.charAt(0)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                                    {complaint.user?.firstName} {complaint.user?.lastName}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                                    {new Date(complaint.createdAt).toLocaleDateString("tr-TR", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>

                            <CardActions
                              sx={{
                                justifyContent: "space-between",
                                px: 3,
                                pb: 2.5,
                                pt: 0,
                              }}
                            >
                              <Stack direction="row" spacing={2}>
                                {[
                                  { icon: <Visibility sx={{ fontSize: 16 }} />, value: complaint.viewCount, color: "#6B7280" },
                                  { icon: <Favorite sx={{ fontSize: 16 }} />, value: complaint.likeCount, color: "#EF4444" },
                                  { icon: <ChatBubble sx={{ fontSize: 16 }} />, value: complaint.commentCount, color: "#06B6D4" },
                                ].map((stat, i) => (
                                  <Stack
                                    key={i}
                                    direction="row"
                                    spacing={0.5}
                                    sx={{ alignItems: "center" }}
                                  >
                                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                                    <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 500 }}>
                                      {stat.value}
                                    </Typography>
                                  </Stack>
                                ))}
                              </Stack>
                              <Button
                                size="small"
                                endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                                sx={{
                                  color: "#1E6E4F",
                                  fontWeight: 700,
                                  textTransform: "none",
                                  "&:hover": { background: alpha("#1E6E4F", 0.1) },
                                }}
                              >
                                Detay
                              </Button>
                            </CardActions>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </Box>

                {totalPages > 1 && (
                  <motion.div variants={itemVariants}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                        sx={{
                          "& .MuiPaginationItem-root": {
                            borderRadius: 2,
                            fontWeight: 600,
                          },
                          "& .MuiPaginationItem-root.Mui-selected": {
                            background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                            color: "#fff",
                          },
                        }}
                      />
                    </Box>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </Container>
      </Box>
    </AuthGuard>
  );
}
