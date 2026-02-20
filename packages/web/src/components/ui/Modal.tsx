import type { ReactNode } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Button from "./Button";
import { modalVariants, modalItemVariants } from "@/lib/animations";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/20"
            onClick={onClose}
          />

          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-50 inset-0 flex items-center justify-center px-4 pointer-events-none overflow-hidden"
          >
            <div
              className={`relative w-full ${sizeStyles[size]} bg-background border border-text/10 rounded-2xl shadow-2xl p-6 pointer-events-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <>
                  <motion.div
                    variants={modalItemVariants}
                    className="flex items-center justify-between mb-4"
                  >
                    <h2 className="text-2xl font-semibold tracking-wide">
                      {title}
                    </h2>
                    <Button onClick={onClose} variant="secondary" outline>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={modalItemVariants}
                    className="w-full h-0.5 bg-text/5 rounded-full mb-6"
                  />
                </>
              )}
              <motion.div variants={modalItemVariants}>{children}</motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
