"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  alpha,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile,
  Send,
  CheckCircle,
  Warning,
  Image,
  PictureAsPdf,
  Description,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { complaintsService, categoriesService, adminService } from "@/app/services/api";
import { useToastContext } from "@/app/components/ToastContainer";
import { useAuthStore } from "@/app/store/authStore";
import { AuthGuard } from "@/app/components/guards/AuthGuard";
import { Category } from "@/app/types";
import { containerVariants, itemVariants } from "@/app/utils/animations";
import { MIN_POINTS_FOR_COMPLAINTS } from "@/app/utils/ranks";

interface CreateComplaintFormData {
  title: string;
  content: string;
  companyName: string;
  categoryId: string;
}

interface UploadedFile {
  file: File;
  description: string;
  id: string;
}

const STEPS = ["Temel Bilgiler", "Kanıtlar", "Önizleme"];

export default function CreateComplaintPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const { user, loadFromLocalStorage } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateComplaintFormData>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const watchedFields = watch(["title", "content", "companyName", "categoryId"]);

  const userPoints = user?.points ?? 0;
  const canCreateComplaint = userPoints >= MIN_POINTS_FOR_COMPLAINTS;

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await categoriesService.getAll();
      setCategories(response.data);
    } catch {
      showToast("Kategoriler yüklenirken hata oluştu", "error");
    } finally {
      setCategoriesLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFromLocalStorage();
    void fetchCategories();
  }, [loadFromLocalStorage, fetchCategories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const newFile: UploadedFile = { file, description: "", id: Date.now().toString() + Math.random() };
      setUploadedFiles((prev) => [...prev, newFile]);
    });
    e.target.value = "";
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDescriptionChange = (id: string, description: string) => {
    setUploadedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, description } : f)));
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return <PictureAsPdf sx={{ color: "#EF4444" }} />;
    if (file.type.includes("image")) return <Image sx={{ color: "#3B82F6" }} />;
    return <Description sx={{ color: "#6B7280" }} />;
  };

  const getStepCompletion = () => {
    const [title, content, companyName, categoryId] = watchedFields;
    if (activeStep === 0) {
      return title?.length >= 10 && content?.length >= 50 && companyName?.length >= 2 && categoryId;
    }
    if (activeStep === 1) {
      return uploadedFiles.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const [title, content, companyName, categoryId] = watchedFields;
      if (!title || title.length < 10 || !content || content.length < 50 || !companyName || companyName.length < 2 || !categoryId) {
        showToast("Lütfen tüm alanları doldurun", "error");
        return;
      }
    }
    if (activeStep === 1 && uploadedFiles.length === 0) {
      showToast("En az bir kanıt dosyası ekleyin", "error");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const onSubmit = async (data: CreateComplaintFormData) => {
    setIsLoading(true);
    try {
      const complaintResponse = await complaintsService.create(data.title, data.content, data.companyName, Number(data.categoryId));
      const complaintId = complaintResponse.data.complaint?.id;
      if (!complaintId) throw new Error("Complaint ID not returned from API");
      for (const uploadedFile of uploadedFiles) {
        const formData = new FormData();
        formData.append("file", uploadedFile.file);
        formData.append("description", uploadedFile.description);
        formData.append("complaintId", complaintId.toString());
        await adminService.uploadEvidence(formData);
      }
      showToast("Şikayet başarıyla oluşturuldu!", "success");
      router.push("/complaints");
    } catch {
      showToast("Şikayet oluşturulurken hata oluştu", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === Number(watchedFields[3]));

  return (
    <AuthGuard>
      <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB" }}>
        <Box sx={{ height: 8, background: "linear-gradient(90deg, #1E6E4F 0%, #059669 100%)" }} />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <motion.div initial="initial" animate="animate" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/complaints")} sx={{ mb: 3, color: "#6B7280", fontWeight: 600, "&:hover": { bgcolor: alpha("#1E6E4F", 0.1), color: "#1E6E4F" } }}>
                Tüm Şikayetlere Dön
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: "1px solid #E5E7EB" }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 800, color: "#1E6E4F" }}>
                    Yeni Şikayet Oluştur
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#6B7280" }}>
                    Şikayetinizi ayrıntılı açıklayın ve kanıtlarınızı ekleyin
                  </Typography>
                </Box>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                  {STEPS.map((label) => (
                    <Step key={label}>
                      <StepLabel sx={{ "& .MuiStepLabel-label": { fontWeight: 600 } }}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {!canCreateComplaint && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card sx={{ mb: 4, borderRadius: 3, border: "2px solid #EF4444", bgcolor: alpha("#EF4444", 0.05) }}>
                      <CardContent sx={{ textAlign: "center", p: 4 }}>
                        <Warning sx={{ fontSize: 64, color: "#EF4444", mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#EF4444", mb: 2 }}>
                          Şikayet Oluşturma Yetkiniz Yok
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#4B5563", mb: 3 }}>
                          Şikayet oluşturmak için en az <strong>{MIN_POINTS_FOR_COMPLAINTS} puan</strong> gereklidir.
                          Mevcut puanınız: <strong>{userPoints} puan</strong>
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
                          <Button variant="outlined" onClick={() => router.push("/complaints")} sx={{ borderRadius: 2 }}>
                            Şikayetleri İncele
                          </Button>
                          <Button variant="contained" onClick={() => router.push("/profile")} startIcon={<CheckCircle />} sx={{ borderRadius: 2, background: "#1E6E4F" }}>
                            Puan Kazan
                          </Button>
                        </Stack>
                        <Typography variant="caption" sx={{ display: "block", mt: 3, color: "#6B7280" }}>
                          Puan kazanmak için yorum yapabilir, beğeni verebilir veya profilinizi tamamlayabilirsiniz.
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {canCreateComplaint && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {activeStep === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Stack spacing={3}>
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#1F2937" }}>
                              Şikayet Detayları
                            </Typography>
                            <TextField
                              label="Başlık"
                              fullWidth
                              placeholder="Şikayetinizin kısa ve öz başlığı..."
                              {...register("title", { required: "Başlık gereklidir", minLength: { value: 10, message: "Başlık en az 10 karakter olmalıdır" } })}
                              error={!!errors.title}
                              helperText={errors.title?.message || (watchedFields[0]?.length > 0 && watchedFields[0].length < 10 ? `${10 - (watchedFields[0]?.length || 0)} karakter kaldı` : "")}
                              disabled={isLoading}
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }}
                            />
                          </Box>

                          <TextField
                            label="İçerik"
                            fullWidth
                            multiline
                            rows={6}
                            placeholder="Şikayetiniz hakkında detaylı açıklama yapınız. Ne oldu, ne zaman oldu, kimlerle iletişim kurdunuz..."
                            {...register("content", { required: "İçerik gereklidir", minLength: { value: 50, message: "İçerik en az 50 karakter olmalıdır" } })}
                            error={!!errors.content}
                            helperText={errors.content?.message || (watchedFields[1]?.length > 0 && watchedFields[1].length < 50 ? `${50 - (watchedFields[1]?.length || 0)} karakter kaldı` : "")}
                            disabled={isLoading}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }}
                          />

                          <TextField
                            label="Firma Adı"
                            fullWidth
                            placeholder="Şikayetin ilgili olduğu firma adı..."
                            {...register("companyName", { required: "Firma adı gereklidir", minLength: { value: 2, message: "Firma adı en az 2 karakter olmalıdır" } })}
                            error={!!errors.companyName}
                            helperText={errors.companyName?.message}
                            disabled={isLoading}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } }}
                          />

                          <FormControl fullWidth error={!!errors.categoryId} disabled={isLoading || categoriesLoading} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                            <InputLabel>Kategori</InputLabel>
                            <Select label="Kategori" defaultValue="" {...register("categoryId", { required: "Kategori seçiniz" })}>
                              <MenuItem value=""><em>Kategori seçiniz</em></MenuItem>
                              {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                              ))}
                            </Select>
                            {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
                          </FormControl>
                        </Stack>
                      </motion.div>
                    )}

                    {activeStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Box>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#1F2937" }}>
                            Kanıt Yükleme
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 3, color: "#6B7280" }}>
                            Şikayetinizi destekleyen görseller veya belgeler ekleyin
                          </Typography>

                          <motion.div whileHover={{ scale: 1.005 }}>
                            <Card sx={{ mb: 3, border: "2px dashed #D1D5DB", bgcolor: "#FAFAFA", cursor: "pointer", borderRadius: 3, transition: "all 0.3s ease", "&:hover": { borderColor: "#1E6E4F", bgcolor: "#F0FDF4" } }}>
                              <CardContent sx={{ textAlign: "center", py: 6, position: "relative" }}>
                                <input type="file" multiple onChange={handleFileChange} disabled={isLoading} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: isLoading ? "not-allowed" : "pointer" }} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" />
                                <CloudUploadIcon sx={{ fontSize: 64, color: "#1E6E4F", mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1F2937", mb: 1 }}>
                                  Dosyaları sürükleyip bırakın veya tıklayın
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                                  Görüntü, PDF, Word, Excel (Maks. 10MB)
                                </Typography>
                              </CardContent>
                            </Card>
                          </motion.div>

                          {uploadedFiles.length > 0 && (
                            <Stack spacing={2}>
                              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1F2937" }}>
                                  Yüklenen Dosyalar ({uploadedFiles.length})
                                </Typography>
                                <Chip label="Zorunlu" color="error" size="small" />
                              </Stack>
                              <AnimatePresence>
                                {uploadedFiles.map((uploadedFile, idx) => (
                                  <motion.div key={uploadedFile.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                                    <Card sx={{ p: 2, borderRadius: 2, border: "1px solid #E5E7EB" }}>
                                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                                          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha("#1E6E4F", 0.1) }}>
                                            {getFileIcon(uploadedFile.file)}
                                          </Box>
                                          <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1F2937" }}>{uploadedFile.file.name}</Typography>
                                            <Typography variant="caption" sx={{ color: "#6B7280" }}>{(uploadedFile.file.size / 1024).toFixed(1)} KB</Typography>
                                          </Box>
                                        </Stack>
                                        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveFile(uploadedFile.id)} sx={{ fontWeight: 600 }}>Sil</Button>
                                      </Stack>
                                      <TextField fullWidth size="small" placeholder="Bu dosya hakkında açıklama..." value={uploadedFile.description} onChange={(e) => handleDescriptionChange(uploadedFile.id, e.target.value)} disabled={isLoading} sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Card>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </Stack>
                          )}
                        </Box>
                      </motion.div>
                    )}

                    {activeStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                          <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: alpha("#1E6E4F", 0.1), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                            <CheckCircle sx={{ fontSize: 40, color: "#1E6E4F" }} />
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1F2937", mb: 1 }}>Şikayetinizi Gözden Geçirin</Typography>
                          <Typography variant="body1" sx={{ color: "#6B7280" }}>Her şey doğruysa gönderin</Typography>
                        </Box>

                        <Card sx={{ p: 3, borderRadius: 3, bgcolor: "#FAFAFA", mb: 3 }}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>BAŞLIK</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1F2937" }}>{watchedFields[0]}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>İÇERİK</Typography>
                              <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.7 }}>{watchedFields[1]}</Typography>
                            </Box>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                              <Box>
                                <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>FİRMA</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1F2937" }}>{watchedFields[2]}</Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>KATEGORİ</Typography>
                                <Chip label={selectedCategory?.name || "-"} sx={{ bgcolor: alpha("#1E6E4F", 0.1), color: "#1E6E4F", fontWeight: 700 }} />
                              </Box>
                            </Stack>
                            <Box>
                              <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>KANITLAR</Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                                {uploadedFiles.map((f) => (
                                  <Chip key={f.id} label={f.file.name} size="small" icon={getFileIcon(f.file)} sx={{ m: 0.5 }} />
                                ))}
                              </Stack>
                            </Box>
                          </Stack>
                        </Card>

                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha("#F59E0B", 0.1), display: "flex", alignItems: "flex-start", gap: 2 }}>
                          <Warning sx={{ color: "#F59E0B", mt: 0.5 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#92400E" }}>Önemli Bilgi</Typography>
                            <Typography variant="caption" sx={{ color: "#92400E" }}>Şikayetiniz gönderildikten sonra admin onayına sunulacaktır. Gerçek dışı şikayetler hesabınıza zarar verebilir.</Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Box sx={{ mt: 4 }}>
                    <LinearProgress variant="determinate" value={((activeStep + 1) / STEPS.length) * 100} sx={{ height: 6, borderRadius: 3, mb: 3, bgcolor: "#E5E7EB", "& .MuiLinearProgress-bar": { borderRadius: 3 } }} />
                    <Stack direction="row" spacing={2} sx={{ justifyContent: activeStep === 0 ? "flex-end" : "space-between" }}>
                      {activeStep > 0 && (
                        <Button variant="outlined" onClick={() => setActiveStep((prev) => prev - 1)} sx={{ borderRadius: 2, fontWeight: 700, borderColor: "#E5E7EB", "&:hover": { borderColor: "#1E6E4F" } }}>
                          Geri
                        </Button>
                      )}
                      {activeStep < STEPS.length - 1 ? (
                        <Button variant="contained" onClick={handleNext} sx={{ borderRadius: 2, fontWeight: 700, background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)", px: 4 }}>
                          Devam Et
                        </Button>
                      ) : (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} /> : <Send />} sx={{ borderRadius: 2, fontWeight: 700, background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)", px: 4, boxShadow: "0 4px 20px rgba(30,110,79,0.4)" }}>
                            {isLoading ? "Gönderiliyor..." : "Şikayeti Gönder"}
                          </Button>
                        </motion.div>
                      )}
                    </Stack>
                  </Box>
                </form>
                )}
              </Paper>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </AuthGuard>
  );
}
