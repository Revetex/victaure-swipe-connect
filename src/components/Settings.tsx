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
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function Settings() {
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { title: "Apparence", component: AppearanceSection },
    { title: "Confidentialité", component: PrivacySection },
    { title: "Notifications", component: NotificationsSection },
    { title: "Sécurité", component: SecuritySection },
    { title: "Utilisateurs bloqués", component: BlockedUsersSection },
    { title: "Déconnexion", component: LogoutSection }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const nextSection = () => {
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const previousSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-8 p-6"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">
            {sections[currentSection].title}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <CurrentSectionComponent />
        </motion.div>

        <Separator />

        <motion.div variants={itemVariants} className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={previousSection}
            disabled={currentSection === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>
          <Button
            variant="outline"
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="flex items-center gap-2"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </ScrollArea>
  );
}