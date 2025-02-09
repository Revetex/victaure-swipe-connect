
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { Building2, Globe, Info } from "lucide-react";
import { motion } from "framer-motion";

export function JobCompanyFields() {
  const { control } = useFormContext();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Informations sur l'entreprise</h3>
      </div>
      
      <FormField
        control={control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
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
              <Globe className="h-4 w-4 text-muted-foreground" />
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
              <Info className="h-4 w-4 text-muted-foreground" />
              Description de l'entreprise
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez votre entreprise en quelques lignes..."
                className="min-h-[120px] bg-background/60 resize-none"
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
