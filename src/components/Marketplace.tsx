import { useState } from "react";
import { ExternalSearchSection } from "@/components/jobs/sections/ExternalSearchSection";

export function Marketplace() {
  const [isExternalSearchLoading, setIsExternalSearchLoading] = useState(false);
  const [hasExternalSearchError, setHasExternalSearchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <div className="w-full">
      <div className="py-8">
        <div className="flex flex-col gap-6 w-full">
          <div className="w-full">
            <ExternalSearchSection
              isLoading={isExternalSearchLoading}
              hasError={hasExternalSearchError}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}