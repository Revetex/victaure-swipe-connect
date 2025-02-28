
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRouter } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SkillsInput } from "@/components/SkillsInput";
import { MarketplaceContract, ContractFormValues } from "@/types/marketplace";
import { contractValidationSchema, ContractFormData } from "./schemas";

export function ContractForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractValidationSchema),
    defaultValues: {
      title: "",
      description: "",
      budget_min: undefined,
      budget_max: undefined,
      deadline: undefined,
      category: undefined,
      location: "",
      requirements: [],
      currency: "CAD"
    }
  });

  const handleSubmit = async (data: ContractFormData) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un contrat");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData: ContractFormValues = {
        ...data,
        requirements: requirements
      };
      
      const { error } = await supabase
        .from('marketplace_contracts')
        .insert({
          title: formData.title,
          description: formData.description,
          budget_min: formData.budget_min,
          budget_max: formData.budget_max,
          deadline: formData.deadline,
          creator_id: user.id,
          status: 'active',
          category: formData.category,
          location: formData.location,
          requirements: formData.requirements,
          currency: formData.currency || 'CAD',
          created_at: new Date().toISOString()
        });
    
      if (error) throw error;
      
      toast.success("Contrat créé avec succès");
      router.navigate('/dashboard/marketplace?tab=contracts');
    } catch (error) {
      console.error('Error submitting contract:', error);
      toast.error("Erreur lors de la création du contrat");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim() === "") return;
    setRequirements([...requirements, newRequirement.trim()]);
    setNewRequirement("");
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créer un nouveau contrat</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du contrat</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Développement d'une application mobile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre projet en détail..." 
                      className="min-h-32" 
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
                    <FormLabel>Budget minimum</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 1000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                    <FormLabel>Budget maximum</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 5000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CAD">CAD - Dollar canadien</SelectItem>
                        <SelectItem value="USD">USD - Dollar américain</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date limite</FormLabel>
                    <DatePicker
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="development">Développement</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="writing">Rédaction</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Montréal, QC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Compétences requises</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {req}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-muted-foreground hover:text-foreground"
                      onClick={() => removeRequirement(index)}
                    >
                      <Trash className="h-3 w-3" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex mt-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Ajouter une compétence requise"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={addRequirement}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Ajouter</span>
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.navigate('/dashboard/marketplace?tab=contracts')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer le contrat"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
