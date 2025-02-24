import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Check, Shield, Star, ArrowRight } from "lucide-react";

export function AuthFooter() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const contactInfo = {
    name: "Thomas Blanchet",
    title: "Développement / Conception",
    email: "tblanchet@hotmail.com",
    tel: "+1(819) 668-0473"
  };
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.name}
TITLE:${contactInfo.title}
EMAIL:${contactInfo.email}
TEL:${contactInfo.tel}
END:VCARD`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        error
      } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      if (error) throw error;
      toast.success("Message envoyé avec succès!");
      setIsOpen(false);
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    }
  };

  return <footer className="mt-24 w-full max-w-xl mx-auto px-4 text-center relative" role="contentinfo">
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
                <p className="font-medium text-[#64B5D9]">{contactInfo.name}</p>
                <p>{contactInfo.title}</p>
                <p>Email: {contactInfo.email}</p>
                <p>Tél: {contactInfo.tel}</p>
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
        </Dialog>
      </div>

      <div className="space-y-8 border-t border-[#F1F0FB]/20 pt-8">
        <div className="flex justify-center mb-12">
          <img src="/lovable-uploads/white-signature.png" alt="Signature décorative" className="w-40 h-16 object-contain opacity-50" />
        </div>

        <nav className="flex flex-wrap justify-center gap-3 text-sm text-[#F1F0FB]/80" role="navigation">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]">
                Conditions d'utilisation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">Conditions d'utilisation</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm prose-invert max-w-none">
                <h3>1. Acceptation des conditions</h3>
                <p>En accédant à Victaure, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>
                
                <h3>2. Utilisation du service</h3>
                <p>Vous vous engagez à utiliser le service de manière éthique et légale. Toute utilisation frauduleuse ou abusive est strictement interdite.</p>
                
                <h3>3. Responsabilité</h3>
                <p>Victaure ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme.</p>
                
                <h3>4. Protection des données</h3>
                <p>Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité.</p>
                
                <h3>5. Propriété intellectuelle</h3>
                <p>Tout le contenu sur Victaure est protégé par les droits d'auteur et autres lois sur la propriété intellectuelle.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]">
                Politique de confidentialité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">Politique de confidentialité</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm prose-invert max-w-none">
                <h3>1. Collecte des données</h3>
                <p>Nous collectons uniquement les données nécessaires au bon fonctionnement du service et à l'amélioration de votre expérience.</p>
                
                <h3>2. Utilisation des données</h3>
                <p>Vos données sont utilisées pour personnaliser votre expérience, améliorer nos services et vous proposer des offres pertinentes.</p>
                
                <h3>3. Protection des données</h3>
                <p>Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données personnelles.</p>
                
                <h3>4. Vos droits</h3>
                <p>Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]">
                Politique des cookies
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">Politique des cookies</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm prose-invert max-w-none">
                <h3>1. Utilisation des cookies</h3>
                <p>Nous utilisons des cookies pour améliorer votre expérience de navigation et personnaliser nos services.</p>
                
                <h3>2. Types de cookies</h3>
                <p>Nous utilisons des cookies essentiels, analytiques et de performance pour optimiser notre plateforme.</p>
                
                <h3>3. Gestion des cookies</h3>
                <p>Vous pouvez modifier vos préférences de cookies à tout moment dans les paramètres de votre navigateur.</p>
                
                <h3>4. Conservation</h3>
                <p>Les cookies sont conservés pour une durée maximale de 13 mois conformément aux recommandations de la CNIL.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#F1F0FB]/80 hover:text-[#F1F0FB]">
                Nous contacter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-[#F1F0FB]">Contactez-nous</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-[#F1F0FB]">
                    Nom
                  </label>
                  <Input id="contact-name" required value={formData.name} onChange={e => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))} className="bg-white text-[#1B2A4A]" autoFocus={false} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-[#F1F0FB]">
                    Email
                  </label>
                  <Input id="contact-email" type="email" required value={formData.email} onChange={e => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))} className="bg-white text-[#1B2A4A]" autoFocus={false} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-medium text-[#F1F0FB]">
                    Message
                  </label>
                  <Textarea id="contact-message" required value={formData.message} onChange={e => setFormData(prev => ({
                  ...prev,
                  message: e.target.value
                }))} className="bg-white text-[#1B2A4A] min-h-[100px]" autoFocus={false} />
                </div>
                <Button type="submit" className="w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white">
                  Envoyer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </nav>

        <div className="text-sm text-[#F1F0FB]/80 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#64B5D9]/5 to-transparent opacity-50"></div>
          <p className="relative">© 2025 Victaure Technologies inc.</p>
        </div>
      </div>
    </footer>;
}
