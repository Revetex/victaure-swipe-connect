import { Check, Briefcase, Calendar, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Briefcase,
      title: t("features.items.matching.title"),
      description: t("features.items.matching.description"),
    },
    {
      icon: Calendar,
      title: t("features.items.management.title"),
      description: t("features.items.management.description"),
    },
    {
      icon: Check,
      title: t("features.items.certification.title"),
      description: t("features.items.certification.description"),
    },
    {
      icon: DollarSign,
      title: t("features.items.financial.title"),
      description: t("features.items.financial.description"),
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {t("features.whyChoose")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}