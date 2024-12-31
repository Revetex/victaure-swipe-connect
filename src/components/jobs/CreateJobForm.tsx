import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Job } from "@/types/job";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  budget: z.string().min(1, "Le budget est requis"),
  location: z.string().min(1, "La localisation est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  subcategory: z.string().min(1, "La sous-catégorie est requise"),
  contract_type: z.string().min(1, "Le type de contrat est requis"),
  experience_level: z.string().min(1, "Le niveau d'expérience est requis"),
});

interface CreateJobFormProps {
  onSuccess: () => void;
  initialData?: Job;
}

export function CreateJobForm({ onSuccess, initialData }: CreateJobFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      budget: initialData.budget.toString(),
      location: initialData.location,
      category: initialData.category,
      subcategory: initialData.subcategory || "",
      contract_type: initialData.contract_type,
      experience_level: initialData.experience_level,
    } : {
      title: "",
      description: "",
      budget: "",
      location: "",
      category: "",
      subcategory: "",
      contract_type: "",
      experience_level: "",
    },
  });

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour créer ou modifier une mission");
      }
    };
    checkAuth();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer une mission");
        return;
      }

      const jobData = {
        title: values.title,
        description: values.description,
        budget: parseFloat(values.budget),
        location: values.location,
        employer_id: user.id,
        category: values.category,
        subcategory: values.subcategory,
        contract_type: values.contract_type,
        experience_level: values.experience_level,
      };

      if (initialData) {
        // Update existing job
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', initialData.id);

        if (error) {
          console.error('Error updating job:', error);
          throw error;
        }
        toast.success("Mission mise à jour avec succès");
      } else {
        // Create new job
        const { error } = await supabase
          .from('jobs')
          .insert([jobData]);

        if (error) {
          console.error('Error creating job:', error);
          throw error;
        }
        toast.success("Mission créée avec succès");
      }

      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error submitting job:', error);
      toast.error("Une erreur est survenue lors de la soumission");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la mission</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Développeur React Senior" {...field} />
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
                  placeholder="Décrivez la mission en détail..."
                  className="min-h-[100px]"
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (CAD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 5000" {...field} />
                </FormControl>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <JobCategoryFields
            category={form.watch("category")}
            subcategory={form.watch("subcategory")}
            onChange={(field, value) => form.setValue(field as any, value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <JobTypeFields
            contractType={form.watch("contract_type")}
            experienceLevel={form.watch("experience_level")}
            onChange={(field, value) => form.setValue(field as any, value)}
          />
        </div>

        <Button type="submit" className="w-full">
          {initialData ? "Mettre à jour la mission" : "Créer la mission"}
        </Button>
      </form>
    </Form>
  );
}