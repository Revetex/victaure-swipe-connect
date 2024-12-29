import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, MessageSquare, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  activeJobs: number;
  unreadMessages: number;
  pendingPayments: string;
  nextJob: string;
}

interface QuickAction {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export function Dashboard() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [jobsResponse, messagesResponse] = await Promise.all([
        supabase
          .from('jobs')
          .select('*', { count: 'exact' })
          .eq('employer_id', user.id)
          .eq('status', 'open'),
        supabase
          .from('messages')
          .select('*', { count: 'exact' })
          .eq('receiver_id', user.id)
          .eq('read', false),
      ]);

      const { data: matches } = await supabase
        .from('matches')
        .select('id')
        .eq('employer_id', user.id)
        .eq('status', 'accepted');

      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pending')
        .in('match_id', matches?.map(match => match.id) || []);

      const pendingAmount = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      return {
        activeJobs: jobsResponse.count || 0,
        unreadMessages: messagesResponse.count || 0,
        pendingPayments: `CAD ${pendingAmount.toLocaleString()}`,
        nextJob: 'Dans 2 jours'
      };
    }
  });

  const quickActions: QuickAction[] = [
    {
      title: "Missions en cours",
      value: stats?.activeJobs.toString() || "0",
      icon: Briefcase,
      color: "text-victaure-blue",
      bgColor: "bg-victaure-blue/10",
    },
    {
      title: "Messages non lus",
      value: stats?.unreadMessages.toString() || "0",
      icon: MessageSquare,
      color: "text-victaure-green",
      bgColor: "bg-victaure-green/10",
    },
    {
      title: "Paiements en attente",
      value: stats?.pendingPayments || "CAD 0",
      icon: DollarSign,
      color: "text-victaure-red",
      bgColor: "bg-victaure-red/10",
    },
    {
      title: "Prochaine mission",
      value: stats?.nextJob || "Aucune",
      icon: Calendar,
      color: "text-victaure-blue",
      bgColor: "bg-victaure-blue/10",
    },
  ];

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