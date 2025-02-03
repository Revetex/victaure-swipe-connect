interface DashboardEditModeProps {
  isEditing: boolean;
}

export function DashboardEditMode({ isEditing }: DashboardEditModeProps) {
  if (!isEditing) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 py-2">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-sm font-medium text-muted-foreground">
            Mode édition
          </h1>
        </div>
      </div>
    </div>
  );
}