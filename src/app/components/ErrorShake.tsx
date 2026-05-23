import { motion } from "motion/react";
import { ReactNode } from "react";

interface ErrorShakeProps {
  children: ReactNode;
  shake: boolean;
  onComplete?: () => void;
}

export function ErrorShake({ children, shake, onComplete }: ErrorShakeProps) {
  return (
    <motion.div
      animate={shake ? {
        x: [0, -10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.5 }
      } : {}}
      onAnimationComplete={onComplete}
    >
      {children}
    </motion.div>
  );
}

export function PulseError({ children, error }: { children: ReactNode; error: boolean }) {
  return (
    <motion.div
      animate={error ? {
        scale: [1, 1.02, 1],
        borderColor: ["rgba(239, 68, 68, 0)", "rgba(239, 68, 68, 1)", "rgba(239, 68, 68, 0)"],
        transition: { duration: 0.6, repeat: 2 }
      } : {}}
    >
      {children}
    </motion.div>
  );
}
