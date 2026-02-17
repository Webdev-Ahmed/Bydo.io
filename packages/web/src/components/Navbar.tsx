import { Link as RouterLink } from "react-router-dom";
import { NAV_LINKS } from "../constants";
import Logo from "./ui/Logo";
import Link from "./ui/Link";
import Divider from "./ui/Divider";
import ThemeSelect from "./theme/ThemeSelect";
import { motion } from "motion/react";

const Navbar = () => {
  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        bounce: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
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
    <header className="w-full fixed pointer-events-none top-0 left-0 px-4">
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="lg:max-w-5xl md:max-w-4xl p-3 rounded-full bg-text/5 mx-auto flex items-center justify-between pointer-events-auto backdrop-blur-xl shadow-md shadow-text/5 my-2 border border-text/5"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Logo />
          <RouterLink to="/">
            <h1 className="text-3xl font-semibold">Todoz.io</h1>
          </RouterLink>
        </motion.div>

        <div className="flex items-center justify-center">
          <ul className="flex gap-2">
            {NAV_LINKS.map((link, idx) => (
              <motion.li variants={itemVariants} key={idx}>
                <Link variant="button" to={link.href}>
                  {link.text}
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={itemVariants}>
            <Divider orientation="vertical" />
          </motion.div>

          <ul className="flex gap-2">
            <motion.li variants={itemVariants}>
              <Link outline to="/login" variant="button">
                Sign in
              </Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Link to="/register" variant="button-filled">
                Sign up
              </Link>
            </motion.li>
          </ul>

          <motion.div variants={itemVariants}>
            <Divider orientation="vertical" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ThemeSelect />
          </motion.div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
