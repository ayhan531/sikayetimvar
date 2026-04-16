"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Divider,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  People,
  Gavel,
  VerifiedUser,
  EmojiEvents,
  ArrowForward,
  Visibility,
  Favorite,
  ChatBubble,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material";
import { adminService, usersService, complaintsService } from "@/app/services/api";
import { getRankLabel, getRankColor } from "@/app/utils/ranks";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DashboardStats {
  totalUsers: number;
  totalComplaints: number;
  totalEvidences: number;
  pendingEvidences: number;
  approvedEvidences: number;
  rejectedEvidences: number;
  totalPoints: number;
}

interface RecentActivity {
  id: number;
  type: "complaint" | "evidence" | "user";
  message: string;
  time: string;
  user?: string;
}

interface TopUser {
  id: number;
  firstName: string;
  lastName: string;
  rank: string;
  points: number;
  complaintCount: number;
}

interface CategoryStat {
  name: string;
  count: number;
}

interface MonthlyStat {
  month: string;
  complaints: number;
  users: number;
  evidences: number;
}

const COLORS = ["#1E6E4F", "#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D1"];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalComplaints: 0,
    totalEvidences: 0,
    pendingEvidences: 0,
    approvedEvidences: 0,
    rejectedEvidences: 0,
    totalPoints: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, complaintsRes, adminStatsRes] = await Promise.all([
        usersService.getAll(),
        complaintsService.getAll(1, 100),
        adminService.getStats(),
      ]);

      const users = usersRes.data || [];
      const complaints = complaintsRes.data?.data || complaintsRes.data || [];

      setStats({
        totalUsers: users.length,
        totalComplaints: complaintsRes.data?.total || complaints.length,
        totalEvidences: adminStatsRes.data?.totalEvidences || 0,
        pendingEvidences: adminStatsRes.data?.pendingEvidences || 0,
        approvedEvidences: adminStatsRes.data?.approvedCount || 0,
        rejectedEvidences: adminStatsRes.data?.rejectedCount || 0,
        totalPoints: users.reduce((sum: number, u: any) => sum + (u.points || 0), 0),
      });

      const rankedUsers = [...users]
        .sort((a: any, b: any) => b.points - a.points)
        .slice(0, 5)
        .map((u: any) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          rank: u.rank,
          points: u.points,
          complaintCount: complaints.filter((c: any) => c.user?.id === u.id).length,
        }));
      setTopUsers(rankedUsers);

      const categoryMap: Record<string, number> = {};
      complaints.forEach((c: any) => {
        const name = c.category?.name || "Diğer";
        categoryMap[name] = (categoryMap[name] || 0) + 1;
      });
      setCategoryStats(
        Object.entries(categoryMap)
          .map(([name, count]) => ({ name, count }))
          .slice(0, 6)
      );

      const monthlyMap: Record<string, MonthlyStat> = {};
      complaints.forEach((c: any) => {
        const date = new Date(c.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyMap[key]) {
          monthlyMap[key] = {
            month: key,
            complaints: 0,
            users: 0,
            evidences: 0,
          };
        }
        monthlyMap[key].complaints++;
      });
      setMonthlyStats(
        Object.values(monthlyMap)
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-6)
          .map((m) => ({
            ...m,
            month: m.month.split("-").reverse().join("/"),
          }))
      );

      const activities: RecentActivity[] = complaints.slice(0, 5).map((c: any) => ({
        id: c.id,
        type: "complaint" as const,
        message: `Yeni şikayet: ${c.title?.substring(0, 40)}...`,
        time: new Date(c.createdAt).toLocaleDateString("tr-TR"),
        user: `${c.user?.firstName} ${c.user?.lastName}`,
      }));
      setRecentActivity(activities);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  const statCards = [
    {
      title: "Toplam Kullanıcı",
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 28 }} />,
      color: "#1E6E4F",
      bgGradient: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
      trend: "+12%",
      href: "/admin/users",
    },
    {
      title: "Toplam Şikayet",
      value: stats.totalComplaints,
      icon: <Gavel sx={{ fontSize: 28 }} />,
      color: "#7C3AED",
      bgGradient: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
      trend: "+8%",
      href: "/admin/complaints",
    },
    {
      title: "Onay Bekleyen",
      value: stats.pendingEvidences,
      icon: <Schedule sx={{ fontSize: 28 }} />,
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      trend: "Acil",
      href: "/admin/evidence",
    },
    {
      title: "Toplam Puan",
      value: stats.totalPoints,
      icon: <EmojiEvents sx={{ fontSize: 28 }} />,
      color: "#10B981",
      bgGradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      trend: "Dağıtıldı",
      href: "/admin/reports",
    },
  ];

  const evidenceStats = [
    {
      label: "Onaylandı",
      value: stats.approvedEvidences,
      color: "#10B981",
      icon: <CheckCircle sx={{ fontSize: 20 }} />,
    },
    {
      label: "Reddedildi",
      value: stats.rejectedEvidences,
      color: "#EF4444",
      icon: <Cancel sx={{ fontSize: 20 }} />,
    },
    {
      label: "Beklemede",
      value: stats.pendingEvidences,
      color: "#F59E0B",
      icon: <Schedule sx={{ fontSize: 20 }} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            Platformunuzun genel durumunu ve son aktiviteleri görüntüleyin
          </Typography>
        </motion.div>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
            <motion.div variants={itemVariants}>
              {loading ? (
                <Skeleton variant="rounded" height={140} />
              ) : (
                <Card
                  component={Link}
                  href={card.href}
                  sx={{
                    height: "100%",
                    background: card.bgGradient,
                    color: "#fff",
                    textDecoration: "none",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    },
                    transition: "all 0.3s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -50,
                      right: -50,
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ position: "relative", zIndex: 1 }}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.9, mb: 1 }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {card.value.toLocaleString("tr-TR")}
                        </Typography>
                        <Chip
                          label={card.trend}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.2)",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.15)",
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <motion.div variants={itemVariants}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Şikayet Trendi
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      Aylık şikayet sayısı
                    </Typography>
                  </Box>
                </Stack>

                {loading ? (
                  <Skeleton variant="rounded" height={300} />
                ) : monthlyStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: 8,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="complaints"
                        stroke="#1E6E4F"
                        strokeWidth={3}
                        dot={{ fill: "#1E6E4F", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: "#059669" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="textSecondary">
                      Henüz veri yok
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <motion.div variants={itemVariants}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Kanıt Durumu
                </Typography>

                {loading ? (
                  <Skeleton variant="rounded" height={200} />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={evidenceStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="label"
                        >
                          {evidenceStats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <Stack spacing={2} sx={{ mt: 2 }}>
                      {evidenceStats.map((stat) => (
                        <Stack
                          key={stat.label}
                          direction="row"
                          sx={{ alignItems: "center", justifyContent: "space-between" }}
                        >
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: stat.color,
                              }}
                            />
                            <Typography variant="body2">{stat.label}</Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {stat.value}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Son Aktiviteler
                  </Typography>
                  <Button
                    component={Link}
                    href="/admin/complaints"
                    endIcon={<ArrowForward />}
                    size="small"
                  >
                    Tümünü Gör
                  </Button>
                </Stack>

                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} variant="rounded" height={60} />
                    ))}
                  </Stack>
                ) : recentActivity.length > 0 ? (
                  <Stack spacing={2}>
                    {recentActivity.map((activity) => (
                      <Box
                        key={activity.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#F9FAFB",
                          border: "1px solid #E5E7EB",
                          "&:hover": {
                            borderColor: "#1E6E4F",
                            bgcolor: "#F0FDF4",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              {activity.message}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              {activity.user && (
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6B7280" }}
                                >
                                  {activity.user}
                                </Typography>
                              )}
                              <Typography
                                variant="caption"
                                sx={{ color: "#9CA3AF" }}
                              >
                                • {activity.time}
                              </Typography>
                            </Stack>
                          </Box>
                          <Chip
                            label={
                              activity.type === "complaint" ? "Şikayet" : "Diğer"
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                activity.type === "complaint"
                                  ? "#EEF2FF"
                                  : "#F3F4F6",
                              color:
                                activity.type === "complaint"
                                  ? "#4F46E5"
                                  : "#6B7280",
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: "center",
                    }}
                  >
                    <Typography color="textSecondary">
                      Henüz aktivite yok
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    En Aktif Kullanıcılar
                  </Typography>
                  <Button
                    component={Link}
                    href="/admin/users"
                    endIcon={<ArrowForward />}
                    size="small"
                  >
                    Tümünü Gör
                  </Button>
                </Stack>

                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} variant="rounded" height={70} />
                    ))}
                  </Stack>
                ) : topUsers.length > 0 ? (
                  <Stack spacing={2}>
                    {topUsers.map((user, index) => (
                      <Box
                        key={user.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#F9FAFB",
                          border: "1px solid #E5E7EB",
                          "&:hover": {
                            borderColor: "#1E6E4F",
                            bgcolor: "#F0FDF4",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ alignItems: "center" }}
                        >
                          <Typography
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              bgcolor:
                                index === 0
                                  ? "#F59E0B"
                                  : index === 1
                                  ? "#9CA3AF"
                                  : index === 2
                                  ? "#CD7F32"
                                  : "#E5E7EB",
                              color:
                                index < 3 ? "#fff" : "#6B7280",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                            }}
                          >
                            {index + 1}
                          </Typography>

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

                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#6B7280" }}>
                              {user.complaintCount} şikayet •{" "}
                              {getRankLabel(user.rank)}
                            </Typography>
                          </Box>

                          <Chip
                            icon={<EmojiEvents sx={{ fontSize: "16px !important" }} />}
                            label={`${user.points} puan`}
                            size="small"
                            sx={{
                              bgcolor: alpha(getRankColor(user.rank), 0.1),
                              color: getRankColor(user.rank),
                              fontWeight: 600,
                              "& .MuiChip-icon": {
                                color: getRankColor(user.rank),
                              },
                            }}
                          />
                        </Stack>

                        <Box sx={{ mt: 1.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((user.points / 200) * 100, 100)}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              bgcolor: "#E5E7EB",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: getRankColor(user.rank),
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: "center",
                    }}
                  >
                    <Typography color="textSecondary">
                      Henüz kullanıcı yok
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {categoryStats.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Kategori Dağılımı
                  </Typography>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: 8,
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#1E6E4F"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </motion.div>
  );
}

function alpha(color: string, opacity: number) {
  return color + Math.round(opacity * 255).toString(16).padStart(2, "0");
}
