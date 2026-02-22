import { useState } from "react";
import { Menu, X, Search, CommandIcon } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { NAV_LINKS } from "@/constants";
import { Logo, Link, Divider, ThemeSelect } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { useCommandPalette } from "@/store/commandPaletteStore";
import {
  navVariants,
  navLogoVariants,
  navLinkVariants,
  navDividerVariants,
  navAuthItemVariants,
  navGuestItemVariants,
  navThemeVariants,
  mobileMenuVariants,
  mobileItemVariants,
} from "@/lib/animations";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { open: openPalette } = useCommandPalette();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="w-svw fixed pointer-events-none top-0 left-0 px-4 z-50">
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="lg:max-w-5xl md:max-w-4xl p-3 rounded-full bg-text/5 mx-auto flex items-center justify-between pointer-events-auto backdrop-blur-xl shadow-md shadow-text/5 my-2 border border-text/5"
      >
        <motion.div
          variants={navLogoVariants}
          className="flex items-center gap-3"
        >
          <Logo rounded />
          <RouterLink to="/" onClick={closeMobile}>
            <h1 className="text-3xl font-bold font-serif">Bydo.io</h1>
          </RouterLink>
        </motion.div>

        <div className="hidden md:flex items-center justify-center">
          <ul className="flex gap-2">
            {NAV_LINKS.map((link, idx) => (
              <motion.li variants={navLinkVariants} key={idx}>
                <Link variant="button" to={link.href}>
                  {link.text}
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={navDividerVariants} style={{ originY: "50%" }}>
            <Divider orientation="vertical" />
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            {isAuthenticated ? (
              <motion.ul
                key="authenticated"
                className="flex gap-2"
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ staggerChildren: 0.06 }}
              >
                <motion.li variants={navAuthItemVariants}>
                  <Link to="/user" outline variant="button">
                    User
                  </Link>
                </motion.li>
                <motion.li variants={navAuthItemVariants}>
                  <Link
                    to="/login"
                    onClick={handleLogout}
                    variant="button-filled"
                  >
                    Logout
                  </Link>
                </motion.li>
              </motion.ul>
            ) : (
              <motion.ul
                key="guest"
                className="flex gap-2"
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ staggerChildren: 0.06 }}
              >
                <motion.li variants={navGuestItemVariants}>
                  <Link outline variant="button" to="/login">
                    Sign in
                  </Link>
                </motion.li>
                <motion.li variants={navGuestItemVariants}>
                  <Link outline variant="button-filled" to="/register">
                    Sign up
                  </Link>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>

          <motion.div variants={navDividerVariants} style={{ originY: "50%" }}>
            <Divider orientation="vertical" />
          </motion.div>

          <motion.div
            variants={navThemeVariants}
            className="flex items-center gap-2"
          >
            <motion.button
              onClick={openPalette}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-text/10 rounded-full text-text/60 hover:text-text/70 hover:bg-text/8 transition-colors"
              whileTap={{ scale: 0.93 }}
              transition={{ duration: 0.12 }}
              aria-label="Search"
            >
              <Search className="size-3.5" />
              <span className="text-sm text-text/60">Search</span>
              <kbd className="text-sm flex items-center gap-0.5 font-mono text-text/40 bg-text/5 px-1.5 rounded-lg border border-text/5">
                <span>
                  <CommandIcon className="size-3" />
                </span>
                <span>K</span>
              </kbd>
            </motion.button>

            <ThemeSelect />
          </motion.div>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeSelect />

          <motion.button
            onClick={() => setMobileOpen((p) => !p)}
            className="p-2 rounded-full text-text/60 hover:text-text hover:bg-text/8 transition-colors"
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="size-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="size-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden lg:max-w-5xl md:max-w-4xl mx-auto mt-1 rounded-2xl bg-text/5 backdrop-blur-xl border border-text/5 shadow-md shadow-text/5 pointer-events-auto overflow-hidden"
          >
            <div className="flex flex-col p-2 gap-1">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={idx}
                  variants={mobileItemVariants}
                  className="w-full"
                >
                  <Link
                    variant="button"
                    to={link.href}
                    onClick={closeMobile}
                    className="flex w-full justify-start"
                  >
                    {link.text}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={mobileItemVariants}
                className="my-1.5 h-px bg-text/8"
              />

              <AnimatePresence mode="wait" initial={false}>
                {isAuthenticated ? (
                  <motion.div
                    key="auth-mobile"
                    className="flex flex-col gap-1"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.05 } },
                    }}
                  >
                    <motion.div
                      variants={mobileItemVariants}
                      className="w-full"
                    >
                      <Link
                        to="/user"
                        outline
                        variant="button"
                        onClick={closeMobile}
                        className="flex w-full justify-start"
                      >
                        User
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={mobileItemVariants}
                      className="w-full"
                    >
                      <Link
                        to="/login"
                        onClick={handleLogout}
                        variant="button-filled"
                        className="flex w-full justify-start"
                      >
                        Logout
                      </Link>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="guest-mobile"
                    className="flex flex-col gap-0.5"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.05 } },
                    }}
                  >
                    <motion.div
                      variants={mobileItemVariants}
                      className="w-full"
                    >
                      <Link
                        outline
                        variant="button"
                        to="/login"
                        onClick={closeMobile}
                        className="flex w-full justify-start"
                      >
                        Sign in
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={mobileItemVariants}
                      className="w-full"
                    >
                      <Link
                        outline
                        variant="button-filled"
                        to="/register"
                        onClick={closeMobile}
                        className="flex w-full justify-start"
                      >
                        Sign up
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
