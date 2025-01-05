import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

interface QuickSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

export function QuickSuggestions({ onSelect }: QuickSuggestionsProps) {
  const { profile } = useProfile();

  // Suggestions adaptées au profil de l'utilisateur
  const getSuggestions = () => {
    const suggestions = [];

    if (!profile?.role) {
      suggestions.push("Je cherche à définir mon orientation professionnelle");
    }

    if (!profile?.skills?.length) {
      suggestions.push("J'aimerais identifier mes compétences clés");
    }

    suggestions.push(
      "Quelles sont les tendances du marché dans mon domaine?",
      "Comment puis-je améliorer mon profil professionnel?",
      "Quelles formations pourraient m'être utiles?"
    );

    return suggestions;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {getSuggestions().map((suggestion, index) => (
        <Button
          key={index}
          variant="secondary"
          size="sm"
          className="text-sm"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}