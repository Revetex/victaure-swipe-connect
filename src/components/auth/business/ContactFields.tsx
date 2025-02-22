
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone, MapPin } from "lucide-react";
import { FormData } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function ContactFields({ formData, setFormData }: ContactFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="(514) 555-0123"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="address"
            placeholder="123 rue Principale"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="province">Province</Label>
          <Select
            value={formData.province}
            onValueChange={(value) => setFormData({ ...formData, province: value })}
          >
            <SelectTrigger>
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

        <div>
          <Label htmlFor="postalCode">Code postal</Label>
          <Input
            id="postalCode"
            placeholder="A1A 1A1"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            required
          />
        </div>
      </div>
    </>
  );
}
