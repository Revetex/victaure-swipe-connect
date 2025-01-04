import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MrVictaureWelcome } from "@/components/dashboard/MrVictaureWelcome";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";

export default function Index() {
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const { messages, handleSendMessage, isThinking } = useChat();

  const handleStartChat = () => {
    setShowWelcome(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* M. Victaure Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-lg border-primary/10">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
                <AvatarFallback className="bg-primary/20">
                  <Bot className="h-8 w-8 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">M. Victaure</h2>
                <p className="text-muted-foreground">Votre Assistant IA Personnel</p>
              </div>
            </div>

            <ScrollArea className="h-[400px] mb-6 border rounded-lg p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === "assistant"
                      ? "mr-12"
                      : "ml-12"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button onClick={() => setShowWelcome(true)}>
                <Bot className="h-4 w-4 mr-2" />
                Plus d'options
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Rest of the content */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Trouvez votre prochain emploi
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
            Découvrez des opportunités professionnelles adaptées à vos compétences et aspirations.
            Notre plateforme vous accompagne dans votre recherche d'emploi.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/jobs">
              <Button size="lg">
                Voir les offres
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="lg">
                Créer mon profil
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {showWelcome && (
        <MrVictaureWelcome
          onDismiss={() => setShowWelcome(false)}
          onStartChat={handleStartChat}
        />
      )}
    </div>
  );
}
