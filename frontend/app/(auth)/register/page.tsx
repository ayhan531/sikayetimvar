"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Shield,
  Verified,
  CheckCircle,
} from "@mui/icons-material";
import { authService } from "@/app/services/api";
import { useAuthStore } from "@/app/store/authStore";
import { useToastContext } from "@/app/components/ToastContainer";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  acceptTerms?: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const { showToast } = useToastContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const password = watch("password");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd) || /[^a-zA-Z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || "");
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "#EF4444";
    if (passwordStrength <= 50) return "#F59E0B";
    if (passwordStrength <= 75) return "#10B981";
    return "#059669";
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptTerms) {
      showToast("Kullanım şartlarını kabul etmeniz gerekmektedir.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.register(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      showToast("Hesap başarıyla oluşturuldu!", "success");
      router.push(user?.isAdmin ? "/admin" : "/complaints");
    } catch {
      showToast(
        "Kayıt yapılamadı. Lütfen bilgilerinizi kontrol ediniz.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Ad"
            fullWidth
            size="medium"
            {...register("firstName", { required: "Ad gereklidir" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            disabled={isLoading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "#1E6E4F", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F" } },
                "&.Mui-focused": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#1E6E4F" },
            }}
          />

          <TextField
            label="Soyadı"
            fullWidth
            size="medium"
            {...register("lastName", { required: "Soyadı gereklidir" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            disabled={isLoading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "#1E6E4F", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F" } },
                "&.Mui-focused": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#1E6E4F" },
            }}
          />
        </Stack>

        <TextField
          label="Email Adresi"
          type="email"
          fullWidth
          size="medium"
          {...register("email", {
            required: "Email gereklidir",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Geçerli bir email giriniz",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isLoading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#1E6E4F", fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F" } },
              "&.Mui-focused": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#1E6E4F" },
          }}
        />

        <Box>
          <TextField
            label="Şifre"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="medium"
            {...register("password", {
              required: "Şifre gereklidir",
              minLength: {
                value: 6,
                message: "Şifre en az 6 karakter olmalıdır",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#1E6E4F", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: "#6B7280" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F" } },
                "&.Mui-focused": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#1E6E4F" },
            }}
          />
          {password && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: alpha("#1E6E4F", 0.1),
                  "& .MuiLinearProgress-bar": {
                    bgcolor: getStrengthColor(),
                    borderRadius: 2,
                  },
                }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 0.5, justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  Şifre gücü:
                </Typography>
                <Typography variant="caption" sx={{ color: getStrengthColor(), fontWeight: 600 }}>
                  {passwordStrength <= 25 ? "Zayıf" : passwordStrength <= 50 ? "Orta" : passwordStrength <= 75 ? "İyi" : "Güçlü"}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>

        <TextField
          label="Şifre Onayla"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          size="medium"
          {...register("passwordConfirm", {
            validate: (value) => value === password || "Şifreler eşleşmiyor",
          })}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}
          disabled={isLoading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#1E6E4F", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                    sx={{ color: "#6B7280" }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F" } },
              "&.Mui-focused": { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1E6E4F", borderWidth: 2 } },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#1E6E4F" },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              size="small"
              sx={{
                color: "#9CA3AF",
                "&.Mui-checked": { color: "#1E6E4F" },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
             {" "}
              <Link href="/terms-of-use" sx={{ color: "#1E6E4F", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                Kullanım şartlarını
              </Link>{" "}
              ve{" "}
              <Link href="/kvkk" sx={{ color: "#1E6E4F", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                KVKK aydınlatma metnini
              </Link>{" "}
              okudum ve kabul ediyorum.
            </Typography>
          }
        />

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading || !acceptTerms}
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
              boxShadow: "0 4px 20px rgba(30, 110, 79, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #145C3F 0%, #047857 100%)",
                boxShadow: "0 6px 25px rgba(30, 110, 79, 0.5)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "#9CA3AF",
                boxShadow: "none",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Hesap Oluştur"
            )}
          </Button>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: <Shield sx={{ fontSize: 16 }} />, text: "SSL Güvenli" },
            { icon: <Verified sx={{ fontSize: 16 }} />, text: "Doğrulanmış" },
            { icon: <CheckCircle sx={{ fontSize: 16 }} />, text: "Ücretsiz" },
          ].map((badge, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: alpha("#1E6E4F", 0.1),
                border: `1px solid ${alpha("#1E6E4F", 0.2)}`,
              }}
            >
              <Box sx={{ color: "#1E6E4F" }}>{badge.icon}</Box>
              <Typography variant="caption" sx={{ color: "#1E6E4F", fontWeight: 600 }}>
                {badge.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          Zaten hesabınız var mı?{" "}
          <Link
            href="/login"
            sx={{
              color: "#1E6E4F",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": { color: "#145C3F", textDecoration: "underline" },
            }}
          >
            Giriş Yapın
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
