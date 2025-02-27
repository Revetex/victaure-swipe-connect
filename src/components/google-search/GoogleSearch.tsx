
import { SearchIcon, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { HfInference } from '@huggingface/inference';
import "./GoogleSearchStyles.css";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function GoogleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { profile } = useProfile();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=22e4528bd7c6f4db0";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    triggerSearch(searchTerm);
  };

  const triggerSearch = (query: string) => {
    const element = document.querySelector('.gsc-search-box input') as HTMLInputElement;
    if (element) {
      element.value = query;
      const searchButton = document.querySelector('.gsc-search-button button') as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    }
  };

  const generateRandomSearch = () => {
    if (!profile) {
      toast.error("Veuillez vous connecter pour utiliser cette fonctionnalité");
      return;
    }
    
    const searchTerms = [
      ...profile.skills || [],
      profile.company_name,
      profile.city,
    ].filter(Boolean);

    if (searchTerms.length > 0) {
      const selectedTerms = searchTerms
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 2);
      
      const query = selectedTerms.join(' ') + ' emploi';
      setSearchTerm(query);
      triggerSearch(query);
    } else {
      toast.error("Complétez votre profil pour des recherches personnalisées");
    }
  };

  const enhanceResults = async () => {
    try {
      setIsEnhancing(true);
      toast.info("Analyse des résultats en cours...");
      
      // Récupérer les résultats actuels et dédupliquer
      const results = document.querySelectorAll('.gsc-result');
      const seenUrls = new Set();
      const uniqueResults = Array.from(results).filter(result => {
        const url = result.querySelector('.gs-visibleUrl')?.textContent;
        if (!url || seenUrls.has(url)) return false;
        seenUrls.add(url);
        return true;
      });

      const resultTexts = uniqueResults.map(result => {
        const title = result.querySelector('.gs-title')?.textContent || '';
        const snippet = result.querySelector('.gs-snippet')?.textContent || '';
        const url = result.querySelector('.gs-visibleUrl')?.textContent || '';
        return { title, snippet, url };
      });

      const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
      
      const prompt = `Analyse ces offres d'emploi et fournis une synthèse détaillée avec:
      1. Top 3 des postes les plus pertinents
      2. Compétences requises principales
      3. Avantages notables (salaire, télétravail, etc)
      4. Recommandations pour postuler
      5. Tendances du marché identifiées

      Format la réponse avec des puces et des sections clairement identifiées.
      
      Offres: ${JSON.stringify(resultTexts)}`;

      const response = await hf.textGeneration({
        model: 'HuggingFaceH4/zephyr-7b-beta',
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.2
        }
      });

      if (response.generated_text) {
        const formattedText = response.generated_text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .join('\n');

        // Créer un élément pour afficher l'analyse IA
        const aiAnalysisElement = document.createElement('div');
        aiAnalysisElement.className = 'ai-analysis';
        aiAnalysisElement.innerHTML = `
          <h3 class="flex items-center gap-2 mb-4">
            <span class="h-6 w-6 text-primary">✨</span>
            Analyse IA des opportunités
          </h3>
          <div class="ai-content prose dark:prose-invert">${formattedText}</div>
        `;

        // Insérer l'analyse avant la liste des résultats
        const resultsContainer = document.querySelector('.gsc-resultsbox-visible');
        if (resultsContainer) {
          // Supprimer l'ancienne analyse si elle existe
          const oldAnalysis = document.querySelector('.ai-analysis');
          if (oldAnalysis) {
            oldAnalysis.remove();
          }

          resultsContainer.insertBefore(aiAnalysisElement, resultsContainer.firstChild);
        }

        toast.success("Analyse des résultats terminée");
      } else {
        throw new Error("Impossible de générer l'analyse");
      }
    } catch (error) {
      console.error('Erreur lors de l\'amélioration des résultats:', error);
      toast.error("Une erreur est survenue lors de l'analyse");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-4 w-full">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Rechercher des offres d'emploi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 bg-background/50"
          />
          <Button 
            type="submit" 
            disabled={isSearching}
            className="h-12 px-4"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={generateRandomSearch}
            className="h-12 px-4"
            variant="outline"
            title="Générer une recherche basée sur votre profil"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      <Card className="bg-background/50 rounded-lg p-6">
        <div className="flex justify-end mb-4">
          <Button
            onClick={enhanceResults}
            disabled={isEnhancing}
            variant="outline"
            className="text-xs"
          >
            {isEnhancing ? 'Analyse en cours...' : 'Analyser avec IA'}
          </Button>
        </div>
        <ScrollArea className="h-[600px]">
          <div className="gcse-searchresults-only"></div>
        </ScrollArea>
      </Card>
    </Card>
  );
}
