
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Lock } from "lucide-react";
import { FormData } from './types';
import { motion } from 'framer-motion';

interface CompanyInfoFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function CompanyInfoFields({ formData, setFormData }: CompanyInfoFieldsProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="space-y-4">
      <motion.div className="space-y-2" {...fadeInUp}>
        <Label htmlFor="companyName">Nom de l'entreprise</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="companyName"
            placeholder="Votre entreprise"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="pl-10 transition-all duration-200 border-primary/20 focus:border-primary"
            required
          />
        </div>
      </motion.div>

      <motion.div className="space-y-2" {...fadeInUp} transition={{ delay: 0.1 }}>
        <Label htmlFor="email">Email professionnel</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="vous@entreprise.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10 transition-all duration-200 border-primary/20 focus:border-primary"
            required
          />
        </div>
      </motion.div>

      <motion.div className="space-y-2" {...fadeInUp} transition={{ delay: 0.2 }}>
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 transition-all duration-200 border-primary/20 focus:border-primary"
            required
          />
        </div>
      </motion.div>
    </div>
  );
}
