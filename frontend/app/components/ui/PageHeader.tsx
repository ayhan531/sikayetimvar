import { Box, Typography, Stack, StackProps } from '@mui/material';
import { motion } from 'framer-motion';

interface PageHeaderProps extends StackProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  action,
  ...props
}: PageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}
        {...props}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1E6E4F 0%, #059669 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Stack>
    </motion.div>
  );
};
