
import { motion } from "framer-motion";
import { AppearanceSection } from "./AppearanceSection";
import { NotificationsSection } from "./NotificationsSection";
import { PrivacySection } from "./PrivacySection";
import { SecuritySection } from "./SecuritySection";
import { BlockedUsersSection } from "./BlockedUsersSection";
import { LogoutSection } from "./LogoutSection";

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

const settingsSections = [
  { id: 'appearance', Component: AppearanceSection },
  { id: 'notifications', Component: NotificationsSection },
  { id: 'privacy', Component: PrivacySection },
  { id: 'security', Component: SecuritySection },
  { id: 'blocked', Component: BlockedUsersSection },
  { id: 'logout', Component: LogoutSection }
];

export function SettingsSections() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        },
        exit: { opacity: 0 }
      }}
      className="container mx-auto px-4 py-6 space-y-4 max-w-xl"
    >
      {settingsSections.map(({ id, Component }, index) => (
        <motion.div
          key={id}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: index * 0.1 }}
          className="bg-card/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Component />
        </motion.div>
      ))}
    </motion.div>
  );
}
