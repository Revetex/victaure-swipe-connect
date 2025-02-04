import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAndApplySuggestion = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      
      // Get a random suggestion from the array
      const randomSuggestion = data.suggestions[Math.floor(Math.random() * data.suggestions.length)];
      
      // Automatically apply the suggestion
      onSuggestionClick(randomSuggestion);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les suggestions"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-background hover:bg-accent"
          onClick={fetchAndApplySuggestion}
          disabled={isLoading}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Chargement..." : "Suggestion IA"}
        </Button>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border rounded-lg shadow-lg p-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}