
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MarketplaceContract } from '@/types/marketplace';

interface ContractViewerProps {
  contract: MarketplaceContract;
}

export function ContractViewer({ contract }: ContractViewerProps) {
  const navigate = useNavigate();

  // Formatage de la date
  const createdAt = new Date(contract.created_at);
  const formattedDate = formatDistanceToNow(createdAt, { 
    addSuffix: true,
    locale: fr 
  });

  // Pour retourner à la liste des contrats
  const handleBack = () => {
    navigate('/dashboard/marketplace?tab=contracts');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-zinc-800">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{contract.title}</h1>
        <Button variant="outline" onClick={handleBack}>
          Retour à la liste
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {contract.description}
            </p>
          </div>

          {contract.requirements && contract.requirements.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Compétences requises</h2>
              <div className="flex flex-wrap gap-2">
                {contract.requirements.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
          <div>
            <h2 className="text-lg font-semibold mb-2">Détails du contrat</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Statut:</span>
                <span className="font-medium">{contract.status === 'active' ? 'Actif' : contract.status}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Créé:</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              
              {contract.location && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Lieu:</span>
                  <span className="font-medium">{contract.location}</span>
                </div>
              )}
              
              {contract.category && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Catégorie:</span>
                  <span className="font-medium">{contract.category}</span>
                </div>
              )}
              
              {(contract.budget_min || contract.budget_max) && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Budget:</span>
                  <span className="font-medium">
                    {contract.budget_min && contract.budget_max 
                      ? `${contract.budget_min} - ${contract.budget_max} ${contract.currency || 'CAD'}`
                      : contract.budget_min 
                        ? `Min: ${contract.budget_min} ${contract.currency || 'CAD'}`
                        : `Max: ${contract.budget_max} ${contract.currency || 'CAD'}`
                    }
                  </span>
                </div>
              )}
              
              {contract.deadline && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Date limite:</span>
                  <span className="font-medium">{new Date(contract.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Client</h2>
            <div className="flex items-center space-x-3">
              {contract.creator?.avatar_url ? (
                <img 
                  src={contract.creator.avatar_url} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    {contract.creator?.full_name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium">{contract.creator?.full_name || 'Anonyme'}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">
              Contacter le client
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
