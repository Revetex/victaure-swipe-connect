
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { ContractFormValues, contractFormSchema } from '@/types/marketplace';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContractFormCustomProps {
  initialData?: Partial<ContractFormValues>;
  onSubmit?: (data: ContractFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  showCancelButton?: boolean;
}

export function ContractFormCustom({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Publier le contrat",
  showCancelButton = true
}: ContractFormCustomProps) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<ContractFormValues>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      budget_min: initialData?.budget_min,
      budget_max: initialData?.budget_max,
      deadline: initialData?.deadline,
      category: initialData?.category || '',
      location: initialData?.location || '',
      requirements: initialData?.requirements || [],
      currency: initialData?.currency || 'CAD'
    },
  });

  const handleSubmit = async (data: ContractFormValues) => {
    if (onSubmit) {
      onSubmit(data);
      return;
    }

    try {
      setSubmitting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Vous devez être connecté pour publier un contrat");
        navigate('/auth');
        return;
      }

      const { error } = await supabase.from('marketplace_contracts').insert([
        {
          title: data.title,
          description: data.description,
          budget_min: data.budget_min || null,
          budget_max: data.budget_max || null,
          deadline: data.deadline || null,
          category: data.category || null,
          location: data.location || null,
          requirements: data.requirements || [],
          creator_id: userData.user.id,
          status: 'active',
          currency: data.currency || 'CAD'
        }
      ]);

      if (error) throw error;
      
      toast.success("Contrat publié avec succès");
      navigate('/marketplace');
    } catch (error) {
      console.error('Error publishing contract:', error);
      toast.error("Erreur lors de la publication du contrat");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          rules={contractFormSchema.title}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du contrat</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Titre descriptif du contrat" 
                  {...field}
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={contractFormSchema.description}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description détaillée</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Décrivez les détails du contrat" 
                  className="min-h-[120px] bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget minimum (CAD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Budget minimum"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget maximum (CAD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Budget maximum"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date limite</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="informatique">Informatique & Tech</SelectItem>
                    <SelectItem value="marketing">Marketing & Communication</SelectItem>
                    <SelectItem value="design">Design & Création</SelectItem>
                    <SelectItem value="redaction">Rédaction & Traduction</SelectItem>
                    <SelectItem value="business">Business & Conseil</SelectItem>
                    <SelectItem value="juridique">Juridique</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu</FormLabel>
              <FormControl>
                <Input
                  placeholder="Emplacement du contrat"
                  {...field}
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Devise</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || 'CAD'}
              >
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CAD">Dollar canadien (CAD)</SelectItem>
                  <SelectItem value="USD">Dollar américain (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exigences (séparées par des virgules)</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: 5 ans d'expérience, connaissance de React"
                  value={field.value?.join(', ') || ''}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(item => item.trim()))}
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {showCancelButton && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Annuler
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting || submitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting || submitting ? "En cours..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
