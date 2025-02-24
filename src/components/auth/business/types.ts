
export interface FormData {
  email: string;
  password: string;
  companyName: string;
  phone: string;
  industry: string;
  companySize: string;
  province: string;
  address: string;
  postalCode: string;
  acceptedTerms?: boolean;
}

export interface BusinessSignupFormProps {
  redirectTo?: string;
}
