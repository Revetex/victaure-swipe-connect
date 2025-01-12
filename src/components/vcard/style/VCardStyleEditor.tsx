import { UserProfile } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useVCardStyle } from "../VCardStyleContext";
import { motion } from "framer-motion";

interface VCardStyleEditorProps {
  profile: UserProfile;
  onStyleChange: (updates: Partial<UserProfile>) => void;
}

export function VCardStyleEditor({ profile, onStyleChange }: VCardStyleEditorProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-semibold">Personnalisation</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Police de caractères</Label>
          <select
            value={profile.custom_font || selectedStyle.font}
            onChange={(e) => onStyleChange({ custom_font: e.target.value })}
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          >
            <option value="Inter, sans-serif">Inter</option>
            <option value="Roboto, sans-serif">Roboto</option>
            <option value="Poppins, sans-serif">Poppins</option>
            <option value="Montserrat, sans-serif">Montserrat</option>
            <option value="Open Sans, sans-serif">Open Sans</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Couleur d'arrière-plan</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={profile.custom_background || selectedStyle.colors.background.card}
              onChange={(e) => onStyleChange({ custom_background: e.target.value })}
              className="h-10 w-full cursor-pointer"
            />
            <button
              onClick={() => onStyleChange({ custom_background: null })}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                "border border-input hover:bg-accent",
                "transition-colors duration-200"
              )}
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Couleur du texte</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={profile.custom_text_color || selectedStyle.colors.text.primary}
              onChange={(e) => onStyleChange({ custom_text_color: e.target.value })}
              className="h-10 w-full cursor-pointer"
            />
            <button
              onClick={() => onStyleChange({ custom_text_color: null })}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                "border border-input hover:bg-accent",
                "transition-colors duration-200"
              )}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Ces modifications seront appliquées uniquement à votre profil. 
            Vous pouvez les réinitialiser à tout moment.
          </p>
        </div>
      </div>
    </motion.div>
  );
}