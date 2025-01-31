import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Layers } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { rates } from "@/constants/rates";
import { federalBrackets, provincialBrackets } from "@/utils/taxBrackets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RateEntry {
  key: string;
  label: string;
  value: number;
  category: string;
  suffix?: string;
}

const formatRates = () => {
  const entries: RateEntry[] = [
    { key: 'regular', label: 'Taux régulier', value: rates.regular, category: 'Taux horaires' },
    { key: 'doubleTime', label: 'Temps double', value: rates.doubleTime, category: 'Taux horaires' },
    { key: 'travelTime', label: 'Temps de voyage', value: rates.travelTime, category: 'Taux horaires' },
    { key: 'pension', label: 'Pension', value: rates.pension, category: 'Allocations' },
    { key: 'meal', label: 'Repas', value: rates.meal, category: 'Allocations' },
    { key: 'overtimeMeal', label: 'Repas temps double', value: rates.overtimeMeal, category: 'Allocations' },
    { key: 'truck', label: 'Camion', value: rates.truck, category: 'Allocations' },
    { key: 'kmRegular', label: 'Kilométrage régulier', value: rates.kmRegular, category: 'Kilométrage' },
    { key: 'kmLoaded', label: 'Kilométrage chargé', value: rates.kmLoaded, category: 'Kilométrage' },
    { key: 'kmTrailer', label: 'Kilométrage avec trailer', value: rates.kmTrailer, category: 'Kilométrage' },
    { key: 'deductions.rrqRate', label: 'RRQ/RPC', value: rates.deductions.rrqRate * 100, category: 'Déductions', suffix: '%' },
    { key: 'deductions.eiRate', label: 'Assurance emploi', value: rates.deductions.eiRate * 100, category: 'Déductions', suffix: '%' },
    { key: 'deductions.rqapRate', label: 'RQAP', value: rates.deductions.rqapRate * 100, category: 'Déductions', suffix: '%' },
    { key: 'deductions.socialBenefitsRate', label: 'Avantages sociaux CCQ', value: rates.deductions.socialBenefitsRate * 100, category: 'Déductions', suffix: '%' },
    { key: 'deductions.ccqLevyRate', label: 'Prélèvement CCQ', value: rates.deductions.ccqLevyRate * 100, category: 'Déductions', suffix: '%' },
    { key: 'deductions.sectoralContribution', label: 'Contribution sectorielle CCQ', value: rates.deductions.sectoralContribution, category: 'Déductions', suffix: '$' },
    { key: 'deductions.unionDues', label: 'Cotisation syndicale', value: rates.deductions.unionDues, category: 'Déductions', suffix: '$' },
    { key: 'deductions.vacationRate', label: 'Vacances CCQ', value: rates.deductions.vacationRate * 100, category: 'Déductions', suffix: '%' },
  ];

  // Ajouter les primes
  Object.entries(rates.premiums).forEach(([key, value]) => {
    let label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    entries.push({
      key: `premiums.${key}`,
      label,
      value,
      category: 'Primes',
      suffix: '$/h'
    });
  });

  return entries;
};

export const RatesTable = () => {
  const [editedRates, setEditedRates] = useState<RateEntry[]>(formatRates());
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleValueChange = (key: string, newValue: string) => {
    setEditedRates(prev => 
      prev.map(rate => 
        rate.key === key 
          ? { ...rate, value: newValue === '' ? 0 : parseFloat(newValue) } 
          : rate
      )
    );
  };

  const handleSave = () => {
    console.log('Nouveaux taux:', editedRates);
    toast({
      title: "Taux mis à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
    navigate('/');
  };

  const handleReset = () => {
    setEditedRates(formatRates());
    toast({
      title: "Réinitialisation",
      description: "Les taux ont été réinitialisés aux valeurs par défaut.",
    });
  };

  const categories = Array.from(new Set(editedRates.map(rate => rate.category)));

  const renderTable = (category: string) => (
    <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
      <div className="p-4 bg-muted/50 font-semibold text-left flex items-center gap-2">
        {category}
      </div>
      <div className="p-2 sm:p-4">
        {editedRates
          .filter(rate => rate.category === category)
          .map(rate => (
            <div key={rate.key} className="flex flex-col items-start py-3 border-b last:border-0">
              <div className="font-medium text-sm mb-2 w-full">
                {rate.label}
              </div>
              <div className="flex items-center gap-2 w-full">
                <Input
                  type="number"
                  value={rate.value || ''}
                  onChange={(e) => handleValueChange(rate.key, e.target.value)}
                  className="w-full"
                  step="0.01"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[20px]">
                  {rate.suffix || '$'}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderTaxBrackets = (brackets: Array<{ min: number; max: number; rate: number }>, title: string) => (
    <div key={title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
      <div className="p-4 bg-primary/10 font-semibold text-left flex items-center gap-2">
        <Layers className="h-4 w-4" />
        {title}
      </div>
      <div className="p-2 sm:p-4 divide-y">
        {brackets.map((bracket, index) => (
          <div key={index} className="flex flex-col py-3">
            <div className="flex flex-col gap-1 mb-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <span className="text-primary">Palier {index + 1}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">
                  {(bracket.rate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                De ${bracket.min.toLocaleString()} à {bracket.max === Infinity ? '∞' : `$${bracket.max.toLocaleString()}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="flex justify-end gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Réinitialiser
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Réinitialiser les taux?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Tous les taux seront réinitialisés à leurs valeurs par défaut.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Continuer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-3 w-3" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {categories
          .filter(cat => cat !== "Impôt fédéral" && cat !== "Impôt provincial")
          .map(category => renderTable(category))}

        {renderTaxBrackets(federalBrackets, "Paliers d'imposition fédéral")}
        {renderTaxBrackets(provincialBrackets, "Paliers d'imposition provincial")}
      </div>
    </div>
  );
};
