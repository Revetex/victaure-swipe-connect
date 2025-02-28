
import React from "react";
import { useBusinessSignup } from "./useBusinessSignup";
import { FormSection } from "./FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Mail, Phone, MapPin, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface BusinessSignupFormProps {
  redirectTo?: string;
}

export function BusinessSignupForm({ redirectTo }: BusinessSignupFormProps) {
  const { formData, setFormData, loading, handleSubmit } = useBusinessSignup(redirectTo);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection title="Informations de l'entreprise">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="companyName">Nom de l'entreprise</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
              <Input
                id="companyName"
                placeholder="Nom de l'entreprise"
                className="pl-10 bg-[#1B2A4A] border-[#64B5D9]/20 text-[#F2EBE4] placeholder:text-[#F2EBE4]/30"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Secteur d'activité</Label>
              <Select 
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/20 text-[#F2EBE4]">
                  <SelectValue placeholder="Choisir un secteur" />
                </SelectTrigger>
                <SelectContent className="bg-[#1B2A4A] border-[#64B5D9]/20">
                  <SelectItem value="tech" className="text-[#F2EBE4]">Technologies</SelectItem>
                  <SelectItem value="retail" className="text-[#F2EBE4]">Commerce</SelectItem>
                  <SelectItem value="manufacturing" className="text-[#F2EBE4]">Industrie</SelectItem>
                  <SelectItem value="services" className="text-[#F2EBE4]">Services</SelectItem>
                  <SelectItem value="other" className="text-[#F2EBE4]">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize">Taille de l'entreprise</Label>
              <Select
                value={formData.companySize}
                onValueChange={(value) => setFormData({ ...formData, companySize: value })}
              >
                <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/20 text-[#F2EBE4]">
                  <SelectValue placeholder="Nombre d'employés" />
                </SelectTrigger>
                <SelectContent className="bg-[#1B2A4A] border-[#64B5D9]/20">
                  <SelectItem value="1-10" className="text-[#F2EBE4]">1-10 employés</SelectItem>
                  <SelectItem value="11-50" className="text-[#F2EBE4]">11-50 employés</SelectItem>
                  <SelectItem value="51-200" className="text-[#F2EBE4]">51-200 employés</SelectItem>
                  <SelectItem value="201+" className="text-[#F2EBE4]">201+ employés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      </FormSection>

      <FormSection title="Coordonnées">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email professionnel</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
              <Input
                id="email"
                type="email"
                placeholder="contact@entreprise.com"
                className="pl-10 bg-[#1B2A4A] border-[#64B5D9]/20 text-[#F2EBE4] placeholder:text-[#F2EBE4]/30"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
              <Input
                id="phone"
                type="tel"
                placeholder="(514) 555-0123"
                className="pl-10 bg-[#1B2A4A] border-[#64B5D9]/20 text-[#F2EBE4] placeholder:text-[#F2EBE4]/30"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Select
                value={formData.province}
                onValueChange={(value) => setFormData({ ...formData, province: value })}
              >
                <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/20 text-[#F2EBE4]">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-[#1B2A4A] border-[#64B5D9]/20">
                  <SelectItem value="QC" className="text-[#F2EBE4]">Québec</SelectItem>
                  <SelectItem value="ON" className="text-[#F2EBE4]">Ontario</SelectItem>
                  <SelectItem value="BC" className="text-[#F2EBE4]">Colombie-Britannique</SelectItem>
                  <SelectItem value="AB" className="text-[#F2EBE4]">Alberta</SelectItem>
                  <SelectItem value="other" className="text-[#F2EBE4]">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
                <Input
                  id="postalCode"
                  placeholder="A1A 1A1"
                  className="pl-10 bg-[#1B2A4A] border-[#64B5D9]/20 text-[#F2EBE4] placeholder:text-[#F2EBE4]/30"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </motion.div>
      </FormSection>

      <FormSection title="Sécurité">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-[#64B5D9]" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-[#1B2A4A] border-[#64B5D9]/20 text-[#F2EBE4] placeholder:text-[#F2EBE4]/30"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>
        </motion.div>
      </FormSection>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] hover:opacity-90 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer mon compte entreprise"}
          <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-150 transition-transform" />
        </Button>
      </motion.div>
    </form>
  );
}
