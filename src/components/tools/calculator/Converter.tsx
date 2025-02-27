
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversionType } from "./types";
import { motion } from "framer-motion";

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
        return [
          ["CAD", "Dollar Canadien"],
          ["USD", "Dollar Américain"],
          ["EUR", "Euro"],
          ["GBP", "Livre Sterling"],
          ["JPY", "Yen Japonais"],
          ["CHF", "Franc Suisse"],
          ["AUD", "Dollar Australien"],
          ["NZD", "Dollar Néo-Zélandais"]
        ];
      case "crypto":
        return [
          ["BTC", "Bitcoin"],
          ["ETH", "Ethereum"],
          ["USDT", "Tether"],
          ["BNB", "Binance Coin"],
          ["XRP", "Ripple"],
          ["ADA", "Cardano"],
          ["SOL", "Solana"],
          ["DOGE", "Dogecoin"]
        ];
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
      case "time":
        return [
          ["s", "Secondes"],
          ["min", "Minutes"],
          ["h", "Heures"],
          ["d", "Jours"],
        ];
      case "unit":
      default:
        return [
          ["u", "Unités"],
          ["dz", "Douzaines"],
          ["c", "Centaines"],
          ["k", "Milliers"],
        ];
    }
  };

  return (
    <div className="space-y-5">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-semibold mb-4 text-center text-primary"
      >
        Convertisseur
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Select value={conversionType} onValueChange={onConversionTypeChange}>
          <SelectTrigger className="w-full backdrop-blur-sm border-primary/20 bg-card/30">
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
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center"
      >
        <Select value={fromUnit} onValueChange={onFromUnitChange}>
          <SelectTrigger className="backdrop-blur-sm border-primary/20 bg-card/30">
            <SelectValue placeholder="De" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur-sm border-border/10">
            {getUnitOptions(conversionType).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ArrowRightLeft className="h-5 w-5 text-primary/70" />

        <Select value={toUnit} onValueChange={onToUnitChange}>
          <SelectTrigger className="backdrop-blur-sm border-primary/20 bg-card/30">
            <SelectValue placeholder="Vers" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur-sm border-border/10">
            {getUnitOptions(conversionType).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          type="number"
          value={conversionValue}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Entrez une valeur..."
          className="text-right backdrop-blur-sm border-primary/20 bg-card/30"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button 
          onClick={onConvert} 
          className="w-full bg-primary/80 hover:bg-primary text-white"
        >
          Convertir
        </Button>
      </motion.div>

      {conversionResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="p-4 text-center bg-primary/10 backdrop-blur-md border border-primary/20 rounded-lg mt-4"
        >
          <p className="text-lg font-semibold text-primary">{conversionResult}</p>
        </motion.div>
      )}
    </div>
  );
}
