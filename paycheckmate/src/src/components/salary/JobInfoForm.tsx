import React from 'react';
import { JobInfo } from "@/types/salary";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building, Calendar, MapPin, Hash } from "lucide-react";

interface JobInfoFormProps {
  jobInfo: JobInfo;
  onJobInfoChange: (field: keyof JobInfo, value: string) => void;
  employeeName: string;
  setEmployeeName: (name: string) => void;
  setWeekDates: (dates: Date[]) => void;
}

export const JobInfoForm = ({
  jobInfo,
  onJobInfoChange,
  employeeName,
  setEmployeeName,
  setWeekDates,
}: JobInfoFormProps) => {
  const handleWeekEndingChange = (date: string) => {
    onJobInfoChange('weekEnding', date);
    if (date) {
      const endDate = new Date(date);
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date;
      });
      setWeekDates(weekDates);
    } else {
      setWeekDates([]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <Building className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold text-foreground">Information du projet</h2>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="employeeName" className="text-xs">Nom de l'employé</Label>
          <Input
            id="employeeName"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="Entrez le nom de l'employé"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="weekEnding" className="text-xs">Semaine se terminant le</Label>
          <Input
            id="weekEnding"
            type="date"
            value={jobInfo.weekEnding}
            onChange={(e) => handleWeekEndingChange(e.target.value)}
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="companyName" className="text-xs">Compagnie</Label>
          <Input
            id="companyName"
            value={jobInfo.companyName}
            onChange={(e) => onJobInfoChange('companyName', e.target.value)}
            placeholder="Entrez le nom de la compagnie"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="jobNumber" className="text-xs">Numéro du projet</Label>
          <Input
            id="jobNumber"
            value={jobInfo.jobNumber}
            onChange={(e) => onJobInfoChange('jobNumber', e.target.value)}
            placeholder="Entrez le numéro du projet"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="jobSiteAddress" className="text-xs">Adresse du chantier</Label>
          <Input
            id="jobSiteAddress"
            value={jobInfo.jobSiteAddress}
            onChange={(e) => onJobInfoChange('jobSiteAddress', e.target.value)}
            placeholder="Entrez l'adresse du chantier"
            className="h-7 text-xs"
          />
        </div>
      </div>
    </div>
  );
};