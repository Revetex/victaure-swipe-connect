import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { defaultFilters } from "@/components/jobs/JobFilterUtils";
import { useJobsQuery } from "@/components/marketplace/hooks/useJobsQuery";
import { toast } from "sonner";
import { MessagesSection } from "./dashboard/sections/MessagesSection";
import { SwipeSection } from "./dashboard/sections/SwipeSection";
import { JobsSection } from "./dashboard/sections/JobsSection";
import { VCardSection } from "./dashboard/sections/VCardSection";
import { PaymentSection } from "./dashboard/sections/PaymentSection";
import type { JobFilters } from "./jobs/JobFilterUtils";

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
            <MessagesSection variants={itemVariants} />
            <SwipeSection variants={itemVariants} />
            <JobsSection 
              variants={itemVariants}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              openLocation={openLocation}
              setOpenLocation={setOpenLocation}
              jobs={jobs}
              isLoading={isLoading}
              error={error}
              onJobDeleted={refetch}
              onCreateClick={() => setIsCreateDialogOpen(true)}
            />
            <VCardSection variants={itemVariants} />
            <PaymentSection variants={itemVariants} />
          </motion.div>
        </div>
      </div>

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