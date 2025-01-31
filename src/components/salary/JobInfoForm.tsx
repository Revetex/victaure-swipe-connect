import { useState } from "react";
import { Button } from "@/components/ui/button";

interface JobInfoFormProps {
  onSubmit: (data: JobInfoData) => void;
}

export interface JobInfoData {
  jobTitle: string;
  jobDescription: string;
  hourlyRate: number;
}

export function JobInfoForm({ onSubmit }: JobInfoFormProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ jobTitle, jobDescription, hourlyRate: Number(hourlyRate) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Hourly Rate</label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <Button type="submit" className="w-full">Save Job Info</Button>
    </form>
  );
}
