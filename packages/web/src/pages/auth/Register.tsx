import { registerSchema } from "@todo/shared";
import { useAuthStore } from "@/store/authStore";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { flattenError, ZodError } from "zod";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError("");
    setIsLoading(true);

    try {
      const validatedData = registerSchema.parse({ name, email, password });

      await register(validatedData);
      navigate("/");
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors = flattenError(err).fieldErrors;
        setErrors(fieldErrors);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setApiError(
          axiosError.response?.data?.message || "Registration Failed",
        );
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <div>Register</div>;
};

export default Register;
