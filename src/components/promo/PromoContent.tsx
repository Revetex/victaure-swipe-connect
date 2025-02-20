
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Trophy, Users, Rocket, Gift } from "lucide-react";
import { motion } from "framer-motion";

interface PromoSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

function PromoSection({ title, description, icon, delay = 0 }: PromoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-4 h-full bg-gradient-to-br from-background to-muted/50 backdrop-blur-sm border-primary/10">
        <div className="flex items-start gap-3">
          <div className="shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-base mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function PromoContent() {
  return (
    <div className="space-y-6 p-4">
      <div className="text-center space-y-2 mb-8">
        <Badge variant="outline" className="mb-2">
          <Sparkles className="h-3 w-3 mr-1" />
          Victaure.com
        </Badge>
        <h2 className="text-2xl font-bold tracking-tight">
          Votre Assistant Professionnel Intelligent
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez une nouvelle façon de gérer votre carrière avec l'aide de l'intelligence artificielle.
          Trouvez des opportunités, développez vos compétences et réseautez efficacement.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PromoSection
          title="Recherche d'emploi intelligente"
          description="Notre IA analyse votre profil et trouve les meilleures opportunités correspondant à vos compétences."
          icon={<Star className="h-5 w-5" />}
          delay={0.1}
        />
        <PromoSection
          title="Réseau professionnel"
          description="Connectez-vous avec des professionnels de votre domaine et élargissez votre réseau."
          icon={<Users className="h-5 w-5" />}
          delay={0.2}
        />
        <PromoSection
          title="Assistant IA personnel"
          description="Obtenez des conseils personnalisés pour améliorer votre CV et votre présence professionnelle."
          icon={<Rocket className="h-5 w-5" />}
          delay={0.3}
        />
      </div>

      <div className="mt-8 space-y-4">
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Programme VIP</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Accédez à des fonctionnalités exclusives et maximisez vos chances de succès professionnel.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <span>CV Premium personnalisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <span>Conseils d'experts</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <span>Candidatures prioritaires</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <span>Support dédié 24/7</span>
            </div>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Commencer gratuitement
        </Button>
      </div>
    </div>
  );
}
