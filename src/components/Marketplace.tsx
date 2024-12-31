import { useState } from "react";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { missionCategories, Job } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Marketplace() {
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<number[]>([300, 1000]);

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ["jobs", category, subcategory, duration, salaryRange],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(job => ({
        ...job,
        company: "Company Name",
        skills: ["Skill 1", "Skill 2"],
        salary: `${job.budget} CAD`
      })) as Job[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-victaure-blue"></div>
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
          <JobList jobs={jobs} onJobDeleted={() => refetch()} />
        </div>
      </div>
    </section>
  );
}