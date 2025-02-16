
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Building2, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BusinessSignupForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    phone: '',
    industry: '',
    companySize: '',
    province: '',
    address: '',
    postalCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Créer le profil entreprise
        const { error: profileError } = await supabase
          .from('business_profiles')
          .insert({
            id: authData.user.id,
            company_name: formData.companyName,
            industry: formData.industry,
            company_size: formData.companySize,
            phone: formData.phone,
            province: formData.province,
            address: formData.address,
            postal_code: formData.postalCode,
            email: formData.email,
            subscription_status: 'trial'
          });

        if (profileError) throw profileError;

        toast.success('Compte entreprise créé avec succès');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || "Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Créez votre compte entreprise
        </h1>
        <p className="text-sm text-muted-foreground">
          Commencez votre période d'essai gratuite de 2 mois
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName">Nom de l'entreprise</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="companyName"
              placeholder="Votre entreprise"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email professionnel</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="vous@entreprise.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="industry">Secteur d'activité</Label>
            <Select 
              value={formData.industry}
              onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
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
              onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}
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

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="(514) 555-0123"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Adresse</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="address"
              placeholder="123 rue Principale"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="province">Province</Label>
            <Select
              value={formData.province}
              onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Créer mon compte entreprise"
        )}
      </Button>

      <p className="px-8 text-center text-sm text-muted-foreground">
        En créant un compte, vous acceptez nos{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-primary">
          conditions d'utilisation
        </a>
        {" "}et notre{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
          politique de confidentialité
        </a>
        .
      </p>
    </form>
  );
}
