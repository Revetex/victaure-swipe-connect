import { SwipeMatch } from "./SwipeMatch";
import { JobFilters } from "./jobs/JobFilterUtils";

export function SwipeJob() {
  return (
    <div className="h-full flex items-center justify-center">
      <SwipeMatch 
        filters={{} as JobFilters}
        onMatchSuccess={() => {}}
      />
    </div>
  );
}