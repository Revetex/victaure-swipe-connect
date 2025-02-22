
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
}

export interface BusinessSignupFormProps {
  redirectTo?: string;
}
