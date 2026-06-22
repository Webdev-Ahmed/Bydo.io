import { loginSchema } from "@bydo-io/shared";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { flattenError, ZodError } from "zod";
import { motion, AnimatePresence, useAnimate } from "motion/react";

import { Divider, Button, Input, Link, Spinner, Logo } from "@/components/";
import { useAuthStore } from "@/store/authStore";
import {
  authPageVariants,
  authSectionVariants,
  authLogoVariants,
  authItemVariants,
} from "@/lib/animations";

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
  const [formScope, formAnimate] = useAnimate();

  const shake = () =>
    formAnimate(
      formScope.current,
      { x: [0, -10, 10, -8, 8, -4, 4, 0] },
      { duration: 0.5, ease: "easeInOut" },
    );

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
        setErrors(flattenError(err).fieldErrors);
        shake();
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setApiError(axiosError.response?.data?.message || "Login failed");
        shake();
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main
      className="flex flex-col justify-center items-center w-full min-h-screen"
      variants={authPageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        className="p-6 max-w-lg w-full rounded-2xl"
        variants={authSectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header
          className="flex flex-col items-center"
          variants={authItemVariants}
        >
          <motion.div variants={authLogoVariants}>
            <Logo />
          </motion.div>
          <motion.h1
            className="sm:text-4xl text-2xl font-medium sm:my-4 my-3"
            variants={authItemVariants}
          >
            Log in to your account
          </motion.h1>
          <motion.p
            className="text-sm font-thin text-text/50"
            variants={authItemVariants}
          >
            Welcome back! Please enter your details.
          </motion.p>
        </motion.header>

        <motion.div variants={authItemVariants}>
          <Divider />
        </motion.div>

        <motion.form
          ref={formScope}
          className="space-y-4"
          onSubmit={handleSubmit}
          variants={authItemVariants}
        >
          <motion.div variants={authItemVariants}>
            <Input
              type="email"
              value={email}
              error={errors.email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </motion.div>
          <motion.div variants={authItemVariants}>
            <Input
              value={password}
              password
              error={errors.password || apiError}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </motion.div>
          <motion.div
            variants={authItemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              className="px-6 flex items-center justify-center w-full"
              disabled={isLoading}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLoading ? (
                  <motion.span
                    key="loading"
                    className="flex items-center"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Spinner variant="secondary" size="sm" />
                    <span className="ml-2">Logging in..</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="login"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    Login
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.form>

        <motion.div variants={authItemVariants}>
          <Divider />
        </motion.div>

        <motion.footer className="text-center" variants={authItemVariants}>
          <p className="text-text/80">
            Don't have an account?{" "}
            <Link to="/register" colored>
              Register
            </Link>
          </p>
        </motion.footer>
      </motion.section>
    </motion.main>
  );
};

export default Login;
