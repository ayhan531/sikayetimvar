"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Avatar,
  LinearProgress,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Person,
  Email,
  Phone,
  LocationCity,
  Description,
  PhotoCamera,
  Save,
  EmojiEvents,
  MilitaryTech,
  Verified,
  Edit as EditIcon,
  SwapHoriz as SwapIcon,
  CheckCircle,
  Favorite as HeartIcon,
  Comment as CommentIcon,
  Star,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { authService } from "@/app/services/api";
import { useAuthStore } from "@/app/store/authStore";
import { User } from "@/app/types";
import { getRankLabel, RANK_ORDER, RANK_THRESHOLDS } from "@/app/utils/ranks";
import { containerVariants, itemVariants } from "@/app/utils/animations";

const POINT_RULES = [
  { action: "Şikayet oluşturma", point: 5, icon: <EditIcon />, color: "#3B82F6" },
  { action: "Aynı firmaya ek şikayet", point: 4, icon: <SwapIcon />, color: "#8B5CF6" },
  { action: "Profil tamamlama", point: 15, icon: <CheckCircle />, color: "#10B981" },
  { action: "Şikayete beğeni bırakma", point: 1, icon: <HeartIcon />, color: "#EF4444" },
  { action: "Şikayete yorum yazma", point: 2, icon: <CommentIcon />, color: "#06B6D4" },
  { action: "Şikayetin beğeni alması", point: 1, icon: <Star />, color: "#F59E0B" },
  { action: "Admin kanıt onayı", point: 1, icon: <AdminIcon />, color: "#1E6E4F" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { token, loadFromLocalStorage, setUser } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rankUpMessage, setRankUpMessage] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    bio: "",
    profileImage: "",
  });

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        const data = response.data as User;
        setProfile(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          city: data.city || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
        });
      } catch {
        setError("Profil bilgisi alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, [token, router]);

  const nextRank = useMemo(() => {
    if (!profile) return null;
    const idx = RANK_ORDER.indexOf(profile.rank);
    if (idx === -1 || idx >= RANK_ORDER.length - 1) return null;
    return RANK_ORDER[idx + 1];
  }, [profile]);

  const remainingPoints = useMemo(() => {
    if (!profile || !nextRank) return 0;
    return Math.max(RANK_THRESHOLDS[nextRank].min - profile.points, 0);
  }, [profile, nextRank]);

  const progressToNextRank = useMemo(() => {
    if (!profile || !nextRank) return 100;
    const currentRankMin = RANK_THRESHOLDS[profile.rank]?.min || 0;
    const nextRankMin = RANK_THRESHOLDS[nextRank]?.min || 0;
    const progress = ((profile.points - currentRankMin) / (nextRankMin - currentRankMin)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }, [profile, nextRank]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const previousRank = profile.rank;
      const response = await authService.updateProfile(form);
      const payload = response.data as { pointsAwarded: number; user: User };

      setProfile((prev) => prev ? { ...prev, ...payload.user } : payload.user);
      setUser(payload.user);

      if (payload.user.rank !== previousRank) {
        setRankUpMessage(`Tebrikler! ${getRankLabel(previousRank)} seviyesinden ${getRankLabel(payload.user.rank)} seviyesine yükseldin.`);
      } else {
        setRankUpMessage("");
      }

      if (payload.pointsAwarded > 0) {
        setSuccess(`Profil tamamlandığı için +${payload.pointsAwarded} puan kazandın!`);
      } else {
        setSuccess("Profil bilgileri güncellendi.");
      }
    } catch {
      setError("Profil kaydedilemedi.");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Profil yüklenemedi.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      <Box sx={{ height: 8, background: "linear-gradient(90deg, #1E6E4F 0%, #059669 100%)" }} />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div initial="initial" animate="animate" variants={containerVariants}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: "1px solid #E5E7EB", overflow: "hidden" }}>
                  <Box sx={{ height: 6, background: `linear-gradient(90deg, ${getRankColor(profile.rank)} 0%, ${alpha(getRankColor(profile.rank), 0.5)} 100%)` }} />
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                      <Avatar
                        src={profile.profileImage}
                        sx={{
                          width: 120,
                          height: 120,
                          mx: "auto",
                          mb: 2,
                          bgcolor: getRankColor(profile.rank),
                          fontSize: "2.5rem",
                          fontWeight: 700,
                          border: `4px solid ${getRankColor(profile.rank)}`,
                        }}
                      >
                        {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                      </Avatar>
                    </motion.div>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#1F2937", mb: 0.5 }}>
                      {profile.firstName} {profile.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280", mb: 2 }}>
                      {profile.email}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mb: 3, flexWrap: "wrap", gap: 1 }}>
                      <Chip icon={<MilitaryTech sx={{ fontSize: 18 }} />} label={getRankLabel(profile.rank)} sx={{ bgcolor: alpha(getRankColor(profile.rank), 0.1), color: getRankColor(profile.rank), fontWeight: 700 }} />
                      <Chip icon={<EmojiEvents sx={{ fontSize: 18 }} />} label={`${profile.points} puan`} sx={{ bgcolor: alpha("#1E6E4F", 0.1), color: "#1E6E4F", fontWeight: 700 }} />
                      {profile.isAdmin && <Chip icon={<Verified sx={{ fontSize: 18 }} />} label="Admin" sx={{ bgcolor: alpha("#F59E0B", 0.1), color: "#F59E0B", fontWeight: 700 }} />}
                    </Stack>

                    {rankUpMessage && (
                      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <Alert severity="success" sx={{ textAlign: "left", mb: 2 }}>{rankUpMessage}</Alert>
                      </motion.div>
                    )}

                    {nextRank ? (
                      <Box sx={{ textAlign: "left" }}>
                        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="caption" sx={{ color: "#6B7280" }}>Sonraki rütbe: {getRankLabel(nextRank)}</Typography>
                          <Typography variant="caption" sx={{ color: "#1E6E4F", fontWeight: 700 }}>{remainingPoints} puan kaldı</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={progressToNextRank} sx={{ height: 8, borderRadius: 4, bgcolor: "#E5E7EB", "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: "#1E6E4F" } }} />
                      </Box>
                    ) : (
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha("#F59E0B", 0.1) }}>
                        <Typography variant="body2" sx={{ color: "#92400E", fontWeight: 700 }}>
                          En yüksek rütbedesin!
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, lg: 8 }}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: "1px solid #E5E7EB" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#1F2937", mb: 1 }}>
                      Profili Düzenle
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
                      Profil bilgilerinizi güncelleyin. Profil tamamlamak için +15 puan kazanın!
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Ad" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} slotProps={{ input: { startAdornment: <Person sx={{ color: "#6B7280" }} /> } }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Soyad" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} slotProps={{ input: { startAdornment: <Person sx={{ color: "#6B7280" }} /> } }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="E-posta" value={profile.email} disabled slotProps={{ input: { startAdornment: <Email sx={{ color: "#6B7280" }} /> } }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Telefon" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} slotProps={{ input: { startAdornment: <Phone sx={{ color: "#6B7280" }} /> } }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Şehir" value={form.city} onChange={(e) => handleChange("city", e.target.value)} slotProps={{ input: { startAdornment: <LocationCity sx={{ color: "#6B7280" }} /> } }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Profil Fotoğrafı URL" value={form.profileImage} onChange={(e) => handleChange("profileImage", e.target.value)} slotProps={{ input: { startAdornment: <PhotoCamera sx={{ color: "#6B7280" }} /> } }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField fullWidth label="Kısa Biyografi" multiline minRows={3} value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} slotProps={{ input: { startAdornment: <Description sx={{ color: "#6B7280", alignSelf: "flex-start", mt: 1 }} /> } }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }} />
                      </Grid>
                    </Grid>

                    {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} style={{ display: "inline-block", width: "100%" }}>
                      <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={<Save />} sx={{ mt: 3, py: 1.5, px: 4, borderRadius: 2, fontWeight: 700, background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)", "&:hover": { background: "linear-gradient(135deg, #145C3F 0%, #047857 100%)" } }}>
                        {saving ? "Kaydediliyor..." : "Profili Kaydet"}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, border: "1px solid #E5E7EB", mt: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#1F2937", mb: 3 }}>
                      Puan Kazandıran Hareketler
                    </Typography>
                    <Stack spacing={2}>
                      {POINT_RULES.map((rule, index) => (
                        <motion.div key={rule.action} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 2, bgcolor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                              <Box sx={{ color: rule.color }}>{rule.icon}</Box>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>{rule.action}</Typography>
                            </Stack>
                            <Chip label={`+${rule.point} puan`} sx={{ bgcolor: alpha(rule.color, 0.1), color: rule.color, fontWeight: 700 }} />
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>
                    <Divider sx={{ my: 3 }} />
                    <Button variant="outlined" onClick={() => router.push("/rewards")} sx={{ borderRadius: 2, fontWeight: 700 }}>
                      Detaylı Puan Rehberini Aç
                    </Button>
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
