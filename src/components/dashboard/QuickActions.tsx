import { Briefcase, Calendar, MessageSquare, DollarSign } from "lucide-react";
import { QuickActionCard } from "./QuickActionCard";
import { DashboardStats } from "@/types/dashboard";
import { useMemo } from "react";

interface QuickActionsProps {
  stats: DashboardStats | undefined;
}

export function QuickActions({ stats }: QuickActionsProps) {
  const quickActions = useMemo(() => [
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
  ], [stats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action, index) => (
        <QuickActionCard key={index} {...action} />
      ))}
    </div>
  );
}