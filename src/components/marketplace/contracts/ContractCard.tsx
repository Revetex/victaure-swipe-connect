
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketplaceContract } from "@/types/marketplace";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ContractCardProps {
  contract: MarketplaceContract;
}

export function ContractCard({ contract }: ContractCardProps) {
  // État pour contrôler l'expansion de la description
  const [expanded, setExpanded] = useState(false);
  
  // Vérifier si la description est assez longue pour être tronquée
  const isLongDescription = contract.description.length > 150;
  
  // Tronquer la description si elle est longue et non développée
  const displayDescription = isLongDescription && !expanded 
    ? `${contract.description.substring(0, 150)}...` 
    : contract.description;

  // Format de la date au format local
  const formattedDate = new Date(contract.created_at).toLocaleDateString();
  
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col space-y-3">
        {/* En-tête avec titre et date */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-1">{contract.title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
        </div>
        
        {/* Détails du budget et statut */}
        <div className="flex flex-wrap items-center gap-2">
          {contract.budget_min && contract.budget_max ? (
            <Badge variant="outline" className="font-normal">
              Budget: {contract.budget_min} - {contract.budget_max} {contract.currency || 'CAD'}
            </Badge>
          ) : contract.budget_min ? (
            <Badge variant="outline" className="font-normal">
              Budget min: {contract.budget_min} {contract.currency || 'CAD'}
            </Badge>
          ) : contract.budget_max ? (
            <Badge variant="outline" className="font-normal">
              Budget max: {contract.budget_max} {contract.currency || 'CAD'}
            </Badge>
          ) : null}
          
          {contract.deadline && (
            <Badge variant="outline" className="font-normal">
              Échéance: {new Date(contract.deadline).toLocaleDateString()}
            </Badge>
          )}
          
          {contract.status === 'active' || contract.status === 'open' ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100">
              {contract.status === 'active' ? 'Actif' : 'Ouvert'}
            </Badge>
          ) : (
            <Badge variant="secondary">
              {contract.status}
            </Badge>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
          {displayDescription}
        </p>
        
        {/* Bouton "Voir plus" si la description est longue */}
        {isLongDescription && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary hover:underline"
          >
            {expanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
        
        {/* Compétences requises */}
        {contract.requirements && contract.requirements.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Compétences requises:</h4>
            <div className="flex flex-wrap gap-1">
              {contract.requirements.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Pied avec créateur et bouton de détails */}
        <div className="flex justify-between items-center pt-3">
          <div className="flex items-center gap-2">
            {contract.creator?.avatar_url ? (
              <img 
                src={contract.creator.avatar_url}
                alt="Avatar" 
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {contract.creator?.full_name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {contract.creator?.full_name || 'Utilisateur'}
            </span>
          </div>
          
          <Link to={`/dashboard/marketplace/contracts/${contract.id}`}>
            <Button variant="outline" size="sm">
              Voir les détails
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
