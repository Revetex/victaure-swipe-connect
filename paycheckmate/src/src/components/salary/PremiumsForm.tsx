import { Premiums } from "@/types/salary";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { rates } from "@/constants/rates";
import { Star } from "lucide-react";

interface PremiumsFormProps {
  premiums: Premiums;
  onPremiumChange: (type: keyof Premiums) => void;
}

export const PremiumsForm = ({ premiums, onPremiumChange }: PremiumsFormProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Star className="h-4 w-4 text-primary dark:text-white" />
        <h2 className="text-base font-semibold text-foreground">Primes</h2>
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-center space-x-2 bg-background/50 dark:bg-background/5 p-2 rounded-lg">
          <Checkbox
            id="refractory"
            checked={premiums.refractory}
            onCheckedChange={() => onPremiumChange("refractory")}
            className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="refractory" className="text-xs text-foreground cursor-pointer">
            Réfractaire (${rates.premiums.refractory}/h)
          </Label>
        </div>

        <div className="flex items-center space-x-2 bg-background/50 dark:bg-background/5 p-2 rounded-lg">
          <Checkbox
            id="superintendent"
            checked={premiums.superintendent}
            onCheckedChange={() => onPremiumChange("superintendent")}
            className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="superintendent" className="text-xs text-foreground cursor-pointer">
            Superintendant (10%)
          </Label>
        </div>

        <div className="flex items-center space-x-2 bg-background/50 dark:bg-background/5 p-2 rounded-lg">
          <Checkbox
            id="nightShift"
            checked={premiums.nightShift}
            onCheckedChange={() => onPremiumChange("nightShift")}
            className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="nightShift" className="text-xs text-foreground cursor-pointer">
            Prime de nuit (${rates.premiums.nightShift}/h)
          </Label>
        </div>

        <div className="flex items-center space-x-2 bg-background/50 dark:bg-background/5 p-2 rounded-lg">
          <Checkbox
            id="flyingPlatform"
            checked={premiums.flyingPlatform}
            onCheckedChange={() => onPremiumChange("flyingPlatform")}
            className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="flyingPlatform" className="text-xs text-foreground cursor-pointer">
            Plateforme volante (${rates.premiums.flyingPlatform}/h)
          </Label>
        </div>

        <div className="flex items-center space-x-2 bg-background/50 dark:bg-background/5 p-2 rounded-lg">
          <Checkbox
            id="airAssisted"
            checked={premiums.airAssisted}
            onCheckedChange={() => onPremiumChange("airAssisted")}
            className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="airAssisted" className="text-xs text-foreground cursor-pointer">
            Air assisté (${rates.premiums.airAssisted}/h)
          </Label>
        </div>

        <div className="flex items-center space-x-2 bg-background/50 dark:bg-background/5 p-2 rounded-lg">
          <Checkbox
            id="heavyIndustrial"
            checked={premiums.heavyIndustrial}
            onCheckedChange={() => onPremiumChange("heavyIndustrial")}
            className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="heavyIndustrial" className="text-xs text-foreground cursor-pointer">
            Industriel lourd (${rates.premiums.heavyIndustrial}/h)
          </Label>
        </div>
      </div>
    </div>
  );
};