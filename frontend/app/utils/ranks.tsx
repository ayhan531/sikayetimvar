import React from "react";
import {
  Spa as SproutIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  MilitaryTech as CrownIcon,
} from "@mui/icons-material";

export type RankKey = 'Recruit' | 'Officer' | 'Manager' | 'Director';

export const RANK_LABELS: Record<string, string> = {
  Recruit: 'Acemi',
  Officer: 'Memur',
  Manager: 'Müdür',
  Director: 'Direktör',
};

export const RANK_COLORS: Record<string, string> = {
  Recruit: '#6B7280',
  Officer: '#06B6D4',
  Manager: '#F59E0B',
  Director: '#EF4444',
};

export const RANK_ICONS: Record<string, React.ReactNode> = {
  Recruit: <SproutIcon sx={{ fontSize: 20, color: "#6B7280" }} />,
  Officer: <StarIcon sx={{ fontSize: 20, color: "#06B6D4" }} />,
  Manager: <TrophyIcon sx={{ fontSize: 20, color: "#F59E0B" }} />,
  Director: <CrownIcon sx={{ fontSize: 20, color: "#EF4444" }} />,
};

export const RANK_DESCRIPTIONS: Record<string, string> = {
  Recruit: 'Yeni başlayan kullanıcı — şikayet yazma ve kanıt yükleme',
  Officer: 'Aktif kullanıcı — kanıt onaylamaya başlayabilir',
  Manager: 'Deneyimli yönetici — gelişmiş admin özellikleri',
  Director: 'Üst düzey yönetici — tam kontrol ve raporlama',
};

export const RANK_THRESHOLDS: Record<string, { min: number; max: number }> = {
  Recruit: { min: 0, max: 10 },
  Officer: { min: 11, max: 50 },
  Manager: { min: 51, max: 150 },
  Director: { min: 151, max: Infinity },
};

export const RANK_ORDER: string[] = ['Recruit', 'Officer', 'Manager', 'Director'];

export const MIN_POINTS_FOR_COMPLAINTS = 5;

export const getRankLabel = (rank: string): string => RANK_LABELS[rank] ?? rank;
export const getRankColor = (rank: string): string => RANK_COLORS[rank] ?? '#6B7280';
export const getRankIcon = (rank: string): React.ReactNode => RANK_ICONS[rank] ?? RANK_ICONS.Recruit;
export const getRankDescription = (rank: string): string => RANK_DESCRIPTIONS[rank] ?? '';
