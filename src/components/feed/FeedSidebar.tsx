
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { BlockedUsersSection } from "@/components/settings/BlockedUsersSection";
import { LogoutSection } from "@/components/settings/LogoutSection";
import { ConnectionsSection } from "@/components/feed/friends/ConnectionsSection";
import { motion } from "framer-motion";
import { ToolsList } from "./sidebar/ToolsList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, UserCircle } from "lucide-react";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
    navigate('/tools');
  };

  const marketingFeatures = [
    {
      icon: Shield,
      title: "Sécurité Renforcée",
      description: "Protection maximale de vos données"
    },
    {
      icon: Lock,
      title: "Confidentialité",
      description: "Contrôle total de votre visibilité"
    },
    {
      icon: UserCircle,
      title: "Profil Professionnel",
      description: "Image de marque optimisée"
    }
  ];

  return (
    <div 
      className={cn(
        "w-full h-full bg-background/95 backdrop-blur-sm border-r border-border/50",
        "relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/5 via-gray-50/10 to-gray-50/5 dark:from-gray-900/10 dark:via-gray-900/20 dark:to-gray-900/10 pointer-events-none" />
      
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Marketing Features */}
          <div className="space-y-4 mb-8">
            {marketingFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/50 hover:bg-card/70 rounded-lg p-4 transition-colors border border-border/5"
              >
                <div className="flex items-start gap-3">
                  <feature.icon className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">{feature.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connexions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 tracking-tight uppercase px-2">
              Connexions
            </h3>
            <div className="bg-card/50 rounded-lg p-2 border border-border/5">
              <ConnectionsSection />
            </div>
          </div>

          {/* Outils */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 tracking-tight uppercase px-2">
              Outils
            </h3>
            <div className="bg-card/50 rounded-lg p-2 border border-border/5">
              <ToolsList onToolClick={handleToolClick} />
            </div>
          </div>

          {/* Paramètres */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 tracking-tight uppercase px-2">
              Paramètres
            </h3>
            <div className="bg-card/50 rounded-lg p-2 space-y-1 border border-border/5">
              <AppearanceSection />
              <NotificationsSection />
              <PrivacySection />
              <SecuritySection />
              <BlockedUsersSection />
              <LogoutSection />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
