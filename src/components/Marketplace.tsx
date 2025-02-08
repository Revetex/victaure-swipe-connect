
import { Card } from "@/components/ui/card";
import { ExternalSearchSection } from "@/components/google-search/ExternalSearchSection";
import { SwipeJob } from "@/components/SwipeJob";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, Search } from "lucide-react";

export function Marketplace() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Tabs defaultValue="swipe" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="swipe" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Offres Victaure
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Recherche externe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="swipe" className="mt-0">
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SwipeJob />
          </Card>
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <ExternalSearchSection />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
