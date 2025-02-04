import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Loader } from "@/components/ui/loader";

interface VCardBioHeaderProps {
  isEditing: boolean;
  isGenerating: boolean;
  onGenerateBio: () => void;
}

export function VCardBioHeader({ isEditing, isGenerating, onGenerateBio }: VCardBioHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white/90">
        Présentation
      </h3>
      {isEditing && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onGenerateBio}
          disabled={isGenerating}
          className="bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 border-gray-200/20 dark:border-white/10 text-gray-700 dark:text-white/90"
        >
          {isGenerating ? (
            <Loader className="mr-2 h-3 w-3" />
          ) : (
            <Wand2 className="mr-2 h-3 w-3" />
          )}
          <span className="text-xs sm:text-sm">Générer</span>
        </Button>
      )}
    </div>
  );
}