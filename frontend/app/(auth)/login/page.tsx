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
  Divider,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Shield,
  Verified,
  AccessTime,
} from "@mui/icons-material";
import { authService } from "@/app/services/api";
import { useAuthStore } from "@/app/store/authStore";
import { useToastContext } from "@/app/components/ToastContainer";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const { showToast } = useToastContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      const { token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      setToken(token);
      setUser(user);

      showToast("Başarıyla giriş yaptınız!", "success");
      router.push(user?.isAdmin ? "/admin" : "/complaints");
    } catch {
      showToast("Giriş yapılamadı. Email ve şifreyi kontrol ediniz.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          label="Email Adresi"
          type="email"
          fullWidth
          size="medium"
          {...register("email", { required: "Email adresi gereklidir" })}
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
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1E6E4F",
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1E6E4F",
                  borderWidth: 2,
                },
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#1E6E4F",
            },
          }}
        />

        <TextField
          label="Şifre"
          type={showPassword ? "text" : "password"}
          fullWidth
          size="medium"
          {...register("password", { required: "Şifre gereklidir" })}
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
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1E6E4F",
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1E6E4F",
                  borderWidth: 2,
                },
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#1E6E4F",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                size="small"
                sx={{
                  color: "#9CA3AF",
                  "&.Mui-checked": {
                    color: "#1E6E4F",
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Beni hatırla
              </Typography>
            }
          />
          <Link
            href="/forgot-password"
            sx={{
              color: "#1E6E4F",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": {
                color: "#145C3F",
                textDecoration: "underline",
              },
            }}
          >
            Şifremi unuttum?
          </Link>
        </Box>

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
            disabled={isLoading}
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
              "Giriş Yap"
            )}
          </Button>
        </motion.div>

        <Divider sx={{ my: 2 }}>
          <Typography variant="caption" sx={{ color: "#9CA3AF", px: 2 }}>
            veya
          </Typography>
        </Divider>

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
            { icon: <AccessTime sx={{ fontSize: 16 }} />, text: "7/24 Destek" },
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
              <Typography
                variant="caption"
                sx={{ color: "#1E6E4F", fontWeight: 600 }}
              >
                {badge.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          Hesabınız yok mu?{" "}
          <Link
            href="/register"
            sx={{
              color: "#1E6E4F",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": {
                color: "#145C3F",
                textDecoration: "underline",
              },
            }}
          >
            Hemen Kayıt Olun
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
