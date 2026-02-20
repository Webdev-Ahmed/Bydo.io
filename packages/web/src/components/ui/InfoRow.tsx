interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-text/6 last:border-0">
    <div className="shrink-0 size-8 rounded-xl bg-text/5 flex items-center justify-center">
      <Icon className="size-3.5 text-text/40" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-text/35 mb-0.5">{label}</p>
      <p className="text-sm text-text/80 truncate">{value}</p>
    </div>
  </div>
);

export default InfoRow;
