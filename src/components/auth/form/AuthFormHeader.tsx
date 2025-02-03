import { ThemeToggle } from "@/components/ThemeToggle";

export const AuthFormHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <ThemeToggle />
    </div>
  );
};