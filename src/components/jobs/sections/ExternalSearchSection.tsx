import { useEffect, useState } from "react";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExternalSearchSectionProps {
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export function ExternalSearchSection({ 
  isLoading = false, 
  hasError = false, 
  errorMessage 
}: ExternalSearchSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSearch = async () => {
    try {
      setIsGenerating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour générer une recherche");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      
      if (data?.suggestions && data.suggestions.length > 0) {
        const searchInput = document.querySelector('.gsc-input') as HTMLInputElement;
        if (searchInput) {
          // Use the first suggestion
          searchInput.value = data.suggestions[0];
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          toast.success("Recherche générée!");
        }
      }
    } catch (error) {
      console.error('Error generating search:', error);
      toast.error("Erreur lors de la génération de la recherche");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .gsc-control-cse {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }
      .gsc-search-box {
        margin-bottom: 0 !important;
        position: relative !important;
      }
      .gsc-input-box {
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        background: transparent !important;
      }
      .gsc-input {
        background: transparent !important;
        color: hsl(var(--foreground)) !important;
      }
      .gsc-results-wrapper-overlay {
        background: hsl(var(--background)) !important;
        backdrop-filter: blur(12px) !important;
      }
      .gsc-webResult.gsc-result {
        background: transparent !important;
        border: none !important;
      }
      .gs-title, .gs-snippet {
        color: hsl(var(--muted-foreground)) !important;
        font-family: var(--font-sans) !important;
        font-size: 0.875rem !important;
      }
      .gs-title b, .gs-snippet b, .gsc-result b {
        color: inherit !important;
        font-weight: inherit !important;
        background: none !important;
      }
      .gsc-completion-container {
        background: hsl(var(--background)) !important;
        border: 1px solid hsl(var(--border)) !important;
        backdrop-filter: blur(12px) !important;
      }
      .gsc-completion-title {
        color: hsl(var(--foreground)) !important;
      }
      .gsc-cursor-box {
        margin: 16px 0 !important;
      }
      .gsc-cursor-page {
        color: hsl(var(--muted-foreground)) !important;
        background: transparent !important;
        padding: 8px !important;
      }
      .gsc-cursor-current-page {
        color: hsl(var(--foreground)) !important;
        font-weight: bold !important;
      }
      .gsc-modal-background-image {
        background: rgba(0, 0, 0, 0.5) !important;
        backdrop-filter: blur(4px) !important;
      }
      .gcsc-find-more-on-google {
        color: hsl(var(--muted-foreground)) !important;
      }
      .gcsc-find-more-on-google-root {
        background: transparent !important;
      }
      .ai-search-button {
        position: absolute !important;
        right: 60px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        z-index: 100 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (hasError) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div className="w-full space-y-4">
      <Card className="p-4 bg-background/60 backdrop-blur-sm border border-border/50">
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent"
          >
            <GoogleSearchBox />
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={generateSearch}
            disabled={isGenerating}
            className="ai-search-button h-8 w-8 rounded-full bg-blue-500/10 hover:bg-blue-500/20"
          >
            <Sparkles className={`h-4 w-4 text-blue-500 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </Card>
    </div>
  );
}