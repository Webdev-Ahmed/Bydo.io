import { motion } from "motion/react";
import type { Filter } from "@/types";

const filtersContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

const filterPillVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

interface FilterPillsProps {
  filter: Filter;
  onChange: (f: Filter) => void;
}

export const FilterPills = ({ filter, onChange }: FilterPillsProps) => (
  <motion.div
    className="flex items-center gap-2 mt-4"
    variants={filtersContainerVariants}
    initial="hidden"
    animate="visible"
  >
    {FILTERS.map(({ label, value }) => (
      <motion.button
        key={value}
        onClick={() => onChange(value)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          filter === value
            ? "bg-primary text-primary-foreground border-primary"
            : "border-text/20 text-text/60 hover:bg-text/10 hover:text-text"
        }`}
        variants={filterPillVariants}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {label}
      </motion.button>
    ))}
  </motion.div>
);
