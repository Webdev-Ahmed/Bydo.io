import { loginSchema } from "@todo/shared";
import { useAuthStore } from "@/store/authStore";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { flattenError, ZodError } from "zod";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError("");
    setIsLoading(true);

    try {
      const validatedData = loginSchema.parse({ email, password });

      await login(validatedData);
      navigate("/");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = flattenError(err).fieldErrors;
        setErrors(fieldErrors);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setApiError(axiosError.response?.data?.message || "Login failed");
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <div>Login</div>;
};

export default Login;
