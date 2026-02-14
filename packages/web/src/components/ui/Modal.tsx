import type { ReactNode } from "react";
import { useEffect } from "react";

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

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className={`relative w-full ${sizeStyles[size]} bg-neutral-900 border border-neutral-50/10 rounded-2xl shadow-2xl p-6 z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-wide">{title}</h2>
              <button
                onClick={onClose}
                className="text-neutral-50/50 hover:text-neutral-50 transition"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>
            <div className="w-full h-0.5 bg-neutral-50/5 rounded-full mb-6" />
          </>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
