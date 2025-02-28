
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User, Sparkles } from "lucide-react";
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
    <Card className="bg-gradient-to-br from-[#1B2A4A]/80 via-[#64B5D9]/10 to-[#1A1F2C]/70 border-[#64B5D9]/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#64B5D9]/10 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#9b87f5]/10 rounded-full blur-3xl -ml-20 -mb-20" />
      
      <CardContent className="px-6 py-8">
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex-shrink-0 bg-gradient-to-br from-[#64B5D9]/20 to-[#9b87f5]/20 rounded-full p-4 shadow-inner"
            variants={itemVariants}
          >
            <Bot className="h-10 w-10 text-[#64B5D9]" />
          </motion.div>
          
          <motion.div className="flex-1 text-center sm:text-left" variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-2 text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>Bonjour, {user?.email?.split('@')[0] || 'Bienvenue'}!</span>
              <Sparkles className="h-5 w-5 text-[#9b87f5]" />
            </h2>
            <p className="text-white/70 mb-6 max-w-lg">
              Mr. Victaure est disponible pour vous aider dans votre recherche d'emploi et vos questions professionnelles.
            </p>
            
            <Button 
              variant="default" 
              onClick={handleRequestChat}
              className="bg-gradient-to-r from-[#64B5D9] to-[#9b87f5] hover:from-[#9b87f5] hover:to-[#64B5D9] border-none text-white font-medium shadow-md hover:shadow-lg transition-all"
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
