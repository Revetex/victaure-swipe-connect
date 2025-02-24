import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Shield, Star } from "lucide-react";

export function PricingGuideDialog() {
  return (
    <DialogContent className="md:max-w-4xl w-11/12 h-[80vh] overflow-y-auto bg-[#1B2A4A] border-2 border-[#F1F0FB]/20">
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold text-center text-[#F1F0FB] mb-6">Guide Tarifaire Victaure 2025</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-12 p-6 text-[#F1F0FB]">
        <section className="space-y-8">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-2xl font-semibold text-[#64B5D9]">Plans d'abonnement</h3>
            <p className="text-[#F1F0FB]/80">Choisissez le plan qui correspond à vos besoins</p>
          </div>
          
          <div className="grid gap-8">
            <div className="p-8 bg-white/5 rounded-xl border-2 border-[#64B5D9]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#64B5D9]/10 px-4 py-2 rounded-bl-xl">
                <span className="text-sm font-medium">STARTER</span>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h5 className="font-semibold text-xl mb-4 text-[#64B5D9]">Tarification</h5>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#64B5D9]">299</span>
                      <span className="text-lg">CAD/mois</span>
                    </div>
                    <p className="text-sm text-[#F1F0FB]/60">284 CAD/mois si trimestriel</p>
                    <p className="text-sm text-[#F1F0FB]/60">249 CAD/mois si annuel</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Fonctionnalités</h5>
                  <ul className="space-y-2 text-sm">
                    {["8 offres actives", "30 jours d'affichage", "Base de 100 CV", "1 admin + 2 utilisateurs"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Outils</h5>
                  <ul className="space-y-2 text-sm">
                    {["Publication d'offres", "Gestion candidatures", "5 templates", "Tableau de bord"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Support</h5>
                  <ul className="space-y-2 text-sm">
                    {["Réponse en moins de 24h", "Documentation", "Tutoriels vidéo", "Chat 9h-17h"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-xl border-2 border-[#64B5D9] relative overflow-hidden">
              <div className="absolute -top-3 right-4 bg-[#64B5D9] text-white px-4 py-1 rounded-full text-sm font-medium">
                RECOMMANDÉ
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h5 className="font-semibold text-xl mb-4 text-[#64B5D9]">Tarification PRO</h5>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#64B5D9]">799</span>
                      <span className="text-lg">CAD/mois</span>
                    </div>
                    <p className="text-sm text-[#F1F0FB]/60">759 CAD/mois si trimestriel</p>
                    <p className="text-sm text-[#F1F0FB]/60">666 CAD/mois si annuel</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Fonctionnalités</h5>
                  <ul className="space-y-2 text-sm">
                    {["Offres illimitées", "45 jours d'affichage", "Base de 500 CV", "3 admin + 5 utilisateurs", "-10% commissions"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Outils avancés</h5>
                  <ul className="space-y-2 text-sm">
                    {["Tests de compétences", "Filtres avancés", "20 templates", "Analytics", "API basique"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Support PRO</h5>
                  <ul className="space-y-2 text-sm">
                    {["Réponse en moins de 4h", "Formation en ligne", "Chat 24/5", "Webinaires mensuels"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-xl border-2 border-[#64B5D9]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#64B5D9]/10 px-4 py-2 rounded-bl-xl">
                <span className="text-sm font-medium">ENTERPRISE</span>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h5 className="font-semibold text-xl mb-4 text-[#64B5D9]">Tarification</h5>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#64B5D9]">2 499</span>
                      <span className="text-lg">CAD/mois</span>
                    </div>
                    <p className="text-sm text-[#F1F0FB]/60">2 374 CAD/mois si trimestriel</p>
                    <p className="text-sm text-[#F1F0FB]/60">2 082 CAD/mois si annuel</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Tout illimité</h5>
                  <ul className="space-y-2 text-sm">
                    {["Offres illimitées", "CV illimités", "60 jours d'affichage", "Utilisateurs illimités", "-20% commissions"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Outils enterprise</h5>
                  <ul className="space-y-2 text-sm">
                    {["API complète", "Intégration SIRH", "Analyses prédictives", "Multi-sites/langues", "Templates illimités"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-4">Support VIP</h5>
                  <ul className="space-y-2 text-sm">
                    {["Account manager", "Support 24/7", "Formation sur site", "Audits trimestriels"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#64B5D9]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-semibold text-[#64B5D9] mb-6 text-center">Commissions et Options</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-[#64B5D9]/10 rounded-xl border border-[#64B5D9]/20">
                <h4 className="text-lg font-medium mb-4 text-[#64B5D9]">Commissions standards</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white/5 rounded-lg">{"< 1 000 CAD"}</div>
                  <div className="p-3 bg-white/5 rounded-lg font-semibold">5%</div>
                  <div className="p-3 bg-white/5 rounded-lg">1 000-5 000 CAD</div>
                  <div className="p-3 bg-white/5 rounded-lg font-semibold">4%</div>
                  <div className="p-3 bg-white/5 rounded-lg">{"> 5 000 CAD"}</div>
                  <div className="p-3 bg-white/5 rounded-lg font-semibold">3%</div>
                  <div className="p-3 bg-white/5 rounded-lg">{"> 10 000 CAD"}</div>
                  <div className="p-3 bg-white/5 rounded-lg font-semibold">Négociable</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-xl border border-[#64B5D9]/20">
                <h4 className="text-lg font-medium mb-4 text-[#64B5D9]">Options de publication</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="font-medium">Standard (Gratuit)</p>
                    <ul className="mt-2 space-y-1 text-sm text-[#F1F0FB]/80">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Visibilité normale
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        30 jours de publication
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg border border-[#64B5D9]/20">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Boost</p>
                      <span className="text-[#64B5D9] font-semibold">29 CAD</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-[#F1F0FB]/80">
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#64B5D9]" />
                        Mise en avant 7 jours
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#64B5D9]" />
                        Alertes email ciblées
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg border border-[#64B5D9]/20">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Premium</p>
                      <span className="text-[#64B5D9] font-semibold">59 CAD</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-[#F1F0FB]/80">
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#64B5D9]" />
                        Badge "Urgent"
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#64B5D9]" />
                        Mise en avant 14 jours
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#64B5D9]" />
                        Top des résultats
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DialogContent>
  );
}
