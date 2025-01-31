import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export function JobDetailsFields() {
  const { control } = useFormContext();
  
  const { fields: benefitsFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: "benefits"
  });

  const { fields: responsibilitiesFields, append: appendResponsibility, remove: removeResponsibility } = useFieldArray({
    control,
    name: "responsibilities"
  });

  const { fields: qualificationsFields, append: appendQualification, remove: removeQualification } = useFieldArray({
    control,
    name: "qualifications"
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Avantages</h3>
        {benefitsFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={control}
              name={`benefits.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Ex: Assurance santé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeBenefit(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendBenefit("")}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un avantage
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Responsabilités</h3>
        {responsibilitiesFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={control}
              name={`responsibilities.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Ex: Développement de nouvelles fonctionnalités" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeResponsibility(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendResponsibility("")}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une responsabilité
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Qualifications</h3>
        {qualificationsFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={control}
              name={`qualifications.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Ex: 5 ans d'expérience en React" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeQualification(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendQualification("")}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une qualification
        </Button>
      </div>
    </div>
  );
}