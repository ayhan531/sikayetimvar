"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Chip,
  LinearProgress,
  alpha,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  EmojiEvents,
  MilitaryTech,
  TrendingUp,
  Star,
  CheckCircle,
  Refresh,
  ArrowForward,
  Spa as SproutIcon,
  Edit as EditIcon,
  SwapHoriz as SwapIcon,
  Favorite as HeartIcon,
  Comment as CommentIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/app/utils/animations";
import { authService } from "@/app/services/api";
import { useAuthStore } from "@/app/store/authStore";

const rankRules = [
  { rank: "Recruit", min: 0, max: 10, color: "#6B7280", icon: <SproutIcon />, description: "Başlangıç seviyesi" },
  { rank: "Officer", min: 11, max: 50, color: "#3B82F6", icon: <Star />, description: "Aktif katılımcı" },
  { rank: "Manager", min: 51, max: 150, color: "#8B5CF6", icon: <EmojiEvents />, description: "Deneyimli kullanıcı" },
  { rank: "Director", min: 151, max: Infinity, color: "#F59E0B", icon: <MilitaryTech />, description: "Lider" },
];

const pointRules = [
  { action: "Şikayet oluşturma", point: 5, icon: <EditIcon />, color: "#3B82F6" },
  { action: "Aynı firmaya ek şikayet", point: 4, icon: <SwapIcon />, color: "#8B5CF6" },
  { action: "Profil tamamlama (tek sefer)", point: 15, icon: <CheckCircle />, color: "#10B981" },
  { action: "Şikayete beğeni bırakma", point: 1, icon: <HeartIcon />, color: "#EF4444" },
  { action: "Şikayete yorum yazma", point: 2, icon: <CommentIcon />, color: "#06B6D4" },
  { action: "Şikayetin beğeni alması", point: 1, icon: <Star />, color: "#F59E0B" },
  { action: "Admin olarak kanıt onaylama", point: 1, icon: <AdminIcon />, color: "#1E6E4F" },
];

export default function RewardsPage() {
  const router = useRouter();
  const { loadFromLocalStorage } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [userRank, setUserRank] = useState("Recruit");
  const [plannedActions, setPlannedActions] = useState({
    complaintCreate: 0,
    sameCompanyBonus: 0,
    profileComplete: 0,
    likeGiven: 0,
    commentGiven: 0,
    likeReceived: 0,
    evidenceApproved: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await authService.getProfile();
        setUserPoints(response.data.points || 0);
        setUserRank(response.data.rank || "Recruit");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFromLocalStorage();
    void fetchUserProfile();
  }, [loadFromLocalStorage]);

  const estimatedPoints = useMemo(() => {
    const actionTotal =
      plannedActions.complaintCreate * 5 +
      plannedActions.sameCompanyBonus * 4 +
      plannedActions.profileComplete * 15 +
      plannedActions.likeGiven * 1 +
      plannedActions.commentGiven * 2 +
      plannedActions.likeReceived * 1 +
      plannedActions.evidenceApproved * 1;
    return Math.max(userPoints, 0) + actionTotal;
  }, [userPoints, plannedActions]);

  const estimatedRank = useMemo(() => {
    if (estimatedPoints >= 151) return "Director";
    if (estimatedPoints >= 51) return "Manager";
    if (estimatedPoints >= 11) return "Officer";
    return "Recruit";
  }, [estimatedPoints]);

  const rankProgress = useMemo(() => {
    if (estimatedPoints >= 151) return 100;
    if (estimatedPoints >= 51) return ((estimatedPoints - 51) / 100) * 100;
    if (estimatedPoints >= 11) return ((estimatedPoints - 11) / 40) * 100;
    return (estimatedPoints / 10) * 100;
  }, [estimatedPoints]);

  const currentRankIndex = useMemo(() => {
    if (estimatedPoints >= 151) return 3;
    if (estimatedPoints >= 51) return 2;
    if (estimatedPoints >= 11) return 1;
    return 0;
  }, [estimatedPoints]);

  const setActionValue = (key: keyof typeof plannedActions, value: string) => {
    const parsed = Number(value);
    setPlannedActions((prev) => ({
      ...prev,
      [key]: Number.isNaN(parsed) ? 0 : Math.max(parsed, 0),
    }));
  };

  const resetCalculator = () => {
    setUserPoints(userPoints);
    setPlannedActions({
      complaintCreate: 0,
      sameCompanyBonus: 0,
      profileComplete: 0,
      likeGiven: 0,
      commentGiven: 0,
      likeReceived: 0,
      evidenceApproved: 0,
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      <Box sx={{ height: 8, background: "linear-gradient(90deg, #1E6E4F 0%, #059669 100%)" }} />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div initial="initial" animate="animate" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Box sx={{ p: 2, borderRadius: "50%", bgcolor: alpha("#1E6E4F", 0.1) }}>
                  <EmojiEvents sx={{ fontSize: 48, color: "#1E6E4F" }} />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#1F2937", mb: 1 }}>
                Hiyerarşi ve Puan Rehberi
              </Typography>
              <Typography variant="h6" sx={{ color: "#6B7280", fontWeight: 400 }}>
                Rütbe atlama tamamen puanla ilerler. Yaptığın hareketlerle puan kazan ve rütbeni yükselt!
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: "1px solid #E5E7EB", height: "100%" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: "center" }}>
                      <MilitaryTech sx={{ color: "#1E6E4F", fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#1F2937" }}>
                        Rütbe Eşikleri
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      {rankRules.map((rule, index) => (
                        <motion.div
                          key={rule.rank}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 2,
                              bgcolor: currentRankIndex === index ? alpha(rule.color, 0.1) : "#F9FAFB",
                              border: "2px solid",
                              borderColor: currentRankIndex === index ? rule.color : "#E5E7EB",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 1 }}>
                              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                                <Box sx={{ color: rule.color }}>{rule.icon}</Box>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: rule.color }}>
                                    {rule.rank}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                    {rule.description}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Chip
                                label={`${rule.min}${rule.max === Infinity ? "+" : ` - ${rule.max}`} puan`}
                                sx={{ bgcolor: alpha(rule.color, 0.1), color: rule.color, fontWeight: 700 }}
                              />
                            </Stack>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: "1px solid #E5E7EB", height: "100%" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: "center" }}>
                      <TrendingUp sx={{ color: "#1E6E4F", fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#1F2937" }}>
                        Puan Kazandıran Hareketler
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      {pointRules.map((rule, index) => (
                        <motion.div
                          key={rule.action}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                            <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 1 }}>
                              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                                <Box sx={{ color: rule.color }}>{rule.icon}</Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>
                                  {rule.action}
                                </Typography>
                              </Stack>
                              <Chip label={`+${rule.point} puan`} sx={{ bgcolor: alpha(rule.color, 0.1), color: rule.color, fontWeight: 700 }} />
                            </Stack>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha("#F59E0B", 0.1), display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <CheckCircle sx={{ color: "#F59E0B", mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#92400E", mb: 0.5 }}>
                          Önemli Bilgi
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#92400E" }}>
                          Profil tamamlama puanı sadece bir kez verilir. Spam davranışları denetlenir.
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: "1px solid #E5E7EB" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: "center" }}>
                      <Star sx={{ color: "#1E6E4F", fontSize: 28 }} />
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1F2937" }}>
                          Rütbe Simülatörü
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6B7280" }}>
                          Planladığın hareketleri girerek tahmini puanını ve rütbeni hesapla
                        </Typography>
                      </Box>
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Mevcut Puan"
                          value={userPoints}
                          disabled
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth type="number" label="Yeni Şikayet" value={plannedActions.complaintCreate} onChange={(e) => setActionValue("complaintCreate", e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth type="number" label="Aynı Firma Bonusu" value={plannedActions.sameCompanyBonus} onChange={(e) => setActionValue("sameCompanyBonus", e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth type="number" label="Profil Tamamlama" value={plannedActions.profileComplete} onChange={(e) => setActionValue("profileComplete", e.target.value)} helperText="0 veya 1" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth type="number" label="Verilen Beğeni" value={plannedActions.likeGiven} onChange={(e) => setActionValue("likeGiven", e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth type="number" label="Yazılan Yorum" value={plannedActions.commentGiven} onChange={(e) => setActionValue("commentGiven", e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth type="number" label="Alınan Beğeni" value={plannedActions.likeReceived} onChange={(e) => setActionValue("likeReceived", e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth type="number" label="Onaylanan Kanıt" value={plannedActions.evidenceApproved} onChange={(e) => setActionValue("evidenceApproved", e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Grid>
                    </Grid>

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                      <Button variant="outlined" onClick={resetCalculator} startIcon={<Refresh />} sx={{ borderRadius: 2, fontWeight: 700 }}>
                        Sıfırla
                      </Button>
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={estimatedRank}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ p: 4, borderRadius: 3, bgcolor: alpha("#1E6E4F", 0.1), textAlign: "center" }}>
                          <Typography variant="h2" sx={{ fontWeight: 800, color: "#1E6E4F", mb: 1 }}>
                            {estimatedPoints}
                          </Typography>
                          <Typography variant="h6" sx={{ color: "#6B7280", mb: 2 }}>
                            Tahmini Toplam Puan
                          </Typography>
                          <Chip
                            label={estimatedRank}
                            icon={<EmojiEvents />}
                            sx={{
                              bgcolor: "#1E6E4F",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "1.1rem",
                              py: 2.5,
                              "& .MuiChip-icon": { color: "#fff" },
                            }}
                          />
                          <Box sx={{ mt: 3 }}>
                            <LinearProgress variant="determinate" value={rankProgress} sx={{ height: 10, borderRadius: 5, bgcolor: alpha("#1E6E4F", 0.2), "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: "#1E6E4F" } }} />
                            <Stack direction="row" sx={{ justifyContent: "space-between", mt: 1 }}>
                              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                Mevcut Rütbe
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#1E6E4F", fontWeight: 700 }}>
                                Sonraki: {currentRankIndex < 3 ? rankRules[currentRankIndex + 1].rank : "Maksimum"}
                              </Typography>
                            </Stack>
                          </Box>
                        </Box>
                      </motion.div>
                    </AnimatePresence>

                    <Box sx={{ mt: 4 }}>
                      <Button variant="contained" endIcon={<ArrowForward />} onClick={() => router.push("/complaints/create")} sx={{ borderRadius: 2, fontWeight: 700, background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)", px: 4, py: 1.5 }}>
                        Hemen Şikayet Oluştur
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
