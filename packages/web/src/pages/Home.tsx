import Modal from "@/components/ui/Modal";
import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import Link from "../components/ui/Link";
import { motion } from "motion/react";
import { useState } from "react";

const Home = () => {
  const [open, setOpen] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        type: "spring" as const,
        bounce: 0.5,
      },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        bounce: 0.5,
      },
    },
  };

  return (
    <Layout className="mt-26">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex sm:flex-row flex-col px-4 justify-between"
      >
        <motion.div variants={itemVariants} className="sm:w-[50%] w-ful mt-20">
          <h1 className="md:text-5xl lg:text-6xl text-4xl lg:leading-20 md:leading-16">
            Clear your mind, one task at a time.
          </h1>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="sm:w-[30%] sm:mt-20 w-full mt-10"
        >
          <p className="text-text/80 text-sm font-medium mb-7">
            Turn <span className="font-serif font-bold italic">"someday"</span>{" "}
            into today. Our dead-simple interface helps you organize the chaos
            of your to-do list so you can actually start checking things off.
          </p>

          <Link
            to="/register"
            variant="button-filled"
            className="px-5 py-3 text-lg"
          >
            Get Started!
          </Link>
        </motion.div>
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-2 w-full h-10 mt-10 px-4 justify-between"
      >
        <motion.div variants={buttonContainerVariants} className="space-x-2">
          <motion.span variants={buttonVariants} className="inline-block">
            <Button outline variant="secondary">
              Transactions
            </Button>
          </motion.span>
          <motion.span variants={buttonVariants} className="inline-block">
            <Button outline variant="secondary">
              Budgets
            </Button>
          </motion.span>
          <motion.span variants={buttonVariants} className="inline-block">
            <Button outline variant="secondary">
              Reminders
            </Button>
          </motion.span>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                staggerDirection: -1,
              },
            },
          }}
          className="space-x-2"
        >
          <motion.span variants={buttonVariants} className="inline-block">
            <Button outline variant="secondary">
              Finances
            </Button>
          </motion.span>
          <motion.span variants={buttonVariants} className="inline-block">
            <Button outline variant="secondary">
              Todos
            </Button>
          </motion.span>
        </motion.div>
      </motion.section>

      <Button onClick={() => setOpen(true)}>Open Modal</Button>

      <Modal isOpen={open} title="slkdj" onClose={() => setOpen(false)}>
        <div>sdlkfj</div>
      </Modal>
    </Layout>
  );
};

export default Home;
