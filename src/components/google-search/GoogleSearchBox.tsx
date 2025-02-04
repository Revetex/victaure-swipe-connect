import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";

export function GoogleSearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!profile?.id) return;
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
          body: { user_id: profile.id }
        });

        if (error) throw error;
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [profile?.id]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(searchUrl, "_blank");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Automatically trigger search after a brief delay
    setTimeout(() => {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`;
      window.open(searchUrl, "_blank");
    }, 300);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Rechercher sur Google..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 bg-background/50 backdrop-blur-sm border-primary/20"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="relative bg-primary/5 border-primary/20 hover:bg-primary/10"
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </Button>
        <Button onClick={handleSearch} className="bg-primary/90 hover:bg-primary">
          Rechercher
        </Button>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 p-2 bg-background/80 backdrop-blur-lg border border-primary/20 rounded-lg shadow-lg"
          >
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-primary/10 transition-colors duration-200"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}