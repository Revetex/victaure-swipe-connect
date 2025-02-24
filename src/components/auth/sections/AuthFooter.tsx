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

  return (
    <footer className="mt-24 w-full max-w-xl mx-auto px-4 text-center relative" role="contentinfo">
      <div className="space-y-8 border-t border-[#F1F0FB]/20 pt-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="relative group bg-gradient-to-r from-[#4A90E2] to-[#64B5D9] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
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
                    <QRCodeSVG 
                      value={vCardData}
                      size={80}
                      level="H"
                      includeMargin={true}
                      className="rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img 
                        src="/lovable-uploads/color-logo.png"
                        alt="Victaure Logo"
                        className="w-12 h-12 opacity-90"
                      />
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
              <Button 
                className="relative group bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Charte des prix officielle
                  <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 rounded-full transition-transform group-hover:scale-105 duration-300" />
              </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-4xl w-11/12 h-[80vh] overflow-y-auto bg-[#1B2A4A] border-2 border-[#F1F0FB]/20">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-[#F1F0FB] mb-2">Guide Tarifaire Victaure 2025</DialogTitle>
                <p className="text-[#F1F0FB]/70 text-center text-sm">En vigueur au 29 février 2025</p>
              </DialogHeader>
              <div className="space-y-8 p-4 text-[#F1F0FB]">
                <section className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#64B5D9] mb-4">Formules d'abonnement et flexibilité</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-[#4A90E2]/10 to-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20">
                      <h4 className="font-medium text-lg mb-2">Formule Flex</h4>
                      <p className="text-sm text-[#F1F0FB]/70 mb-3">Liberté totale sans engagement</p>
                      <ul className="text-sm space-y-2">
                        <li>• Paiement mensuel</li>
                        <li>• Prix standard</li>
                        <li>• Annulation à tout moment</li>
                        <li>• Modification mensuelle possible</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#4A90E2]/20 to-[#64B5D9]/20 rounded-lg border-2 border-[#64B5D9]/30 relative">
                      <div className="absolute -top-3 right-4 bg-[#64B5D9] text-white px-3 py-1 rounded-full text-xs font-medium">
                        POPULAIRE
                      </div>
                      <h4 className="font-medium text-lg mb-2">Formule Smart</h4>
                      <p className="text-sm text-[#F1F0FB]/70 mb-3">Engagement optimisé 3 mois</p>
                      <ul className="text-sm space-y-2">
                        <li>• -5% sur tous les prix</li>
                        <li>• Paiement trimestriel</li>
                        <li>• Renouvellement automatique</li>
                        <li>• Changement trimestriel possible</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#4A90E2]/10 to-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20">
                      <h4 className="font-medium text-lg mb-2">Formule Premium</h4>
                      <p className="text-sm text-[#F1F0FB]/70 mb-3">Engagement annuel privilégié</p>
                      <ul className="text-sm space-y-2">
                        <li>• 2 mois gratuits (-17%)</li>
                        <li>• Paiement annuel unique</li>
                        <li>• Garantie satisfait ou remboursé</li>
                        <li>• Prix bloqués 12 mois</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#64B5D9] mb-4">Plans d'abonnement détaillés</h3>
                  
                  <div className="p-6 bg-white/5 rounded-lg border border-[#64B5D9]/20">
                    <h4 className="text-lg font-medium text-[#64B5D9] mb-4">Plan Starter</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Tarification</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Mensuel: 299 CAD/mois</li>
                          <li>• Trimestriel: 284 CAD/mois</li>
                          <li>• Annuel: 249 CAD/mois</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Fonctionnalités</h5>
                        <ul className="text-sm space-y-1">
                          <li>• 8 offres actives</li>
                          <li>• 30 jours d'affichage</li>
                          <li>• Base de 100 CV</li>
                          <li>• 1 admin + 2 utilisateurs</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Outils</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Publication d'offres</li>
                          <li>• Gestion candidatures</li>
                          <li>• 5 templates</li>
                          <li>• Tableau de bord</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Support</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Email (< 24h)</li>
                          <li>• Documentation</li>
                          <li>• Tutoriels vidéo</li>
                          <li>• Chat 9h-17h</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-lg border-2 border-[#64B5D9]/30 relative">
                    <div className="absolute -top-3 right-4 bg-[#64B5D9] text-white px-3 py-1 rounded-full text-xs font-medium">
                      RECOMMANDÉ
                    </div>
                    <h4 className="text-lg font-medium text-[#64B5D9] mb-4">Plan Pro</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Tarification</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Mensuel: 799 CAD/mois</li>
                          <li>• Trimestriel: 759 CAD/mois</li>
                          <li>• Annuel: 666 CAD/mois</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Fonctionnalités</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Offres illimitées</li>
                          <li>• 45 jours d'affichage</li>
                          <li>• Base de 500 CV</li>
                          <li>• 3 admin + 5 utilisateurs</li>
                          <li>• -10% commissions</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Outils avancés</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Tests de compétences</li>
                          <li>• Filtres avancés</li>
                          <li>• 20 templates</li>
                          <li>• Analytics</li>
                          <li>• API basique</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Support PRO</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Prioritaire (< 4h)</li>
                          <li>• Formation en ligne</li>
                          <li>• Chat 24/5</li>
                          <li>• Webinaires mensuels</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-lg border border-[#64B5D9]/20">
                    <h4 className="text-lg font-medium text-[#64B5D9] mb-4">Plan Enterprise</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Tarification</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Mensuel: 2 499 CAD/mois</li>
                          <li>• Trimestriel: 2 374 CAD/mois</li>
                          <li>• Annuel: 2 082 CAD/mois</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Tout illimité</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Offres illimitées</li>
                          <li>• CV illimités</li>
                          <li>• 60 jours d'affichage</li>
                          <li>• Utilisateurs illimités</li>
                          <li>• -20% commissions</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Outils enterprise</h5>
                        <ul className="text-sm space-y-1">
                          <li>• API complète</li>
                          <li>• Intégration SIRH</li>
                          <li>• Analyses prédictives</li>
                          <li>• Multi-sites/langues</li>
                          <li>• Templates illimités</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Support VIP</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Account manager</li>
                          <li>• Support 24/7</li>
                          <li>• Formation sur site</li>
                          <li>• Audits trimestriels</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#64B5D9] mb-4">Système de contrats</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20">
                        <h4 className="font-medium mb-3">Commissions standards</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>{"< 1 000 CAD"}</div><div>5%</div>
                          <div>1 000-5 000 CAD</div><div>4%</div>
                          <div>{"> 5 000 CAD"}</div><div>3%</div>
                          <div>{"> 10 000 CAD"}</div><div>Négociable</div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20">
                        <h4 className="font-medium mb-3">Système d'enchères</h4>
                        <ul className="text-sm space-y-2">
                          <li>• Taux de base : 6%</li>
                          <li>• Bonus multi-enchères : +1%</li>
                          <li>• Plafond : 8%</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg border border-[#64B5D9]/20">
                        <h4 className="font-medium mb-3">Options de publication</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-sm">Standard (Gratuit)</p>
                            <ul className="text-sm mt-1 text-[#F1F0FB]/80">
                              <li>• Visibilité normale</li>
                              <li>• 30 jours de publication</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Boost (29 CAD)</p>
                            <ul className="text-sm mt-1 text-[#F1F0FB]/80">
                              <li>• Mise en avant 7 jours</li>
                              <li>• Alertes email ciblées</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Premium (59 CAD)</p>
                            <ul className="text-sm mt-1 text-[#F1F0FB]/80">
                              <li>• Badge "Urgent"</li>
                              <li>• Mise en avant 14 jours</li>
                              <li>• Top des résultats</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-[#64B5D9] mb-4">Services additionnels</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <h4 className="font-medium mb-3">Services marketing</h4>
                        <ul className="text-sm space-y-2">
                          <li>• Email ciblé : 299 CAD</li>
                          <li>• Bannière homepage : 499 CAD/semaine</li>
                          <li>• Post réseau social : 199 CAD</li>
                          <li>• Push notification : 99 CAD</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <h4 className="font-medium mb-3">Formation</h4>
                        <ul className="text-sm space-y-2">
                          <li>• Formation en ligne (2h) : 299 CAD</li>
                          <li>• Formation sur site (4h) : 599 CAD</li>
                          <li>• Consulting RH (2h) : 399 CAD</li>
                          <li>• Pack complet : 999 CAD</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-center mb-12">
          <img 
            src="/lovable-uploads/white-signature.png"
            alt="Signature décorative" 
            className="w-40 h-16 object-contain opacity-50"
          />
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
                  <Input 
                    id="contact-name" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))} 
                    className="bg-white text-[#1B2A4A]" 
                    autoFocus={false}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-[#F1F0FB]">
                    Email
                  </label>
                  <Input 
                    id="contact-email" 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))} 
                    className="bg-white text-[#1B2A4A]" 
                    autoFocus={false}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-medium text-[#F1F0FB]">
                    Message
                  </label>
                  <Textarea 
                    id="contact-message" 
                    required 
                    value={formData.message} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      message: e.target.value
                    }))} 
                    className="bg-white text-[#1B2A4A] min-h-[100px]" 
                    autoFocus={false}
                  />
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
    </footer>
  );
}
