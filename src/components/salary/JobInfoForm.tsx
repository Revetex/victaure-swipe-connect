import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobInfo } from "@/types/salary";
import { useState } from "react";

interface JobInfoFormProps {
  jobInfo: JobInfo;
  onJobInfoChange: (field: keyof JobInfo, value: string) => void;
  employeeName: string;
  setEmployeeName: (name: string) => void;
  setWeekDates: (dates: Date[]) => void;
}

export function JobInfoForm({
  jobInfo,
  onJobInfoChange,
  employeeName,
  setEmployeeName,
  setWeekDates,
}: JobInfoFormProps) {
  const handleWeekEndingChange = (date: string) => {
    onJobInfoChange("weekEnding", date);
    const endDate = new Date(date);
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
    setWeekDates(dates);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Job Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeName">Employee Name</Label>
          <Input
            id="employeeName"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weekEnding">Week Ending</Label>
          <Input
            id="weekEnding"
            type="date"
            value={jobInfo.weekEnding}
            onChange={(e) => handleWeekEndingChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={jobInfo.companyName}
            onChange={(e) => onJobInfoChange("companyName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobSiteAddress">Job Site Address</Label>
          <Input
            id="jobSiteAddress"
            value={jobInfo.jobSiteAddress}
            onChange={(e) => onJobInfoChange("jobSiteAddress", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobNumber">Job Number</Label>
          <Input
            id="jobNumber"
            value={jobInfo.jobNumber}
            onChange={(e) => onJobInfoChange("jobNumber", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

