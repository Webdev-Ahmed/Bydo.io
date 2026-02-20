// ─── Easing ──────────────────────────────────────────────────────────────────

export const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ─── Generic page-section variants ───────────────────────────────────────────

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const cardFadeVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease },
  },
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease } },
};

// ─── Auth page variants (Login + Register) ────────────────────────────────────

const authEase = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export const authPageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export const authSectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: authEase,
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const authItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: authEase } },
};

export const authFieldsContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const authLogoVariants = {
  hidden: { opacity: 0, scale: 0.75, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 18,
      delay: 0.05,
    },
  },
};

// ─── Todos page variants ──────────────────────────────────────────────────────

export const todosHeaderVariants = {
  hidden: { opacity: 0, y: -20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease },
  },
};

export const todosFormVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease, delay: 0.15 },
  },
};

export const todosProgressVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
};

export const todosEmptyVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export const todosBulkBarVariants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease },
  },
  exit: {
    opacity: 0,
    y: 8,
    filter: "blur(4px)",
    transition: { duration: 0.2 },
  },
};

// ─── TodoItem variants ────────────────────────────────────────────────────────

export const todoItemVariants = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease },
  },
  exit: {
    opacity: 0,
    x: 16,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: "easeIn" as const },
  },
};

export const todoButtonGroupVariants = {
  hidden: { opacity: 0, x: 8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

// ─── Navbar variants ──────────────────────────────────────────────────────────

export const navVariants = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease, delayChildren: 0.3 },
  },
};

export const navLogoVariants = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease },
  },
};

export const navLinkVariants = {
  hidden: { opacity: 0, x: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease },
  },
};

export const navDividerVariants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export const navAuthItemVariants = {
  hidden: { opacity: 0, x: -12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease },
  },
  exit: {
    opacity: 0,
    x: 12,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

export const navGuestItemVariants = {
  hidden: { opacity: 0, x: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease },
  },
  exit: {
    opacity: 0,
    x: -12,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

export const navThemeVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
};

export const mobileMenuVariants = {
  hidden: { opacity: 0, y: -8, filter: "blur(6px)", scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.25,
      ease,
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    scale: 0.97,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

export const mobileItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease } },
};

// ─── Calendar variants ────────────────────────────────────────────────────────

export const dayCellVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.18, ease } },
};
