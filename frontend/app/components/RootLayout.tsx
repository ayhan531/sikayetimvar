"use client";

import React, { useEffect } from "react";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
  Badge,
  Stack,
  Chip,
} from "@mui/material";
import { CacheProvider } from "@emotion/react";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { ToastProvider } from "./ToastContainer";
import { createEmotionCache } from "../theme/emotionCache";
import theme from "../theme/theme";
import { getRankLabel, getRankColor } from "../utils/ranks";

const emotionCache = createEmotionCache();

const RankBadge = ({ rank, points }: { rank: string; points: number }) => (
  <Chip
    icon={<EmojiEventsIcon sx={{ fontSize: "16px !important" }} />}
    label={`${getRankLabel(rank)} (${points} puan)`}
    size="small"
    sx={{
      fontWeight: 600,
      bgcolor: getRankColor(rank),
      color: "#fff",
      "& .MuiChip-icon": { color: "#fff" },
    }}
  />
);

export function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, loadFromLocalStorage } =
    useAuthStore();

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push("/");
  };

  const menuItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Şikayetler", href: "/complaints" },
    ...(isAuthenticated
      ? [
          { label: "Yeni Şikayet", href: "/complaints/create" },
          { label: "Profilim", href: "/profile" },
        ]
      : []),
  ];
  const adminItems =
    user?.isAdmin || user?.rank === "Director"
      ? [{ label: "Admin Paneli", href: "/admin" }]
      : [];

  const drawer = (
    <Box sx={{ width: 260 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, bgcolor: "#1E6E4F", color: "#fff" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Şikayetimvar
        </Typography>
        {user && <RankBadge rank={user.rank} points={user.points} />}
      </Box>
      <List>
        {[...menuItems, ...adminItems].map((item, idx) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(30, 110, 79, 0.1)",
                    borderLeft: "3px solid #1E6E4F",
                    color: "#1E6E4F",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <CacheProvider value={emotionCache}>
      <ToastProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* Root wrapper — plain div to avoid hydration mismatch */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            {/* Navbar */}
            <AppBar position="sticky">
              <Toolbar>
                {isMobile && (
                  <IconButton
                    color="inherit"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Typography
                    variant="h6"
                    component={Link}
                    href="/"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.4rem",
                      color: "#fff",
                      mr: 3,
                    }}
                  >
                    Şikayetimvar
                  </Typography>
                </motion.div>

                {!isMobile && (
                  <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
                    {menuItems.map((item) => (
                      <motion.div
                        key={item.href}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Typography
                          component={Link}
                          href={item.href}
                          sx={{
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: pathname === item.href ? 700 : 500,
                            borderBottom:
                              pathname === item.href
                                ? "2px solid #fff"
                                : "none",
                            pb: 0.5,
                            "&:hover": { color: "#fff" },
                          }}
                        >
                          {item.label}
                        </Typography>
                      </motion.div>
                    ))}
                    {adminItems.map((item) => (
                      <motion.div key={item.href} whileHover={{ y: -2 }}>
                        <Typography
                          component={Link}
                          href={item.href}
                          sx={{
                            color: "#FCD34D",
                            fontWeight: 600,
                            "&:hover": { color: "#FDE68A" },
                          }}
                        >
                          {item.label}
                        </Typography>
                      </motion.div>
                    ))}
                  </Stack>
                )}

                {isAuthenticated && user ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton color="inherit" size="small">
                        <Badge badgeContent={0} color="error">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton color="inherit" onClick={handleMenuOpen}>
                        <AccountCircleIcon />
                      </IconButton>
                    </motion.div>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        disabled
                        sx={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>
                        <RankBadge rank={user.rank} points={user.points} />
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        href="/profile"
                        onClick={handleMenuClose}
                      >
                        Profilim
                      </MenuItem>
                      {(user.isAdmin || user.rank === "Director") && (
                        <MenuItem
                          component={Link}
                          href="/admin"
                          onClick={handleMenuClose}
                        >
                          Admin Paneli
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1, fontSize: 18 }} /> Çıkış Yap
                      </MenuItem>
                    </Menu>
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center" }}
                  >
                    <Typography
                      component={Link}
                      href="/login"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 500,
                        "&:hover": { color: "#fff" },
                      }}
                    >
                      Giriş
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)" }}>
                      |
                    </Typography>
                    <Typography
                      component={Link}
                      href="/register"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 600,
                        "&:hover": { color: "#fff" },
                      }}
                    >
                      Kayıt Ol
                    </Typography>
                  </Stack>
                )}
              </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            {isMobile && (
              <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
              >
                {drawer}
              </Drawer>
            )}

            {/* Page Content */}
            <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {children}
              </motion.div>
            </Container>

            {/* Footer */}
            <Box
              component="footer"
              sx={{ bgcolor: "#0F3A2A", color: "#D1FAE5", pt: 6, pb: 3, mt: 4 }}
            >
              <Container maxWidth="lg">
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={4}
                  sx={{ justifyContent: "space-between", mb: 4 }}
                >
                  <Box sx={{ maxWidth: 280 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#ECFDF5", fontWeight: 700, mb: 1 }}
                    >
                      Şikayetimvar
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#A7F3D0", lineHeight: 1.7 }}
                    >
                      Türkiye&apos;nin en güvenilir tüketici şikayetleri
                      platformu. Haklarınızı savunun, sesinizi duyurun.
                    </Typography>
                  </Box>

                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#ECFDF5", fontWeight: 600, mb: 0.5 }}
                    >
                      Hızlı Bağlantılar
                    </Typography>
                    {[
                      { label: "Ana Sayfa", href: "/" },
                      { label: "Şikayetler", href: "/complaints" },
                      { label: "Şikayet Yaz", href: "/complaints/create" },
                      { label: "Puan Sistemi", href: "/rewards" },
                    ].map((item) => (
                      <Typography
                        key={item.href}
                        component={Link}
                        href={item.href}
                        variant="body2"
                        sx={{
                          color: "#A7F3D0",
                          "&:hover": { color: "#6EE7B7" },
                          transition: "color 0.2s",
                        }}
                      >
                        {item.label}
                      </Typography>
                    ))}
                  </Stack>

                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#ECFDF5", fontWeight: 600, mb: 0.5 }}
                    >
                      Yasal
                    </Typography>
                    {[
                      {
                        label: "Gizlilik Politikası",
                        href: "/privacy-policy",
                      },
                      {
                        label: "Kullanım Koşulları",
                        href: "/terms-of-use",
                      },
                      { label: "KVKK", href: "/kvkk" },
                      { label: "Çerez Politikası", href: "/cookie-policy" },
                    ].map((t) => (
                      <Typography
                        key={t.href}
                        component={Link}
                        href={t.href}
                        variant="body2"
                        sx={{
                          color: "#A7F3D0",
                          "&:hover": { color: "#6EE7B7" },
                        }}
                      >
                        {t.label}
                      </Typography>
                    ))}
                  </Stack>

                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#ECFDF5", fontWeight: 600, mb: 0.5 }}
                    >
                      İletişim
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#A7F3D0" }}>
                      info@sikayetimvar.com
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#A7F3D0" }}>
                      +90 (212) 555 0000
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#A7F3D0" }}>
                      İstanbul, Türkiye
                    </Typography>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    borderTop: "1px solid #166534",
                    pt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#86EFAC" }}>
                    © 2026 Şikayetimvar. Tüm hakları saklıdır.
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#86EFAC" }}>
                    v1.0.0 — Türkiye&apos;de 🇹🇷 ile yapıldı
                  </Typography>
                </Box>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </ToastProvider>
    </CacheProvider>
  );
}
