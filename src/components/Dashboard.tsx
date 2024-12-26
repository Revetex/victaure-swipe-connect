import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, MessageSquare, DollarSign } from "lucide-react";

const quickActions = [
  {
    title: "Missions en cours",
    value: "3",
    icon: Briefcase,
    color: "text-victaure-blue",
    bgColor: "bg-victaure-blue/10",
  },
  {
    title: "Messages non lus",
    value: "12",
    icon: MessageSquare,
    color: "text-victaure-green",
    bgColor: "bg-victaure-green/10",
  },
  {
    title: "Paiements en attente",
    value: "€2,500",
    icon: DollarSign,
    color: "text-victaure-red",
    bgColor: "bg-victaure-red/10",
  },
  {
    title: "Prochaine mission",
    value: "Dans 2 jours",
    icon: Calendar,
    color: "text-victaure-blue",
    bgColor: "bg-victaure-blue/10",
  },
];

export function Dashboard() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-victaure-gray-dark mt-1">
            Bienvenue ! Voici un aperçu de votre activité.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-victaure-gray-dark">
                  {action.title}
                </CardTitle>
                <div className={`${action.bgColor} p-2 rounded-full`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{action.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            variant="outline"
            className="border-victaure-blue text-victaure-blue hover:bg-victaure-blue/10"
          >
            Voir plus de détails
          </Button>
        </div>
      </div>
    </section>
  );
}