
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from './types';

interface CompanyDetailsFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function CompanyDetailsFields({ formData, setFormData }: CompanyDetailsFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="industry">Secteur d'activité</Label>
        <Select 
          value={formData.industry}
          onValueChange={(value) => setFormData({ ...formData, industry: value })}
        >
          <SelectTrigger>
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
      </div>

      <div>
        <Label htmlFor="companySize">Taille de l'entreprise</Label>
        <Select
          value={formData.companySize}
          onValueChange={(value) => setFormData({ ...formData, companySize: value })}
        >
          <SelectTrigger>
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
      </div>
    </div>
  );
}
