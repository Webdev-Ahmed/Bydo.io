interface ErrorCardProps {
  message: string;
}

const ErrorCard = ({ message }: ErrorCardProps) => (
  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
    <p className="text-sm text-rose-500/80">{message}</p>
  </div>
);

export default ErrorCard;
