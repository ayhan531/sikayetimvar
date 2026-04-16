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
  Avatar,
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
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  EmojiEvents,
  CheckCircle,
  Cancel,
  Visibility,
  FilterList,
  Refresh,
} from "@mui/icons-material";
import { usersService } from "@/app/services/api";
import { User } from "@/app/types";
import { getRankLabel, getRankColor, RANK_ORDER } from "@/app/utils/ranks";

interface UserStats {
  total: number;
  active: number;
  admins: number;
  byRank: Record<string, number>;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    rank: "",
    isAdmin: false,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await usersService.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats: UserStats = {
    total: users.length,
    active: users.filter((u) => u.points > 0).length,
    admins: users.filter((u) => u.isAdmin).length,
    byRank: users.reduce((acc, u) => {
      acc[u.rank] = (acc[u.rank] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      rank: user.rank || "Recruit",
      isAdmin: user.isAdmin || false,
    });
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      if (editForm.rank !== selectedUser.rank) {
        await usersService.updateRank(selectedUser.id, editForm.rank);
      }
      await usersService.updateUser(selectedUser.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        isAdmin: editForm.isAdmin,
      });
      await fetchUsers();
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
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
            Kullanıcı Yönetimi
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            Tüm kullanıcıları görüntüleyin, düzenleyin ve yönetin
          </Typography>
        </motion.div>
      </Box>

      <Stack spacing={3}>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                    background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                    color: "#fff",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Toplam Kullanıcı
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    color: "#fff",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {stats.active}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Aktif Kullanıcı
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                    color: "#fff",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {stats.admins}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Yönetici
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: "center", mb: 3 }}
              >
                <TextField
                  placeholder="Kullanıcı ara..."
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

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Yenile">
                    <IconButton onClick={() => void fetchUsers()}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    size="small"
                  >
                    Filtrele
                  </Button>
                </Stack>
              </Stack>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>E-posta</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Rütbe</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Puan</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Onay Sayısı</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Profil</TableCell>
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
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography color="textSecondary">
                              Kullanıcı bulunamadı
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((user) => (
                          <TableRow
                            key={user.id}
                            hover
                            sx={{
                              "&:hover": {
                                bgcolor: "#F0FDF4",
                              },
                            }}
                          >
                            <TableCell>
                              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                                <Avatar
                                  sx={{
                                    bgcolor: getRankColor(user.rank),
                                    width: 40,
                                    height: 40,
                                    fontWeight: 700,
                                  }}
                                >
                                  {user.firstName?.charAt(0)}
                                  {user.lastName?.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {user.firstName} {user.lastName}
                                  </Typography>
                                  {user.isAdmin && (
                                    <Chip
                                      label="Admin"
                                      size="small"
                                      sx={{
                                        height: 18,
                                        fontSize: "0.65rem",
                                        bgcolor: "#7C3AED",
                                        color: "#fff",
                                      }}
                                    />
                                  )}
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{user.email}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={<EmojiEvents sx={{ fontSize: "16px !important" }} />}
                                label={getRankLabel(user.rank)}
                                size="small"
                                sx={{
                                  bgcolor: `${getRankColor(user.rank)}15`,
                                  color: getRankColor(user.rank),
                                  fontWeight: 600,
                                  "& .MuiChip-icon": {
                                    color: getRankColor(user.rank),
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user.points}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {user.approvedCount || 0}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.profileCompleted ? "Tamamlandı" : "Eksik"}
                                size="small"
                                sx={{
                                  bgcolor: user.profileCompleted ? "#DCFCE7" : "#FEF3C7",
                                  color: user.profileCompleted ? "#166534" : "#92400E",
                                  fontWeight: 600,
                                }}
                              />
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
                                    component="a"
                                    href={`/profile`}
                                  >
                                    <Visibility sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Düzenle">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <EditIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredUsers.length}
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

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Rütbe Dağılımı
              </Typography>
              <Stack spacing={2}>
                {RANK_ORDER.map((rank) => (
                  <Box key={rank}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", mb: 0.5 }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <EmojiEvents
                          sx={{ color: getRankColor(rank), fontSize: 20 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {getRankLabel(rank)}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stats.byRank[rank] || 0} kullanıcı
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={
                        stats.total > 0
                          ? ((stats.byRank[rank] || 0) / stats.total) * 100
                          : 0
                      }
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#E5E7EB",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: getRankColor(rank),
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
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
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
          <EmojiEvents sx={{ color: "#1E6E4F" }} /> Kullanıcı Düzenle
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {selectedUser && (
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: getRankColor(selectedUser.rank), width: 50, height: 50, fontWeight: 700 }}>
                    {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedUser.firstName} {selectedUser.lastName}</Typography>
                    <Typography variant="caption" sx={{ color: "#6B7280" }}>{selectedUser.email}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Chip icon={<EmojiEvents />} label={`${selectedUser.points} puan`} sx={{ bgcolor: "#1E6E4F15", color: "#1E6E4F" }} />
                  <Chip label={getRankLabel(selectedUser.rank)} sx={{ bgcolor: `${getRankColor(selectedUser.rank)}15`, color: getRankColor(selectedUser.rank) }} />
                  {selectedUser.isAdmin && <Chip label="Admin" color="secondary" size="small" />}
                </Stack>
              </Box>
            )}
            <TextField
              label="Ad"
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Soyad"
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Rütbe</InputLabel>
              <Select
                value={editForm.rank}
                label="Rütbe"
                onChange={(e) =>
                  setEditForm({ ...editForm, rank: e.target.value })
                }
              >
                {RANK_ORDER.map((rank) => (
                  <MenuItem key={rank} value={rank}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <EmojiEvents sx={{ color: getRankColor(rank), fontSize: 20 }} />
                      <span>{getRankLabel(rank)}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
              {selectedUser && editForm.rank !== selectedUser.rank && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Rütbe değişikliği: {getRankLabel(selectedUser.rank)} → {getRankLabel(editForm.rank)}
                </Alert>
              )}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button
            variant="contained"
            onClick={() => void handleSaveUser()}
            sx={{ background: "#1E6E4F" }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
