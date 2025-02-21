
export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export type ConversionType = 'currency' | 'crypto' | 'temperature' | 'length' | 'weight' | 'time' | 'unit';

export type TransactionType = 'fixed' | 'variable' | 'subscription' | 'escrow' | 'auction';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface FilterOrder {
  field: string;
  direction: 'asc' | 'desc';
}

export const categories: Category[] = [
  { id: '1', name: 'Services', description: 'Services professionnels' },
  { id: '2', name: 'Produits', description: 'Produits physiques' },
  { id: '3', name: 'Digital', description: 'Produits numériques' }
];

export const marketingDescriptions = {
  fixed: "Paiement unique et immédiat",
  variable: "Montant variable selon les conditions",
  subscription: "Paiement récurrent automatique",
  escrow: "Paiement sécurisé avec garantie",
  auction: "Système d'enchères sécurisé"
};
