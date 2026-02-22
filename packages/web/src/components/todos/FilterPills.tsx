import { motion } from "motion/react";
import {
  filterPillsContainerVariants,
  filterPillVariants,
} from "@/lib/animations";
import type { Filter } from "@/types";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

interface FilterPillsProps {
  filter: Filter;
  onChange: (f: Filter) => void;
}

const FilterPills = ({ filter, onChange }: FilterPillsProps) => (
  <motion.div
    className="flex items-center gap-2 mt-4"
    variants={filterPillsContainerVariants}
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

export default FilterPills;
