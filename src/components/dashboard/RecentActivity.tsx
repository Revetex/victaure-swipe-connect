import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityItem } from "./activity/ActivityItem";
import { useRecentActivity } from "./activity/useRecentActivity";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <h3 className="text-lg font-semibold">Activité récente</h3>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activité récente</h3>
      <ScrollArea className="h-[500px] pr-4">
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {activities?.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}