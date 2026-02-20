import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Compass } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  errorPageContainerVariants,
  errorPageCodeVariants,
  errorPageItemVariants,
  errorPageIconVariants,
  compassNeedleVariants,
} from "@/lib/animations";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      <motion.div
        className="flex flex-col items-center text-center"
        variants={errorPageContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-[10rem] font-bold leading-none text-primary/10 select-none"
          variants={errorPageCodeVariants}
        >
          404
        </motion.h1>

        <motion.div
          className="-mt-16 mb-6 p-4 rounded-full bg-primary/10 border border-primary/20"
          variants={errorPageIconVariants}
        >
          <motion.div variants={compassNeedleVariants} animate="animate">
            <Compass className="size-8 text-primary" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-2xl font-semibold mb-2"
          variants={errorPageItemVariants}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          className="text-text/50 text-sm max-w-sm mb-8"
          variants={errorPageItemVariants}
        >
          Looks like this page doesn't exist or was moved. Double-check the URL
          or head back home.
        </motion.p>

        <motion.div variants={errorPageItemVariants}>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default NotFound;
