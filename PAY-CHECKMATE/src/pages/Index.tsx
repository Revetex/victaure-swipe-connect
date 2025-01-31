import { useState } from "react";
import { Calculator, Settings } from "lucide-react";
import { Hours, Allowances, Premiums, JobInfo, SalaryResult } from "@/types/salary";
import { HoursForm } from "@/components/salary/HoursForm";
import { AllowancesForm } from "@/components/salary/AllowancesForm";
import { SalaryResults } from "@/components/salary/SalaryResults";
import { JobInfoForm } from "@/components/salary/JobInfoForm";
import { calculateSalary } from "@/utils/salaryCalculator";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [jobInfo, setJobInfo] = useState<JobInfo>({
    weekEnding: "",
    companyName: "",
    jobNumber: "",
    jobSiteAddress: "",
  });
  const [employeeName, setEmployeeName] = useState("");
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [hours, setHours] = useState<Hours>({
    regular: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 },
    doubleTime: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 },
    travelTime: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 },
  });
  const [allowances, setAllowances] = useState<Allowances>({
    regularKm: 0,
    loadedKm: 0,
    trailerKm: 0,
    pensionDaysApplied: {},
    mealDaysApplied: {},
    truckDaysApplied: {},
    overtimeMealDaysApplied: {},
    expenses: 0,
    pension: 0,
    meal: 0,
    truck: 0,
    km: 0,
    total: 0
  });
  const [premiums, setPremiums] = useState<Premiums>({
    refractory: false,
    superintendent: false,
    nightShift: false,
    flyingPlatform: false,
    airAssisted: false,
    heavyIndustrial: false,
  });
  const [expenses, setExpenses] = useState([]);
  const [salary, setSalary] = useState<SalaryResult>({
    baseSalary: 0,
    premiumTotal: 0,
    travelTimePay: 0,
    subtotal: 0,
    deductions: {
      rrq: 0,
      ei: 0,
      rqap: 0,
      provincialTax: 0,
      federalTax: 0,
      socialBenefits: 0,
      ccqLevy: 0,
      sectoralContribution: 0,
      unionDues: 0,
      vacationPayDeduction: 0,
      total: 0
    },
    allowances: {
      regularKm: 0,
      loadedKm: 0,
      trailerKm: 0,
      pensionDaysApplied: {},
      mealDaysApplied: {},
      truckDaysApplied: {},
      overtimeMealDaysApplied: {},
      expenses: 0,
      pension: 0,
      meal: 0,
      truck: 0,
      km: 0,
      total: 0
    },
    hours: {
      regular: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 },
      doubleTime: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 },
      travelTime: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 }
    },
    netPay: 0,
    totalPayment: 0,
    vacationPay: 0
  });

  const handleJobInfoChange = (field: keyof JobInfo, value: string) => {
    setJobInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (type: keyof Hours, day: string, value: string) => {
    setHours((prev) => ({
      ...prev,
      [type]: { ...prev[type], [day]: Number(value) || 0 },
    }));
  };

  type DayState = { [key: string]: boolean };

  const handleAllowanceChange = (type: keyof Allowances, value: number | DayState) => {
    setAllowances((prev) => ({ ...prev, [type]: value }));
  };

  const handlePremiumChange = (type: keyof Premiums) => {
    setPremiums((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const calculateAndSetSalary = () => {
    const calculatedSalary = calculateSalary(hours, allowances, premiums);
    setSalary(calculatedSalary);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full">
      <div className="w-full px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
        {/* Theme toggle in top left */}
        <div className="fixed top-4 left-4 z-50">
          <ThemeToggle />
        </div>

        {/* Settings button in top right */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/settings')}
            className="border-orange-500/20"
          >
            <Settings className="h-4 w-4 text-orange-500" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-between mb-6 pt-12">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-orange-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-orange-500">
              Calculateur de paie
            </h1>
          </div>
          <div className="h-6 mt-2">
            <img 
              src="/signature.PNG" 
              alt="Signature" 
              className="h-full w-auto object-contain"
              onError={(e) => {
                console.error('Error loading signature image');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[400px,1fr] gap-4">
          <div className="space-y-4">
            <Card className="p-4 border-orange-500/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <JobInfoForm
                jobInfo={jobInfo}
                onJobInfoChange={handleJobInfoChange}
                employeeName={employeeName}
                setEmployeeName={setEmployeeName}
                setWeekDates={setWeekDates}
              />
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4 border-orange-500/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <HoursForm
                hours={hours}
                premiums={premiums}
                onHoursChange={handleHoursChange}
                onPremiumChange={handlePremiumChange}
                weekDates={weekDates}
              />
            </Card>

            <Card className="p-4 border-orange-500/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <AllowancesForm
                allowances={allowances}
                onAllowanceChange={handleAllowanceChange}
                expenses={expenses}
                onExpensesChange={setExpenses}
              />
            </Card>

            <Card className="p-4 border-orange-500/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <SalaryResults
                salary={salary}
                jobInfo={jobInfo}
                employeeName={employeeName}
                expenses={expenses}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}