import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
interface TaskInputProps {
  onAddTask: (task: string, dueDate?: string) => void;
  className?: string;
}
export function TaskInput({
  onAddTask,
  className
}: TaskInputProps) {
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) {
      toast.error("La tâche ne peut pas être vide");
      return;
    }
    onAddTask(taskText, dueDate || undefined);
    setTaskText("");
    setDueDate("");
    toast.success("Tâche ajoutée avec succès");
  };
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className={cn("w-full max-w-2xl mx-auto", "bg-[#2A3441]/80 backdrop-blur-lg", "rounded-xl", "border border-white/10", "shadow-lg shadow-black/10", "p-4", "space-y-4", className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input type="text" value={taskText} onChange={e => setTaskText(e.target.value)} placeholder="Ajouter une nouvelle tâche..." className="flex-1 bg-[#1A1F2C]/50 text-[#F2EBE4] border-white/10 placeholder:text-[#F2EBE4]/50" />
          <Button type="button" variant="outline" size="icon" onClick={() => setShowDateInput(!showDateInput)} className="bg-[#1A1F2C]/50 border-white/10 hover:bg-purple-500/20 hover:border-purple-500/30">
            <Calendar className="h-4 w-4 text-[#F2EBE4]" />
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 bg-white text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        <AnimatePresence>
          {showDateInput && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: "auto"
        }} exit={{
          opacity: 0,
          height: 0
        }} className="overflow-hidden">
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-[#1A1F2C]/50 text-[#F2EBE4] border-white/10" />
            </motion.div>}
        </AnimatePresence>
      </form>
    </motion.div>;
}