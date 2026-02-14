import { loginSchema } from "@todo/shared";
import { useAuthStore } from "@/store/authStore";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { flattenError, ZodError } from "zod";
import FormContainer from "@/components/ui/FormContainer";
import Input from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Button from "@/components/ui/Button";

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

  return (
    <FormContainer title="Login">
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          error={errors.email}
        />

        <div className="mb-6">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            error={errors.password}
          />
          <ErrorMessage message={apiError} />
        </div>

        <Button type="submit" disabled={isLoading} variant="primary" fullWidth>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="mt-4 text-center text-neutral-50/50">
        Don't have an account?{" "}
        <Link to="/register" className="text-pink-500 hover:underline">
          Register
        </Link>
      </p>
    </FormContainer>
  );
};

export default Login;
