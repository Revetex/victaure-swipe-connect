import { Suspense, useState, useEffect, useRef } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { MessagesSquare, Bot, Wand2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [userQuestions, setUserQuestions] = useState<number>(0);
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showWelcome = async () => {
      if (!showWelcomeMessage) {
        setShowThinking(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowThinking(false);
        setIsTyping(true);
        const message = "Bonjour ! Je suis Mr. Victaure, votre assistant personnel. Comment puis-je vous aider aujourd'hui ? 🎯";
        let tempMessage = "";
        for (let i = 0; i < message.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 30));
          tempMessage += message[i];
          setVisibleMessages([tempMessage]);
        }
        setIsTyping(false);
        setShowWelcomeMessage(true);
      }
    };

    if (!isTyping && !showWelcomeMessage) {
      showWelcome();
    }
  }, [isTyping, showWelcomeMessage]);

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

  const handleSendMessage = async () => {
    if (userQuestions >= 3) {
      toast.error("Veuillez vous connecter pour continuer la conversation avec Mr. Victaure");
      return;
    }
    if (userInput.trim()) {
      const userMessage = userInput.trim();
      setUserQuestions(prev => prev + 1);
      setVisibleMessages(prev => [...prev, { content: userMessage, isUser: true }]);
      setUserInput("");
      setShowThinking(true);

      try {
        const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://victaure.com',
            'X-Title': 'Victaure Assistant'
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct', // Modèle gratuit
            messages: [
              {
                role: 'system',
                content: 'Tu es Mr. Victaure, un assistant professionnel sur une plateforme de recrutement. Tu dois être amical et professionnel, encourageant les utilisateurs à créer un compte après 3 messages.'
              },
              {
                role: 'user',
                content: userMessage
              }
            ]
          })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        setVisibleMessages(prev => [...prev, { content: aiResponse, isUser: false }]);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Désolé, je ne peux pas répondre pour le moment");
      } finally {
        setShowThinking(false);
        
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1B2A4A] relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-[#F2EBE4]/5 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-xl mx-auto space-y-8">
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
                  <div className="flex items-center gap-1 ml-2">
                    <Wand2 className="w-4 h-4 text-[#64B5D9] animate-pulse" />
                    <span className="text-xs text-[#64B5D9]">réfléchit...</span>
                  </div>
                )}
              </div>

              <div 
                ref={chatContainerRef}
                className="flex flex-col justify-end h-[400px] overflow-y-auto mb-4"
              >
                <div className="space-y-4">
                  {visibleMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.isUser
                          ? "ml-auto bg-[#64B5D9] text-[#F2EBE4] border-transparent max-w-[80%]"
                          : "mr-auto bg-[#F2EBE4] text-[#1B2A4A] border-[#64B5D9]/10 max-w-[80%]"
                      }`}
                    >
                      <p className="text-sm font-medium whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
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
                  className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#64B5D9] text-[#F2EBE4] hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
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

          <div className="w-full">
            <Suspense fallback={<div className="flex items-center justify-center">
              <Loader className="w-6 h-6 text-[#64B5D9]" />
            </div>}>
              <AuthForm redirectTo={location.state?.from?.pathname} />
            </Suspense>
          </div>
        </div>

        <footer className="mt-24 w-full max-w-xl mx-auto px-4 text-center">
          <div className="space-y-8 border-t border-[#F2EBE4]/10 pt-8">
            <div>
              <p className="text-[#64B5D9] font-medium">Une entreprise fièrement québécoise</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#F2EBE4]">Nous contacter</h3>
              <form className="space-y-4 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full h-10 px-4 rounded-lg bg-[#F2EBE4]/10 border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors text-[#F2EBE4] placeholder:text-[#F2EBE4]/40"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full h-10 px-4 rounded-lg bg-[#F2EBE4]/10 border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors text-[#F2EBE4] placeholder:text-[#F2EBE4]/40"
                />
                <textarea
                  placeholder="Votre message..."
                  rows={4}
                  className="w-full p-4 rounded-lg bg-[#F2EBE4]/10 border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors text-[#F2EBE4] placeholder:text-[#F2EBE4]/40"
                />
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-[#64B5D9] text-[#F2EBE4] hover:bg-[#64B5D9]/90 transition-colors font-medium"
                >
                  Envoyer
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#F2EBE4]">Liens juridiques</h3>
              <div className="space-y-2">
                <Link to="/legal/terms" className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9]">
                  Conditions d'utilisation
                </Link>
                <Link to="/legal/privacy" className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9]">
                  Politique de confidentialité
                </Link>
                <Link to="/legal/cookies" className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9]">
                  Politique des cookies
                </Link>
              </div>
            </div>

            <div className="text-sm text-[#F2EBE4]/60">
              <p>© {new Date().getFullYear()} Victaure Technologies inc.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
