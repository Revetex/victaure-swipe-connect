import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, Briefcase, MapPin, School, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

interface SuggestionCategory {
  icon: JSX.Element;
  suggestions: string[];
  label: string;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      setSuggestions(data.suggestions);
      setShowSuggestions(true);
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

  const groupSuggestions = (suggestions: string[]): SuggestionCategory[] => {
    const categories: SuggestionCategory[] = [
      {
        icon: <Briefcase className="h-4 w-4" />,
        label: "Emplois",
        suggestions: suggestions.filter(s => s.toLowerCase().includes("emploi") || s.toLowerCase().includes("recrutement"))
      },
      {
        icon: <MapPin className="h-4 w-4" />,
        label: "Par région",
        suggestions: suggestions.filter(s => s.toLowerCase().includes("montréal") || s.toLowerCase().includes("québec"))
      },
      {
        icon: <School className="h-4 w-4" />,
        label: "Formation",
        suggestions: suggestions.filter(s => s.toLowerCase().includes("formation") || s.toLowerCase().includes("cours"))
      },
      {
        icon: <Code className="h-4 w-4" />,
        label: "Compétences",
        suggestions: suggestions.filter(s => !s.toLowerCase().includes("emploi") && 
                                          !s.toLowerCase().includes("recrutement") && 
                                          !s.toLowerCase().includes("montréal") && 
                                          !s.toLowerCase().includes("québec") &&
                                          !s.toLowerCase().includes("formation") &&
                                          !s.toLowerCase().includes("cours"))
      }
    ];

    return categories.filter(cat => cat.suggestions.length > 0);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-background hover:bg-accent"
          onClick={fetchSuggestions}
          disabled={isLoading}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Chargement..." : "Suggestions IA"}
        </Button>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border rounded-lg shadow-lg p-4 space-y-4"
          >
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              groupSuggestions(suggestions).map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {category.icon}
                    {category.label}
                  </div>
                  {category.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                      className="cursor-pointer p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                      onClick={() => {
                        onSuggestionClick(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      {suggestion}
                    </motion.div>
                  ))}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}