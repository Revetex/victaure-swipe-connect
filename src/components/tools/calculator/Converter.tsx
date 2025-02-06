import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

interface ConverterProps {
  conversionType: string;
  fromUnit: string;
  toUnit: string;
  conversionValue: string;
  conversionResult: string;
  onConversionTypeChange: (value: string) => void;
  onFromUnitChange: (value: string) => void;
  onToUnitChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onConvert: () => void;
}

export function Converter({
  conversionType,
  fromUnit,
  toUnit,
  conversionValue,
  conversionResult,
  onConversionTypeChange,
  onFromUnitChange,
  onToUnitChange,
  onValueChange,
  onConvert
}: ConverterProps) {
  const getUnitOptions = (type: string) => {
    switch (type) {
      case "length":
        return [
          ["m", "Mètres"],
          ["km", "Kilomètres"],
          ["cm", "Centimètres"],
          ["mm", "Millimètres"],
          ["ft", "Pieds"],
          ["in", "Pouces"],
        ];
      case "weight":
        return [
          ["kg", "Kilogrammes"],
          ["g", "Grammes"],
          ["mg", "Milligrammes"],
          ["lb", "Livres"],
          ["oz", "Onces"],
        ];
      case "temperature":
        return [
          ["c", "Celsius"],
          ["f", "Fahrenheit"],
          ["k", "Kelvin"],
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <Select value={conversionType} onValueChange={onConversionTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Type de conversion" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="length">Longueur</SelectItem>
          <SelectItem value="weight">Poids</SelectItem>
          <SelectItem value="temperature">Température</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
        <Select value={fromUnit} onValueChange={onFromUnitChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getUnitOptions(conversionType).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ArrowRightLeft className="h-4 w-4" />

        <Select value={toUnit} onValueChange={onToUnitChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getUnitOptions(conversionType).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        type="number"
        value={conversionValue}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="Entrez une valeur..."
        className="text-right"
      />

      <Button onClick={onConvert} className="w-full">
        Convertir
      </Button>

      {conversionResult && (
        <Card className="p-4 text-center">
          <p className="text-lg font-semibold">{conversionResult}</p>
        </Card>
      )}
    </div>
  );
}