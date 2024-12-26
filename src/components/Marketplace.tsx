import { useState } from "react";
import { JobCard } from "./JobCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Building2,
  Clock,
  Euro,
  SlidersHorizontal,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  sector: string;
  skills: string[];
  category: string;
  contract_type: string;
  experience_level: string;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Lead Developer Frontend",
    company: "Tech Solutions",
    location: "Toronto",
    salary: "600-800 CAD / jour",
    duration: "12 mois",
    sector: "Technology",
    skills: ["React", "TypeScript", "Node.js"],
    category: "Technology",
    contract_type: "Full-time",
    experience_level: "Senior"
  },
  {
    id: "2",
    title: "Product Manager",
    company: "Innovation Corp",
    location: "Vancouver",
    salary: "550-700 CAD / jour",
    duration: "6 mois",
    sector: "Product",
    skills: ["Agile", "Scrum", "Product Strategy"],
    category: "Product",
    contract_type: "Full-time",
    experience_level: "Mid-Level"
  },
];

export function Marketplace() {
  const [sector, setSector] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<number[]>([300, 1000]);

  const sectors = ["Technology", "Finance", "Healthcare", "Product", "Marketing"];
  const durations = ["3-6 mois", "6-12 mois", "12+ mois"];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <SlidersHorizontal className="h-6 w-6 text-victaure-blue" />
          <h2 className="text-2xl font-bold text-foreground">
            Explorer les missions
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6 bg-card p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Secteur
                </label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les secteurs" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Durée
                </label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les durées" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Rémunération (CAD/jour)
                </label>
                <Slider
                  defaultValue={salaryRange}
                  max={1000}
                  min={300}
                  step={50}
                  onValueChange={setSalaryRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{salaryRange[0]} CAD</span>
                  <span>{salaryRange[1]} CAD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid gap-6">
            {mockJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
