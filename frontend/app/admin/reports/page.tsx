"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Grid,
  LinearProgress,
  Divider,
  Button,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  TrendingUp,
  People,
  Gavel,
  EmojiEvents,
  CheckCircle,
  Cancel,
  Schedule,
  Download,
  Print,
  Refresh,
  Category,
  ThumbUp,
  ChatBubble,
  Visibility,
} from "@mui/icons-material";
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
  AreaChart,
  Area,
} from "recharts";
import { usersService, complaintsService, adminService } from "@/app/services/api";
import { getRankLabel, getRankColor, RANK_ORDER } from "@/app/utils/ranks";

const COLORS = ["#1E6E4F", "#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D1"];

interface ReportStats {
  totalUsers: number;
  totalComplaints: number;
  totalEvidences: number;
  totalPoints: number;
  pendingEvidences: number;
  approvedEvidences: number;
  rejectedEvidences: number;
  activeUsers: number;
  newUsersThisMonth: number;
  newComplaintsThisMonth: number;
  resolvedComplaints: number;
}

interface TrendData {
  month: string;
  users: number;
  complaints: number;
  evidences: number;
  points: number;
}

interface RankDistribution {
  rank: string;
  count: number;
  percentage: number;
}

interface CategoryReport {
  name: string;
  count: number;
  percentage: number;
}

interface TopCompany {
  name: string;
  count: number;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats>({
    totalUsers: 0,
    totalComplaints: 0,
    totalEvidences: 0,
    totalPoints: 0,
    pendingEvidences: 0,
    approvedEvidences: 0,
    rejectedEvidences: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    newComplaintsThisMonth: 0,
    resolvedComplaints: 0,
  });
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [rankDistribution, setRankDistribution] = useState<RankDistribution[]>([]);
  const [categoryReport, setCategoryReport] = useState<CategoryReport[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, complaintsRes, adminStatsRes] = await Promise.all([
        usersService.getAll(),
        complaintsService.getAll(1, 500),
        adminService.getStats(),
      ]);

      const users = usersRes.data || [];
      const complaints = complaintsRes.data?.data || complaintsRes.data || [];

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const newUsersThisMonth = users.filter((u: any) => {
        const date = new Date(u.createdAt);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }).length;

      const newComplaintsThisMonth = complaints.filter((c: any) => {
        const date = new Date(c.createdAt);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }).length;

      const activeUsers = users.filter((u: any) => u.points > 0).length;
      const totalPoints = users.reduce((sum: number, u: any) => sum + (u.points || 0), 0);
      const resolvedComplaints = complaints.filter((c: any) => c.status === "resolved").length;

      setStats({
        totalUsers: users.length,
        totalComplaints: complaints.length,
        totalEvidences:
          (adminStatsRes.data?.approvedCount || 0) +
          (adminStatsRes.data?.rejectedCount || 0),
        totalPoints,
        pendingEvidences: adminStatsRes.data?.pendingEvidences || 0,
        approvedEvidences: adminStatsRes.data?.approvedCount || 0,
        rejectedEvidences: adminStatsRes.data?.rejectedCount || 0,
        activeUsers,
        newUsersThisMonth,
        newComplaintsThisMonth,
        resolvedComplaints,
      });

      const monthlyMap: Record<string, TrendData> = {};
      complaints.forEach((c: any) => {
        const date = new Date(c.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyMap[key]) {
          monthlyMap[key] = {
            month: key,
            users: 0,
            complaints: 0,
            evidences: 0,
            points: 0,
          };
        }
        monthlyMap[key].complaints++;
      });

      users.forEach((u: any) => {
        const date = new Date(u.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyMap[key]) {
          monthlyMap[key].users++;
          monthlyMap[key].points += u.points || 0;
        }
      });

      setTrendData(
        Object.values(monthlyMap)
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-6)
          .map((m) => ({
            ...m,
            month: m.month.split("-").reverse().join("/"),
          }))
      );

      const rankCounts: Record<string, number> = {};
      users.forEach((u: any) => {
        rankCounts[u.rank] = (rankCounts[u.rank] || 0) + 1;
      });

      setRankDistribution(
        RANK_ORDER.map((rank) => ({
          rank: getRankLabel(rank),
          count: rankCounts[rank] || 0,
          percentage:
            users.length > 0
              ? Math.round(((rankCounts[rank] || 0) / users.length) * 100)
              : 0,
        }))
      );

      const categoryMap: Record<string, number> = {};
      complaints.forEach((c: any) => {
        const name = c.category?.name || "Diğer";
        categoryMap[name] = (categoryMap[name] || 0) + 1;
      });

      const totalComplaintsCount = complaints.length;
      setCategoryReport(
        Object.entries(categoryMap)
          .map(([name, count]) => ({
            name,
            count,
            percentage:
              totalComplaintsCount > 0
                ? Math.round((count / totalComplaintsCount) * 100)
                : 0,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      );

      const companyMap: Record<string, number> = {};
      complaints.forEach((c: any) => {
        const name = c.companyName || "Bilinmeyen";
        companyMap[name] = (companyMap[name] || 0) + 1;
      });

      setTopCompanies(
        Object.entries(companyMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      );

      setTopUsers(
        [...users]
          .sort((a: any, b: any) => b.points - a.points)
          .slice(0, 10)
      );
    } catch (error) {
      console.error("Report data fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReportData();
  }, [fetchReportData]);

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

  const summaryCards = [
    {
      title: "Toplam Kullanıcı",
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 28 }} />,
      color: "#1E6E4F",
      trend: `+${stats.newUsersThisMonth} bu ay`,
      trendColor: "#10B981",
    },
    {
      title: "Toplam Şikayet",
      value: stats.totalComplaints,
      icon: <Gavel sx={{ fontSize: 28 }} />,
      color: "#7C3AED",
      trend: `+${stats.newComplaintsThisMonth} bu ay`,
      trendColor: "#10B981",
    },
    {
      title: "Çözülen Şikayet",
      value: stats.resolvedComplaints,
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      color: "#10B981",
      trend: `${stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}% oran`,
      trendColor: "#6B7280",
    },
    {
      title: "Toplam Puan",
      value: stats.totalPoints.toLocaleString(),
      icon: <EmojiEvents sx={{ fontSize: 28 }} />,
      color: "#F59E0B",
      trend: "Dağıtıldı",
      trendColor: "#6B7280",
    },
  ];

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
                  background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Raporlar ve İstatistikler
              </Typography>
              <Typography variant="body1" sx={{ color: "#6B7280" }}>
                Platformunuzun detaylı analizini görüntüleyin ve raporlar
                oluşturun
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<Print />}
                size="small"
              >
                Yazdır
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #1E6E4F 0%, #059669 100%)",
                }}
              >
                Dışa Aktar
              </Button>
            </Stack>
          </Stack>
        </motion.div>
      </Box>

      <Grid container spacing={3}>
        {summaryCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
            <motion.div variants={itemVariants}>
              {loading ? (
                <Skeleton variant="rounded" height={140} />
              ) : (
                <Card
                  sx={{
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 4,
                      height: "100%",
                      bgcolor: card.color,
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "#6B7280", mb: 1 }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 800, color: card.color }}
                        >
                          {card.value}
                        </Typography>
                        <Chip
                          label={card.trend}
                          size="small"
                          sx={{
                            mt: 1,
                            bgcolor: `${card.trendColor}15`,
                            color: card.trendColor,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: `${card.color}15`,
                          color: card.color,
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

        <Grid size={{ xs: 12, lg: 8 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Aylık Trend Analizi
                </Typography>
                {loading ? (
                  <Skeleton variant="rounded" height={300} />
                ) : trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E6E4F" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#1E6E4F" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                      </defs>
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
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#1E6E4F"
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                        name="Kullanıcılar"
                      />
                      <Area
                        type="monotone"
                        dataKey="complaints"
                        stroke="#7C3AED"
                        fillOpacity={1}
                        fill="url(#colorComplaints)"
                        name="Şikayetler"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography color="textSecondary">
                      Henüz yeterli veri yok
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
                  <Skeleton variant="circular" height={200} />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Onaylandı", value: stats.approvedEvidences },
                          { name: "Reddedildi", value: stats.rejectedEvidences },
                          { name: "Beklemede", value: stats.pendingEvidences },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#EF4444" />
                        <Cell fill="#F59E0B" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: "#10B981" }} />
                      <Typography variant="body2">Onaylandı</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stats.approvedEvidences}
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: "#EF4444" }} />
                      <Typography variant="body2">Reddedildi</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stats.rejectedEvidences}
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: "#F59E0B" }} />
                      <Typography variant="body2">Beklemede</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stats.pendingEvidences}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Rütbe Dağılımı
                </Typography>
                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} variant="rounded" height={50} />
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {rankDistribution.map((item) => (
                      <Box key={item.rank}>
                        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <EmojiEvents sx={{ color: getRankColor(item.rank), fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.rank}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.count} ({item.percentage}%)
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "#E5E7EB",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: getRankColor(item.rank),
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  En Çok Şikayet Edilen Firmalar
                </Typography>
                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} variant="rounded" height={50} />
                    ))}
                  </Stack>
                ) : topCompanies.length > 0 ? (
                  <Stack spacing={2}>
                    {topCompanies.map((company, index) => (
                      <Box
                        key={company.name}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#F9FAFB",
                          border: "1px solid #E5E7EB",
                        }}
                      >
                        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                bgcolor: COLORS[index % COLORS.length],
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {company.name}
                            </Typography>
                          </Stack>
                          <Chip
                            label={`${company.count} şikayet`}
                            size="small"
                            sx={{
                              bgcolor: `${COLORS[index % COLORS.length]}20`,
                              color: COLORS[index % COLORS.length],
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="textSecondary">
                      Henüz veri yok
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  En Aktif Kullanıcılar (Liderlik Tablosu)
                </Typography>
                {loading ? (
                  <Skeleton variant="rounded" height={300} />
                ) : topUsers.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topUsers.slice(0, 5)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" stroke="#6B7280" fontSize={12} />
                      <YAxis
                        type="category"
                        dataKey="firstName"
                        stroke="#6B7280"
                        fontSize={12}
                        width={100}
                        tickFormatter={(value, index) =>
                          `${topUsers[index]?.firstName} ${topUsers[index]?.lastName?.charAt(0)}.`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="points" fill="#1E6E4F" radius={[0, 4, 4, 0]} name="Puan" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="textSecondary">
                      Henüz kullanıcı yok
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
}
