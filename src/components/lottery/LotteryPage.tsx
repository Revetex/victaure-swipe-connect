import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Diamond, Star, Crown } from "lucide-react";
import { PyramidRush } from "./pyramid/PyramidRush";

export function LotteryPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Imperium Lottery</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez nos jeux de loterie exceptionnels
          </p>
        </div>

        <Tabs defaultValue="pyramid" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pyramid" className="space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Pyramid Rush</span>
            </TabsTrigger>
            <TabsTrigger value="zodiac" className="space-x-2">
              <Star className="h-4 w-4" />
              <span>Zodiac Fortune</span>
            </TabsTrigger>
            <TabsTrigger value="sphere" className="space-x-2">
              <Crown className="h-4 w-4" />
              <span>LotoSphere</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pyramid" className="mt-6">
            <Card className="p-6">
              <PyramidRush />
            </Card>
          </TabsContent>

          <TabsContent value="zodiac" className="mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">IMPERIUM ZODIAC FORTUNE</h2>
              <p className="text-muted-foreground mb-6">
                La Loterie Astrale Premium – Quand l'univers guide vos gains !
              </p>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Grille des Gains</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Alignement Parfait</span>
                      <Badge>3 000 000 CAD$</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Harmonie Céleste</span>
                      <Badge>500 000 CAD$</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Constellation Chanceuse</span>
                      <Badge>100 000 CAD$</Badge>
                    </li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Événements Spéciaux</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>Pleine Lune : Gains doublés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>Équinoxe : Jackpot triplé</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>Pluie de Météores : Tickets gratuits</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sphere" className="mt-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">LOTOSPHERE</h2>
              <p className="text-muted-foreground mb-6">
                La révolution de la loterie digitale avec des gains garantis
              </p>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Programme VIP</h3>
                  <ul className="space-y-2">
                    {['Bronze', 'Argent', 'Or', 'Platine', 'Diamant'].map((level) => (
                      <li key={level} className="flex items-center gap-2">
                        <Diamond className="h-4 w-4" />
                        <span>{level}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Événements Hebdomadaires</h3>
                  <ul className="space-y-2">
                    <li>Lundi Magique : 50% de réduction</li>
                    <li>Mercredi Multiplicateur : Gains ×2</li>
                    <li>Vendredi Fortune : 1000 codes gagnants</li>
                    <li>Week-end en Or : Tickets gratuits VIP</li>
                  </ul>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
