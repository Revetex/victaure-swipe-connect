import { motion } from "framer-motion";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentActivityProps {
  isEditing: boolean;
}

export function RecentActivity({ isEditing }: RecentActivityProps) {
  const activities = [
    {
      id: 1,
      title: "Nouvelle mission créée",
      description: "Mission de développement web",
      time: "Il y a 2 heures",
    },
    {
      id: 2,
      title: "Candidature reçue",
      description: "John Doe a postulé à votre mission",
      time: "Il y a 3 heures",
    },
    {
      id: 3,
      title: "Paiement effectué",
      description: "CAD 500 pour la mission #1234",
      time: "Il y a 5 heures",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Activité récente
        </h3>
        {isEditing && (
          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
            Configurer
          </Button>
        )}
      </div>
      
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start space-x-4 rounded-lg p-3 transition-colors
                ${isEditing ? 'cursor-move hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
            >
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Aucune activité récente</p>
        </div>
      )}
      
      <Button
        variant="ghost"
        className="w-full justify-between text-blue-500 hover:text-blue-600"
      >
        Voir toutes les activités
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}