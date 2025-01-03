import { Check, Briefcase, Calendar, DollarSign } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Matching Intelligent",
    description:
      "Trouvez les missions qui correspondent parfaitement à vos compétences grâce à notre IA.",
  },
  {
    icon: Calendar,
    title: "Gestion Simplifiée",
    description:
      "Gérez vos contrats et paiements en toute simplicité avec notre plateforme automatisée.",
  },
  {
    icon: Check,
    title: "Certifications Blockchain",
    description:
      "Validez vos compétences avec des certifications sécurisées et reconnues.",
  },
  {
    icon: DollarSign,
    title: "Services Financiers",
    description:
      "Accédez à des services financiers et assuranciels intégrés pour sécuriser vos missions.",
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 animate-fadeIn">
          Pourquoi choisir Victaure ?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}