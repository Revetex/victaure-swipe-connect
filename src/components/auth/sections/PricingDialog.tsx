
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { motion } from "framer-motion";
import { ArrowRight, Check, Shield, Clock, CreditCard, AlertCircle } from "lucide-react";

interface PricingDialogProps {
  isPricingOpen: boolean;
  setIsPricingOpen: (open: boolean) => void;
}

export function PricingDialog({ isPricingOpen, setIsPricingOpen }: PricingDialogProps) {
  return (
    <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
      <DialogContent className="max-w-4xl w-11/12 h-[80vh] overflow-y-auto bg-[#1B2A4A] border-2 border-[#64B5D9]/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-[#F2EBE4] mb-6">
            Tarifs Victaure 2025
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 p-4">
          <section className="space-y-6">
            <h3 className="text-xl font-semibold text-[#F2EBE4] flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Abonnements Mensuels
            </h3>
            <PricingGrid />
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-[#F2EBE4] flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Commissions sur Contrats
            </h3>
            <div className="bg-[#2A2D3E]/50 rounded-lg p-4">
              <h4 className="font-medium text-[#F2EBE4] mb-3">Prix Fixe</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-[#F2EBE4]/80">
                <div>{"< 1 000 CAD"}</div><div>5%</div>
                <div>1 000-5 000 CAD</div><div>4%</div>
                <div>{"> 5 000 CAD"}</div><div>3%</div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="font-medium text-[#F2EBE4] mb-2">Enchères</h4>
                <div className="text-sm text-[#F2EBE4]/80">
                  <div>Base : 6%</div>
                  <div>Maximum : 8%</div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-[#F2EBE4] flex items-center gap-2">
              <Check className="w-5 h-5" />
              Promotions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#2A2D3E]/50 rounded-lg p-4">
                <h4 className="font-medium text-[#F2EBE4] mb-2">Réduction Annuelle</h4>
                <p className="text-sm text-[#F2EBE4]/80">2 MOIS GRATUITS sur tout abonnement annuel</p>
              </div>
              <div className="bg-[#2A2D3E]/50 rounded-lg p-4">
                <h4 className="font-medium text-[#F2EBE4] mb-2">Startups</h4>
                <p className="text-sm text-[#F2EBE4]/80">-20% sur tous les abonnements<br/>Éligibilité : entreprises {"< 2 ans"}</p>
              </div>
              <div className="bg-[#2A2D3E]/50 rounded-lg p-4">
                <h4 className="font-medium text-[#F2EBE4] mb-2">Volume de Contrats</h4>
                <p className="text-sm text-[#F2EBE4]/80">-10% après 25 contrats<br/>-20% après 50 contrats</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-[#F2EBE4] flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Services Additionnels
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#2A2D3E]/50 rounded-lg p-4">
                <h4 className="font-medium text-[#F2EBE4] mb-2">Mise en Avant</h4>
                <ul className="text-sm text-[#F2EBE4]/80 space-y-2">
                  <li>Contrat Standard : GRATUIT</li>
                  <li>Contrat Premium (7 jours) : 29 CAD</li>
                  <li>Contrat Urgent (14 jours) : 59 CAD</li>
                </ul>
              </div>
              <div className="bg-[#2A2D3E]/50 rounded-lg p-4">
                <h4 className="font-medium text-[#F2EBE4] mb-2">Formation</h4>
                <ul className="text-sm text-[#F2EBE4]/80 space-y-2">
                  <li>En ligne (2h) : 299 CAD</li>
                  <li>Sur site : 599 CAD</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-[#F2EBE4] flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Garanties et Conditions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#2A2D3E]/50 rounded-lg p-4">
                <h4 className="font-medium text-[#F2EBE4] mb-2">Garanties</h4>
                <ul className="text-sm text-[#F2EBE4]/80 space-y-2">
                  <li>• Paiement sécurisé par entiercement</li>
                  <li>• 7 jours de période de validation</li>
                  <li>• Support client prioritaire</li>
                  <li>• Remboursement sous conditions</li>
                </ul>
              </div>
              <div className="bg-[#2A2D3E]/50 rounded-lg p-4">
                <h4 className="font-medium text-[#F2EBE4] mb-2">Conditions</h4>
                <ul className="text-sm text-[#F2EBE4]/80 space-y-2">
                  <li>• Prix en CAD (HT)</li>
                  <li>• Engagement : 3 mois minimum</li>
                  <li>• Préavis : 30 jours</li>
                  <li>• Paiement mensuel ou annuel</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
