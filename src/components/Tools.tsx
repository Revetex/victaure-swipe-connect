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

export function Tools() {
  const [activeTab, setActiveTab] = useState("hours");
  const [formData, setFormData] = useState({
    hours: {},
    jobInfo: {},
    allowances: {},
    premiums: {},
    expenses: {}
  });

  const handleFormSubmit = (type: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [type]: data
    }));
    
    // Move to next tab automatically
    const tabOrder = ["hours", "jobInfo", "allowances", "premiums", "expenses", "results"];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
      toast.success("Informations sauvegardées");
    }
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
              <HoursForm onSubmit={(data) => handleFormSubmit('hours', data)} />
            </TabsContent>
            
            <TabsContent value="jobInfo">
              <JobInfoForm onSubmit={(data) => handleFormSubmit('jobInfo', data)} />
            </TabsContent>
            
            <TabsContent value="allowances">
              <AllowancesForm onSubmit={(data) => handleFormSubmit('allowances', data)} />
            </TabsContent>
            
            <TabsContent value="premiums">
              <PremiumsForm onSubmit={(data) => handleFormSubmit('premiums', data)} />
            </TabsContent>
            
            <TabsContent value="expenses">
              <ExpensesForm onSubmit={(data) => handleFormSubmit('expenses', data)} />
            </TabsContent>
            
            <TabsContent value="results">
              <SalaryResults formData={formData} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}