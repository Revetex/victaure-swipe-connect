
export interface BusinessProfile {
  id: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  description?: string;
  website?: string;
  logo_url?: string;
  location?: string;
  created_at: string;
  trial_end_date?: string;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
  verified: boolean;
}

export interface SubscriptionProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  type: 'standard' | 'premium';
  features: {
    job_posts: number;
    duration_days: number;
    featured: boolean;
    priority_listing?: boolean;
    enhanced_visibility?: boolean;
  };
  created_at: string;
}

export interface BusinessSubscription {
  id: string;
  business_id: string;
  product_id: string;
  status: 'active' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  cancelled_at?: string;
  stripe_subscription_id?: string;
}

export interface JobPosting {
  id: string;
  business_id: string;
  title: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  job_type?: string;
  is_priority: boolean;
  status: 'draft' | 'published' | 'expired' | 'closed';
  created_at: string;
  expires_at?: string;
  published_at?: string;
  priority_expires_at?: string;
}
