
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import Settings from "@/components/Settings";
import { NotificationsTab } from "@/components/notifications/NotificationsTab";

interface ContentRouterProps {
  currentPage: number;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
  renderDashboardHome: () => JSX.Element;
}

export function ContentRouter({
  currentPage,
  onEditStateChange,
  onRequestChat,
  renderDashboardHome
}: ContentRouterProps) {
  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const content = (() => {
    switch (currentPage) {
      case 1:
        return <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />;
      case 2:
        return <Messages />;
      case 3:
        return <Marketplace />;
      case 4:
        return <Feed />;
      case 9:
        return <NotificationsTab />;
      case 10:
        return <Settings />;
      default:
        return renderDashboardHome();
    }
  })();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="w-full h-full p-6"
    >
      {content}
    </motion.div>
  );
}
