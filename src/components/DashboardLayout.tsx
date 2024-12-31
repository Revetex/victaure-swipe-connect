import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { PaymentBox } from "@/components/dashboard/PaymentBox";
import { JobList } from "@/components/jobs/JobList";
import { useJobsQuery } from "@/components/marketplace/hooks/useJobsQuery";
import { defaultFilters } from "@/components/jobs/JobFilterUtils";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { data: jobs = [], isLoading, error, refetch } = useJobsQuery(defaultFilters);

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
      {/* Content */}
      <div className="relative z-10 flex-1 overflow-auto py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px] pb-12">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages Section - Updated width */}
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

            {/* SwipeJob Section - Adjusted to maintain layout */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-1 xl:col-span-2 h-[650px] md:h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <SwipeJob />
              </div>
            </motion.div>

            {/* Jobs Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-2 xl:col-span-4 min-h-[650px] md:min-h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 overflow-auto">
                <div className="p-6 sm:p-8">
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
              className="col-span-1 md:col-span-2 xl:col-span-4 min-h-[650px] md:min-h-[750px] mb-12"
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
    </div>
  );
}