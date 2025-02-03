import { Input } from "@/components/ui/input";

interface SignUpFieldsProps {
  fullName: string;
  phone: string;
  onChange: (field: string, value: string) => void;
}

export const SignUpFields = ({ fullName, phone, onChange }: SignUpFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-foreground">
          Nom complet
        </label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          placeholder="Votre nom complet"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Numéro de téléphone
        </label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="Votre numéro de téléphone"
          required
        />
      </div>
    </>
  );
};