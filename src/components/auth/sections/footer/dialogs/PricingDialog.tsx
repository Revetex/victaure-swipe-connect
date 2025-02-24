
import { DialogContent } from "@/components/ui/dialog";
import { PricingHeader } from "./pricing/PricingHeader";
import { PricingContent } from "./pricing/PricingContent";

export function PricingDialog() {
  return (
    <DialogContent 
      className="md:max-w-4xl w-11/12 h-[80vh] overflow-y-auto bg-[#1B2A4A] border-2 border-[#F1F0FB]/20"
      aria-describedby="pricing-description"
    >
      <div className="space-y-12 p-6 text-[#F1F0FB]">
        <section className="space-y-8">
          <PricingHeader />
          <PricingContent />
        </section>
      </div>
    </DialogContent>
  );
}
