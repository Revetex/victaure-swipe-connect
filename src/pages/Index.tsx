import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* M. Victaure Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/10">
              <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
              <AvatarFallback className="bg-primary/20">
                <Bot className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold mb-2">M. Victaure</h2>
              <p className="text-muted-foreground mb-4">
                Votre assistant IA personnel, prêt à vous aider dans votre recherche d'emploi
              </p>
              <Link to="/dashboard">
                <Button className="gap-2">
                  <Bot className="h-4 w-4" />
                  Discuter avec M. Victaure
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Trouvez votre prochain emploi
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
            Découvrez des opportunités professionnelles adaptées à vos compétences et aspirations.
            Notre plateforme vous accompagne dans votre recherche d'emploi.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/jobs">
              <Button size="lg">
                Voir les offres
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="lg">
                Créer mon profil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}