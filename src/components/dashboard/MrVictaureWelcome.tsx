
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export interface MrVictaureWelcomeProps {
  onRequestChat?: () => void;
}

export function MrVictaureWelcome({ onRequestChat }: MrVictaureWelcomeProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleRequestChat = () => {
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate("/chat");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-background border-primary/20 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
      
      <CardContent className="px-4 py-5 sm:p-6">
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex-shrink-0 bg-primary/20 rounded-full p-3"
            variants={itemVariants}
          >
            <Bot className="h-8 w-8 text-primary" />
          </motion.div>
          
          <motion.div className="flex-1 text-center sm:text-left" variants={itemVariants}>
            <h2 className="text-lg font-semibold mb-1">
              Bonjour, {user?.email?.split('@')[0] || 'Bienvenue'}!
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Mr. Victaure est disponible pour vous aider dans votre recherche d'emploi et vos questions professionnelles.
            </p>
            
            <Button 
              variant="default" 
              onClick={handleRequestChat}
              className="bg-primary/80 hover:bg-primary"
            >
              <User className="mr-2 h-4 w-4" />
              Commencer à discuter
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
