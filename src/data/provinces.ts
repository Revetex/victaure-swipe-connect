export const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon'
] as const;

export type Province = typeof provinces[number];

export const cities: { [key in Province]: string[] } = {
  'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'],
  'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'],
  'Manitoba': ['Winnipeg', 'Brandon', 'Thompson', 'Steinbach', 'Portage la Prairie'],
  'New Brunswick': ['Saint John', 'Moncton', 'Fredericton', 'Dieppe', 'Miramichi'],
  'Newfoundland and Labrador': ['St. Johns', 'Mount Pearl', 'Corner Brook', 'Grand Falls-Windsor'],
  'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith'],
  'Nova Scotia': ['Halifax', 'Dartmouth', 'Sydney', 'Truro', 'New Glasgow'],
  'Nunavut': ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Baker Lake'],
  'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
  'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall'],
  'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'],
  'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current'],
  'Yukon': ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction']
};

export const contractTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Freelance',
  'Internship'
];

export const experienceLevels = [
  'Entry level',
  'Junior',
  'Mid-level',
  'Senior',
  'Lead',
  'Expert'
];
