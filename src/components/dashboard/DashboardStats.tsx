
import { Card } from "@/components/ui/card";
import { Briefcase, MessageSquare, DollarSign, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardStats as DashboardStatsType } from "@/types/dashboard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
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

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async (): Promise<DashboardStatsType> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch active jobs count
      const { count: activeJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      // Fetch unread messages count
      const { count: unreadMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);

      // Fetch pending payments
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pending');
      const pendingPayments = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Fetch next job
      const { data: nextJobs } = await supabase
        .from('jobs')
        .select('title')
        .eq('status', 'open')
        .order('created_at', { ascending: true })
        .limit(1);

      return {
        activeJobs: activeJobs || 0,
        unreadMessages: unreadMessages || 0,
        pendingPayments: `CAD ${pendingPayments.toFixed(2)}`,
        nextJob: nextJobs?.[0]?.title || "Aucune mission"
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-10 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const quickActions = [
    {
      title: "Missions en cours",
      value: stats?.activeJobs.toString() || "0",
      icon: Briefcase,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Messages non lus",
      value: stats?.unreadMessages.toString() || "0",
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Paiements en attente",
      value: stats?.pendingPayments || "CAD 0",
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Prochaine mission",
      value: stats?.nextJob || "Aucune",
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
    >
      {quickActions.map((action, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className={cn("p-6 overflow-hidden relative group cursor-pointer")}>
            <div className={cn("absolute inset-0 opacity-50", action.bgColor)} />
            <div className="relative">
              <div className={cn("p-2 w-fit rounded-lg", action.bgColor)}>
                <action.icon className={cn("h-5 w-5", action.color)} />
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{action.title}</p>
                <p className="text-2xl font-semibold mt-1">{action.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
