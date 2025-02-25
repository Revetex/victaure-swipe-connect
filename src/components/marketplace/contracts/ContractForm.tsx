
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { contractFormSchema, type ContractFormValues } from "@/types/marketplace";

const categories = [
  "Développement Web",
  "Design",
  "Marketing",
  "Rédaction",
  "Traduction",
  "Autre"
];

export function ContractForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useUser();

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      currency: "CAD",
      requirements: [],
    },
  });

  const onSubmit = async (values: ContractFormValues) => {
    try {
      if (!user) {
        toast.error("Vous devez être connecté pour créer un contrat");
        return;
      }

      const { error } = await supabase
        .from('marketplace_contracts')
        .insert({
          ...values,
          creator_id: user.id,
          status: 'open',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Contrat créé avec succès");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
      toast.error("Erreur lors de la création du contrat");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du contrat</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Développement d'une application web" />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Décrivez votre projet en détail..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="budget_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget minimum</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    placeholder="0"
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
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    placeholder="1000"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
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
              <FormItem>
                <FormLabel>Date limite</FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </FormControl>
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
              <FormLabel>Localisation</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Montréal, QC" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" className="w-full sm:w-auto">
            Créer le contrat
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
