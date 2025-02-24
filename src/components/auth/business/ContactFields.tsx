
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone, MapPin } from "lucide-react";
import { FormData } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';

interface ContactFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function ContactFields({ formData, setFormData }: ContactFieldsProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="space-y-4">
      <motion.div className="space-y-2" {...fadeInUp}>
        <Label htmlFor="phone" className="text-[#F1F0FB]">Téléphone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
          <Input
            id="phone"
            type="tel"
            placeholder="(514) 555-0123"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-10 bg-[#1B2A4A]/20 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40 focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div className="space-y-2" {...fadeInUp} transition={{ delay: 0.1 }}>
        <Label htmlFor="address" className="text-[#F1F0FB]">Adresse</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#F1F0FB]/60" />
          <Input
            id="address"
            placeholder="123 rue Principale"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="pl-10 bg-[#1B2A4A]/20 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40 focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4" 
        {...fadeInUp} 
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-2">
          <Label htmlFor="province" className="text-[#F1F0FB]">Province</Label>
          <Select
            value={formData.province}
            onValueChange={(value) => setFormData({ ...formData, province: value })}
          >
            <SelectTrigger className="w-full bg-[#1B2A4A]/20 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="QC">Québec</SelectItem>
              <SelectItem value="ON">Ontario</SelectItem>
              <SelectItem value="BC">Colombie-Britannique</SelectItem>
              <SelectItem value="AB">Alberta</SelectItem>
              <SelectItem value="MB">Manitoba</SelectItem>
              <SelectItem value="SK">Saskatchewan</SelectItem>
              <SelectItem value="NS">Nouvelle-Écosse</SelectItem>
              <SelectItem value="NB">Nouveau-Brunswick</SelectItem>
              <SelectItem value="NL">Terre-Neuve-et-Labrador</SelectItem>
              <SelectItem value="PE">Île-du-Prince-Édouard</SelectItem>
              <SelectItem value="NT">Territoires du Nord-Ouest</SelectItem>
              <SelectItem value="NU">Nunavut</SelectItem>
              <SelectItem value="YT">Yukon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-[#F1F0FB]">Code postal</Label>
          <Input
            id="postalCode"
            placeholder="A1A 1A1"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className="bg-[#1B2A4A]/20 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40 focus:border-[#64B5D9] focus:ring-1 focus:ring-[#64B5D9] transition-all"
            required
          />
        </div>
      </motion.div>
    </div>
  );
}
