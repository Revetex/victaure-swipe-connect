
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContractForm } from '@/components/marketplace/contracts/ContractForm';
import { ContractFormValues } from '@/types/marketplace';

// Ce composant adapte le ContractForm existant aux nouvelles interfaces
export function ContractFormAdaptor(props: any) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Simuler l'interface useRouter que le composant attend
  const router = {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    pathname: location.pathname,
    query: {}
  };
  
  // S'assurer que les valeurs initiales ont toutes les propriétés requises
  const initialValues: ContractFormValues = {
    title: "",  // Non-optionnel
    description: "",
    requirements: [],
    budget_min: undefined,
    budget_max: undefined,
    deadline: undefined,
    location: undefined,
    category: undefined,
    currency: "CAD"
  };
  
  return (
    <ContractForm
      {...props}
      router={router}
      initialValues={initialValues}
    />
  );
}
