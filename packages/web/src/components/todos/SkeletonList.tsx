import { motion } from "motion/react";
import { skeletonItemVariants } from "@/lib/animations";

export const SkeletonList = () => (
  <ul className="flex flex-col">
    {Array.from({ length: 4 }).map((_, i) => (
      <motion.li
        key={i}
        className="flex items-center justify-between gap-4 py-3"
        custom={i}
        variants={skeletonItemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3">
          <div className="size-4 rounded bg-text/10 animate-pulse" />
          <div className="h-4 w-48 rounded bg-text/10 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-14 rounded-full bg-text/10 animate-pulse" />
          <div className="h-8 w-14 rounded-full bg-text/10 animate-pulse" />
        </div>
      </motion.li>
    ))}
  </ul>
);
