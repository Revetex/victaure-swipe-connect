import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, UserPlus, Briefcase } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      type: "message",
      text: "Nouveau message de Marie",
      time: "Il y a 5 min",
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      type: "like",
      text: "Thomas a aimé votre profil",
      time: "Il y a 15 min",
      icon: ThumbsUp,
      color: "text-emerald-500"
    },
    {
      type: "connection",
      text: "Nouvelle connexion avec Pierre",
      time: "Il y a 1h",
      icon: UserPlus,
      color: "text-purple-500"
    },
    {
      type: "job",
      text: "Candidature vue par l'employeur",
      time: "Il y a 2h",
      icon: Briefcase,
      color: "text-amber-500"
    }
  ];

  return (
    <Card className="p-6 bg-white dark:bg-dark-charcoal border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Activité récente
      </h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.type}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`p-2 rounded-full bg-gray-50 dark:bg-gray-800 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.text}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}