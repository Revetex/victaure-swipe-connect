import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SwipeJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*');

        if (error) throw error;

        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error("Erreur lors de la récupération des emplois");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Available Jobs</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </div>
  );
}
