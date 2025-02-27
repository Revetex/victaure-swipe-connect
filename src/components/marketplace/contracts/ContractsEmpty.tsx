
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ContractsEmpty() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="bg-primary/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-primary"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium mb-2">Aucun contrat disponible</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Il n'y a actuellement aucun contrat ouvert. Créez votre premier contrat ou revenez plus tard.
      </p>
      
      <Button 
        onClick={() => navigate('/dashboard/marketplace/contracts/new')}
        className="bg-primary text-white hover:bg-primary/90"
      >
        Créer un contrat
      </Button>
    </div>
  );
}
