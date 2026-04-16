import { Box, Skeleton, Stack } from '@mui/material';
import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      <Skeleton variant="text" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" />
    </Box>
  </motion.div>
);

export const CardSkeletonList = ({ count = 3 }: { count?: number }) => (
  <Stack spacing={2}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </Stack>
);

export const StatCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" />
    </Box>
  </motion.div>
);

export const StatCardSkeletonList = ({ count = 4 }: { count?: number }) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
    {Array.from({ length: count }).map((_, i) => (
      <Box key={i} sx={{ flex: 1 }}>
        <StatCardSkeleton />
      </Box>
    ))}
  </Stack>
);
