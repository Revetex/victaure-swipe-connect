import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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

  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
    }
  }, [formState.errors]);

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-lg border p-4 space-y-6">
                    <h3 className="text-lg font-semibold">Informations essentielles</h3>
                    <JobBasicInfoFields />
                    <JobTypeFields />
                    <JobCategoryFields />
                  </div>

                  {missionType === "company" && (
                    <div className="rounded-lg border p-4 space-y-6">
                      <h3 className="text-lg font-semibold">Informations entreprise</h3>
                      <JobCompanyFields />
                      <JobSalaryFields />
                    </div>
                  )}

                  <div className="rounded-lg border p-4 space-y-6">
                    <h3 className="text-lg font-semibold">Détails supplémentaires</h3>
                    <JobDetailsFields />
                  </div>
                </motion.div>
              </ScrollArea>

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