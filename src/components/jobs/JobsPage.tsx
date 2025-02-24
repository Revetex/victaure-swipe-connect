
import { GoogleSearch } from "@/components/google-search/GoogleSearch";

export function JobsPage() {
  const SEARCH_ENGINE_ID = "1262c5460a0314a80";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <GoogleSearch searchEngineId={SEARCH_ENGINE_ID} />
      </div>
    </div>
  );
}
