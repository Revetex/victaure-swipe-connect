
export interface Location {
  id: string;
  user_id: string;
  job_id?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface MapConfig {
  apiKey: string;
  zoom: number;
  center: {
    lat: number;
    lng: number;
  };
}
