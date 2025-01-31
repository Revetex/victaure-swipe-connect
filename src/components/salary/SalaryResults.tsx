import { SalaryResult, JobInfo } from "../../types/salary";
import { Card } from "../../components/ui/card";

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

  const totalRegularHours = Object.values(salary.hours.regular).reduce((a, b) => a + b, 0);
  const totalDoubleTimeHours = Object.values(salary.hours.doubleTime).reduce((a, b) => a + b, 0);
  const totalTravelTimeHours = Object.values(salary.hours.travelTime).reduce((a, b) => a + b, 0);

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
                <span>{totalRegularHours}</span>
              </div>
              <div className="flex justify-between">
                <span>Double Time Hours:</span>
                <span>{totalDoubleTimeHours}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Time Hours:</span>
                <span>{totalTravelTimeHours}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Pay Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Salary:</span>
                <span>{formatCurrency(salary.baseSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span>Premium Total:</span>
                <span>{formatCurrency(salary.premiumTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Time Pay:</span>
                <span>{formatCurrency(salary.travelTimePay)}</span>
              </div>
              <div className="flex justify-between">
                <span>Allowances:</span>
                <span>{formatCurrency(salary.allowances.total)}</span>
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
              <span>Subtotal:</span>
              <span>{formatCurrency(salary.subtotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Deductions:</span>
              <span>{formatCurrency(salary.deductions.total)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Net Pay:</span>
              <span>{formatCurrency(salary.netPay)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-green-600">
              <span>Total Payment:</span>
              <span>{formatCurrency(salary.totalPayment)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}