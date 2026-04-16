"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
  Grid,
  Alert,
  Pagination,
  Tabs,
  Tab,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Cancel,
  Schedule,
  Visibility,
  AttachFile,
  Image,
  Description,
  InsertDriveFile,
  Refresh,
  FilterList,
} from "@mui/icons-material";
import { adminService } from "@/app/services/api";
import { useToastContext } from "@/app/components/ToastContainer";

interface Evidence {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: string;
  complaint?: {
    id: number;
    title: string;
    companyName?: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
}

interface Approval {
  id: number;
  approved: boolean;
  feedback?: string;
  pointsGained: number;
  approvedAt: string;
  evidence?: Evidence;
  admin?: {
    firstName: string;
    lastName: string;
  };
}

interface EvidenceStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  todayApproved: number;
  todayRejected: number;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) {
    return <Image sx={{ color: "#0EA5E9" }} />;
  }
  if (["pdf"].includes(ext || "")) {
    return <Description sx={{ color: "#EF4444" }} />;
  }
  return <InsertDriveFile sx={{ color: "#6B7280" }} />;
};

const STATUS_CONFIG = {
  pending: {
    label: "Beklemede",
    color: "#F59E0B",
    bgcolor: "#FEF3C7",
    icon: <Schedule sx={{ fontSize: 16 }} />,
  },
  approved: {
    label: "Onaylandı",
    color: "#10B981",
    bgcolor: "#DCFCE7",
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
  },
  rejected: {
    label: "Reddedildi",
    color: "#EF4444",
    bgcolor: "#FEE2E2",
    icon: <Cancel sx={{ fontSize: 16 }} />,
  },
};

export default function EvidenceManagement() {
  const { showToast } = useToastContext();
  const [tabValue, setTabValue] = useState(0);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState<EvidenceStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    todayApproved: 0,
    todayRejected: 0,
  });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [feedback, setFeedback] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, historyRes, statsRes] = await Promise.all([
        adminService.getPendingEvidences(1, 50),
        adminService.getApprovalHistory(1, 50),
        adminService.getStats(),
      ]);

      const pendingData = pendingRes.data?.data || pendingRes.data || [];
      const historyData = historyRes.data?.data || historyRes.data || [];

      setEvidences(pendingData);
      setApprovals(historyData);

      setStats({
        total: (statsRes.data?.approvedCount || 0) + (statsRes.data?.rejectedCount || 0),
        pending: statsRes.data?.pendingEvidences || 0,
        approved: statsRes.data?.approvedCount || 0,
        rejected: statsRes.data?.rejectedCount || 0,
        todayApproved: 0,
        todayRejected: 0,
      });
    } catch (error) {
      console.error("Failed to fetch evidences:", error);
      showToast("Veriler yüklenirken hata oluştu", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleApprove = async (evidenceId: number, approved: boolean) => {
    if (!feedback.trim()) {
      showToast("Geri bildirim giriniz", "error");
      return;
    }

    try {
      await adminService.approveEvidence(evidenceId, approved, feedback);
      showToast(
        approved ? "Kanıt onaylandı" : "Kanıt reddedildi",
        approved ? "success" : "error"
      );
      setDetailDialogOpen(false);
      setFeedback("");
      setSelectedEvidence(null);
      void fetchData();
    } catch (error) {
      showToast("İşlem başarısız oldu", "error");
    }
  };

  const openDetailDialog = (evidence: Evidence) => {
    setSelectedEvidence(evidence);
    setFeedback("");
    setDetailDialogOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const statCards = [
    {
      label: "Onay Bekleyen",
      value: stats.pending,
      color: "#F59E0B",
      bgcolor: "#FEF3C7",
      icon: <Schedule sx={{ fontSize: 24 }} />,
    },
    {
      label: "Onaylandı",
      value: stats.approved,
      color: "#10B981",
      bgcolor: "#DCFCE7",
      icon: <CheckCircle sx={{ fontSize: 24 }} />,
    },
    {
      label: "Reddedildi",
      value: stats.rejected,
      color: "#EF4444",
      bgcolor: "#FEE2E2",
      icon: <Cancel sx={{ fontSize: 24 }} />,
    },
    {
      label: "Toplam",
      value: stats.total,
      color: "#7C3AED",
      bgcolor: "#EDE9FE",
      icon: <AttachFile sx={{ fontSize: 24 }} />,
    },
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
            Kanıt Yönetimi
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            Şikayet kanıtlarını inceleyin, onaylayın veya reddedin
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  bgcolor: stat.bgcolor,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, color: stat.color }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: stat.color }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{
                borderBottom: "1px solid #E5E7EB",
                px: 2,
                "& .MuiTab-root": {
                  fontWeight: 600,
                },
              }}
            >
              <Tab
                label={
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <span>Onay Bekleyen</span>
                    {stats.pending > 0 && (
                      <Chip
                        label={stats.pending}
                        size="small"
                        sx={{
                          bgcolor: "#FEF3C7",
                          color: "#D97706",
                          fontWeight: 700,
                          height: 20,
                          fontSize: "0.7rem",
                        }}
                      />
                    )}
                  </Stack>
                }
              />
              <Tab label="Onay Geçmişi" />
            </Tabs>

            <AnimatePresence mode="wait">
              {tabValue === 0 && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {loading ? (
                    <Box sx={{ p: 3 }}>
                      <LinearProgress />
                    </Box>
                  ) : evidences.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <CheckCircle
                        sx={{ fontSize: 64, color: "#10B981", mb: 2 }}
                      />
                      <Typography variant="h6" sx={{ color: "#6B7280" }}>
                        Tüm kanıtlar incelendi!
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                        Onay bekleyen kanıt bulunmuyor
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Dosya</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Şikayet</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                              İşlemler
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {evidences.map((evidence) => (
                            <TableRow
                              key={evidence.id}
                              hover
                              sx={{
                                "&:hover": {
                                  bgcolor: "#F0FDF4",
                                },
                              }}
                            >
                              <TableCell>
                                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                  <Box
                                    sx={{
                                      p: 1,
                                      borderRadius: 1,
                                      bgcolor: "#F3F4F6",
                                    }}
                                  >
                                    {getFileIcon(evidence.fileName)}
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {evidence.fileName}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "#9CA3AF" }}
                                    >
                                      {evidence.fileType || "Dosya"}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ maxWidth: 200 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {evidence.complaint?.title || "-"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#9CA3AF" }}
                                >
                                  {evidence.complaint?.companyName || "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {evidence.complaint?.user?.firstName}{" "}
                                  {evidence.complaint?.user?.lastName?.charAt(0)}.
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ maxWidth: 200 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#6B7280",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {evidence.description || "Açıklama yok"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                  {new Date(evidence.uploadedAt).toLocaleDateString(
                                    "tr-TR"
                                  )}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  sx={{ justifyContent: "flex-end" }}
                                >
                                  <Tooltip title="İncele">
                                    <IconButton
                                      size="small"
                                      onClick={() => openDetailDialog(evidence)}
                                    >
                                      <Visibility sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Onayla">
                                    <IconButton
                                      size="small"
                                      sx={{
                                        color: "#10B981",
                                        "&:hover": { bgcolor: "#DCFCE7" },
                                      }}
                                      onClick={() => {
                                        setSelectedEvidence(evidence);
                                        setDetailDialogOpen(true);
                                        setFeedback("");
                                      }}
                                    >
                                      <CheckCircle sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reddet">
                                    <IconButton
                                      size="small"
                                      sx={{
                                        color: "#EF4444",
                                        "&:hover": { bgcolor: "#FEE2E2" },
                                      }}
                                      onClick={() => {
                                        setSelectedEvidence(evidence);
                                        setDetailDialogOpen(true);
                                        setFeedback("");
                                      }}
                                    >
                                      <Cancel sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </motion.div>
              )}

              {tabValue === 1 && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {loading ? (
                    <Box sx={{ p: 3 }}>
                      <LinearProgress />
                    </Box>
                  ) : approvals.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="h6" sx={{ color: "#6B7280" }}>
                        Henüz onay geçmişi yok
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Dosya</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Geri Bildirim</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Admin</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Puan</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {approvals.map((approval) => {
                            const config = STATUS_CONFIG[
                              approval.approved ? "approved" : "rejected"
                            ] as typeof STATUS_CONFIG.approved;
                            return (
                              <TableRow
                                key={approval.id}
                                hover
                                sx={{
                                  "&:hover": {
                                    bgcolor: "#F0FDF4",
                                  },
                                }}
                              >
                                <TableCell>
                                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                    <Box
                                      sx={{
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: "#F3F4F6",
                                      }}
                                    >
                                      {getFileIcon(
                                        approval.evidence?.fileName || ""
                                      )}
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {approval.evidence?.fileName || "-"}
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    icon={config.icon}
                                    label={config.label}
                                    size="small"
                                    sx={{
                                      bgcolor: config.bgcolor,
                                      color: config.color,
                                      fontWeight: 600,
                                      "& .MuiChip-icon": {
                                        color: config.color,
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ maxWidth: 200 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#6B7280",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {approval.feedback || "-"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {approval.admin?.firstName}{" "}
                                    {approval.admin?.lastName}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={`+${approval.pointsGained}`}
                                    size="small"
                                    sx={{
                                      bgcolor: "#DCFCE7",
                                      color: "#166534",
                                      fontWeight: 600,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                    {new Date(approval.approvedAt).toLocaleDateString(
                                      "tr-TR"
                                    )}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Kanıt İncele</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {selectedEvidence && (
              <>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: "#fff",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      {getFileIcon(selectedEvidence.fileName)}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedEvidence.fileName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6B7280" }}>
                        {selectedEvidence.fileType || "Dosya"} •{" "}
                        {new Date(selectedEvidence.uploadedAt).toLocaleDateString(
                          "tr-TR"
                        )}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Şikayet
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {selectedEvidence.complaint?.title || "-"}
                    </Typography>
                    {selectedEvidence.complaint?.companyName && (
                      <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                        {selectedEvidence.complaint.companyName}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Açıklama
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {selectedEvidence.description || "Açıklama yok"}
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  label="Geri Bildirim (Zorunlu)"
                  multiline
                  rows={4}
                  fullWidth
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Onay veya reddetme sebebini açıklayın..."
                  required
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setDetailDialogOpen(false)}>İptal</Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={() =>
              selectedEvidence && void handleApprove(selectedEvidence.id, false)
            }
            disabled={!feedback.trim()}
          >
            Reddet
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() =>
              selectedEvidence && void handleApprove(selectedEvidence.id, true)
            }
            disabled={!feedback.trim()}
            sx={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            }}
          >
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
