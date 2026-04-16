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
  TablePagination,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
  InputAdornment,
  Avatar,
  Grid,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  Visibility,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Cancel,
  Schedule,
  FilterList,
  Refresh,
  ThumbUp,
  ChatBubble,
  Warning,
} from "@mui/icons-material";
import { complaintsService } from "@/app/services/api";
import { Complaint } from "@/app/types";
import { getRankLabel, getRankColor } from "@/app/utils/ranks";

type ComplaintStatus = "open" | "pending" | "approved" | "resolved" | "rejected";

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; color: string; bgcolor: string }
> = {
  open: { label: "Açık", color: "#0EA5E9", bgcolor: "#E0F2FE" },
  pending: { label: "Beklemede", color: "#F59E0B", bgcolor: "#FEF3C7" },
  approved: { label: "Onaylandı", color: "#10B981", bgcolor: "#DCFCE7" },
  resolved: { label: "Çözüldü", color: "#8B5CF6", bgcolor: "#EDE9FE" },
  rejected: { label: "Reddedildi", color: "#EF4444", bgcolor: "#FEE2E2" },
};

export default function ComplaintsManagement() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [editStatus, setEditStatus] = useState<ComplaintStatus>("open");

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await complaintsService.getAll(1, 100);
      const data = response.data?.data || response.data || [];
      setComplaints(data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    pending: complaints.filter((c) => c.status === "pending").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    rejected: complaints.filter((c) => c.status === "rejected").length,
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setEditStatus(complaint.status as ComplaintStatus);
    setEditDialogOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedComplaint) return;

    try {
      await fetchComplaints();
      setEditDialogOpen(false);
      setSelectedComplaint(null);
    } catch (error) {
      console.error("Failed to update complaint:", error);
    }
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
            Şikayet Yönetimi
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            Tüm şikayetleri görüntüleyin, durumlarını güncelleyin ve yönetin
          </Typography>
        </motion.div>
      </Box>

      <Stack spacing={3}>
        <motion.div variants={itemVariants}>
          <Grid container spacing={2}>
            {Object.entries(stats).map(([key, value]) => {
              const config =
                key === "total"
                  ? { color: "#1E6E4F", bgcolor: "#DCFCE7", label: "Toplam" }
                  : key === "open"
                  ? { color: "#0EA5E9", bgcolor: "#E0F2FE", label: "Açık" }
                  : key === "pending"
                  ? { color: "#F59E0B", bgcolor: "#FEF3C7", label: "Beklemede" }
                  : key === "resolved"
                  ? { color: "#8B5CF6", bgcolor: "#EDE9FE", label: "Çözüldü" }
                  : { color: "#EF4444", bgcolor: "#FEE2E2", label: "Reddedildi" };

              return (
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={key}>
                  <Card
                    sx={{
                      background: config.bgcolor,
                      border: `1px solid ${config.color}30`,
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: config.color,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s",
                    }}
                    onClick={() =>
                      setStatusFilter(key === "total" ? "all" : key)
                    }
                  >
                    <CardContent sx={{ textAlign: "center", py: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, color: config.color }}
                      >
                        {value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: config.color }}
                      >
                        {config.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: "center", mb: 3 }}
              >
                <TextField
                  placeholder="Şikayet ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{ flex: 1, maxWidth: 400 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#9CA3AF" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Durum</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Durum"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">Tümü</MenuItem>
                    {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                      <MenuItem key={value} value={value}>
                        {config.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Yenile">
                    <IconButton onClick={() => void fetchComplaints()}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Şikayet</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>İstatistikler</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        İşlemler
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <LinearProgress />
                        </TableCell>
                      </TableRow>
                    ) : filteredComplaints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography color="textSecondary">
                              Şikayet bulunamadı
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredComplaints
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((complaint) => {
                          const statusConfig =
                            STATUS_CONFIG[complaint.status as ComplaintStatus] ||
                            STATUS_CONFIG.open;

                          return (
                            <TableRow
                              key={complaint.id}
                              hover
                              sx={{
                                "&:hover": {
                                  bgcolor: "#F0FDF4",
                                },
                              }}
                            >
                              <TableCell sx={{ maxWidth: 250 }}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {complaint.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#6B7280" }}
                                  >
                                    {complaint.companyName}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={complaint.category?.name || "Genel"}
                                  size="small"
                                  sx={{
                                    bgcolor: "#E0F2FE",
                                    color: "#0369A1",
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                  <Avatar
                                    sx={{
                                      width: 28,
                                      height: 28,
                                      fontSize: "0.7rem",
                                      bgcolor: getRankColor(
                                        complaint.user?.rank || "Recruit"
                                      ),
                                    }}
                                  >
                                    {complaint.user?.firstName?.charAt(0)}
                                    {complaint.user?.lastName?.charAt(0)}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {complaint.user?.firstName}{" "}
                                    {complaint.user?.lastName?.charAt(0)}.
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={statusConfig.label}
                                  size="small"
                                  sx={{
                                    bgcolor: statusConfig.bgcolor,
                                    color: statusConfig.color,
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="Görüntüleme">
                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                      <Visibility sx={{ fontSize: 14, color: "#9CA3AF" }} />
                                      <Typography variant="caption">
                                        {complaint.viewCount}
                                      </Typography>
                                    </Stack>
                                  </Tooltip>
                                  <Tooltip title="Beğeni">
                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                      <ThumbUp sx={{ fontSize: 14, color: "#EF4444" }} />
                                      <Typography variant="caption">
                                        {complaint.likeCount}
                                      </Typography>
                                    </Stack>
                                  </Tooltip>
                                  <Tooltip title="Yorum">
                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                      <ChatBubble sx={{ fontSize: 14, color: "#06B6D4" }} />
                                      <Typography variant="caption">
                                        {complaint.commentCount}
                                      </Typography>
                                    </Stack>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                  {new Date(
                                    complaint.createdAt
                                  ).toLocaleDateString("tr-TR")}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  sx={{ justifyContent: "flex-end" }}
                                >
                                  <Tooltip title="Görüntüle">
                                    <IconButton
                                      size="small"
                                      component={Link}
                                      href={`/complaints/${complaint.id}`}
                                    >
                                      <Visibility sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Düzenle">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditComplaint(complaint)}
                                    >
                                      <EditIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredComplaints.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Sayfa başına:"
              />
            </CardContent>
          </Card>
        </motion.div>
      </Stack>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Şikayet Durumu Güncelle</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {selectedComplaint && (
              <Alert severity="info">
                <strong>{selectedComplaint.title}</strong> şikayetinin durumunu
                güncelliyorsunuz.
              </Alert>
            )}
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={editStatus}
                label="Durum"
                onChange={(e) =>
                  setEditStatus(e.target.value as ComplaintStatus)
                }
              >
                {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                  <MenuItem key={value} value={value}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: config.color,
                        }}
                      />
                      <Typography>{config.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button
            variant="contained"
            onClick={() => void handleSaveStatus()}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
