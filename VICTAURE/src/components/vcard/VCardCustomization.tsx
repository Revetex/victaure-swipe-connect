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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
    >
      <div className="flex items-center gap-2 border-b pb-4 border-white/20">
        <Paintbrush className="h-5 w-5 text-purple-400" />
        <h3 className="text-xl font-medium text-purple-100">Personnalisation</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
        >
          <Label className="flex items-center gap-2 text-purple-200">
            <Type className="h-4 w-4" />
            Police
          </Label>
          <Select
            value={profile.custom_font || "'Poppins', sans-serif"}
            onValueChange={(value) => setProfile({ ...profile, custom_font: value })}
          >
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-purple-100">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent className="bg-purple-900/95 border-purple-700">
              {fontOptions.map((font) => (
                <SelectItem 
                  key={font.value} 
                  value={font.value}
                  className="text-purple-100 hover:bg-purple-800/50"
                >
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
        >
          <Label className="flex items-center gap-2 text-purple-200">
            <Palette className="h-4 w-4" />
            Arrière-plan
          </Label>
          <Input
            type="color"
            value={profile.custom_background || "#ffffff"}
            onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
            className="h-10 px-2 bg-white/10 border-white/20 rounded-md cursor-pointer"
          />
        </motion.div>

        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
        >
          <Label className="flex items-center gap-2 text-purple-200">
            <TextCursor className="h-4 w-4" />
            Couleur du texte
          </Label>
          <Input
            type="color"
            value={profile.custom_text_color || "#000000"}
            onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
            className="h-10 px-2 bg-white/10 border-white/20 rounded-md cursor-pointer"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}