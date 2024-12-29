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
    <section className="py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Pourquoi choisir Victaure ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-victaure-blue/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-victaure-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-victaure-gray-dark">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}