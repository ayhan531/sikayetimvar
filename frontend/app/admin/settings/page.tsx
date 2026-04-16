"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Save as SaveIcon,
  Security,
  Notifications,
  Palette,
  Language,
  Storage,
  Backup,
  Shield,
  Info,
  Refresh,
} from "@mui/icons-material";
import { useAuthStore } from "@/app/store/authStore";
import { getRankLabel, getRankColor } from "@/app/utils/ranks";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newComplaintAlert: boolean;
  newUserAlert: boolean;
  weeklyReport: boolean;
}

interface SecuritySettings {
  requireEmailVerification: boolean;
  enableTwoFactor: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "Şikayetimvar",
    siteDescription:
      "Türkiye'nin en güvenilir tüketici şikayetleri platformu",
    contactEmail: "info@sikayetimvar.com",
    contactPhone: "+90 (212) 555 0000",
    address: "İstanbul, Türkiye",
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      pushNotifications: true,
      newComplaintAlert: true,
      newUserAlert: true,
      weeklyReport: false,
    });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    requireEmailVerification: false,
    enableTwoFactor: false,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tabs = [
    { label: "Genel", icon: <Info /> },
    { label: "Bildirimler", icon: <Notifications /> },
    { label: "Güvenlik", icon: <Shield /> },
    { label: "Görünüm", icon: <Palette /> },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <motion.div variants={itemVariants}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Sistem Ayarları
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            Platform ayarlarınızı yapılandırın ve yönetin
          </Typography>
        </motion.div>
      </Box>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert severity="success" sx={{ mb: 3 }}>
            Ayarlarınız başarıyla kaydedildi!
          </Alert>
        </motion.div>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent sx={{ p: 1 }}>
                <Stack spacing={0.5}>
                  {tabs.map((tab, index) => (
                    <Button
                      key={tab.label}
                      variant={activeTab === index ? "contained" : "text"}
                      startIcon={tab.icon}
                      onClick={() => setActiveTab(index)}
                      sx={{
                        justifyContent: "flex-start",
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        bgcolor:
                          activeTab === index
                            ? "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)"
                            : "transparent",
                        color:
                          activeTab === index ? "#fff" : "#6B7280",
                        "&:hover": {
                          bgcolor:
                            activeTab === index
                              ? "linear-gradient(135deg, #059669 0%, #1E6E4F 100%)"
                              : "#F3F4F6",
                        },
                      }}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                {activeTab === 0 && (
                  <Stack spacing={3}>
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center", mb: 2 }}
                      >
                        <Info sx={{ color: "#1E6E4F" }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Genel Ayarlar
                        </Typography>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            label="Site Adı"
                            value={siteSettings.siteName}
                            onChange={(e) =>
                              setSiteSettings({
                                ...siteSettings,
                                siteName: e.target.value,
                              })
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            label="İletişim E-postası"
                            value={siteSettings.contactEmail}
                            onChange={(e) =>
                              setSiteSettings({
                                ...siteSettings,
                                contactEmail: e.target.value,
                              })
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            label="Site Açıklaması"
                            value={siteSettings.siteDescription}
                            onChange={(e) =>
                              setSiteSettings({
                                ...siteSettings,
                                siteDescription: e.target.value,
                              })
                            }
                            fullWidth
                            multiline
                            rows={3}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            label="Telefon"
                            value={siteSettings.contactPhone}
                            onChange={(e) =>
                              setSiteSettings({
                                ...siteSettings,
                                contactPhone: e.target.value,
                              })
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            label="Adres"
                            value={siteSettings.address}
                            onChange={(e) =>
                              setSiteSettings({
                                ...siteSettings,
                                address: e.target.value,
                              })
                            }
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                )}

                {activeTab === 1 && (
                  <Stack spacing={3}>
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center", mb: 2 }}
                      >
                        <Notifications sx={{ color: "#1E6E4F" }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Bildirim Ayarları
                        </Typography>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />

                      <Stack spacing={2}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.emailNotifications}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    emailNotifications: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="E-posta Bildirimleri"
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#6B7280", ml: 6 }}
                          >
                            Önemli güncellemeler için e-posta alın
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.pushNotifications}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    pushNotifications: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="Anlık Bildirimler"
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#6B7280", ml: 6 }}
                          >
                            Tarayıcı bildirimlerini etkinleştirin
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.newComplaintAlert}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    newComplaintAlert: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="Yeni Şikayet Uyarısı"
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#6B7280", ml: 6 }}
                          >
                            Yeni şikayetler oluşturulduğunda bildirim alın
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.newUserAlert}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    newUserAlert: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="Yeni Kullanıcı Uyarısı"
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#6B7280", ml: 6 }}
                          >
                            Yeni kullanıcı kayıt olduğunda bildirim alın
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.weeklyReport}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    weeklyReport: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="Haftalık Rapor"
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#6B7280", ml: 6 }}
                          >
                            Haftalık özet raporu e-posta ile alın
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                )}

                {activeTab === 2 && (
                  <Stack spacing={3}>
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center", mb: 2 }}
                      >
                        <Security sx={{ color: "#1E6E4F" }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Güvenlik Ayarları
                        </Typography>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />

                      <Stack spacing={2}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={securitySettings.requireEmailVerification}
                                onChange={(e) =>
                                  setSecuritySettings({
                                    ...securitySettings,
                                    requireEmailVerification: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="E-posta Doğrulama Zorunlu"
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#6B7280", ml: 6 }}
                          >
                            Kullanıcıların kayıt sırasında e-postalarını
                            doğrulaması gerekir
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={securitySettings.enableTwoFactor}
                                onChange={(e) =>
                                  setSecuritySettings({
                                    ...securitySettings,
                                    enableTwoFactor: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="İki Faktörlü Kimlik Doğrulama"
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#6B7280", ml: 6 }}
                          >
                            Admin hesapları için 2FA'yı etkinleştirin
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              label="Maksimum Giriş Denemesi"
                              type="number"
                              value={securitySettings.maxLoginAttempts}
                              onChange={(e) =>
                                setSecuritySettings({
                                  ...securitySettings,
                                  maxLoginAttempts:
                                    parseInt(e.target.value) || 5,
                                })
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              label="Oturum Zaman Aşımı (dk)"
                              type="number"
                              value={securitySettings.sessionTimeout}
                              onChange={(e) =>
                                setSecuritySettings({
                                  ...securitySettings,
                                  sessionTimeout:
                                    parseInt(e.target.value) || 60,
                                })
                              }
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Stack>
                    </Box>
                  </Stack>
                )}

                {activeTab === 3 && (
                  <Stack spacing={3}>
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center", mb: 2 }}
                      >
                        <Palette sx={{ color: "#1E6E4F" }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Görünüm Ayarları
                        </Typography>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            label="Ana Renk"
                            type="color"
                            value="#1E6E4F"
                            fullWidth
                            slotProps={{
                              input: {
                                sx: { height: 56 },
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            label="Vurgu Renk"
                            type="color"
                            value="#10B981"
                            fullWidth
                            slotProps={{
                              input: {
                                sx: { height: 56 },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                )}

                <Divider sx={{ my: 4 }} />

                <Stack
                  direction="row"
                  sx={{ justifyContent: "flex-end" }}
                  spacing={2}
                >
                  <Button variant="outlined">İptal</Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => void handleSave()}
                    disabled={saving}
                    sx={{
                      background:
                        "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                    }}
                  >
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <motion.div variants={itemVariants}>
            <Card sx={{ bgcolor: "#FEF3C7", border: "1px solid #F59E0B" }}>
              <CardContent>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#F59E0B",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <Shield sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Yönetici Hesabı
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#92400E" }}>
                      {user?.email}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        icon={<Security sx={{ fontSize: "14px !important" }} />}
                        label={`${getRankLabel(user?.rank || "Recruit")} Rütbe`}
                        size="small"
                        sx={{
                          bgcolor: getRankColor(user?.rank || "Recruit"),
                          color: "#fff",
                          fontWeight: 600,
                          "& .MuiChip-icon": { color: "#fff" },
                        }}
                      />
                      <Chip
                        label={`${user?.points || 0} Puan`}
                        size="small"
                        sx={{
                          bgcolor: "#FDE68A",
                          color: "#92400E",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                  </Box>
                  <Button variant="outlined" size="small">
                    Profili Düzenle
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
}
