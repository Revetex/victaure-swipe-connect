import { ExternalSearchSection } from "@/components/jobs/sections/ExternalSearchSection";

export function Marketplace() {
  return (
    <div className="w-full">
      <div className="py-8">
        <div className="flex flex-col gap-6 w-full">
          <div className="w-full">
            <ExternalSearchSection />
          </div>
        </div>
      </div>
    </div>
  );
}