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
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";

interface CreateJobFormProps {
  onSuccess?: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const form = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, isSubmitting } = useJobFormSubmit(onSuccess);
  const missionType = form.watch("mission_type");
  const formState = form.formState;

  // Afficher les erreurs de validation
  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
    }
  }, [formState.errors]);

  const tabs = [
    { id: "basic", label: "Informations de base" },
    { id: "type", label: "Type de mission" },
    { id: "category", label: "Catégorie" },
    ...(missionType === "company" ? [{ id: "company", label: "Entreprise" }] : []),
  ];

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="relative"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div 
                    className="mt-6 space-y-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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
                </AnimatePresence>

                <div className="mt-6 rounded-lg border p-4">
                  <JobDetailsFields />
                </div>
              </Tabs>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !formState.isValid}
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