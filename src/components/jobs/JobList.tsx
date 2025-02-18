
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, Building2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  contract_type: string;
  created_at: string;
  salary_range?: string;
  description: string;
  budget?: number;
  accept_bids?: boolean;
  application_deadline?: string;
  application_steps?: any;
  benefits?: string[];
  bid_end_date?: string;
  category?: string;
  certifications_required?: string[];
}

interface JobListProps {
  filters: any;
  showFilters: boolean;
  filterType: string;
  viewMode: 'list' | 'grid' | 'cards';
  jobs?: Job[];
  onJobDeleted?: () => void;
}

export function JobList({ filters, showFilters, filterType, viewMode, jobs: propJobs, onJobDeleted }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propJobs) {
      setJobs(propJobs);
      setLoading(false);
      return;
    }

    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedJobs = data.map(job => ({
          ...job,
          company: job.company_name || 'Entreprise',
          type: job.contract_type || 'Temps plein'
        }));

        setJobs(formattedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error("Impossible de charger les offres d'emploi");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [propJobs]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Aucune offre disponible</h3>
        <p className="text-muted-foreground">
          Revenez plus tard pour voir les nouvelles offres
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card 
          key={job.id}
          className={cn(
            "p-6 transition-all duration-200 hover:shadow-lg cursor-pointer",
            "border-l-4 border-l-primary"
          )}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-lg font-semibold text-foreground/90 mb-1">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company_name}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {job.contract_type}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(job.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </Badge>
                {job.salary_range && (
                  <Badge variant="secondary">
                    {job.salary_range}
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground line-clamp-2">
                {job.description}
              </p>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
          </div>
        </Card>
      ))}
    </div>
  );
}
