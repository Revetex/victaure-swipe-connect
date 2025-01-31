import { Calculator, User } from "lucide-react";

interface HeaderProps {
  employeeName: string;
  onPrintPDF: () => void;
}

export const Header = ({ employeeName }: HeaderProps) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 border-b border-blue-200 dark:border-blue-800 pb-2 gap-2">
    <div className="flex items-center gap-2">
      <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      <h2 className="text-xl font-title font-bold text-blue-900 dark:text-blue-100">
        Relevé de paie
      </h2>
    </div>
    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
      {employeeName && (
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <User className="h-4 w-4" />
          <span className="font-medium">{employeeName}</span>
        </div>
      )}
    </div>
  </div>
);