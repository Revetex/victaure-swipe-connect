import { Calculator, Languages, Ruler, ListTodo, StickyNote } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";

const tools = [
  {
    id: "notes",
    title: "Notes",
    description: "Gérez vos notes et idées",
    icon: StickyNote,
    path: "/dashboard/tools/notes"
  },
  {
    id: "tasks",
    title: "Tâches",
    description: "Organisez vos tâches quotidiennes",
    icon: ListTodo,
    path: "/dashboard/tools/tasks"
  },
  {
    id: "calculator",
    title: "Calculatrice",
    description: "Effectuez des calculs rapidement",
    icon: Calculator,
    path: "/dashboard/tools/calculator"
  },
  {
    id: "translator",
    title: "Traducteur",
    description: "Traduisez du texte facilement",
    icon: Languages,
    path: "/dashboard/tools/translator"
  },
  {
    id: "converter",
    title: "Convertisseur",
    description: "Convertissez des unités de mesure",
    icon: Ruler,
    path: "/dashboard/tools/converter"
  }
];

export function ToolsPage() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Outils" currentPage={5} onPageChange={(page) => navigate(`/dashboard`)}>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:bg-accent/5 transition-colors"
                  onClick={() => navigate(tool.path)}
                >
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="w-8 h-8 mr-2 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}