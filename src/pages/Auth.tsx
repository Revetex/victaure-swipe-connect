
import { Suspense, useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { MessagesSquare, Bot, Wand2 } from "lucide-react";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showThinking, setShowThinking] = useState(false);
  const [userQuestions, setUserQuestions] = useState<number>(0);
  const [userInput, setUserInput] = useState("");

  const messages = [
    "Bonjour ! Je suis Mr. Victaure, votre assistant personnel.",
    "Je suis là pour vous guider dans votre recherche d'emploi... 🎯",
    "Laissez-moi vous présenter notre plateforme innovante !",
    "Sur Victaure, vous pouvez créer votre CV professionnel avec mon aide. Je vous guide dans la rédaction et optimise votre profil. 📝",
    "Notre système d'enchères et de contrats sécurisés vous permet de participer à des appels d'offres professionnels. 📊"
  ];

  useEffect(() => {
    const showNextMessage = async () => {
      if (currentMessageIndex < messages.length) {
        setShowThinking(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowThinking(false);
        setIsTyping(true);
        
        const message = messages[currentMessageIndex];
        let tempMessage = "";
        
        for (let i = 0; i < message.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 30));
          tempMessage += message[i];
          setVisibleMessages(prev => [...prev.slice(0, -1), tempMessage]);
        }
        
        setIsTyping(false);
        setCurrentMessageIndex(prev => prev + 1);
      }
    };

    if (!isTyping && currentMessageIndex < messages.length) {
      showNextMessage();
    }
  }, [currentMessageIndex, isTyping]);

  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
    sessionStorage.removeItem('redirectTo');
    return <Navigate to={redirectTo} replace />;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader className="w-8 h-8 text-[#64B5D9]" />
    </div>;
  }

  const handleSendMessage = () => {
    if (userQuestions >= 3) {
      toast.error("Veuillez vous connecter pour continuer la conversation avec Mr. Victaure");
      return;
    }
    if (userInput.trim()) {
      setUserQuestions(prev => prev + 1);
      setVisibleMessages(prev => [...prev, userInput.trim()]);
      setUserInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F2EBE4] via-[#F2EBE4]/50 to-[#64B5D9]/10 relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-white/5 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <motion.div className="fixed inset-0 opacity-10" 
        style={{
          background: "radial-gradient(circle at center, #64B5D9 0%, transparent 70%)"
        }} 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }} 
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 sm:p-6 lg:p-8 relative z-10">
        <motion.div 
          className="w-full max-w-xl mx-auto space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            <Logo size="xl" className="transform-none" />
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-[#1B2A4A] via-[#1B2A4A] to-[#64B5D9] bg-clip-text text-transparent font-tiempos text-center">
              La Plateforme Complète du Marché de l'Emploi
            </h1>

            <div className="w-full glass-panel rounded-xl p-4 border border-[#64B5D9]/20 bg-white/80 dark:bg-[#1B2A4A]/80">
              <div className="flex items-center gap-2 text-[#1B2A4A] dark:text-[#64B5D9] mb-4">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">Mr. Victaure</span>
                {showThinking && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 ml-2"
                  >
                    <Wand2 className="w-4 h-4 text-[#64B5D9] animate-pulse" />
                    <span className="text-xs text-[#64B5D9]/70">réfléchit...</span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-4 h-[400px] overflow-y-auto flex flex-col-reverse px-2">
                <AnimatePresence mode="popLayout">
                  {visibleMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-3 rounded-lg border ${
                        index >= messages.length
                          ? "ml-auto bg-[#64B5D9] text-white border-transparent max-w-[80%]"
                          : "mr-auto bg-[#F2EBE4] border-[#64B5D9]/10 max-w-[80%]"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={userQuestions >= 3 ? "Connectez-vous pour continuer..." : "Posez une question à Mr. Victaure..."}
                  disabled={userQuestions >= 3}
                  className="flex-1 h-10 px-4 rounded-lg bg-[#F2EBE4] border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={userQuestions >= 3 || !userInput.trim()}
                  className="h-10 px-4 rounded-lg bg-[#64B5D9] text-white hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span className="text-sm">Envoyer</span>
                  <MessagesSquare className="w-4 h-4" />
                </button>
              </div>
              {userQuestions >= 3 && (
                <p className="mt-2 text-xs text-[#1B2A4A]/60 text-center">
                  Vous avez atteint la limite de questions. Connectez-vous pour continuer à discuter avec Mr. Victaure.
                </p>
              )}
            </div>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center">
              <Loader className="w-6 h-6 text-[#64B5D9]" />
            </div>
          }>
            <AuthForm redirectTo={location.state?.from?.pathname} />
          </Suspense>
        </motion.div>

        <div className="mt-8 text-center text-sm text-[#1B2A4A]/60">
          <span className="font-medium text-[#1B2A4A]">Victaure</span> - Votre passerelle vers l'emploi du futur.
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-[#1B2A4A]/40 font-tiempos">
          © Thomas Blanchet
        </div>
      </main>
    </div>
  );
}
