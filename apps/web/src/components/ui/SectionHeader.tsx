interface SectionHeaderProps {
  label: string;
  count?: number;
  className?: string;
}

const SectionHeader = ({ label, count, className }: SectionHeaderProps) => (
  <div className={`flex items-center gap-4 ${className ?? ""}`}>
    <span className="text-xs font-semibold uppercase tracking-widest text-text/35 font-serif shrink-0">
      {label}
    </span>
    <div className="flex-1 h-px bg-text/8" />
    {count !== undefined && (
      <span className="text-xs text-text/25 shrink-0">{count}</span>
    )}
  </div>
);

export default SectionHeader;
