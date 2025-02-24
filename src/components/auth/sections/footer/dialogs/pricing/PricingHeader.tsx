
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function PricingHeader() {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold text-center text-[#F1F0FB] mb-4">
          Guide Tarifaire Victaure 2025
        </DialogTitle>
        <DialogDescription id="pricing-description" className="text-center text-[#F1F0FB]/80 mb-6">
          Découvrez nos différentes offres et choisissez celle qui correspond le mieux à vos besoins
        </DialogDescription>
      </DialogHeader>
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-semibold text-[#64B5D9]">Plans d'abonnement</h3>
        <p className="text-[#F1F0FB]/80">Choisissez le plan qui correspond à vos besoins</p>
      </div>
    </>
  );
}
