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
            <DialogContent className="sm:max-w-md bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">Charte des prix Victaure</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 text-[#F1F0FB]">
                <div className="grid gap-4">
                  <div className="p-5 bg-gradient-to-br from-[#4A90E2]/10 to-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20">
                    <h4 className="font-medium text-lg mb-3 text-[#64B5D9]">Plan Starter <span className="text-sm font-normal text-[#F1F0FB]/70">299 CAD/mois</span></h4>
                    <ul className="text-sm space-y-2 text-[#F1F0FB]/90">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        8 offres d'emploi actives
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        Gestion des candidatures
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        30 jours d'affichage
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        Commission standard
                      </li>
                    </ul>
                  </div>
                    
                  <div className="p-5 bg-gradient-to-br from-[#4A90E2]/20 to-[#64B5D9]/20 rounded-lg border-2 border-[#64B5D9]/30 relative">
                    <div className="absolute -top-3 right-4 bg-[#64B5D9] text-white px-3 py-1 rounded-full text-xs font-medium">
                      POPULAIRE
                    </div>
                    <h4 className="font-medium text-lg mb-3 text-[#64B5D9]">Plan Pro <span className="text-sm font-normal text-[#F1F0FB]/70">799 CAD/mois</span></h4>
                    <ul className="text-sm space-y-2 text-[#F1F0FB]/90">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        Offres illimitées
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        500 CV dans la base
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        45 jours d'affichage
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        -10% sur commissions
                      </li>
                    </ul>
                  </div>
                    
                  <div className="p-5 bg-gradient-to-br from-[#4A90E2]/10 to-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20">
                    <h4 className="font-medium text-lg mb-3 text-[#64B5D9]">Plan Enterprise <span className="text-sm font-normal text-[#F1F0FB]/70">2499 CAD/mois</span></h4>
                    <ul className="text-sm space-y-2 text-[#F1F0FB]/90">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        CV illimités
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        Visibilité maximale
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        Account manager dédié
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                        -20% sur commissions
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20">
                  <h4 className="font-medium mb-3 text-[#64B5D9]">Structure des Commissions</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                      Contrats {"< 1 000 CAD"}
                    </div>
                    <div>5%</div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                      1 000-5 000 CAD
                    </div>
                    <div>4%</div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#64B5D9]" />
                      {"> 5 000 CAD"}
                    </div>
                    <div>3%</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#64B5D9]/20">
                    <p className="text-sm">Système d'enchères: 6-8% selon la compétition</p>
                  </div>
                </div>
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
