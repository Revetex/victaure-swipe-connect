
import { JobsList } from "../JobsList";
import { JobSearch } from "../JobSearch";

export function JobsResults() {
  return (
    <div className="space-y-4 p-4">
      <JobSearch />
      <JobsList />
    </div>
  );
}
