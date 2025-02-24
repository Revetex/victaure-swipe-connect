
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

  const colorSchemes = [
    { name: "Classique", primary: "#64B5D9", secondary: "#9B6CD9" },
    { name: "Moderne", primary: "#4A90E2", secondary: "#50E3C2" },
    { name: "Élégant", primary: "#9B6CD9", secondary: "#C084FC" },
    { name: "Professionnel", primary: "#2A4365", secondary: "#4A5568" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div {...fadeInUp}>
          <Label htmlFor="industry" className="mb-2 block">Secteur d'activité</Label>
          <Select 
            value={formData.industry}
            onValueChange={(value) => setFormData({ ...formData, industry: value })}
          >
            <SelectTrigger className="w-full bg-[#1B2A4A]/20 border-[#64B5D9]/20 text-[#F1F0FB]">
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
          <Label htmlFor="companySize" className="mb-2 block">Taille de l'entreprise</Label>
          <Select
            value={formData.companySize}
            onValueChange={(value) => setFormData({ ...formData, companySize: value })}
          >
            <SelectTrigger className="w-full bg-[#1B2A4A]/20 border-[#64B5D9]/20 text-[#F1F0FB]">
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

      <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
        <Label className="mb-4 block">Thème de couleur</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colorSchemes.map((scheme) => (
            <div
              key={scheme.name}
              onClick={() => setFormData({ 
                ...formData, 
                colorScheme: scheme.name,
                primaryColor: scheme.primary,
                secondaryColor: scheme.secondary
              })}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                formData.colorScheme === scheme.name 
                  ? 'border-[#64B5D9] bg-[#1B2A4A]/40' 
                  : 'border-[#1B2A4A]/20 hover:border-[#64B5D9]/40'
              }`}
            >
              <div className="flex flex-col space-y-2">
                <div className="text-[#F1F0FB] text-sm font-medium">{scheme.name}</div>
                <div className="flex space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: scheme.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: scheme.secondary }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
