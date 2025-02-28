import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversionType } from "./types";
interface ConverterProps {
  conversionType: ConversionType;
  fromUnit: string;
  toUnit: string;
  conversionValue: string;
  conversionResult: string;
  onConversionTypeChange: (value: ConversionType) => void;
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
  const getUnitOptions = (type: ConversionType) => {
    switch (type) {
      case "currency":
        return [["CAD", "Dollar Canadien"], ["USD", "Dollar Américain"], ["EUR", "Euro"], ["GBP", "Livre Sterling"], ["JPY", "Yen Japonais"], ["CHF", "Franc Suisse"], ["AUD", "Dollar Australien"], ["NZD", "Dollar Néo-Zélandais"]];
      case "crypto":
        return [["BTC", "Bitcoin"], ["ETH", "Ethereum"], ["USDT", "Tether"], ["BNB", "Binance Coin"], ["XRP", "Ripple"], ["ADA", "Cardano"], ["SOL", "Solana"], ["DOGE", "Dogecoin"]];
      case "length":
        return [["m", "Mètres"], ["km", "Kilomètres"], ["cm", "Centimètres"], ["mm", "Millimètres"], ["ft", "Pieds"], ["in", "Pouces"]];
      case "weight":
        return [["kg", "Kilogrammes"], ["g", "Grammes"], ["mg", "Milligrammes"], ["lb", "Livres"], ["oz", "Onces"]];
      case "temperature":
        return [["c", "Celsius"], ["f", "Fahrenheit"], ["k", "Kelvin"]];
      case "time":
        return [["s", "Secondes"], ["min", "Minutes"], ["h", "Heures"], ["d", "Jours"]];
      case "unit":
      default:
        return [["u", "Unités"], ["dz", "Douzaines"], ["c", "Centaines"], ["k", "Milliers"]];
    }
  };
  return <div className="glass-container space-y-4 bg-black">
      <Select value={conversionType} onValueChange={onConversionTypeChange}>
        <SelectTrigger className="glass-input">
          <SelectValue placeholder="Type de conversion" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur-sm border-border/10">
          <SelectItem value="currency">Devises</SelectItem>
          <SelectItem value="crypto">Cryptomonnaies</SelectItem>
          <SelectItem value="length">Longueur</SelectItem>
          <SelectItem value="weight">Poids</SelectItem>
          <SelectItem value="temperature">Température</SelectItem>
          <SelectItem value="time">Temps</SelectItem>
          <SelectItem value="unit">Unités</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
        <Select value={fromUnit} onValueChange={onFromUnitChange}>
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="De" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur-sm border-border/10">
            {getUnitOptions(conversionType).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>

        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />

        <Select value={toUnit} onValueChange={onToUnitChange}>
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="Vers" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur-sm border-border/10">
            {getUnitOptions(conversionType).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Input type="number" value={conversionValue} onChange={e => onValueChange(e.target.value)} placeholder="Entrez une valeur..." className="glass-input text-right" />

      <Button onClick={onConvert} className="glass-button w-full">
        Convertir
      </Button>

      {conversionResult && <div className="p-4 text-center glass-card">
          <p className="text-lg font-semibold text-foreground">{conversionResult}</p>
        </div>}
    </div>;
}