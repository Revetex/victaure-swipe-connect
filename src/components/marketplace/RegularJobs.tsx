import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, Clock, ImagePlus, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { MarketplaceJob, JobCategory } from "@/types/marketplace/types";

export function RegularJobs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['marketplace-jobs'],
    queryFn: async () => {
      console.log('Fetching jobs...');
      const { data, error } = await supabase
        .from('marketplace_jobs')
        .select(`
          *,
          employer:profiles!marketplace_jobs_employer_id_fkey(full_name, avatar_url),
          category:marketplace_job_categories!marketplace_jobs_category_id_fkey(name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast.error("Erreur lors du chargement des offres d'emploi");
        throw error;
      }

      console.log('Jobs fetched:', data);
      return data as MarketplaceJob[];
    }
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['job-categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('marketplace_job_categories')
        .select('*')
        .is('parent_id', null)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error("Erreur lors du chargement des catégories");
        throw error;
      }

      console.log('Categories fetched:', data);
      return data as JobCategory[];
    }
  });

  const isLoading = jobsLoading || categoriesLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Offres d'emploi</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Publier une offre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publier une offre d'emploi</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du poste</Label>
                    <Input id="title" placeholder="Ex: Développeur Full Stack" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input id="company" placeholder="Nom de l'entreprise" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input id="location" placeholder="Ex: Montréal, QC" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary_min">Salaire minimum</Label>
                    <Input id="salary_min" type="number" min="0" step="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary_max">Salaire maximum</Label>
                    <Input id="salary_max" type="number" min="0" step="1000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary_period">Période de salaire</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Par heure</SelectItem>
                        <SelectItem value="monthly">Par mois</SelectItem>
                        <SelectItem value="yearly">Par année</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remote_type">Type de travail</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-site">Sur place</SelectItem>
                        <SelectItem value="hybrid">Hybride</SelectItem>
                        <SelectItem value="remote">Télétravail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du poste</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez le poste, les responsabilités, les exigences..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo de l'entreprise</Label>
                  <div className="aspect-square w-32 rounded-lg border-2 border-dashed border-muted flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <Button className="w-full">
                Publier l'offre
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-4 space-y-4">
              <div className="w-full h-4 bg-muted animate-pulse rounded" />
              <div className="space-y-2">
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg truncate">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {job.salary_min && job.salary_max ? (
                    <>
                      {job.salary_currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                      /{job.salary_period.replace('ly', '')}
                    </>
                  ) : (
                    "Salaire à discuter"
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">
              Aucune offre d'emploi pour le moment
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
