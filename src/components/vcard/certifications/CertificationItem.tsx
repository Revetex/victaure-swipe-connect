import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Award, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface Certification {
  title: string;
  institution: string;
  year: string;
}

interface CertificationItemProps {
  cert: Certification;
  index: number;
  isEditing: boolean;
  onUpdate: (index: number, field: keyof Certification, value: string) => void;
  onRemove: (index: number) => void;
}

export function CertificationItem({
  cert,
  index,
  isEditing,
  onUpdate,
  onRemove,
}: CertificationItemProps) {
  if (isEditing) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-400 shrink-0" />
          <Input
            value={cert.title}
            onChange={(e) => onUpdate(index, "title", e.target.value)}
            placeholder="Titre du diplôme/certification"
            className="flex-1 bg-white/10 border-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
          <Input
            value={cert.institution}
            onChange={(e) => onUpdate(index, "institution", e.target.value)}
            placeholder="Institution"
            className="flex-1 bg-white/10 border-indigo-500/20"
          />
        </div>
        <div className="flex gap-2">
          <Input
            value={cert.year}
            onChange={(e) => onUpdate(index, "year", e.target.value)}
            placeholder="Année"
            className="w-32 bg-white/10 border-indigo-500/20"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-indigo-400 hover:text-red-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-indigo-400 shrink-0" />
        <p className="font-medium text-lg text-white">{cert.title || "Titre non défini"}</p>
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
        <p className="text-white/80">{cert.institution || "Institution non définie"}</p>
      </div>
      <p className="text-sm text-white/60">{cert.year || "Année non définie"}</p>
    </>
  );
}