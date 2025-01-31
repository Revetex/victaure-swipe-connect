import { useState } from "react";
import { Card } from "@/components/ui/card";
import { JobInfo } from "@/types/salary";
import { SalaryResult } from "@/types/salary";
import { ProjectInfo } from "./results/ProjectInfo";
import { MainCalculations } from "./results/MainCalculations";
import { ExpensesTable } from "./results/ExpensesTable";
import { DeductionsTable } from "./results/DeductionsTable";
import { AllowancesTable } from "./results/AllowancesTable";
import { TotalSection } from "./results/TotalSection";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { generatePDF } from "./pdf/PdfGenerator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ExpenseEntry {
  store: string;
  description: string;
  amount: number;
}

interface SalaryResultsProps {
  salary: SalaryResult;
  jobInfo: JobInfo;
  employeeName: string;
  expenses: ExpenseEntry[];
}

export const SalaryResults = ({ salary, jobInfo, employeeName, expenses }: SalaryResultsProps) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const isMobile = useIsMobile();
  
  const totalHoursWithoutTravel = Object.values(salary.hours.regular).reduce((acc: number, curr: number) => acc + curr, 0);
  const safetyEquipmentAmount = totalHoursWithoutTravel * 0.60;
  const subtotalWithSafety = salary.subtotal + safetyEquipmentAmount;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const grossSalary = subtotalWithSafety + (subtotalWithSafety * 0.13);
  const netSalary = subtotalWithSafety + (subtotalWithSafety * 0.13) - salary.deductions.total + salary.allowances.total;

  const handlePrintPDF = async () => {
    await generatePDF('salary-results', jobInfo);
  };

  const PayStubContent = () => (
    <div id="salary-results" className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl shadow-lg border border-orange-200 dark:border-gray-700 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-orange-500 dark:text-orange-400">Relevé de paie</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Semaine se terminant le {jobInfo.weekEnding || "Non spécifié"}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{employeeName}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrintPDF}
          className="flex items-center gap-2 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 dark:border-gray-600"
          data-pdf-button
        >
          <FileText className="h-4 w-4" />
          PDF
        </Button>
      </div>

      <div className="space-y-6">
        <ProjectInfo jobInfo={jobInfo} />
        <MainCalculations 
          salary={salary}
          safetyEquipmentAmount={safetyEquipmentAmount}
          subtotalWithSafety={subtotalWithSafety}
        />
        <AllowancesTable salary={salary} />
        <ExpensesTable expenses={expenses} />
        <DeductionsTable salary={salary} />
        <TotalSection 
          netSalary={netSalary} 
          grossSalary={grossSalary}
          totalExpenses={totalExpenses}
          isMobile={isMobile} 
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full bg-background/95 backdrop-blur-sm border-t border-orange-200 dark:border-gray-700 shadow-lg p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowFullScreen(true)}
              className="flex items-center gap-2 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 dark:border-gray-600"
            >
              <Eye className="h-4 w-4" />
              Voir le relevé
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showFullScreen} onOpenChange={setShowFullScreen}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800" aria-describedby="paystub-description">
          <DialogTitle className="sr-only">Relevé de paie détaillé</DialogTitle>
          <p id="paystub-description" className="sr-only">
            Vue détaillée du relevé de paie incluant les informations du projet, les calculs principaux, 
            les allocations, les dépenses et les déductions.
          </p>
          <PayStubContent />
        </DialogContent>
      </Dialog>
    </>
  );
};