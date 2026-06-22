// ─── Easing ──────────────────────────────────────────────────────────────────

export const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const easeOut = [0.0, 0.0, 0.2, 1.0] as [number, number, number, number];

// ─── HOW SPEED WORKS ─────────────────────────────────────────────────────────
// `duration` is intentionally absent from all `visible` transitions.
// MotionConfig in SettingsProvider sets the global duration, and Framer Motion
// merges it with each variant's ease/delay/stagger. Exit transitions keep their
// own short explicit durations so they stay snappy regardless of speed setting.
// Spring variants are unaffected — they use stiffness/damping, not duration.
// Loop animations (e.g. compassNeedleVariants) keep their duration intentionally.
// New variants: just omit `duration` from `visible` and it works automatically.

// ─── Generic page-section variants ───────────────────────────────────────────

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { ease } },
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
    transition: { ease },
  },
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { ease } },
};

// ─── Error pages (401, 403, 404) ─────────────────────────────────────────────

export const errorPageContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const errorPageCodeVariants = {
  hidden: { opacity: 0, y: -40, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ease },
  },
};

export const errorPageItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ease } },
};

// Spring — speed setting does not apply (no duration)
export const errorPageIconVariants = {
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

// Loop animation — duration is intentional, not speed-controlled
export const compassNeedleVariants = {
  animate: {
    rotate: [0, 20, -20, 10, -10, 0],
    transition: {
      duration: 3,
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatDelay: 1.5,
    },
  },
};

// ─── Auth page variants (Login + Register) ────────────────────────────────────

const authEase = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export const authPageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ease: "easeOut" as const },
  },
};

export const authSectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: authEase,
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const authItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { ease: authEase } },
};

export const authFieldsContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// Spring — speed setting does not apply
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

// ─── Home page ────────────────────────────────────────────────────────────────

export const heroLeftVariants = {
  hidden: { opacity: 0, x: -40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { ease },
  },
};

export const heroRightVariants = {
  hidden: { opacity: 0, x: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      ease,
      delay: 0.15,
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

export const tagsLeftContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.6 },
  },
};

export const tagsRightContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.75 },
  },
};

export const tagVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ease },
  },
};

// ─── Todos page variants ──────────────────────────────────────────────────────

export const todosHeaderVariants = {
  hidden: { opacity: 0, y: -20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ease },
  },
};

export const todosFormVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease, delay: 0.1 },
  },
};

export const todosProgressVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { ease } },
};

export const todosEmptyVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: easeOut } },
};

export const todosBulkBarVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease },
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: { duration: 0.15, ease: easeOut },
  },
};

// ─── Filter pills ─────────────────────────────────────────────────────────────

export const filterPillsContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

export const filterPillVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { ease } },
};

// ─── Skeleton list ────────────────────────────────────────────────────────────

export const skeletonItemVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

// ─── TodoItem variants ────────────────────────────────────────────────────────
// Note: opacity here only controls the enter/exit animation.
// Dynamic opacity (dragging, temp) must live on a child element, not this
// motion element — otherwise Framer Motion "owns" opacity and style.opacity
// is silently ignored.

export const todoItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 32,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.18, ease: easeOut },
  },
};

export const todoButtonGroupVariants = {
  hidden: { opacity: 0, x: 8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.12, ease: "easeIn" as const },
  },
};

// ─── Modal ────────────────────────────────────────────────────────────────────

export const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      bounce: 0.4,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export const modalItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      bounce: 0.4,
    },
  },
};

// ─── Calendar picker dropdown ─────────────────────────────────────────────────

export const calendarDropdownVariants = {
  hidden: { opacity: 0, y: -8, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ease },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

// ─── Navbar variants ──────────────────────────────────────────────────────────

export const navVariants = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { ease, delayChildren: 0.15 },
  },
};

export const navLogoVariants = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { ease } },
};

export const navLinkVariants = {
  hidden: { opacity: 0, x: 16, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { ease } },
};

export const navDividerVariants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { ease: "easeOut" as const },
  },
};

export const navAuthItemVariants = {
  hidden: { opacity: 0, x: -12, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { ease } },
  exit: {
    opacity: 0,
    x: 12,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

export const navGuestItemVariants = {
  hidden: { opacity: 0, x: 12, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { ease } },
  exit: {
    opacity: 0,
    x: -12,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

export const navThemeVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { ease } },
};

export const mobileMenuVariants = {
  hidden: { opacity: 0, y: -8, filter: "blur(6px)", scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { ease, staggerChildren: 0.05, delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    scale: 0.97,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

export const mobileItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { ease } },
};

// ─── Calendar page variants ───────────────────────────────────────────────────

export const dayCellVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 380,
      damping: 28,
    },
  },
};

// ─── Command palette ──────────────────────────────────────────────────────────

export const commandPaletteBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18, ease: easeOut } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const commandPaletteVariants = {
  hidden: { opacity: 0, scale: 0.97, y: -8, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 380,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -6,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: easeOut },
  },
};

export const commandPaletteGroupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export const commandPaletteItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { ease } },
};
