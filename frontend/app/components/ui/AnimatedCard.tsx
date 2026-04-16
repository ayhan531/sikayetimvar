import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { cardVariants } from '@/app/utils/animations';

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedCard = ({
  children,
  delay = 0,
  ...props
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true }}
      variants={cardVariants}
      transition={{ delay }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
};
