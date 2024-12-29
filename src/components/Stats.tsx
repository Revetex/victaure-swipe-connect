import { Users, Briefcase, DollarSign, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Stats() {
  const { t } = useTranslation();

  const stats = [
    {
      name: t("stats.activeUsers.label"),
      value: t("stats.activeUsers.value"),
      icon: Users,
      description: t("stats.activeUsers.description"),
    },
    {
      name: t("stats.availableMissions.label"),
      value: t("stats.availableMissions.value"),
      icon: Briefcase,
      description: t("stats.availableMissions.description"),
    },
    {
      name: t("stats.revenue.label"),
      value: t("stats.revenue.value"),
      icon: DollarSign,
      description: t("stats.revenue.description"),
    },
    {
      name: t("stats.satisfaction.label"),
      value: t("stats.satisfaction.value"),
      icon: Star,
      description: t("stats.satisfaction.description"),
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-victaure-gray-light rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-white rounded-full">
                <stat.icon className="h-6 w-6 text-victaure-blue" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-lg font-semibold text-victaure-blue mt-1">
                {stat.name}
              </p>
              <p className="text-victaure-gray-dark text-sm mt-2 text-center">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}