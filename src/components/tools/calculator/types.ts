
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

export interface MarketingDescription {
  title: string;
  description: string;
  features: string[];
}

export const categories: Category[] = [
  { id: '1', name: 'Services', description: 'Services professionnels' },
  { id: '2', name: 'Produits', description: 'Produits physiques' },
  { id: '3', name: 'Digital', description: 'Produits numériques' }
];

export const marketingDescriptions: Record<TransactionType, MarketingDescription> = {
  fixed: {
    title: "Paiement Fixe",
    description: "Paiement unique et immédiat",
    features: ["Transaction rapide", "Montant fixe", "Sans frais cachés"]
  },
  variable: {
    title: "Paiement Variable",
    description: "Montant variable selon les conditions",
    features: ["Flexibilité", "Ajustement possible", "Conditions personnalisables"]
  },
  subscription: {
    title: "Abonnement",
    description: "Paiement récurrent automatique",
    features: ["Renouvellement automatique", "Gestion simplifiée", "Facturation régulière"]
  },
  escrow: {
    title: "Dépôt Fiduciaire",
    description: "Paiement sécurisé avec garantie",
    features: ["Protection acheteur", "Sécurité maximale", "Libération conditionnelle"]
  },
  auction: {
    title: "Enchère",
    description: "Système d'enchères sécurisé",
    features: ["Enchères en temps réel", "Histoire des offres", "Prix dynamique"]
  }
};
