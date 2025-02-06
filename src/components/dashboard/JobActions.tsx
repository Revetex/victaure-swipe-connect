import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function JobActions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formatCsvValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return `"${value.join(', ')}"`;
    if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
    return String(value);
  };

  const handleExport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id);

      if (jobsError) throw jobsError;

      const headers = [
        'Titre',
        'Description',
        'Budget',
        'Localisation',
        'Catégorie',
        'Type de contrat',
        'Niveau d\'expérience',
        'Type de travail à distance',
        'Compétences requises',
        'Avantages',
        'Date de création'
      ];

      const csvRows = [
        headers.join(','),
        ...jobsData.map(job => [
          formatCsvValue(job.title),
          formatCsvValue(job.description),
          formatCsvValue(job.budget),
          formatCsvValue(job.location),
          formatCsvValue(job.category),
          formatCsvValue(job.contract_type),
          formatCsvValue(job.experience_level),
          formatCsvValue(job.remote_type),
          formatCsvValue(job.required_skills),
          formatCsvValue(job.benefits),
          formatCsvValue(new Date(job.created_at).toLocaleDateString())
        ].join(','))
      ];

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `missions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export réussi !");
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast.error("Une erreur est survenue lors de l'export");
    }
  };

  const handleRefresh = async () => {
    try {
      console.log("Refreshing dashboard data...");
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      await queryClient.invalidateQueries({ queryKey: ['jobs'] });
      await queryClient.invalidateQueries({ queryKey: ['scraped-jobs'] });
      toast.success("Données actualisées !");
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error);
      toast.error("Une erreur est survenue lors de l'actualisation");
    }
  };

  const handleCreateJob = () => {
    navigate("/jobs/create");
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={handleRefresh}
        className="bg-white dark:bg-gray-800 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
      >
        Actualiser
      </Button>
      <Button
        variant="outline"
        onClick={handleExport}
        className="bg-white dark:bg-gray-800 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-300"
      >
        Exporter
      </Button>
      <Button
        onClick={handleCreateJob}
        className="bg-victaure-blue text-white hover:bg-victaure-blue/90 transition-all duration-300"
      >
        Créer une mission
      </Button>
    </div>
  );
}