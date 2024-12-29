import { Users, Briefcase, DollarSign, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
  description: string;
}

export function Stats() {
  const { t } = useTranslation();

  const stats: StatItem[] = [
    {
      icon: Users,
      value: t("stats.activeUsers.value"),
      label: t("stats.activeUsers.label"),
      description: t("stats.activeUsers.description"),
    },
    {
      icon: Briefcase,
      value: t("stats.availableMissions.value"),
      label: t("stats.availableMissions.label"),
      description: t("stats.availableMissions.description"),
    },
    {
      icon: DollarSign,
      value: t("stats.revenue.value"),
      label: t("stats.revenue.label"),
      description: t("stats.revenue.description"),
    },
    {
      icon: Star,
      value: t("stats.satisfaction.value"),
      label: t("stats.satisfaction.label"),
      description: t("stats.satisfaction.description"),
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, label, description }: StatItem) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-lg font-semibold text-primary mt-1">
          {label}
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}