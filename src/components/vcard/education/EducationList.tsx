import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Education } from "@/types/profile";
import { EducationForm } from "./EducationForm";
import { EducationView } from "./EducationView";

interface EducationListProps {
  education: Education[];
  isEditing: boolean;
  onReorder: (newOrder: Education[]) => void;
  onUpdate: (index: number, updatedEducation: Education) => void;
  onRemove: (index: number) => void;
}

export function EducationList({
  education,
  isEditing,
  onReorder,
  onUpdate,
  onRemove,
}: EducationListProps) {
  if (isEditing) {
    return (
      <Reorder.Group axis="y" values={education} onReorder={onReorder}>
        {education.map((edu, index) => (
          <Reorder.Item key={edu.id} value={edu}>
            <EducationForm
              education={edu}
              onUpdate={(updatedEducation) => onUpdate(index, updatedEducation)}
              onRemove={() => onRemove(index)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    );
  }

  return (
    <AnimatePresence>
      {education.map((edu) => (
        <EducationView key={edu.id} education={edu} />
      ))}
    </AnimatePresence>
  );
}