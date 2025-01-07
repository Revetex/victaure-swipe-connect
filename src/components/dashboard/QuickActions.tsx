import { StatsGrid } from "./stats/StatsGrid";
import type { DashboardStats } from "@/types/dashboard";

interface QuickActionsProps {
  stats: DashboardStats | undefined;
}

export function QuickActions({ stats }: QuickActionsProps) {
  return <StatsGrid stats={stats} />;
}