interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  loading?: boolean;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  loading = false,
}: StatCardProps) => (
  <div className="rounded-2xl border border-text/8 bg-text/2 p-4">
    <div className="size-7 rounded-xl bg-text/5 flex items-center justify-center mb-3">
      <Icon className="size-3.5 text-text/40" />
    </div>
    <p className="text-2xl font-semibold">{loading ? "—" : value}</p>
    <p className="text-xs text-text/35 mt-0.5">{label}</p>
  </div>
);

export default StatCard;
