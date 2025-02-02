import { useState } from "react";
import { ExternalSearchSection } from "@/components/jobs/sections/ExternalSearchSection";

export function Marketplace() {
  const [isExternalSearchLoading, setIsExternalSearchLoading] = useState(false);
  const [hasExternalSearchError, setHasExternalSearchError] = useState(false);

  const handleRetryExternalSearch = () => {
    setHasExternalSearchError(false);
  };

  return (
    <div className="w-full">
      <div className="px-4 py-8">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold">Emplois disponibles</h1>
          </div>

          <div className="w-full -mx-4 px-4 md:mx-0 md:px-0">
            <ExternalSearchSection
              isLoading={isExternalSearchLoading}
              hasError={hasExternalSearchError}
              onRetry={handleRetryExternalSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}