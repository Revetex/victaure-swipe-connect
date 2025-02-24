
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from './types';
import { motion } from 'framer-motion';

interface CompanyDetailsFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function CompanyDetailsFields({ formData, setFormData }: CompanyDetailsFieldsProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <motion.div {...fadeInUp}>
        <Label htmlFor="industry" className="mb-2 block text-[#F1F0FB]">Secteur d'activité</Label>
        <Select 
          value={formData.industry}
          onValueChange={(value) => setFormData({ ...formData, industry: value })}
        >
          <SelectTrigger className="w-full bg-[#1B2A4A]/20 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40">
            <SelectValue placeholder="Choisir un secteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Technologies</SelectItem>
            <SelectItem value="manufacturing">Fabrication</SelectItem>
            <SelectItem value="retail">Commerce de détail</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Label htmlFor="companySize" className="mb-2 block text-[#F1F0FB]">Taille de l'entreprise</Label>
        <Select
          value={formData.companySize}
          onValueChange={(value) => setFormData({ ...formData, companySize: value })}
        >
          <SelectTrigger className="w-full bg-[#1B2A4A]/20 border-[#64B5D9]/20 text-[#F1F0FB] placeholder-[#F1F0FB]/40">
            <SelectValue placeholder="Nombre d'employés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10 employés</SelectItem>
            <SelectItem value="11-50">11-50 employés</SelectItem>
            <SelectItem value="51-200">51-200 employés</SelectItem>
            <SelectItem value="201-500">201-500 employés</SelectItem>
            <SelectItem value="501+">501+ employés</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </div>
  );
}
