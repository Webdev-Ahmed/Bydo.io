import { registerSchema } from "@todo/shared";
import { useAuthStore } from "@/store/authStore";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { flattenError, ZodError } from "zod";
import Logo from "@/components/ui/Logo";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Link from "@/components/ui/Link";
import { motion, AnimatePresence, useAnimate } from "motion/react";
import {
  authPageVariants,
  authSectionVariants,
  authItemVariants,
  authLogoVariants,
  authFieldsContainerVariants,
} from "@/lib/animations";

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
      const validatedData = registerSchema.parse({ name, email, password });
      await register(validatedData);
      navigate("/");
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(flattenError(err).fieldErrors);
        shake();
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setApiError(
          axiosError.response?.data?.message || "Registration Failed",
        );
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
            Create your new account
          </motion.h1>
          <motion.p
            className="text-sm font-thin text-text/50"
            variants={authItemVariants}
          >
            Welcome! Please enter the details.
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
          <motion.div variants={authFieldsContainerVariants}>
            <motion.div variants={authItemVariants}>
              <Input
                type="text"
                value={name}
                error={errors.name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </motion.div>
            <motion.div className="mt-4" variants={authItemVariants}>
              <Input
                type="email"
                value={email}
                error={errors.email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </motion.div>
            <motion.div className="mt-4" variants={authItemVariants}>
              <Input
                value={password}
                password
                error={errors.password || apiError}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={authItemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring" as const,
              stiffness: 400,
              damping: 20,
            }}
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
                    <span className="ml-2">Creating account..</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="register"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    Register
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
            Already have an account?{" "}
            <Link to="/login" colored>
              Login
            </Link>
          </p>
        </motion.footer>
      </motion.section>
    </motion.main>
  );
};

export default Register;
