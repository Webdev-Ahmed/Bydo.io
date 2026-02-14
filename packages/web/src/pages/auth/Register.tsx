import { registerSchema } from "@todo/shared";
import { useAuthStore } from "@/store/authStore";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { flattenError, ZodError } from "zod";
import FormContainer from "@/components/ui/FormContainer";
import Input from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Button from "@/components/ui/Button";

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

  return (
    <FormContainer title="Register">
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
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
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="mt-4 text-center text-neutral-50/50">
        Already have an account?{" "}
        <Link to="/login" className="text-pink-500 hover:underline">
          Login
        </Link>
      </p>
    </FormContainer>
  );
};

export default Register;
