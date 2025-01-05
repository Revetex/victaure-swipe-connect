export const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon'
] as const;

export type Province = typeof provinces[number];

export const cities: { [key: string]: string[] } = {
  'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'],
  'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'],
  'Manitoba': ['Winnipeg', 'Brandon', 'Thompson', 'Steinbach', 'Portage la Prairie'],
  'New Brunswick': ['Saint John', 'Moncton', 'Fredericton', 'Dieppe', 'Miramichi'],
  'Newfoundland and Labrador': ["St. John's", 'Mount Pearl', 'Corner Brook', 'Grand Falls-Windsor'],
  'Nova Scotia': ['Halifax', 'Dartmouth', 'Sydney', 'Truro', 'New Glasgow'],
  'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
  'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall'],
  'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 
    'Saguenay', 'Levis', 'Trois-Rivieres', 'Terrebonne'],
  'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current'],
  'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith'],
  'Nunavut': ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Baker Lake'],
  'Yukon': ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction']
};

export const provinceData = cities;

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