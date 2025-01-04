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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-card/95 backdrop-blur-sm shadow-lg border-primary/10">
            <Tabs defaultValue="messages" className="w-full">
              <div className="border-b">
                <TabsList className="p-0 h-12">
                  <TabsTrigger value="messages" className="data-[state=active]:bg-background/50">
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-background/50">
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-background/50">
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="data-[state=active]:bg-background/50">
                    Tâches
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="data-[state=active]:bg-background/50">
                    Paiements
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-background/50">
                    Paramètres
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="messages" className="p-0">
                <div className="flex items-center gap-4 p-4 border-b">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
                    <AvatarFallback className="bg-primary/20">
                      <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">M. Victaure</h2>
                    <p className="text-sm text-muted-foreground">Comment puis-je vous aider ?</p>
                  </div>
                </div>

                <ScrollArea className="h-[500px] p-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.sender === "assistant" ? "mr-12" : "ml-12"
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

                <div className="p-4 border-t">
                  <input
                    type="text"
                    placeholder="Écrivez votre message..."
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        handleSendMessage(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <div className="p-4">
                  <p className="text-muted-foreground">Aucune notification pour le moment.</p>
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <div className="p-4">
                  <p className="text-muted-foreground">Aucune note pour le moment.</p>
                </div>
              </TabsContent>

              <TabsContent value="tasks">
                <div className="p-4">
                  <p className="text-muted-foreground">Aucune tâche pour le moment.</p>
                </div>
              </TabsContent>

              <TabsContent value="payments">
                <div className="p-4">
                  <p className="text-muted-foreground">Aucun paiement pour le moment.</p>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="p-4">
                  <p className="text-muted-foreground">Paramètres de l'application.</p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        {showWelcome && (
          <MrVictaureWelcome
            onDismiss={() => setShowWelcome(false)}
            onStartChat={handleStartChat}
          />
        )}
      </div>
    </div>
  );
}