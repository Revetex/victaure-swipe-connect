
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Building2, Globe, Info } from "lucide-react";
import { motion } from "framer-motion";

export function JobCompanyFields() {
  const { control } = useFormContext();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Informations sur l'entreprise</h3>
      </div>
      
      <FormField
        control={control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Nom de l'entreprise
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Acme Inc." 
                className="bg-background/60"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="company_website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Site web
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: https://www.acme.com" 
                className="bg-background/60"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="company_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Description de l'entreprise
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez votre entreprise..."
                className="min-h-[100px] bg-background/60"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
