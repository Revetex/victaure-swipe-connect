import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Job } from "@/types/job";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { JobFormFields } from "./form/JobFormFields";
import { useJobForm } from "./form/useJobForm";

interface CreateJobFormProps {
  onSuccess: () => void;
  initialData?: Job;
}

export function CreateJobForm({ onSuccess, initialData }: CreateJobFormProps) {
  const { form, onSubmit } = useJobForm({ initialData, onSuccess });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour créer ou modifier une mission");
      }
    };
    checkAuth();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <JobFormFields form={form} />
        <Button type="submit" className="w-full">
          {initialData ? "Mettre à jour la mission" : "Créer la mission"}
        </Button>
      </form>
    </Form>
  );
}