import { Code, Briefcase, PaintBucket, HardHat, Wrench, Brain, Building2, Laptop, Palette, ChartBar, Cog, Hammer, Truck, Leaf } from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company?: string;
  location: string;
  salary?: string;
  category: string;
  contract_type: string;
  experience_level: string;
  skills?: string[];
  budget?: number;
  description?: string;
  employer_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  subcategory?: string;
}

export const missionCategories: Record<string, { icon: any; subcategories: string[] }> = {
  "Technologie": {
    icon: Laptop,
    subcategories: [
      "Développement Web",
      "Développement Mobile",
      "DevOps & Cloud",
      "Intelligence Artificielle",
      "Data Science",
      "Cybersécurité",
      "Architecture Logicielle",
      "QA & Testing",
      "Administration Système",
      "Support Technique"
    ]
  },
  "Gestion & Business": {
    icon: ChartBar,
    subcategories: [
      "Gestion de Projet",
      "Product Management",
      "Business Analysis",
      "Consulting",
      "Stratégie",
      "Marketing Digital",
      "Ressources Humaines",
      "Finance & Comptabilité",
      "Ventes B2B",
      "Service Client"
    ]
  },
  "Design & Créatif": {
    icon: Palette,
    subcategories: [
      "UI/UX Design",
      "Design Graphique",
      "Motion Design",
      "Design 3D",
      "Direction Artistique",
      "Design Produit",
      "Design d'Intérieur",
      "Illustration",
      "Photographie",
      "Vidéo & Animation"
    ]
  },
  "Construction & BTP": {
    icon: Building2,
    subcategories: [
      "Gros Œuvre",
      "Second Œuvre",
      "Architecture",
      "Génie Civil",
      "Conduite de Travaux",
      "Bureau d'Études",
      "Maîtrise d'Œuvre",
      "Expertise Technique",
      "Sécurité & Conformité",
      "Rénovation"
    ]
  },
  "Industrie & Production": {
    icon: Cog,
    subcategories: [
      "Production",
      "Maintenance Industrielle",
      "Qualité",
      "Méthodes & Industrialisation",
      "R&D",
      "Automatisation",
      "Supply Chain",
      "QHSE",
      "Lean Management",
      "Ingénierie"
    ]
  },
  "Artisanat & Métiers Manuels": {
    icon: Hammer,
    subcategories: [
      "Menuiserie",
      "Plomberie",
      "Électricité",
      "Peinture",
      "Carrelage",
      "Maçonnerie",
      "Couverture",
      "Serrurerie",
      "Chauffage",
      "Finitions"
    ]
  },
  "Transport & Logistique": {
    icon: Truck,
    subcategories: [
      "Transport Routier",
      "Logistique",
      "Manutention",
      "Gestion de Stock",
      "Import/Export",
      "Distribution",
      "Planification",
      "Achats",
      "Douane",
      "E-commerce"
    ]
  },
  "Environnement & Énergie": {
    icon: Leaf,
    subcategories: [
      "Énergies Renouvelables",
      "Efficacité Énergétique",
      "Gestion des Déchets",
      "Développement Durable",
      "Études Environnementales",
      "Certification",
      "Conseil Environnemental",
      "Économie Circulaire",
      "Agriculture Durable",
      "Biodiversité"
    ]
  }
};