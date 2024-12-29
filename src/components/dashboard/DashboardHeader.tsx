interface DashboardHeaderProps {
  title: string;
  description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-victaure-gray-dark mt-1">{description}</p>
    </div>
  );
}