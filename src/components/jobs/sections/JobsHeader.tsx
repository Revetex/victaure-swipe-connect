
import { AppHeader } from "@/components/header/AppHeader";

interface JobsHeaderProps {
  totalJobs: number;
  onRequestAssistant: () => void;
}

export function JobsHeader({ totalJobs, onRequestAssistant }: JobsHeaderProps) {
  return <AppHeader totalJobs={totalJobs} onRequestAssistant={onRequestAssistant} />;
}
