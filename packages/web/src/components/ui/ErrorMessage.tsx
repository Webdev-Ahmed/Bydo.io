interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return <p className="text-red-500 text-sm mt-1">{message}</p>;
};

export default ErrorMessage;
