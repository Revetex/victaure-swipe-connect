import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoursForm } from "./salary/HoursForm";
import { JobInfoForm } from "./salary/JobInfoForm";
import { AllowancesForm } from "./salary/AllowancesForm";
import { PremiumsForm } from "./salary/PremiumsForm";
import { ExpensesForm } from "./salary/ExpensesForm";
import { SalaryResults } from "./salary/SalaryResults";
import { toast } from "sonner";
import { Hours, JobInfo, Allowances, Premiums } from "@/types/salary";

export function Tools() {
  const [activeTab, setActiveTab] = useState("hours");
  const [employeeName, setEmployeeName] = useState("");
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [hours, setHours] = useState<Hours>({
    regular: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 },
    doubleTime: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 },
    travelTime: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 }
  });
  const [jobInfo, setJobInfo] = useState<JobInfo>({
    weekEnding: "",
    companyName: "",
    jobSiteAddress: "",
    jobNumber: ""
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
    total: 0
  });
  const [premiums, setPremiums] = useState<Premiums>({
    refractory: false,
    superintendent: false,
    nightShift: false,
    flyingPlatform: false,
    airAssisted: false,
    heavyIndustrial: false
  });
  const [expenses, setExpenses] = useState([{ store: "", description: "", amount: 0 }]);

  const handleJobInfoChange = (field: keyof JobInfo, value: string) => {
    setJobInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Calculateur de Salaire</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="hours">Heures</TabsTrigger>
            <TabsTrigger value="jobInfo">Emploi</TabsTrigger>
            <TabsTrigger value="allowances">Indemnités</TabsTrigger>
            <TabsTrigger value="premiums">Primes</TabsTrigger>
            <TabsTrigger value="expenses">Dépenses</TabsTrigger>
            <TabsTrigger value="results">Résultats</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="hours">
              <HoursForm 
                hours={hours}
                onHoursChange={setHours}
              />
            </TabsContent>
            
            <TabsContent value="jobInfo">
              <JobInfoForm 
                jobInfo={jobInfo}
                onJobInfoChange={handleJobInfoChange}
                employeeName={employeeName}
                setEmployeeName={setEmployeeName}
                setWeekDates={setWeekDates}
              />
            </TabsContent>
            
            <TabsContent value="allowances">
              <AllowancesForm 
                allowances={allowances}
                weekDates={weekDates}
                onAllowancesChange={setAllowances}
              />
            </TabsContent>
            
            <TabsContent value="premiums">
              <PremiumsForm 
                premiums={premiums}
                onPremiumsChange={setPremiums}
              />
            </TabsContent>
            
            <TabsContent value="expenses">
              <ExpensesForm 
                expenses={expenses}
                onExpensesChange={setExpenses}
              />
            </TabsContent>
            
            <TabsContent value="results">
              <SalaryResults 
                salary={calculateSalary(hours, allowances, premiums)}
                jobInfo={jobInfo}
                employeeName={employeeName}
                expenses={expenses}
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}