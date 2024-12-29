import { useState } from "react";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { missionCategories, Job } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { PlusCircle, Search } from "lucide-react";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function Marketplace() {
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobs = [], isLoading, error, refetch } = useQuery({
    queryKey: ["jobs", category, subcategory, duration, activeTab],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        let query = supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (activeTab === "mine" && user) {
          query = query.eq("employer_id", user.id);
        }

        if (category && category !== "all") {
          query = query.eq("category", category);
        }

        if (subcategory && subcategory !== "all") {
          query = query.eq("subcategory", subcategory);
        }

        if (duration && duration !== "all") {
          query = query.eq("contract_type", duration);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching jobs:", error);
          throw error;
        }

        return data.map(job => ({
          ...job,
          company: "Company Name",
          skills: ["Skill 1", "Skill 2"],
          salary: `${job.budget} CAD`
        })) as Job[];
      } catch (error) {
        console.error("Error in job query:", error);
        toast.error("Erreur lors du chargement des missions");
        throw error;
      }
    }
  });

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-destructive">Une erreur est survenue lors du chargement des missions</p>
      </div>
    );
  }

  const handleJobCreated = () => {
    setIsDialogOpen(false);
    refetch();
  };

  return (
    <section className="py-8 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as "all" | "mine")}>
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="all">Toutes les missions</TabsTrigger>
                <TabsTrigger value="mine">Mes annonces</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Filtres
            </Button>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle mission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <CreateJobForm onSuccess={handleJobCreated} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {showFilters && (
            <JobFilters
              category={category}
              setCategory={setCategory}
              subcategory={subcategory}
              setSubcategory={setSubcategory}
              duration={duration}
              setDuration={setDuration}
              missionCategories={missionCategories}
            />
          )}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <JobList 
              jobs={jobs} 
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}