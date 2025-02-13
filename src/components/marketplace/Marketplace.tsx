
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesList } from "./ServicesList";
import { ItemsList } from "./ItemsList"; // Nous allons le créer ensuite
import { PageLayout } from "@/components/layout/PageLayout";

export function Marketplace() {
  return (
    <PageLayout>
      <div className="container mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="services" className="flex-1 sm:flex-none">Services</TabsTrigger>
            <TabsTrigger value="items" className="flex-1 sm:flex-none">Articles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="mt-6">
            <ServicesList />
          </TabsContent>
          
          <TabsContent value="items" className="mt-6">
            <ItemsList />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
