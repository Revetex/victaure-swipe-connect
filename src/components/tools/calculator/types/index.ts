
export type TransactionType = 'escrow' | 'auction' | 'fixed';
export type FilterOrder = 'asc' | 'desc';

export type ConversionType = 'currency' | 'crypto' | 'length' | 'weight' | 'temperature' | 'unit' | 'time';

export interface Rate {
  code: string;
  rate: number;
  name: string;
}

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  success: boolean;
  timestamp: number;
}

export const marketingDescriptions = {
  escrow: {
    title: "Paiement Sécurisé en Fiducie 🔒",
    description: "Protégez vos transactions avec notre système de paiement en fiducie. Les fonds sont sécurisés jusqu'à la livraison du service ou du produit.",
    features: [
      "Protection acheteur et vendeur",
      "Période de gel personnalisable",
      "Traçabilité complète",
      "Remboursement automatique si conditions non remplies"
    ]
  },
  auction: {
    title: "Système d'Enchères en Temps Réel ⚡",
    description: "Créez des enchères dynamiques et engageantes. Idéal pour maximiser la valeur de vos biens ou services.",
    features: [
      "Notifications en temps réel",
      "Historique des enchères",
      "Prix de réserve",
      "Durée flexible"
    ]
  },
  fixed: {
    title: "Prix Fixe Simple et Efficace 💰",
    description: "Vendez rapidement à prix fixe. La solution parfaite pour les transactions immédiates.",
    features: [
      "Transaction rapide",
      "Prix transparent",
      "Paiement immédiat",
      "Sans commission"
    ]
  }
};

export const categories = [
  { id: 'tech', name: 'Technologie', description: 'Matériel informatique, logiciels, etc.' },
  { id: 'services', name: 'Services', description: 'Prestations professionnelles' },
  { id: 'goods', name: 'Biens', description: 'Produits physiques' },
  { id: 'other', name: 'Autre', description: 'Autres types de produits/services' }
];
