import { Suspense, useState, useEffect, useRef } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { MessagesSquare, Bot, Wand2 } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [autoMessages, setAutoMessages] = useState<string[]>([]);
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

  const chatContainerRef = useRef<HTMLDivElement>(null);

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
          setAutoMessages(prev => [...prev.slice(0, currentMessageIndex), tempMessage]);
        }
        setIsTyping(false);
        setCurrentMessageIndex(prev => prev + 1);

        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
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
      setAutoMessages([]); // Reset auto messages when user starts chatting
      setCurrentMessageIndex(messages.length); // Stop auto messages
      setUserQuestions(prev => prev + 1);
      setVisibleMessages(prev => [...prev, userInput.trim()]);
      setUserInput("");
      
      setTimeout(() => {
        const responses = [
          "Je comprends votre question. Pour y répondre pleinement, je vous invite à créer un compte. Cela me permettra de mieux vous accompagner.",
          "Excellente question ! Pour accéder à toutes les fonctionnalités et obtenir une réponse détaillée, je vous suggère de vous connecter.",
          "Je vois que vous êtes intéressé ! Connectez-vous pour découvrir toutes les possibilités que nous offrons."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setVisibleMessages(prev => [...prev, randomResponse]);
        
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1B2A4A] relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-[#F2EBE4]/5 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 sm:p-6 lg:p-8 relative z-10">
        <motion.div 
          className="w-full max-w-xl mx-auto space-y-8 sm:space-y-12" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            <Logo size="xl" className="transform-none text-[#F2EBE4]" />
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#F2EBE4] font-tiempos text-center px-4">
              La Plateforme Complète du Marché de l'Emploi
            </h1>

            <div className="w-full glass-panel rounded-xl p-4 border-2 border-[#222] shadow-[0_0_0_1px_rgba(100,181,217,0.1),0_4px_12px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 text-[#1B2A4A] mb-4">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">Mr. Victaure</span>
                {showThinking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 ml-2"
                  >
                    <Wand2 className="w-4 h-4 text-[#64B5D9] animate-pulse" />
                    <span className="text-xs text-[#64B5D9]">réfléchit...</span>
                  </motion.div>
                )}
              </div>

              <div 
                ref={chatContainerRef}
                className="space-y-4 h-[400px] overflow-y-auto flex flex-col-reverse"
                style={{
                  scrollBehavior: 'smooth'
                }}
              >
                <div className="flex flex-col-reverse">
                  <AnimatePresence mode="popLayout">
                    {visibleMessages.map((message, index) => (
                      <motion.div
                        key={`user-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="ml-auto bg-[#64B5D9] text-[#F2EBE4] border-transparent max-w-[80%] p-3 rounded-lg"
                      >
                        <p className="text-sm whitespace-pre-wrap">{message}</p>
                      </motion.div>
                    ))}
                    {autoMessages.map((message, index) => (
                      <motion.div
                        key={`auto-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="mr-auto bg-[#F2EBE4] border-[#64B5D9]/10 max-w-[80%] p-3 rounded-lg"
                      >
                        <p className="text-sm text-[#1B2A4A] whitespace-pre-wrap">{message}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder={
                    userQuestions >= 3
                      ? "Connectez-vous pour continuer..."
                      : "Posez une question à Mr. Victaure..."
                  }
                  disabled={userQuestions >= 3}
                  className="flex-1 h-10 px-4 rounded-lg bg-[#F2EBE4] border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#1B2A4A]"
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={userQuestions >= 3 || !userInput.trim()}
                  className="h-10 px-4 rounded-lg bg-[#64B5D9] text-[#F2EBE4] hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

          <div className="mt-8 w-full">
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  <Loader className="w-6 h-6 text-[#64B5D9]" />
                </div>
              }
            >
              <AuthForm redirectTo={location.state?.from?.pathname} />
            </Suspense>
          </div>
        </motion.div>

        <div className="mt-24 w-full">
          <footer className="pb-8 px-4 w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex items-center justify-center">
                <Logo size="lg" className="transform-none text-[#F2EBE4]" />
              </div>
              <div className="flex items-center justify-center">
                <a href="https://www.linkedin.com/in/thomas-blanchet-5b5b5b229/" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a4 4 0 0 1 4 4v4h4a4 4 0 0 1 4-4V8a4 4 0 0 1-4-4H8a4 4 0 0 1-4 4z" />
                    <path d="M12 16a4 4 0 0 0 4-4h4a4 4 0 0 0 4 4v4a4 4 0 0 0-4 4H12a4 4 0 0 0-4-4z" />
                    <path d="M4 12a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4z" />
                  </svg>
                </a>
              </div>
              <div className="flex items-center justify-center">
                <a href="https://github.com/thomasblanchet" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
                    <line x1="12" y1="9" x2="12" y2="15" />
                    <line x1="12" y1="15" x2="12" y2="19" />
                  </svg>
                </a>
              </div>
              <div className="flex items-center justify-center">
                <a href="https://www.instagram.com/thomasblanchet/" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                    <line x1="12" y1="16" x2="12" y2="20" />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
