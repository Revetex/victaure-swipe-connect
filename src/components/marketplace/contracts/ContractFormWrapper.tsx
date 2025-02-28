
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Schéma de validation pour le formulaire
const contractSchema = z.object({
  title: z.string().min(10, "Le titre doit faire au moins 10 caractères").nonempty("Le titre est requis"),
  description: z.string().min(50, "La description doit faire au moins 50 caractères").nonempty("La description est requise"),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  deadline: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  currency: z.string().default("CAD")
});

type ContractFormData = z.infer<typeof contractSchema>;

export function ContractFormWrapper() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [requirements, setRequirements] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState<ContractFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    currency: "CAD"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour créer un contrat");
      return;
    }
    
    try {
      // Valider les données avec zod
      const validatedData = contractSchema.parse(formData);
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('marketplace_contracts')
        .insert({
          title: validatedData.title,
          description: validatedData.description,
          budget_min: validatedData.budget_min,
          budget_max: validatedData.budget_max,
          deadline: validatedData.deadline,
          creator_id: user.id,
          status: 'active',
          category: validatedData.category,
          location: validatedData.location,
          requirements: requirements,
          currency: validatedData.currency || 'CAD',
          created_at: new Date().toISOString()
        });
    
      if (error) throw error;
      
      toast.success("Contrat créé avec succès");
      navigate('/dashboard/marketplace?tab=contracts');
    } catch (error) {
      console.error('Error submitting contract:', error);
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          toast.error(`Erreur de validation: ${err.message}`);
        });
      } else {
        toast.error("Erreur lors de la création du contrat");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Traitement spécial pour les champs numériques
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? Number(value) : undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addRequirement = (requirement: string) => {
    if (requirement.trim()) {
      setRequirements(prev => [...prev, requirement.trim()]);
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== index));
  };

  // Redirige vers la page du marketplace avec l'onglet des contrats
  const handleCancel = () => {
    navigate('/dashboard/marketplace?tab=contracts');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Créer un nouveau contrat</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Titre du contrat
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Ex: Développement d'une application mobile"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description détaillée
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md min-h-32"
            placeholder="Décrivez votre projet en détail..."
            required
          />
        </div>

        {/* Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="budget_min" className="block text-sm font-medium">
              Budget minimum
            </label>
            <input
              id="budget_min"
              name="budget_min"
              type="number"
              value={formData.budget_min || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ex: 1000"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="budget_max" className="block text-sm font-medium">
              Budget maximum
            </label>
            <input
              id="budget_max"
              name="budget_max"
              type="number"
              value={formData.budget_max || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ex: 5000"
            />
          </div>
        </div>

        {/* Devise et Date limite */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="currency" className="block text-sm font-medium">
              Devise
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="CAD">CAD - Dollar canadien</option>
              <option value="USD">USD - Dollar américain</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="deadline" className="block text-sm font-medium">
              Date limite
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Catégorie et Localisation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium">
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="development">Développement</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="writing">Rédaction</option>
              <option value="other">Autre</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              Localisation
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ex: Montréal, QC"
            />
          </div>
        </div>

        {/* Compétences requises */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Compétences requises
          </label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {requirements.map((req, index) => (
              <div key={index} className="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                {req}
                <button 
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              placeholder="Ajouter une compétence requise"
              className="flex-1 px-3 py-2 border rounded-l-md"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRequirement((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 rounded-r-md border border-l-0"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Ajouter une compétence requise"]') as HTMLInputElement;
                if (input) {
                  addRequirement(input.value);
                  input.value = '';
                  input.focus();
                }
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Création en cours..." : "Créer le contrat"}
          </button>
        </div>
      </form>
    </div>
  );
}
