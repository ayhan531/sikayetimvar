"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
  Chip,
  alpha,
  Stack,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { getRankLabel, getRankColor } from "@/app/utils/ranks";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Gavel as ComplaintIcon,
  Category as CategoryIcon,
  VerifiedUser as EvidenceIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  TrendingUp,
  EmojiEvents,
  Security,
} from "@mui/icons-material";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  color?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <DashboardIcon />, href: "/admin" },
  { label: "Kanıt Yönetimi", icon: <EvidenceIcon />, href: "/admin/evidence" },
  { label: "Kullanıcılar", icon: <PeopleIcon />, href: "/admin/users" },
  { label: "Şikayetler", icon: <ComplaintIcon />, href: "/admin/complaints" },
  { label: "Kategoriler", icon: <CategoryIcon />, href: "/admin/categories" },
  { label: "Raporlar", icon: <ReportIcon />, href: "/admin/reports" },
  { label: "Ayarlar", icon: <SettingsIcon />, href: "/admin/settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isAuthenticated, loadFromLocalStorage, logout } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const canAccess = user.isAdmin || user.rank === "Director";
      if (!canAccess) {
        router.push("/");
      }
    } else if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleCollapseToggle = () => setCollapsed(!collapsed);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationOpen = (e: React.MouseEvent<HTMLElement>) => setNotificationAnchor(e.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);
  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const activeIndex = useMemo(() => {
    return navItems.findIndex((item) => isActive(item.href));
  }, [pathname]);

  const drawerWidth = collapsed && !isMobile ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0F3A2A 0%, #145C3F 100%)",
        color: "#fff",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: collapsed ? 1 : 3,
          py: 2,
          minHeight: 72,
        }}
      >
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Security sx={{ color: "#fff", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      letterSpacing: 0.5,
                      lineHeight: 1.2,
                    }}
                  >
                    Şikayetimvar
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.7, fontSize: "0.65rem" }}
                  >
                    Admin Panel
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Security sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
        )}

        {!isMobile && (
          <IconButton
            onClick={handleCollapseToggle}
            sx={{
              color: "#fff",
              opacity: 0.7,
              "&:hover": { opacity: 1, background: "rgba(255,255,255,0.1)" },
            }}
          >
            <ChevronLeftIcon
              sx={{
                transform: collapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
        )}
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {navItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Tooltip title={collapsed ? item.label : ""} placement="right">
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={isActive(item.href)}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "initial",
                    px: collapsed ? 1 : 2.5,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background:
                        isActive(item.href)
                          ? "linear-gradient(180deg, #10B981 0%, #059669 100%)"
                          : "transparent",
                      borderRadius: "0 4px 4px 0",
                    },
                    "&.Mui-selected": {
                      background: "rgba(16, 185, 129, 0.15)",
                      "&:hover": {
                        background: "rgba(16, 185, 129, 0.2)",
                      },
                    },
                    "&:hover": {
                      background: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 48,
                      color: isActive(item.href) ? "#10B981" : "rgba(255,255,255,0.7)",
                      justifyContent: "center",
                    }}
                  >
                    {item.badge ? (
                      <Badge
                        badgeContent={item.badge}
                        color="error"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "0.65rem",
                            height: 18,
                            minWidth: 18,
                          },
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontWeight: isActive(item.href) ? 600 : 400,
                            fontSize: "0.9rem",
                            color: isActive(item.href) ? "#fff" : "rgba(255,255,255,0.7)",
                          },
                        },
                      }}
                    />
                  )}
                  {!collapsed && isActive(item.href) && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#10B981",
                        boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </motion.div>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <Box sx={{ p: 2 }}>
        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: getRankColor(user.rank),
                    width: 40,
                    height: 40,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#fff", lineHeight: 1.3 }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Chip
                    icon={<EmojiEvents sx={{ fontSize: "14px !important" }} />}
                    label={`${getRankLabel(user.rank)} (${user.points})`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      bgcolor: alpha(getRankColor(user.rank), 0.2),
                      color: "#fff",
                      "& .MuiChip-icon": { color: "#fff" },
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          transition: "width 0.3s, margin 0.3s",
          background: "linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)",
          borderBottom: "1px solid #e5e7eb",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 72 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: { md: "none" },
                color: "#1E6E4F",
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="body2"
                sx={{ color: "#6B7280", fontWeight: 500 }}
              >
                Yönetim Paneli
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#1E6E4F",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {navItems.find((item) => isActive(item.href))?.label || "Dashboard"}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Tooltip title="Siteye Git">
              <IconButton
                component={Link}
                href="/"
                sx={{ color: "#6B7280" }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Bildirimler">
              <IconButton
                onClick={handleNotificationOpen}
                sx={{ color: "#6B7280" }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              slotProps={{
                paper: {
                  sx: { width: 320, maxHeight: 400 },
                },
              }}
            >
              <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Bildirimler
                </Typography>
              </Box>
              <MenuItem onClick={handleNotificationClose}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Yeni kanıt onayı bekliyor
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    5 dakika önce
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Yeni kullanıcı kaydı
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    1 saat önce
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Şikayet raporlandı
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    3 saat önce
                  </Typography>
                </Box>
              </MenuItem>
            </Menu>

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                ml: 1,
                "&:hover": {
                  background: "rgba(30, 110, 79, 0.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: user ? getRankColor(user.rank) : "#1E6E4F",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              slotProps={{
                paper: {
                  sx: { width: 220 },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e5e7eb" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.email}
                </Typography>
              </Box>
              <MenuItem component={Link} href="/profile" onClick={handleMenuClose}>
                <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20, color: "#6B7280" }} />
                Profilim
              </MenuItem>
              <MenuItem component={Link} href="/admin" onClick={handleMenuClose}>
                <DashboardIcon sx={{ mr: 1.5, fontSize: 20, color: "#6B7280" }} />
                Admin Panel
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "#EF4444" }}>
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Çıkış Yap
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          transition: "width 0.3s",
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background: "#F9FAFB",
          transition: "width 0.3s, margin 0.3s",
        }}
      >
        <Toolbar sx={{ minHeight: 72 }} />
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
