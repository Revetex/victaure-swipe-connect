import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paintbrush, Type, Palette, TextCursor } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const fontOptions = [
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
];

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border"
    >
      <div className="flex items-center gap-2 pb-4 border-b">
        <Paintbrush className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Personnalisation</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Police
          </Label>
          <Select
            value={profile.custom_font || "'Poppins', sans-serif"}
            onValueChange={(value) => setProfile({ ...profile, custom_font: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Arrière-plan
          </Label>
          <div className="relative">
            <Input
              type="color"
              value={profile.custom_background || "#ffffff"}
              onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
              className="h-10 px-2 border rounded-md w-full cursor-pointer"
            />
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="flex items-center gap-2">
            <TextCursor className="h-4 w-4" />
            Couleur du texte
          </Label>
          <div className="relative">
            <Input
              type="color"
              value={profile.custom_text_color || "#000000"}
              onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
              className="h-10 px-2 border rounded-md w-full cursor-pointer"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}