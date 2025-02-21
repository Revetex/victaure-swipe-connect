
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface JobsAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JobsAIAssistant({ isOpen, onClose }: JobsAIAssistantProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Simulation de réponse pour l'instant
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("L'assistant analyse votre demande", {
        description: "Je recherche les meilleures opportunités pour vous..."
      });
      setQuery("");
    } catch (error) {
      toast.error("Une erreur est survenue", {
        description: "Veuillez réessayer plus tard"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-x-0 bottom-0 p-4 z-50"
        >
          <Card className="max-w-2xl mx-auto border border-primary/20 bg-black/90 backdrop-blur-xl shadow-xl">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Assistant Victaure IA
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm text-zinc-400">
                Je peux vous aider à :
                <span className="block mt-2 pl-4 space-y-1">
                  <span className="block">• Trouver des offres adaptées à votre profil</span>
                  <span className="block">• Analyser les tendances du marché</span>
                  <span className="block">• Optimiser votre CV et lettre de motivation</span>
                  <span className="block">• Préparer vos entretiens</span>
                </span>
              </p>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 bg-zinc-900/50 border-zinc-800 focus:border-primary/30"
                  disabled={isLoading}
                />
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary/80 hover:bg-primary text-white"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
