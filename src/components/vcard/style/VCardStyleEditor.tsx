import { UserProfile } from "@/types/profile";
import { styleOptions } from "../styles";
import { useVCardStyle } from "../VCardStyleContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface VCardStyleEditorProps {
  profile: UserProfile;
  onStyleChange: (updates: Partial<UserProfile>) => void;
}

export function VCardStyleEditor({ profile, onStyleChange }: VCardStyleEditorProps) {
  const { selectedStyle, setSelectedStyle } = useVCardStyle();

  return (
    <div className="space-y-6 bg-background text-foreground">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Style du profil</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {styleOptions.map((style) => (
            <div
              key={style.id}
              className={cn(
                "p-4 rounded-lg cursor-pointer transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                selectedStyle.id === style.id ? "ring-2 ring-primary" : "ring-1 ring-border"
              )}
              onClick={() => {
                setSelectedStyle(style);
                onStyleChange({ style_id: style.id });
              }}
              style={{
                background: style.colors.background.card,
                borderColor: style.colors.primary
              }}
            >
              <div className="space-y-2">
                <div 
                  className="h-4 rounded"
                  style={{ background: style.colors.primary }}
                />
                <div 
                  className="h-2 w-2/3 rounded"
                  style={{ background: style.colors.secondary }}
                />
                <p 
                  className="text-sm font-medium mt-2"
                  style={{ 
                    color: style.colors.text.primary,
                    fontFamily: style.font
                  }}
                >
                  {style.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personnalisation</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Police personnalisée</Label>
            <Input
              value={profile.custom_font || ""}
              onChange={(e) => onStyleChange({ custom_font: e.target.value })}
              placeholder="ex: 'Roboto', sans-serif"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>Couleur de texte personnalisée</Label>
            <Input
              type="color"
              value={profile.custom_text_color || "#000000"}
              onChange={(e) => onStyleChange({ custom_text_color: e.target.value })}
              className="h-10 px-2 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>Arrière-plan personnalisé</Label>
            <Input
              type="color"
              value={profile.custom_background || "#ffffff"}
              onChange={(e) => onStyleChange({ custom_background: e.target.value })}
              className="h-10 px-2 bg-background"
            />
          </div>
        </div>
      </div>
    </div>
  );
}