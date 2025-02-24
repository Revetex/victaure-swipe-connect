
export interface FormData {
  companyName: string;
  email: string;
  password: string;
  industry: string;
  companySize: string;
  firstName: string;
  lastName: string;
  phone: string;
  colorScheme?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface BusinessSignupFormProps {
  redirectTo?: string;
}
