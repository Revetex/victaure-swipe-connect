import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { PaymentBox } from "@/components/dashboard/PaymentBox";
import { JobList } from "@/components/jobs/JobList";
import { useJobsQuery } from "@/components/marketplace/hooks/useJobsQuery";
import { defaultFilters } from "@/components/jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { Plus, Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { JobFiltersPanel } from "./jobs/JobFiltersPanel";
import { JobFilters } from "./jobs/JobFilterUtils";
import { toast } from "sonner";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [openLocation, setOpenLocation] = useState(false);
  
  const { data: jobs = [], isLoading, error, refetch } = useJobsQuery(filters);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
    toast.success("Mission créée avec succès");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-auto py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px] pb-12">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-1 xl:col-span-1 h-[650px] md:h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <div className="p-6 sm:p-8 h-full">
                  <Messages />
                </div>
              </div>
            </motion.div>

            {/* SwipeJob Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-1 xl:col-span-2 h-[650px] md:h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <SwipeJob />
              </div>
            </motion.div>

            {/* Jobs Management Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-2 xl:col-span-3 min-h-[650px] md:min-h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 overflow-auto">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mes Missions</h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrer
                      </Button>
                      <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="flex-1 sm:flex-none bg-victaure-blue hover:bg-victaure-blue-dark"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle Mission
                      </Button>
                    </div>
                  </div>

                  {showFilters && (
                    <JobFiltersPanel
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      openLocation={openLocation}
                      setOpenLocation={setOpenLocation}
                    />
                  )}

                  <JobList 
                    jobs={jobs} 
                    isLoading={isLoading}
                    error={error}
                    onJobDeleted={() => refetch()} 
                  />
                </div>
              </div>
            </motion.div>

            {/* VCard Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-2 xl:col-span-4 min-h-[650px] md:min-h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 overflow-auto">
                <div className="p-6 sm:p-8">
                  <VCard />
                </div>
              </div>
            </motion.div>

            {/* Payment Box Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-2 xl:col-span-4 h-[450px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <div className="p-6 sm:p-8 h-full">
                  <PaymentBox />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Create Job Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle mission</DialogTitle>
          </DialogHeader>
          <CreateJobForm onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}