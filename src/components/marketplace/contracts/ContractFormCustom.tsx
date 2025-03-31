
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { ContractFormValues } from "@/types/marketplace";

interface ContractFormCustomProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  userId: string;
}

export function ContractFormCustom({
  onSuccess,
  onCancel,
  userId,
}: ContractFormCustomProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<ContractFormValues>({
    defaultValues: {
      title: "",
      description: "",
      budget_min: undefined,
      budget_max: undefined,
      deadline: undefined,
      location: "",
      category: "",
      currency: "CAD",
      requirements: []
    }
  });

  const onSubmit = async (data: ContractFormValues) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour créer un contrat",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format the date for database storage
      const formattedDeadline = data.deadline 
        ? format(data.deadline, 'yyyy-MM-dd') 
        : undefined;
      
      const contractData = {
        title: data.title,
        description: data.description || "",
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        deadline: formattedDeadline,
        category: data.category,
        location: data.location,
        requirements: data.requirements || [],
        creator_id: userId,
        status: "open",
        currency: data.currency || "CAD"
      };
      
      const { error } = await supabase
        .from("marketplace_contracts")
        .insert(contractData);

      if (error) throw error;

      toast({
        title: "Contrat créé",
        description: "Votre contrat a été publié avec succès",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le contrat. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Le titre est requis" }}
            render={({ field }) => (
              <Input
                id="title"
                {...field}
              />
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "La description est requise" }}
            render={({ field }) => (
              <Textarea
                id="description"
                {...field}
              />
            )}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budget_min">Budget minimum</Label>
            <Controller
              name="budget_min"
              control={control}
              rules={{ required: "Le budget minimum est requis" }}
              render={({ field }) => (
                <Input
                  id="budget_min"
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              )}
            />
            {errors.budget_min && (
              <p className="text-sm text-red-500 mt-1">{errors.budget_min.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="budget_max">Budget maximum</Label>
            <Controller
              name="budget_max"
              control={control}
              rules={{ required: "Le budget maximum est requis" }}
              render={({ field }) => (
                <Input
                  id="budget_max"
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              )}
            />
            {errors.budget_max && (
              <p className="text-sm text-red-500 mt-1">{errors.budget_max.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="deadline">Date limite</Label>
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <Input
                id="deadline"
                type="date"
                className="w-full"
                // Convert Date to string for input
                value={field.value ? format(field.value, 'yyyy-MM-dd') : ""}
                onChange={(e) => {
                  // Convert string to Date when value changes
                  field.onChange(e.target.value ? new Date(e.target.value) : undefined);
                }}
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">Informatique & Tech</SelectItem>
                  <SelectItem value="design">Design & Création</SelectItem>
                  <SelectItem value="writing">Rédaction & Traduction</SelectItem>
                  <SelectItem value="marketing">Marketing & Ventes</SelectItem>
                  <SelectItem value="legal">Juridique</SelectItem>
                  <SelectItem value="finance">Finance & Comptabilité</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="location">Localisation</Label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input
                id="location"
                {...field}
                placeholder="Exemple: Montréal, QC"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="currency">Devise</Label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAD">Dollar canadien (CAD)</SelectItem>
                  <SelectItem value="USD">Dollar américain (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création en cours..." : "Créer le contrat"}
        </Button>
      </div>
    </form>
  );
}
