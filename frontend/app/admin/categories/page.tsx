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
  Paper,
  InputAdornment,
  Alert,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Gavel,
  Refresh,
} from "@mui/icons-material";
import { categoriesService } from "@/app/services/api";
import { Category } from "@/app/types";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoriesService.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditForm({
      name: category.name || "",
      description: category.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleAddCategory = () => {
    setAddForm({ name: "", description: "" });
    setAddDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCategory) return;

    try {
      await fetchCategories();
      setEditDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleSaveAdd = async () => {
    try {
      await fetchCategories();
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add category:", error);
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

  const totalComplaints = categories.reduce(
    (sum, cat) => sum + (cat.complaintCount || 0),
    0
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <motion.div variants={itemVariants}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Kategori Yönetimi
              </Typography>
              <Typography variant="body1" sx={{ color: "#6B7280" }}>
                Şikayet kategorilerini oluşturun, düzenleyin ve yönetin
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              sx={{
                background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669 0%, #1E6E4F 100%)",
                },
              }}
            >
              Yeni Kategori
            </Button>
          </Stack>
        </motion.div>
      </Box>

      <Stack spacing={3}>
        <motion.div variants={itemVariants}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.2)",
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {categories.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Toplam Kategori
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.2)",
                      }}
                    >
                      <Gavel sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {totalComplaints}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Toplam Şikayet
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ bgcolor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#E0F2FE",
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 28, color: "#0EA5E9" }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, color: "#0EA5E9" }}
                      >
                        {categories.length > 0
                          ? Math.round(totalComplaints / categories.length)
                          : 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        Ort. Şikayet/Kategori
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
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
                  placeholder="Kategori ara..."
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

                <Tooltip title="Yenile">
                  <IconButton onClick={() => void fetchCategories()}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Stack>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Şikayet Sayısı</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ortalama</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        İşlemler
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Typography sx={{ textAlign: "center", py: 2 }}>
                            Yükleniyor...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography color="textSecondary">
                              Kategori bulunamadı
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategories.map((category, index) => (
                        <TableRow
                          key={category.id}
                          hover
                          sx={{
                            "&:hover": {
                              bgcolor: "#F0FDF4",
                            },
                          }}
                        >
                          <TableCell>
                            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  bgcolor: [
                                    "#1E6E4F",
                                    "#7C3AED",
                                    "#0EA5E9",
                                    "#F59E0B",
                                    "#EF4444",
                                    "#10B981",
                                  ][index % 6],
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                }}
                              >
                                {category.name?.charAt(0)}
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {category.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#6B7280",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {category.description || "Açıklama yok"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={category.complaintCount || 0}
                              size="small"
                              sx={{
                                bgcolor: "#E0F2FE",
                                color: "#0369A1",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#6B7280" }}>
                              {totalComplaints > 0
                                ? `${Math.round(
                                    ((category.complaintCount || 0) /
                                      totalComplaints) *
                                      100
                                  )}%`
                                : "0%"}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={0.5}
                              sx={{ justifyContent: "flex-end" }}
                            >
                              <Tooltip title="Düzenle">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <EditIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Sil">
                                <IconButton size="small" color="error">
                                  <DeleteIcon sx={{ fontSize: 18 }} />
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
            </CardContent>
          </Card>
        </motion.div>

        {filteredCategories.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Kategori Dağılımı
                </Typography>
                <Stack spacing={2}>
                  {filteredCategories.map((category, index) => (
                    <Box key={category.id}>
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", mb: 0.5 }}
                      >
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: 1,
                              bgcolor: [
                                "#1E6E4F",
                                "#7C3AED",
                                "#0EA5E9",
                                "#F59E0B",
                                "#EF4444",
                                "#10B981",
                              ][index % 6],
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {category.name}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {category.complaintCount || 0} şikayet
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#E5E7EB",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${
                              totalComplaints > 0
                                ? ((category.complaintCount || 0) /
                                    totalComplaints) *
                                  100
                                : 0
                            }%`,
                            borderRadius: 4,
                            background: [
                              "#1E6E4F",
                              "#7C3AED",
                              "#0EA5E9",
                              "#F59E0B",
                              "#EF4444",
                              "#10B981",
                            ][index % 6],
                            transition: "width 0.3s ease",
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Stack>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Kategori Düzenle</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {selectedCategory && (
              <Alert severity="info">
                <strong>{selectedCategory.name}</strong> kategorisini
                düzenliyorsunuz.
              </Alert>
            )}
            <TextField
              label="Kategori Adı"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Açıklama"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button
            variant="contained"
            onClick={() => void handleSaveEdit()}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Yeni Kategori Ekle</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Kategori Adı"
              value={addForm.name}
              onChange={(e) =>
                setAddForm({ ...addForm, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Açıklama"
              value={addForm.description}
              onChange={(e) =>
                setAddForm({ ...addForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>İptal</Button>
          <Button
            variant="contained"
            onClick={() => void handleSaveAdd()}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
