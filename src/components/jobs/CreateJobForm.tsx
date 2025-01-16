import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { JobBasicInfoFields } from "./form/JobBasicInfoFields";
import { JobTypeFields } from "./form/JobTypeFields";
import { JobCategoryFields } from "./form/JobCategoryFields";
import { JobCompanyFields } from "./form/JobCompanyFields";
import { JobSalaryFields } from "./form/JobSalaryFields";
import { JobDetailsFields } from "./form/JobDetailsFields";
import { jobFormSchema, defaultValues } from "./form/jobFormSchema";
import { useJobFormSubmit } from "./form/useJobFormSubmit";
import { motion } from "framer-motion";

interface CreateJobFormProps {
  onSuccess?: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const form = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const { handleSubmit, isSubmitting } = useJobFormSubmit(onSuccess);
  const missionType = form.watch("mission_type");

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
                  <TabsTrigger value="basic">Informations de base</TabsTrigger>
                  <TabsTrigger value="type">Type de mission</TabsTrigger>
                  <TabsTrigger value="category">Catégorie</TabsTrigger>
                  {missionType === "company" && (
                    <TabsTrigger value="company">Entreprise</TabsTrigger>
                  )}
                </TabsList>

                <motion.div 
                  className="mt-6 space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="basic" className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <JobBasicInfoFields />
                    </div>
                  </TabsContent>

                  <TabsContent value="type" className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <JobTypeFields />
                    </div>
                  </TabsContent>

                  <TabsContent value="category" className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <JobCategoryFields />
                    </div>
                  </TabsContent>

                  {missionType === "company" && (
                    <TabsContent value="company" className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <JobCompanyFields />
                        <div className="mt-6">
                          <JobSalaryFields />
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </motion.div>

                <div className="mt-6 rounded-lg border p-4">
                  <JobDetailsFields />
                </div>
              </Tabs>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? "Création en cours..." : "Créer la mission"}
              </Button>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}