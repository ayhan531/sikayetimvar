import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { itemVariants } from '@/app/utils/animations';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  delay?: number;
  subtitle?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  color = 'primary',
  delay = 0,
  subtitle,
}: StatCardProps) => {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={itemVariants}
      transition={{ delay }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${
            color === 'primary'
              ? '#1E6E4F'
              : color === 'secondary'
                ? '#059669'
                : color === 'success'
                  ? '#10b981'
                  : color === 'warning'
                    ? '#f59e0b'
                    : '#06b6d4'
          } 0%, ${
            color === 'primary'
              ? '#145C3F'
              : color === 'secondary'
                ? '#047857'
                : color === 'success'
                  ? '#059669'
                  : color === 'warning'
                    ? '#d97706'
                    : '#0891b2'
          } 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
              {icon && (
                <Box
                  sx={{
                    fontSize: 28,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {icon}
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {title}
                </Typography>
              </Box>
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};
