
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Diamond, Star, Crown, Sword, ScrollText, HelpCircle, AlertTriangle } from "lucide-react";
import { PyramidRush } from "./pyramid/PyramidRush";
import { ZodiacFortune } from "./zodiac/ZodiacFortune";
import { LotoSphere } from "./sphere/LotoSphere";
import { ChessPage } from "../tools/ChessPage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export function LotteryPage() {
  const { handlePayment, loading } = usePaymentHandler();
  const isMobile = useIsMobile();

  const handleGamePayment = async (amount: number, gameTitle: string) => {
    try {
      await handlePayment(amount, `Paiement pour ${gameTitle}`);
      toast("Paiement traité avec succès !");
    } catch (error) {
      toast("Erreur lors du paiement", {
        description: "Une erreur est survenue lors du traitement du paiement",
      });
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-20 min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Espace Jeux Imperium
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Découvrez nos jeux exceptionnels
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-sm">
                  <ScrollText className="h-4 w-4" />
                  Règlement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Règlement et Conditions d'Utilisation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">1. Conditions Générales</h3>
                    <p>En accédant à nos jeux, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">2. Responsabilité</h3>
                    <p>Les jeux sont fournis "tels quels". Nous ne pouvons garantir qu'ils seront sans interruption, sécurisés ou sans erreurs.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">3. Fair-Play</h3>
                    <p>Toute tentative de triche ou d'exploitation de bugs entraînera une suspension immédiate du compte.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">4. Protection des Données</h3>
                    <p>Vos données de jeu sont protégées conformément à notre politique de confidentialité.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold text-foreground mb-2">5. Propriété Intellectuelle</h3>
                    <p>Tout le contenu des jeux est protégé par les lois sur la propriété intellectuelle.</p>
                  </section>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-sm">
                  <HelpCircle className="h-4 w-4" />
                  Infos
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-2xl sm:w-full">
                <DialogHeader>
                  <DialogTitle>Informations sur nos Jeux</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>Nos jeux sont conçus pour offrir une expérience divertissante et équitable à tous les utilisateurs.</p>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-2">
                      <Diamond className="h-4 w-4 text-blue-400 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">Échecs vs IA</h4>
                        <p>Affrontez notre IA avec différents niveaux de difficulté.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Trophy className="h-4 w-4 text-yellow-400 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">Pyramid Rush</h4>
                        <p>Testez votre chance dans ce jeu de probabilités captivant.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-purple-400 mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">Zodiac Fortune</h4>
                        <p>Découvrez votre chance à travers les signes du zodiaque.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Alerte
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-2xl sm:w-full">
                <DialogHeader>
                  <DialogTitle>Jeu Responsable</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Jouez de manière responsable :</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Fixez-vous des limites de temps et respectez-les</li>
                    <li>Ne jouez que pour le divertissement</li>
                    <li>Prenez des pauses régulières</li>
                    <li>N'essayez pas de récupérer vos pertes</li>
                  </ul>
                  <p className="text-yellow-500">Si vous avez besoin d'aide, n'hésitez pas à contacter notre support.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="chess" className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4'}`}>
            <TabsTrigger value="chess" className="space-x-2">
              <Sword className="h-4 w-4" />
              <span className="truncate">Échecs</span>
            </TabsTrigger>
            <TabsTrigger value="pyramid" className="space-x-2">
              <Trophy className="h-4 w-4" />
              <span className="truncate">Pyramid Rush</span>
            </TabsTrigger>
            <TabsTrigger value="zodiac" className="space-x-2">
              <Star className="h-4 w-4" />
              <span className="truncate">Zodiac Fortune</span>
            </TabsTrigger>
            <TabsTrigger value="sphere" className="space-x-2">
              <Crown className="h-4 w-4" />
              <span className="truncate">LotoSphere</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chess" className="mt-4 sm:mt-6">
            <Card className="p-2 sm:p-6">
              <ChessPage />
            </Card>
          </TabsContent>

          <TabsContent value="pyramid" className="mt-4 sm:mt-6">
            <Card className="p-2 sm:p-6">
              <PyramidRush onPaymentRequested={handleGamePayment} />
            </Card>
          </TabsContent>

          <TabsContent value="zodiac" className="mt-4 sm:mt-6">
            <Card className="p-2 sm:p-6">
              <ZodiacFortune onPaymentRequested={handleGamePayment} />
            </Card>
          </TabsContent>

          <TabsContent value="sphere" className="mt-4 sm:mt-6">
            <Card className="p-2 sm:p-6">
              <LotoSphere onPaymentRequested={handleGamePayment} />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

