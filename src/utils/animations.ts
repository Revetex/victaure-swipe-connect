import { type MotionProps } from "framer-motion";

export const fadeInUpProps: MotionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const scaleInProps: MotionProps = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { 
    duration: 0.8,
    type: "spring",
    stiffness: 200,
    damping: 20
  }
};

export const buttonHoverProps: MotionProps = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 }
};