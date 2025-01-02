import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageSquare, Briefcase, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Activity } from "./types";

interface ActivityItemProps {
  activity: Activity;
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

const getIcon = (type: Activity['type']) => {
  switch (type) {
    case 'message':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'match':
      return <Briefcase className="h-5 w-5 text-green-500" />;
    case 'notification':
      return <Bell className="h-5 w-5 text-yellow-500" />;
  }
};

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <motion.div 
      variants={item}
      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
        {getIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-white">
          {activity.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {activity.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {format(new Date(activity.created_at), "d MMMM 'à' HH:mm", { locale: fr })}
        </p>
      </div>
    </motion.div>
  );
}