
import { Users, Briefcase, DollarSign, Star } from "lucide-react";

const stats = [
  {
    name: "Utilisateurs Actifs",
    value: "50,000+",
    icon: Users,
    description: "Professionnels connectés",
  },
  {
    name: "Services IA",
    value: "15+",
    icon: Briefcase,
    description: "Solutions intelligentes",
  },
  {
    name: "Revenus Générés",
    value: "€10M+",
    icon: DollarSign,
    description: "Pour nos partenaires",
  },
  {
    name: "Taux de Réussite",
    value: "98%",
    icon: Star,
    description: "Satisfaction client",
  },
];

export function Stats() {
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
