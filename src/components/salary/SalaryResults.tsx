import { SalaryResult, JobInfo } from "../../types/salary";
import { Card } from "../ui/card";

interface SalaryResultsProps {
  salary: SalaryResult;
  jobInfo: JobInfo;
  employeeName: string;
  expenses: { store: string; description: string; amount: number }[];
}

export function SalaryResults({
  salary,
  jobInfo,
  employeeName,
  expenses,
}: SalaryResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Salary Results</h2>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Hours Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Regular Hours:</span>
                <span>{salary.regularHours}</span>
              </div>
              <div className="flex justify-between">
                <span>Double Time Hours:</span>
                <span>{salary.doubleTimeHours}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Time Hours:</span>
                <span>{salary.travelTimeHours}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Pay Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Regular Pay:</span>
                <span>{formatCurrency(salary.regularPay)}</span>
              </div>
              <div className="flex justify-between">
                <span>Double Time Pay:</span>
                <span>{formatCurrency(salary.doubleTimePay)}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Time Pay:</span>
                <span>{formatCurrency(salary.travelTimePay)}</span>
              </div>
              <div className="flex justify-between">
                <span>Allowances:</span>
                <span>{formatCurrency(salary.allowances)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-xl font-semibold mb-4">Deductions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(salary.deductions).map(([key, value]) => (
              key !== "total" && (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                  <span>{formatCurrency(value)}</span>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Gross Pay:</span>
              <span>{formatCurrency(salary.grossPay)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Deductions:</span>
              <span>{formatCurrency(salary.deductions.total)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Net Pay:</span>
              <span>{formatCurrency(salary.netPay)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}