
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Upload } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";

const contractFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  type: z.string().min(1, "Le type est requis"),
  location: z.string().min(1, "La localisation est requise"),
  budget_min: z.number().min(0, "Le budget minimum doit être positif"),
  budget_max: z.number().min(0, "Le budget maximum doit être positif"),
  deadline: z.date().optional(),
  requirements: z.array(z.string()),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

export function ContractForm() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      requirements: [],
      type: "service",
      category: "technology",
    },
  });

  const onSubmit = async (data: ContractFormValues) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un contrat");
      return;
    }

    try {
      setUploading(true);

      // Upload documents first
      const documentUrls: string[] = [];
      for (const file of files) {
        const fileName = `${crypto.randomUUID()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("contract-documents")
          .upload(fileName, file);

        if (uploadError) {
          toast.error(`Erreur lors de l'upload du fichier ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("contract-documents")
          .getPublicUrl(fileName);

        documentUrls.push(publicUrl);
      }

      // Create contract with listing
      const { error } = await supabase
        .from("marketplace_contracts")
        .insert({
          title: data.title,
          description: data.description,
          budget_min: data.budget_min,
          budget_max: data.budget_max,
          deadline: data.deadline?.toISOString(),
          requirements: data.requirements,
          category: data.category,
          location: data.location,
          currency: "CAD",
          creator_id: user.id,
          documents: documentUrls,
          status: "open",
        });

      if (error) throw error;

      // Créer également une annonce marketplace
      const { error: listingError } = await supabase
        .from("marketplace_listings")
        .insert({
          title: data.title,
          description: data.description,
          price: data.budget_max,
          type: data.type,
          currency: "CAD",
          seller_id: user.id,
          status: "active",
        });

      if (listingError) throw listingError;

      toast.success("Contrat et annonce créés avec succès");
      form.reset();
      setFiles([]);
    } catch (error) {
      console.error("Error creating contract:", error);
      toast.error("Erreur lors de la création du contrat");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'annonce</FormLabel>
              <FormControl>
                <Input placeholder="Titre du contrat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'annonce</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="project">Projet</SelectItem>
                  <SelectItem value="contract">Contrat</SelectItem>
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technology">Technologie</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="writing">Rédaction</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="legal">Juridique</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
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
                  placeholder="Description détaillée du contrat"
                  className="min-h-[100px]"
                  {...field} 
                />
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
                <Input placeholder="Ville, Province" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget minimum (CAD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0}
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                    min={0}
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date limite</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Documents (PDF)</FormLabel>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="flex-1"
            />
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          {files.length > 0 && (
            <ul className="text-sm text-muted-foreground">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={uploading}
        >
          {uploading ? "Création en cours..." : "Publier l'annonce"}
        </Button>
      </form>
    </Form>
  );
}
