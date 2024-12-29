import { useState } from "react";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { missionCategories, Job } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Marketplace() {
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<number[]>([300, 1000]);

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ["jobs", category, subcategory, duration, salaryRange],
    queryFn: async () => {
      try {
        let query = supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (category && category !== "all") {
          query = query.eq("category", category);
        }

        if (subcategory && subcategory !== "all") {
          query = query.eq("subcategory", subcategory);
        }

        if (duration && duration !== "all") {
          query = query.eq("contract_type", duration);
        }

        // Filter by salary range
        query = query
          .gte("budget", salaryRange[0])
          .lte("budget", salaryRange[1]);

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
    console.error("Query error:", error);
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-destructive">Une erreur est survenue lors du chargement des missions</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          <JobFilters
            category={category}
            setCategory={setCategory}
            subcategory={subcategory}
            setSubcategory={setSubcategory}
            duration={duration}
            setDuration={setDuration}
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
            missionCategories={missionCategories}
          />
          <JobList jobs={jobs} />
        </div>
      </div>
    </section>
  );
}