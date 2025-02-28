
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonWithTooltip } from "@/components/ui/button-with-tooltip";
import { UserCog, FileText, UserPlus, Briefcase, Newspaper, MessageSquare, Activity, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export interface QuickActionsProps {
  onRequestChat?: () => void;
}

export function QuickActions({ onRequestChat }: QuickActionsProps) {
  const navigate = useNavigate();

  const handleChatClick = () => {
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate("/chat");
    }
  };

  const actions = [
    {
      icon: UserCog,
      label: "Profil",
      onClick: () => navigate("/settings"),
      tooltip: "Mettre à jour vos informations personnelles",
      color: "#64B5D9"
    },
    {
      icon: FileText,
      label: "CV",
      onClick: () => navigate("/cv"),
      tooltip: "Créer ou mettre à jour votre CV",
      color: "#9b87f5"
    },
    {
      icon: UserPlus,
      label: "Réseau",
      onClick: () => navigate("/connections"),
      tooltip: "Gérer vos connexions professionnelles",
      color: "#F97316"
    },
    {
      icon: Briefcase,
      label: "Emplois",
      onClick: () => navigate("/jobs"),
      tooltip: "Parcourir les offres d'emploi",
      color: "#0EA5E9"
    },
    {
      icon: MessageSquare,
      label: "Assistant",
      onClick: handleChatClick,
      tooltip: "Discuter avec l'assistant",
      color: "#8B5CF6"
    },
    {
      icon: Newspaper,
      label: "Articles",
      onClick: () => navigate("/articles"),
      tooltip: "Lire les derniers articles professionnels",
      color: "#F97316"
    },
    {
      icon: Activity,
      label: "Activité",
      onClick: () => navigate("/dashboard"),
      tooltip: "Voir votre activité récente",
      color: "#64B5D9"
    },
    {
      icon: Star,
      label: "Favoris",
      onClick: () => navigate("/favorites"),
      tooltip: "Accéder à vos favoris",
      color: "#9b87f5"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Card className="bg-gradient-to-br from-[#1A1F2C]/90 to-[#1B2A4A]/80 backdrop-blur-md border-white/5 shadow-lg h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-white/90 tracking-normal flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gradient-to-b from-[#64B5D9] to-[#9b87f5] rounded-full"></span>
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="grid grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {actions.map((action, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ButtonWithTooltip
                variant="ghost"
                className="w-full h-auto flex flex-col items-center justify-center gap-2 p-3 hover:bg-white/5 rounded-lg transition-all duration-200 text-white/80 hover:text-white"
                onClick={action.onClick}
                tooltip={action.tooltip}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1A1F2C]/60 border border-white/5">
                  <action.icon className="h-5 w-5" style={{ color: action.color }} />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </ButtonWithTooltip>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
