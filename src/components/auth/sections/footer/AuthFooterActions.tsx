import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function AuthFooterActions() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="relative group bg-gradient-to-r from-[#4A90E2] to-[#64B5D9] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Partenariat
              <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 rounded-full transition-transform group-hover:scale-105 duration-300" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">Partenariat Victaure</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-[#F1F0FB]">
            <div className="text-center space-y-2">
              <p className="font-medium text-[#64B5D9]">Thomas Blanchet</p>
              <p>Développement / Conception</p>
              <p>Email: tblanchet@hotmail.com</p>
              <p>Tél: +1(819) 668-0473</p>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-lg shadow-lg relative">
                <QRCodeSVG value={vCardData} size={80} level="H" includeMargin={true} className="rounded" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img src="/lovable-uploads/color-logo.png" alt="Victaure Logo" className="w-12 h-12 opacity-90" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#4A90E2]/10 to-[#64B5D9]/10 p-4 rounded-lg border border-[#64B5D9]/20">
              <h4 className="font-medium mb-2">Avantages du Partenariat</h4>
              <ul className="text-sm space-y-2 text-[#F1F0FB]/90">
                <li>• Accès prioritaire aux nouvelles fonctionnalités</li>
                <li>• Support dédié 24/7</li>
                <li>• Formations personnalisées gratuites</li>
                <li>• Événements exclusifs partenaires</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="relative group bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Guide tarifaire complet
              <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 rounded-full transition-transform group-hover:scale-105 duration-300" />
          </Button>
        </DialogTrigger>
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
