import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { AppearanceSection } from "./settings/AppearanceSection";
import { PrivacySection } from "./settings/PrivacySection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { ScrollArea } from "./ui/scroll-area";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { useNavigate } from "react-router-dom";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";
import { AppHeader } from "./navigation/AppHeader";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export function Settings() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(5);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackToHome = () => {
    navigate('/dashboard');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen pb-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background to-background/90" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, #4f4f4f 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, #4f4f4f 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, #4f4f4f 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, #4f4f4f 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>

      <AppHeader 
        title="Paramètres"
        showFriendsList={showFriendsList}
        onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
        isEditing={false}
        onToolReturn={handleBackToHome}
      />

      {showFriendsList && (
        <DashboardFriendsList 
          show={showFriendsList} 
          onClose={() => setShowFriendsList(false)}
        />
      )}

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-2xl mx-auto space-y-8 p-6"
        >
          <motion.div 
            variants={itemVariants} 
            className="space-y-2 bg-background/40 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold tracking-tight">Paramètres</h2>
            <p className="text-muted-foreground">
              Gérez vos préférences et paramètres de compte
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-background/40 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            <AppearanceSection />
          </motion.div>

          <Separator className="bg-foreground/10" />

          <motion.div 
            variants={itemVariants}
            className="bg-background/40 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            <PrivacySection />
          </motion.div>

          <Separator className="bg-foreground/10" />

          <motion.div 
            variants={itemVariants}
            className="bg-background/40 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            <NotificationsSection />
          </motion.div>

          <Separator className="bg-foreground/10" />

          <motion.div 
            variants={itemVariants}
            className="bg-background/40 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            <SecuritySection />
          </motion.div>

          <Separator className="bg-foreground/10" />

          <motion.div variants={itemVariants}>
            <div className="space-y-4 bg-background/40 backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-medium">Utilisateurs bloqués</h3>
              <div className="p-4 rounded-lg bg-muted/30">
                <BlockedUsersSection />
              </div>
            </div>
          </motion.div>

          <Separator className="bg-foreground/10" />

          <motion.div 
            variants={itemVariants}
            className="bg-background/40 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            <LogoutSection />
          </motion.div>
        </motion.div>
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <DashboardNavigation 
          currentPage={currentPage} 
          onPageChange={(page) => {
            setCurrentPage(page);
            if (page !== 5) {
              navigate('/dashboard');
            }
          }}
          isEditing={false}
        />
      </div>
    </div>
  );
}