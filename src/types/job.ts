import { Code, Briefcase, PaintBucket, HardHat, Wrench, Brain, Building2, Laptop, Palette, ChartBar, Cog, Hammer, Truck, Leaf, Heart, Stethoscope, Utensils, School, Music, Camera, Scale, Microscope } from "lucide-react";

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
      "Support Technique",
      "Blockchain",
      "IoT",
      "Réalité Virtuelle/Augmentée",
      "Jeux Vidéo",
      "Réseaux",
      "Base de Données"
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
      "Service Client",
      "Entrepreneuriat",
      "E-commerce",
      "Relations Publiques",
      "Développement Commercial",
      "Gestion des Risques",
      "Audit"
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
      "Vidéo & Animation",
      "Design Web",
      "Design Editorial",
      "Design Packaging",
      "Design Textile",
      "Design Industriel",
      "Architecture d'Intérieur"
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
      "Rénovation",
      "Construction Durable",
      "Géotechnique",
      "Topographie",
      "Urbanisme",
      "Infrastructures",
      "Aménagement Paysager"
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
      "Ingénierie",
      "Robotique",
      "Mécanique",
      "Électronique",
      "Plasturgie",
      "Métallurgie",
      "Agroalimentaire"
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
      "Finitions",
      "Ébénisterie",
      "Ferronnerie",
      "Vitrerie",
      "Tapisserie",
      "Cordonnerie",
      "Bijouterie"
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
      "E-commerce",
      "Transport Maritime",
      "Transport Aérien",
      "Transport Ferroviaire",
      "Entreposage",
      "Supply Chain",
      "Logistique Internationale"
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
      "Biodiversité",
      "Traitement de l'Eau",
      "Qualité de l'Air",
      "Dépollution",
      "Écologie Industrielle",
      "Smart Grid",
      "Transition Énergétique"
    ]
  },
  "Santé & Bien-être": {
    icon: Heart,
    subcategories: [
      "Médecine",
      "Soins Infirmiers",
      "Kinésithérapie",
      "Pharmacie",
      "Psychologie",
      "Nutrition",
      "Sport & Fitness",
      "Médecine Alternative",
      "Thérapie",
      "Santé Mentale",
      "Soins à Domicile",
      "Radiologie",
      "Dentisterie",
      "Optométrie",
      "Laboratoire Médical",
      "Recherche Médicale"
    ]
  },
  "Hôtellerie & Restauration": {
    icon: Utensils,
    subcategories: [
      "Cuisine",
      "Service en Salle",
      "Management Hôtelier",
      "Réception",
      "Housekeeping",
      "Bar & Cocktails",
      "Événementiel",
      "Traiteur",
      "Pâtisserie",
      "Sommellerie",
      "Gestion de Restaurant",
      "Food & Beverage",
      "Conciergerie",
      "Tourisme",
      "Animation",
      "Spa & Bien-être"
    ]
  },
  "Éducation & Formation": {
    icon: School,
    subcategories: [
      "Enseignement Primaire",
      "Enseignement Secondaire",
      "Enseignement Supérieur",
      "Formation Professionnelle",
      "E-learning",
      "Coaching",
      "Langues Étrangères",
      "Soutien Scolaire",
      "Formation Continue",
      "Pédagogie",
      "Éducation Spécialisée",
      "Formation d'Adultes",
      "Sciences de l'Éducation",
      "Petite Enfance",
      "Formation en Entreprise",
      "Orientation Professionnelle"
    ]
  },
  "Arts & Culture": {
    icon: Music,
    subcategories: [
      "Musique",
      "Théâtre",
      "Danse",
      "Arts Visuels",
      "Cinéma",
      "Littérature",
      "Patrimoine",
      "Muséologie",
      "Arts Numériques",
      "Production Culturelle",
      "Médiation Culturelle",
      "Arts du Spectacle",
      "Arts Plastiques",
      "Artisanat d'Art",
      "Gestion Culturelle",
      "Conservation"
    ]
  },
  "Médias & Communication": {
    icon: Camera,
    subcategories: [
      "Journalisme",
      "Production Audiovisuelle",
      "Relations Presse",
      "Communication Digitale",
      "Rédaction Web",
      "Community Management",
      "Publicité",
      "Production Radio",
      "Édition",
      "Traduction",
      "Content Marketing",
      "Réseaux Sociaux",
      "Storytelling",
      "Copywriting",
      "Communication Corporate",
      "Relations Publiques"
    ]
  },
  "Juridique & Droit": {
    icon: Scale,
    subcategories: [
      "Droit des Affaires",
      "Droit Social",
      "Droit Immobilier",
      "Droit Fiscal",
      "Propriété Intellectuelle",
      "Droit International",
      "Droit Pénal",
      "Droit Public",
      "Droit de l'Environnement",
      "Droit des Contrats",
      "Droit Bancaire",
      "Droit des Sociétés",
      "Contentieux",
      "Conseil Juridique",
      "Compliance",
      "Protection des Données"
    ]
  },
  "Recherche & Sciences": {
    icon: Microscope,
    subcategories: [
      "Recherche Fondamentale",
      "Recherche Appliquée",
      "Biotechnologie",
      "Sciences des Matériaux",
      "Physique",
      "Chimie",
      "Biologie",
      "Mathématiques",
      "Neurosciences",
      "Génétique",
      "Astronomie",
      "Géologie",
      "Océanographie",
      "Climatologie",
      "Nanotechnologie",
      "Sciences Cognitives"
    ]
  }
};