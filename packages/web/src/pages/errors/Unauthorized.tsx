import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import Button from "@/components/ui/Button";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const codeVariants = {
  hidden: { opacity: 0, y: -40, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 18,
      delay: 0.2,
    },
  },
};

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      <motion.div
        className="flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-[10rem] font-bold leading-none text-primary/10 select-none"
          variants={codeVariants}
        >
          401
        </motion.h1>

        <motion.div
          className="-mt-16 mb-6 p-4 rounded-full bg-primary/10 border border-primary/20"
          variants={iconVariants}
        >
          <Lock className="size-8 text-primary" />
        </motion.div>

        <motion.h2
          className="text-2xl font-semibold mb-2"
          variants={itemVariants}
        >
          Unauthorized
        </motion.h2>

        <motion.p
          className="text-text/50 text-sm max-w-sm mb-8"
          variants={itemVariants}
        >
          You need to be logged in to access this page. Please sign in to
          continue.
        </motion.p>

        <motion.div variants={itemVariants} transition={{ duration: 0.2 }}>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Unauthorized;
