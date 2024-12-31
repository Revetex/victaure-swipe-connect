import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobCategoryFieldsProps {
  category: string;
  subcategory: string;
  onChange: (field: string, value: string) => void;
}

export function JobCategoryFields({
  category,
  subcategory,
  onChange,
}: JobCategoryFieldsProps) {
  const allCategories = {
    "Manuel": ["Rénovation", "Installation", "Maintenance", "Artisanat", "Réparation"],
    "Construction": ["Gros œuvre", "Second œuvre", "Finitions", "BIM", "Architecture"],
    "Technologie": ["Développement Web", "DevOps", "Mobile", "Data", "Cloud", "Sécurité", "IA", "Blockchain"],
    "Design": ["UI/UX", "Graphisme", "Motion", "3D", "Web Design", "Print", "Branding"],
    "Marketing": ["Digital", "Content", "SEO", "Social Media", "Growth", "Brand", "Analytics"],
    "Gestion": ["Product Management", "Agile", "Conseil", "Stratégie", "Opérations", "Qualité"],
    "Finance": ["Comptabilité", "Audit", "Contrôle de gestion", "Trésorerie", "Risk Management"],
    "Ressources Humaines": ["Recrutement", "Formation", "Paie", "SIRH", "Relations sociales"],
    "Vente": ["B2B", "B2C", "Account Management", "Business Development", "Export"],
    "Service Client": ["Support", "SAV", "Relation client", "Help Desk", "CRM"],
    "Logistique": ["Supply Chain", "Transport", "Achats", "Stock", "Planning"],
    "Production": ["Industrie", "Qualité", "Maintenance", "R&D", "Méthodes"],
    "Recherche": ["R&D", "Innovation", "Études", "Veille", "Laboratoire"],
    "Éducation": ["Formation", "E-learning", "Tutorat", "Pédagogie", "EdTech"],
    "Santé": ["Médical", "Paramédical", "Recherche", "E-santé", "Bien-être"],
    "Expertise": ["Formation", "Audit", "Conseil", "Expertise technique", "Certification"]
  };

  const sortedCategories = Object.keys(allCategories).sort((a, b) => {
    // Mettre Manuel et Construction en premier
    if (a === "Manuel") return -1;
    if (b === "Manuel") return 1;
    if (a === "Construction") return -1;
    if (b === "Construction") return 1;
    return a.localeCompare(b);
  });

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={category}
          onValueChange={(value) => {
            onChange("category", value);
            onChange("subcategory", ""); // Reset subcategory when category changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {sortedCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {category && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Sous-catégorie</Label>
          <Select
            value={subcategory}
            onValueChange={(value) => onChange("subcategory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              {allCategories[category]?.sort().map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}