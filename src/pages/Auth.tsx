import { Suspense, useState, useEffect, useRef } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { MessagesSquare, Bot, Wand2, Mail, Phone, MapPin, MessageCircle, BrainCircuit } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
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
        setVisibleMessages([{ content: message, isUser: false }]);
        setIsTyping(false);
        setShowWelcomeMessage(true);
      }
    };

    if (!isTyping && !showWelcomeMessage) {
      showWelcome();
    }
  }, [isTyping, showWelcomeMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [visibleMessages]);

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
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://victaure.com',
            'X-Title': 'Victaure Assistant',
            'Origin': window.location.origin
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct',
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

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Format de réponse invalide');
        }

        const aiResponse = data.choices[0].message.content;
        setVisibleMessages(prev => [...prev, { content: aiResponse, isUser: false }]);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error("L'assistant n'est pas disponible pour le moment, veuillez réessayer plus tard.");
        setVisibleMessages(prev => [...prev, { 
          content: "Désolé, je ne suis pas disponible pour le moment. Veuillez réessayer plus tard.", 
          isUser: false 
        }]);
      } finally {
        setShowThinking(false);
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

            <p className="text-[#64B5D9] font-medium text-lg">Une entreprise fièrement québécoise</p>

            <div className="w-full glass-panel rounded-xl overflow-hidden border-2 border-[#222] shadow-[0_0_0_1px_rgba(100,181,217,0.1),0_4px_12px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 bg-[#F2EBE4] p-4 border-b-[3px] border-[#64B5D9]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <BrainCircuit className="w-10 h-10 text-[#1B2A4A]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1B2A4A]">Mr. Victaure</h3>
                    <p className="text-xs text-[#1B2A4A]/60">Assistant IA</p>
                  </div>
                </div>
                {showThinking && (
                  <div className="flex items-center gap-1 ml-auto">
                    <Wand2 className="w-4 h-4 text-[#64B5D9] animate-pulse" />
                    <span className="text-xs text-[#64B5D9]">réfléchit...</span>
                  </div>
                )}
              </div>

              <div className="p-4">
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
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
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
                <Link 
                  to="/legal/terms" 
                  className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9] transition-colors"
                >
                  Conditions d'utilisation
                </Link>
                <Link 
                  to="/legal/privacy" 
                  className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9] transition-colors"
                >
                  Politique de confidentialité
                </Link>
                <Link 
                  to="/legal/cookies" 
                  className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9] transition-colors"
                >
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
