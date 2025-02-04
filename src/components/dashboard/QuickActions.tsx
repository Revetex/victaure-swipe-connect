import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Users 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Publier une offre",
      description: "Créer une nouvelle offre d'emploi",
      icon: Plus,
      onClick: () => navigate("/jobs/new"),
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Rechercher",
      description: "Explorer les opportunités",
      icon: Search,
      onClick: () => navigate("/jobs"),
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Messages",
      description: "Voir vos conversations",
      icon: MessageSquare,
      onClick: () => navigate("/messages"),
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Réseau",
      description: "Gérer vos connexions",
      icon: Users,
      onClick: () => navigate("/network"),
      color: "text-amber-600 dark:text-amber-400"
    }
  ];

  return (
    <Card className="p-6 bg-white dark:bg-dark-charcoal border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Actions rapides
      </h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className="w-full justify-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={action.onClick}
            >
              <action.icon className={`w-5 h-5 ${action.color}`} />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">
                  {action.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}