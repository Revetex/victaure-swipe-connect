
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MessageAnimationProps {
  children: ReactNode;
}

export function MessageAnimation({ children }: MessageAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 w-full"
    >
      {children}
    </motion.div>
  );
}
