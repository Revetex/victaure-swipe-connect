
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
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
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (conversionType !== 'currency') return;
      
      setIsLoadingRates(true);
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/CAD');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        toast.error("Erreur lors de la récupération des taux de change");
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [conversionType]);

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
      case "currency":
        return [
          ["CAD", "Dollar Canadien"],
          ["USD", "Dollar Américain"],
          ["EUR", "Euro"],
          ["GBP", "Livre Sterling"],
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-muted/30">
      <Select value={conversionType} onValueChange={onConversionTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Type de conversion" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="length">Longueur</SelectItem>
          <SelectItem value="weight">Poids</SelectItem>
          <SelectItem value="temperature">Température</SelectItem>
          <SelectItem value="currency">Devises</SelectItem>
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

        <ArrowRightLeft className="h-4 w-4 opacity-50" />

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
        className={cn(
          "text-right bg-background/95 backdrop-blur",
          "supports-[backdrop-filter]:bg-background/60"
        )}
      />

      <Button onClick={onConvert} className="w-full" disabled={isLoadingRates}>
        {isLoadingRates ? "Chargement des taux..." : "Convertir"}
      </Button>

      {conversionResult && (
        <div className="p-4 text-center bg-background/80 rounded-lg">
          <p className="text-lg font-semibold">{conversionResult}</p>
          {conversionType === 'currency' && (
            <p className="text-sm text-muted-foreground mt-1">
              Taux mis à jour il y a {Math.floor(Date.now() / 60000)} minutes
            </p>
          )}
        </div>
      )}
    </div>
  );
}
