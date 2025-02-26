
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PartnershipDialog } from "./dialogs/PartnershipDialog";
import { PricingDialog } from "./dialogs/PricingDialog";

export function AuthFooterActions() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="relative group bg-[#2C2C2C]/50 text-[#E0E0E0] hover:bg-[#3C3C3C]/50 px-6 py-3 rounded-full border border-[#3C3C3C]/10 transition-all duration-300 hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Partenariat
              <div className="w-1.5 h-1.5 rounded-full bg-[#64B5D9] group-hover:scale-150 transition-transform" />
            </span>
          </Button>
        </DialogTrigger>
        <PartnershipDialog />
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="relative group bg-[#2C2C2C]/50 text-[#E0E0E0] hover:bg-[#3C3C3C]/50 px-6 py-3 rounded-full border border-[#3C3C3C]/10 transition-all duration-300 hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Guide tarifaire complet
              <div className="w-1.5 h-1.5 rounded-full bg-[#64B5D9] group-hover:scale-150 transition-transform" />
            </span>
          </Button>
        </DialogTrigger>
        <PricingDialog />
      </Dialog>
    </div>
  );
}
