import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { Layout, Button, Link } from "@/components/";
import {
  heroLeftVariants,
  heroRightVariants,
  fadeUpVariants,
  tagsLeftContainerVariants,
  tagsRightContainerVariants,
  tagVariants,
} from "@/lib/animations";

const Home = () => {
  const navigator = useNavigate();

  return (
    <Layout className="mt-26">
      <section className="flex sm:flex-row flex-col px-4 justify-between">
        <motion.div
          className="sm:w-[50%] w-full mt-20"
          variants={heroLeftVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="md:text-5xl lg:text-6xl text-4xl lg:leading-20 md:leading-16 font-semibold">
            Clear your mind,{" "}
            <span className="font-serif italic text-primary lg:text-7xl md:text-6xl text-5xl">
              one
            </span>{" "}
            task at a time.
          </h1>
        </motion.div>

        <motion.div
          className="sm:w-[30%] sm:mt-20 w-full mt-10"
          variants={heroRightVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className="text-text/80 text-sm font-medium mb-7"
            variants={fadeUpVariants}
          >
            Turn{" "}
            <span className="font-serif font-bold italic text-base text-primary">
              "someday"
            </span>{" "}
            into today. Our dead-simple interface helps you organize the chaos
            of your to-do list so you can actually start checking things off.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            whileHover={{ x: 4 }}
            whileTap={{ x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to="/todos"
              variant="button-filled"
              className="px-5 py-3 text-lg"
            >
              Get Started!
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="flex flex-wrap gap-2 w-full mt-10 px-4 sm:px-6 justify-between">
        <motion.div
          className="flex flex-wrap gap-2"
          variants={tagsLeftContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="inline-block" variants={tagVariants}>
            <Button outline variant="secondary">
              Transactions
            </Button>
          </motion.span>
          <motion.span className="inline-block" variants={tagVariants}>
            <Button outline variant="secondary">
              Budgets
            </Button>
          </motion.span>
          <motion.span className="inline-block" variants={tagVariants}>
            <Button outline variant="secondary">
              Reminders
            </Button>
          </motion.span>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-2"
          variants={tagsRightContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="inline-block" variants={tagVariants}>
            <Button outline variant="secondary">
              Finances
            </Button>
          </motion.span>
          <motion.span className="inline-block" variants={tagVariants}>
            <Button
              onClick={() => navigator("/todos")}
              outline
              variant="secondary"
            >
              Todos
            </Button>
          </motion.span>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Home;
