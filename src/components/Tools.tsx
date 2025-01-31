import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { JobInfo } from "@/types/salary";
import { Hours, Allowances, Premiums, SalaryResult } from "@/types/salary";
import { useState } from "react";
import { JobInfoForm } from "@/components/salary/JobInfoForm";
import { HoursForm } from "@/components/salary/HoursForm";
import { AllowancesForm } from "@/components/salary/AllowancesForm";
import { SalaryResults } from "@/components/salary/SalaryResults";
import { calculateSalary } from "@/utils/salaryCalculator";
import { rates } from "@/constants/rates";

interface ExpenseEntry {
  store: string;
  description: string;
  amount: number;
}

export function Tools() {
  const [jobInfo, setJobInfo] = useState<JobInfo>({
    weekEnding: "",
    companyName: "",
    jobSiteAddress: "",
    jobNumber: "",
  });

  const [employeeName, setEmployeeName] = useState("");
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  const [hours, setHours] = useState<Hours>({
    regular: {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    },
    doubleTime: {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    },
    travelTime: {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    },
  });

  const [allowances, setAllowances] = useState<Allowances>({
    pensionDaysApplied: {},
    mealDaysApplied: {},
    truckDaysApplied: {},
    overtimeMealDaysApplied: {},
    regularKm: 0,
    loadedKm: 0,
    trailerKm: 0,
    expenses: 0,
    pension: 0,
    meal: 0,
    truck: 0,
    km: 0,
    total: 0,
  });

  const [premiums, setPremiums] = useState<Premiums>({
    refractory: false,
    superintendent: false,
    nightShift: false,
    flyingPlatform: false,
    airAssisted: false,
    heavyIndustrial: false,
  });

  const [expenses, setExpenses] = useState<ExpenseEntry[]>([
    { store: "", description: "", amount: 0 },
  ]);

  const handleJobInfoChange = (field: keyof JobInfo, value: string) => {
    setJobInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (type: keyof Hours, day: string, value: string) => {
    setHours((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [day]: parseFloat(value) || 0,
      },
    }));
  };

  const handleAllowanceChange = (
    type: keyof Allowances,
    value: number | { [key: string]: boolean }
  ) => {
    setAllowances((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handlePremiumChange = (type: keyof Premiums) => {
    setPremiums((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const salary: SalaryResult = calculateSalary(hours, allowances, premiums);

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculateur de paie CCQ</TabsTrigger>
          <TabsTrigger value="rates">Taux horaires</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator">
          <Card className="p-6">
            <div className="grid gap-8">
              <JobInfoForm
                jobInfo={jobInfo}
                onJobInfoChange={handleJobInfoChange}
                employeeName={employeeName}
                setEmployeeName={setEmployeeName}
                setWeekDates={setWeekDates}
              />

              <HoursForm
                hours={hours}
                premiums={premiums}
                onHoursChange={handleHoursChange}
                onPremiumChange={handlePremiumChange}
                weekDates={weekDates}
              />

              <AllowancesForm
                allowances={allowances}
                onAllowanceChange={handleAllowanceChange}
                expenses={expenses}
                onExpensesChange={setExpenses}
              />

              <SalaryResults
                salary={salary}
                jobInfo={jobInfo}
                employeeName={employeeName}
                expenses={expenses}
              />
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="rates">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Taux horaires en vigueur</h3>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm font-medium">Taux régulier</p>
                  <p className="text-2xl font-bold">${rates.regular}/h</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Temps double</p>
                  <p className="text-2xl font-bold">${rates.doubleTime}/h</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Temps de voyage</p>
                  <p className="text-2xl font-bold">${rates.travelTime}/h</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}