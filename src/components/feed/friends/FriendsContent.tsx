import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { ConnectionsSection } from "./ConnectionsSection";
import { UserPlus, Users, Calculator, Languages, ListTodo, Ruler, Sword, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const tools = [
    {
      name: "Tâches",
      icon: ListTodo,
      path: "/tools",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      path: "/tools",
      color: "bg-green-500/10 text-green-500"
    },
    {
      name: "Traducteur",
      icon: Languages,
      path: "/tools",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      name: "Convertisseur",
      icon: Ruler,
      path: "/tools",
      color: "bg-orange-500/10 text-orange-500"
    },
    {
      name: "Échecs",
      icon: Sword,
      path: "/tools",
      color: "bg-red-500/10 text-red-500"
    },
    {
      name: "Assistant IA",
      icon: BrainCircuit,
      path: "/tools",
      color: "bg-indigo-500/10 text-indigo-500"
    }
  ];

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="relative"
        variants={itemVariants}
      >
        <ProfileSearch 
          onSelect={setSelectedProfile}
          placeholder="Rechercher un contact..."
          className="w-full bg-background/95 backdrop-blur"
        />
        <UserPlus className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {tools.map((tool) => (
            <Button
              key={tool.name}
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-2 p-3 h-auto",
                "hover:bg-accent/5 transition-all duration-200",
                "group relative"
              )}
              onClick={() => navigate(tool.path)}
            >
              <div className={cn(
                "p-2 rounded-lg",
                tool.color
              )}>
                <tool.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">{tool.name}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Mes connections</span>
        </div>

        <motion.div variants={itemVariants}>
          <ConnectionsSection />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FriendRequestsSection />
        </motion.div>
      </motion.div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </motion.div>
  );
}