import { Check, Briefcase, Calendar, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

export function Features() {
  const { t } = useTranslation();

  const features: FeatureItem[] = [
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
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {t("features.whyChoose")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description }: FeatureItem) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}