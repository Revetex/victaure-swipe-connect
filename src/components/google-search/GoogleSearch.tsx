
import { SearchIcon, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { HfInference } from '@huggingface/inference';
import "./GoogleSearchStyles.css";

export function GoogleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
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
    if (!profile) return;
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
    }
  };

  const enhanceResults = async () => {
    try {
      setIsEnhancing(true);
      
      // Récupérer les résultats actuels
      const results = document.querySelectorAll('.gsc-result');
      const resultTexts = Array.from(results).map(result => {
        const title = result.querySelector('.gs-title')?.textContent || '';
        const snippet = result.querySelector('.gs-snippet')?.textContent || '';
        return { title, snippet };
      });

      const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
      
      const prompt = `Voici des résultats de recherche d'emploi. Donne un résumé analytique concis qui inclut :
      - Les types de postes principaux
      - Les compétences les plus demandées
      - Les opportunités les plus intéressantes
      
      Résultats : ${JSON.stringify(resultTexts)}`;

      const response = await hf.textGeneration({
        model: 'HuggingFaceH4/zephyr-7b-beta',
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7
        }
      });

      if (response.generated_text) {
        // Créer un élément pour afficher l'analyse IA
        const aiAnalysisElement = document.createElement('div');
        aiAnalysisElement.className = 'ai-analysis';
        aiAnalysisElement.innerHTML = `
          <h3>💡 Analyse IA des résultats</h3>
          <p>${response.generated_text}</p>
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

        toast.success("Analyse IA des résultats terminée");
      } else {
        throw new Error("Impossible de générer l'analyse");
      }
    } catch (error) {
      console.error('Erreur lors de l\'amélioration des résultats:', error);
      toast.error("Impossible d'améliorer les résultats pour le moment");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
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
          title="Générer une recherche basée sur votre profil"
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-background/50 rounded-lg px-8 py-6">
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            onClick={enhanceResults}
            disabled={isEnhancing}
            variant="outline"
            className="text-xs"
          >
            {isEnhancing ? 'Analyse en cours...' : 'Analyser avec IA'}
          </Button>
        </div>
        <div className="gcse-searchresults-only"></div>
      </div>
    </form>
  );
}
