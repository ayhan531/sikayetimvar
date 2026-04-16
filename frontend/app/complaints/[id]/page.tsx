"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Container,
  Paper,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  alpha,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ThumbUp as ThumbUpIcon,
  Chat as ChatIcon,
  Visibility,
  Favorite,
  CalendarToday,
  Business,
  Verified,
  Share,
  Bookmark,
  Download,
  Image,
  Description,
  PictureAsPdf,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { complaintsService, adminService } from "@/app/services/api";
import { useToastContext } from "@/app/components/ToastContainer";
import { useAuthStore } from "@/app/store/authStore";
import { AuthGuard } from "@/app/components/guards/AuthGuard";
import { Complaint, ComplaintComment } from "@/app/types";

export default function ComplaintDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { showToast } = useToastContext();
  const { user, loadFromLocalStorage } = useAuthStore();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<number | null>(null);
  const [decision, setDecision] = useState<boolean>(true);
  const [feedback, setFeedback] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [comments, setComments] = useState<ComplaintComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const fetchComplaint = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await complaintsService.getById(id);
      setComplaint(response.data);
      const commentResponse = await complaintsService.getComments(id);
      setComments(commentResponse.data);
      void complaintsService.incrementView(id).catch(() => {});
    } catch {
      showToast("Şikayet yüklenirken hata oluştu", "error");
      router.push("/complaints");
    } finally {
      setIsLoading(false);
    }
  }, [id, router, showToast]);

  useEffect(() => {
    loadFromLocalStorage();
    void fetchComplaint();
  }, [loadFromLocalStorage, fetchComplaint]);

  useEffect(() => {
    if (complaint) {
      document.title = `${complaint.title} - Şikayetimvar | ${complaint.companyName} Şikayeti`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", `${complaint.title}. ${complaint.companyName} hakkında şikayet. ${complaint.content.substring(0, 150)}...`);
      }
    }
  }, [complaint]);

  const openDecisionDialog = (evidenceId: number, approved: boolean) => {
    setSelectedEvidenceId(evidenceId);
    setDecision(approved);
    setFeedback("");
    setOpenDialog(true);
  };

  const handleApproveDialogClose = () => {
    setOpenDialog(false);
    setSelectedEvidenceId(null);
    setFeedback("");
  };

  const handleApproveEvidence = async () => {
    if (!selectedEvidenceId) return;
    setIsApproving(true);
    try {
      await adminService.approveEvidence(selectedEvidenceId, decision, feedback);
      showToast(decision ? "Kanıt başarıyla onaylandı!" : "Kanıt reddedildi!", "success");
      handleApproveDialogClose();
      void fetchComplaint();
    } catch {
      showToast("İşlem sırasında hata oluştu", "error");
    } finally {
      setIsApproving(false);
    }
  };

  const handleToggleLike = async () => {
    setIsLikeLoading(true);
    try {
      const response = await complaintsService.toggleLike(id);
      setComplaint((prev) => prev ? { ...prev, likeCount: response.data.likeCount } : prev);
      setIsLiked(response.data.liked);
      showToast(response.data.liked ? "Beğeni eklendi, puan kazandınız" : "Beğeni geri alındı", "success");
    } catch {
      showToast("Beğeni işlemi başarısız", "error");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      showToast("Yorum metni boş olamaz", "error");
      return;
    }
    setIsCommentLoading(true);
    try {
      await complaintsService.addComment(id, commentText);
      setCommentText("");
      showToast("Yorum eklendi, puan kazandınız", "success");
      void fetchComplaint();
    } catch {
      showToast("Yorum eklenirken hata oluştu", "error");
    } finally {
      setIsCommentLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bgcolor: string; color: string; label: string; icon?: React.ReactElement }> = {
      open: { bgcolor: "#3B82F6", color: "#fff", label: "Açık", icon: <Visibility sx={{ fontSize: 16 }} /> },
      pending: { bgcolor: "#F59E0B", color: "#fff", label: "Beklemede", icon: <CalendarToday sx={{ fontSize: 16 }} /> },
      approved: { bgcolor: "#10B981", color: "#fff", label: "Onaylandı", icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
      resolved: { bgcolor: "#059669", color: "#fff", label: "Çözüldü", icon: <Verified sx={{ fontSize: 16 }} /> },
      rejected: { bgcolor: "#EF4444", color: "#fff", label: "Reddedildi", icon: <CancelIcon sx={{ fontSize: 16 }} /> },
    };
    return configs[status?.toLowerCase()] || { bgcolor: "#6B7280", color: "#fff", label: status };
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

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("pdf")) return <PictureAsPdf sx={{ color: "#EF4444" }} />;
    if (fileType?.includes("image")) return <Image sx={{ color: "#3B82F6" }} />;
    return <Description sx={{ color: "#6B7280" }} />;
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <CircularProgress sx={{ color: "#1E6E4F" }} />
        </Box>
      </AuthGuard>
    );
  }

  if (!complaint) {
    return (
      <AuthGuard>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h6" color="error">Şikayet bulunamadı</Typography>
        </Container>
      </AuthGuard>
    );
  }

  const isAdmin = Boolean(user?.isAdmin || user?.rank === "Director");
  const statusConfig = getStatusConfig(complaint.status);

  return (
    <AuthGuard>
      <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB" }}>
        <Box
          sx={{
            height: 8,
            background: "linear-gradient(90deg, #1E6E4F 0%, #059669 100%)",
          }}
        />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/complaints")}
              sx={{
                mb: 3,
                color: "#6B7280",
                fontWeight: 600,
                "&:hover": { bgcolor: alpha("#1E6E4F", 0.1), color: "#1E6E4F" },
              }}
            >
              Tüm Şikayetlere Dön
            </Button>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 4,
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: statusConfig.bgcolor }} />

              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
                    <Chip
                      label={complaint.category?.name}
                      size="small"
                      sx={{ bgcolor: alpha("#1E6E4F", 0.1), color: "#1E6E4F", fontWeight: 700, border: "1px solid", borderColor: alpha("#1E6E4F", 0.3) }}
                    />
                    <Chip
                      label={statusConfig.label}
                      size="small"
                      sx={{ bgcolor: statusConfig.bgcolor, color: statusConfig.color, fontWeight: 600 }}
                      icon={statusConfig.icon}
                    />
                  </Stack>
                  <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 800, color: "#1F2937", lineHeight: 1.3, fontSize: { xs: "1.5rem", md: "1.75rem", lg: "2rem" } }}>
                    {complaint.title}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 2, bgcolor: "#F9FAFB" }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: getRankColor(complaint.user?.rank || "Recruit"), fontWeight: 700 }}>
                    {complaint.user?.firstName?.charAt(0)}{complaint.user?.lastName?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: "#1F2937" }}>
                      {complaint.user?.firstName} {complaint.user?.lastName}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "#6B7280" }}>
                        {new Date(complaint.createdAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                      </Typography>
                      <Chip label={complaint.user?.rank} size="small" variant="outlined" sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast("Link kopyalandı!", "success");
                      }}
                      sx={{ color: "#6B7280", "&:hover": { color: "#1E6E4F" } }}
                    >
                      <Share sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#6B7280", "&:hover": { color: "#1E6E4F" } }}>
                      <Bookmark sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Stack>
                </Box>

                <Typography variant="body1" sx={{ lineHeight: 1.9, color: "#4B5563", fontSize: "1.05rem" }}>
                  {complaint.content}
                </Typography>

                <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", p: 3, borderRadius: 2, bgcolor: "#fff", border: "1px solid #E5E7EB" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#6B7280", display: "block", mb: 0.5 }}>Firma</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Business sx={{ fontSize: 18, color: "#1E6E4F" }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "#1F2937" }}>{complaint.companyName}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#6B7280", display: "block", mb: 0.5 }}>Görüntülenme</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Visibility sx={{ fontSize: 18, color: "#3B82F6" }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "#1F2937" }}>{complaint.viewCount}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#6B7280", display: "block", mb: 0.5 }}>Beğeni</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Favorite sx={{ fontSize: 18, color: "#EF4444" }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "#1F2937" }}>{complaint.likeCount}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#6B7280", display: "block", mb: 0.5 }}>Yorum</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <ChatIcon sx={{ fontSize: 18, color: "#06B6D4" }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: "#1F2937" }}>{complaint.commentCount}</Typography>
                    </Stack>
                  </Box>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant={isLiked ? "contained" : "outlined"}
                    color={isLiked ? "error" : "inherit"}
                    startIcon={<ThumbUpIcon />}
                    onClick={handleToggleLike}
                    disabled={isLikeLoading}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      borderColor: isLiked ? "transparent" : "#E5E7EB",
                      bgcolor: isLiked ? "#EF4444" : "transparent",
                      "&:hover": { bgcolor: isLiked ? "#DC2626" : alpha("#EF4444", 0.1), borderColor: "#EF4444" },
                    }}
                  >
                    {isLikeLoading ? "Bekleyin..." : isLiked ? "Beğenildi" : "Beğen"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ChatIcon />}
                    onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })}
                    sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#E5E7EB", "&:hover": { borderColor: "#1E6E4F", bgcolor: alpha("#1E6E4F", 0.1) } }}
                  >
                    Yorum Yap
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {complaint.evidences && complaint.evidences.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#1F2937", display: "flex", alignItems: "center", gap: 1 }}>
                  Kanıtlar ({complaint.evidences.length})
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 4 }}>
                  <AnimatePresence>
                    {complaint.evidences.map((evidence, index) => {
                      const evidenceStatus = getStatusConfig(evidence.status);
                      return (
                        <motion.div
                          key={evidence.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card sx={{ borderRadius: 2, border: "1px solid #E5E7EB", overflow: "hidden" }}>
                            <Box sx={{ height: 4, bgcolor: evidenceStatus.bgcolor }} />
                            <CardContent>
                              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(evidenceStatus.bgcolor, 0.1) }}>
                                  {getFileIcon(evidence.fileType)}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 700, color: "#1F2937" }}>
                                    {evidence.fileName}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                    {evidence.fileType || "Dosya"}
                                  </Typography>
                                </Box>
                                <Chip label={evidenceStatus.label} size="small" sx={{ bgcolor: evidenceStatus.bgcolor, color: evidenceStatus.color, fontWeight: 600 }} />
                              </Stack>
                              {evidence.description && (
                                <Typography variant="body2" sx={{ mb: 2, p: 1.5, bgcolor: "#F9FAFB", borderRadius: 1, color: "#4B5563" }}>
                                  {evidence.description}
                                </Typography>
                              )}
                              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                                  {new Date(evidence.uploadedAt).toLocaleDateString("tr-TR")}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    href={evidence.fileUrl}
                                    target="_blank"
                                    size="small"
                                    startIcon={<Download />}
                                    sx={{ fontWeight: 600, textTransform: "none" }}
                                  >
                                    İndir
                                  </Button>
                                  {isAdmin && evidence.status.toLowerCase() === "pending" && (
                                    <>
                                      <Button size="small" variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => openDecisionDialog(evidence.id, true)} sx={{ fontWeight: 700 }}>
                                        Onayla
                                      </Button>
                                      <Button size="small" variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => openDecisionDialog(evidence.id, false)} sx={{ fontWeight: 700 }}>
                                        Reddet
                                      </Button>
                                    </>
                                  )}
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </Box>
              </motion.div>
            )}

            <Paper id="comments-section" elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: "1px solid #E5E7EB" }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#1F2937" }}>
                Yorumlar ({comments.length})
              </Typography>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder="Bu şikayetle ilgili görüşlerinizi yazın..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 },
                  }}
                />
                <Button variant="contained" onClick={handleAddComment} disabled={isCommentLoading} sx={{ alignSelf: "flex-end", borderRadius: 2, fontWeight: 700, background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)" }}>
                  {isCommentLoading ? "Gönderiliyor..." : "Yorum Ekle"}
                </Button>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              {comments.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <ChatIcon sx={{ fontSize: 48, color: "#E5E7EB", mb: 2 }} />
                  <Typography variant="body1" sx={{ color: "#6B7280" }}>Henüz yorum yok. İlk yorumu siz yazın.</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {comments.map((comment) => (
                    <motion.div key={comment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                        <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: getRankColor(comment.user?.rank || "Recruit"), fontSize: "0.875rem", fontWeight: 700 }}>
                            {comment.user?.firstName?.charAt(0)}{comment.user?.lastName?.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1F2937" }}>
                              {comment.user?.firstName} {comment.user?.lastName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                              {new Date(comment.createdAt).toLocaleString("tr-TR")}
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="body2" sx={{ color: "#4B5563", lineHeight: 1.7, pl: 6 }}>
                          {comment.content}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              )}
            </Paper>
          </motion.div>
        </Container>

        <Dialog open={openDialog} onClose={handleApproveDialogClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
          <DialogTitle sx={{ fontWeight: 700, color: decision ? "#10B981" : "#EF4444" }}>
            {decision ? "Kanıtı Onayla" : "Kanıtı Reddet"}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Açıklama (isteğe bağlı)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Kanıt hakkında not ekleyin..."
              sx={{ "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: decision ? "#10B981" : "#EF4444", borderWidth: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleApproveDialogClose} disabled={isApproving} sx={{ fontWeight: 600 }}>İptal</Button>
            <Button
              onClick={handleApproveEvidence}
              variant="contained"
              color={decision ? "success" : "error"}
              disabled={isApproving}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {isApproving ? <CircularProgress size={24} /> : decision ? "Onayla" : "Reddet"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AuthGuard>
  );
}
