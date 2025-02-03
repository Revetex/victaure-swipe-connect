import { motion } from "framer-motion";
import { 
  Megaphone, 
  Handshake, 
  TrendingUp, 
  Building2, 
  Users,
  BarChartHorizontal,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MarketingPanel() {
  const promotions = [
    {
      icon: Building2,
      title: "Partenariats Entreprises",
      description: "Rejoignez notre réseau d'entreprises partenaires et accédez à des talents qualifiés.",
      action: "En savoir plus",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Handshake,
      title: "Programme d'Affiliation",
      description: "Gagnez des commissions en recommandant Victaure à votre réseau.",
      action: "Devenir Partenaire",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Gift,
      title: "Offres Spéciales",
      description: "Profitez de nos offres exclusives pour les nouveaux recruteurs.",
      action: "Voir les Offres",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "10k+",
      label: "Utilisateurs Actifs",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      icon: BarChartHorizontal,
      value: "85%",
      label: "Taux de Satisfaction",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Taux de Réussite",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm space-y-4 p-4"
    >
      <Card className="border-none bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Opportunités Partenaires</CardTitle>
          </div>
          <CardDescription>
            Découvrez comment développer votre activité avec Victaure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {promotions.map((promo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-full", promo.bgColor)}>
                  <promo.icon className={cn("h-5 w-5", promo.color)} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">{promo.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {promo.description}
                  </p>
                  <Button 
                    variant="link" 
                    className={cn("p-0 h-auto font-medium", promo.color)}
                  >
                    {promo.action}
                  </Button>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-lg text-center space-y-2",
              stat.bgColor
            )}
          >
            <div className="flex justify-center">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div className={cn("text-xl font-bold", stat.color)}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}