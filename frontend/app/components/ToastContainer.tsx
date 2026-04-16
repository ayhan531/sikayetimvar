"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Alert, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info",
    ) => {
      const id = Date.now().toString();
      const newToast: ToastMessage = { id, message, type };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <Stack
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{
              opacity: 0,
              x: 400,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
            exit={{
              opacity: 0,
              x: 400,
              scale: 0.8,
              transition: {
                duration: 0.2,
              },
            }}
            style={{
              marginBottom: index > 0 ? 12 : 0,
              pointerEvents: "auto",
            }}
          >
            <Alert
              onClose={() => removeToast(toast.id)}
              severity={
                toast.type === "error"
                  ? "error"
                  : toast.type === "success"
                    ? "success"
                    : toast.type === "warning"
                      ? "warning"
                      : "info"
              }
              sx={{
                width: 360,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
                animation: "slideUp 0.3s ease-out",
              }}
            >
              {toast.message}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </Stack>
  );
};
