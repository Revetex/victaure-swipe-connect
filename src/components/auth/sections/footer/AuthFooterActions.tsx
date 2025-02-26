
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PartnershipDialog } from "./dialogs/PartnershipDialog";
import { PricingDialog } from "./dialogs/PricingDialog";

export function AuthFooterActions() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="relative group bg-gradient-to-r from-[#4A90E2] to-[#64B5D9] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <span className="relative z-10 flex items-center gap-2">
              Partenariat
              <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />
            </span>
          </Button>
        </DialogTrigger>
        <PartnershipDialog />
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="relative group bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <span className="relative z-10 flex items-center gap-2">
              Guide tarifaire complet
              <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />
            </span>
          </Button>
        </DialogTrigger>
        <PricingDialog />
      </Dialog>
    </div>
  );
}
