
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSwipeJobs } from "./swipe/useSwipeJobs";
import { defaultFilters } from "./JobFilterUtils";
import { Loader2 } from "lucide-react";

interface JobsPreviewProps {
  onAuthRequired: () => void;
}

export function JobsPreview({ onAuthRequired }: JobsPreviewProps) {
  const navigate = useNavigate();
  const { jobs, loading } = useSwipeJobs(defaultFilters);
  const previewJobs = (jobs || []).slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {previewJobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-card p-4 rounded-lg shadow-md"
          >
            <h3 className="font-semibold mb-2">{job.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {job.company_name}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {job.location}
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onAuthRequired}
            >
              Voir l'offre
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button 
          size="lg"
          onClick={() => navigate("/auth")}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Voir toutes les offres d'emploi
        </Button>
      </div>
    </div>
  );
}
