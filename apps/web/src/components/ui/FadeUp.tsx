import { motion } from "motion/react";
import { ease } from "@/lib/animations";
import type { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const FadeUp = ({ children, delay = 0, className }: FadeUpProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease, delay },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default FadeUp;
