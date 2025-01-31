import { SalaryResult } from "@/types/salary";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Clock, Calculator, Briefcase, Coins, AlertCircle } from "lucide-react";
import { rates } from "@/constants/rates";

interface MainCalculationsProps {
  salary: SalaryResult;
  safetyEquipmentAmount: number;
  subtotalWithSafety: number;
}

export const MainCalculations = ({ salary, safetyEquipmentAmount, subtotalWithSafety }: MainCalculationsProps) => {
  const totalHours = Object.values(salary.hours.regular).reduce((acc: number, curr: number) => acc + curr, 0);
  const totalDoubleTime = Object.values(salary.hours.doubleTime).reduce((acc: number, curr: number) => acc + curr, 0);
  const totalTravelTime = Object.values(salary.hours.travelTime).reduce((acc: number, curr: number) => acc + curr, 0);

  const activePremiums = Object.entries({
    'Réfractaire': rates.premiums.refractory,
    'Surintendant': rates.premiums.superintendent,
    'Quart de nuit': rates.premiums.nightShift,
    'Plateforme volante': rates.premiums.flyingPlatform,
    'Air assisté': rates.premiums.airAssisted,
    'Industriel lourd': rates.premiums.heavyIndustrial
  }).filter(([_, rate]) => salary.premiumTotal > 0 && rate > 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={2} className="text-sm font-semibold text-blue-800 dark:text-blue-200 border-b border-blue-200 dark:border-blue-800">
            Calculs principaux
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Briefcase className="h-3 w-3" />
            Salaire de base ({totalHours}h @ {rates.regular}$)
          </TableCell>
          <TableCell className="py-1 text-right">${salary.baseSalary.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Temps double ({totalDoubleTime}h @ {rates.doubleTime}$)
          </TableCell>
          <TableCell className="py-1 text-right">${(totalDoubleTime * rates.doubleTime).toFixed(2)}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Temps de voyage ({totalTravelTime}h @ {rates.travelTime}$)
          </TableCell>
          <TableCell className="py-1 text-right">${salary.travelTimePay.toFixed(2)}</TableCell>
        </TableRow>

        {activePremiums.length > 0 && (
          <>
            <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
              <TableCell colSpan={2} className="py-1">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <AlertCircle className="h-3 w-3" />
                  Primes appliquées:
                </div>
              </TableCell>
            </TableRow>
            {activePremiums.map(([name, rate]) => (
              <TableRow key={name} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
                <TableCell className="py-1 pl-6">{name}</TableCell>
                <TableCell className="py-1 text-right">${rate.toFixed(2)}/h</TableCell>
              </TableRow>
            ))}
          </>
        )}

        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Coins className="h-3 w-3" />
            Total des primes
          </TableCell>
          <TableCell className="py-1 text-right">${salary.premiumTotal.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Équipement de sécurité ({totalHours}h @ 0.60$)
          </TableCell>
          <TableCell className="py-1 text-right">${safetyEquipmentAmount.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Calculator className="h-3 w-3" />
            Sous-total avant vacances
          </TableCell>
          <TableCell className="py-1 text-right">${subtotalWithSafety.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1">Vacances CCQ (13%)</TableCell>
          <TableCell className="py-1 text-right">${(subtotalWithSafety * 0.13).toFixed(2)}</TableCell>
        </TableRow>
        <TableRow className="font-bold bg-blue-50 dark:bg-blue-900/50">
          <TableCell className="py-1">Salaire brut</TableCell>
          <TableCell className="py-1 text-right">${(subtotalWithSafety + (subtotalWithSafety * 0.13)).toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};