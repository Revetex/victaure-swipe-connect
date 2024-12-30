import { SupabaseClient } from '@supabase/supabase-js';

export interface JobFilters {
  category: string;
  subcategory: string;
  duration: string;
  experienceLevel: string;
  location: string;
  searchTerm: string;
}

export const applyJobFilters = (query: any, filters: JobFilters) => {
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  
  if (filters.subcategory && filters.subcategory !== 'all') {
    query = query.eq('subcategory', filters.subcategory);
  }

  if (filters.location && filters.location !== 'all') {
    query = query.eq('location', filters.location);
  }

  if (filters.experienceLevel && filters.experienceLevel !== 'all') {
    query = query.eq('experience_level', filters.experienceLevel);
  }

  return query;
};

export const uploadJobImages = async (
  supabase: SupabaseClient,
  images: File[]
): Promise<string[]> => {
  const imageUrls: string[] = [];

  for (const image of images) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('jobs')
      .upload(`images/${fileName}`, image);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      continue;
    }

    if (data) {
      const { data: { publicUrl } } = supabase.storage
        .from('jobs')
        .getPublicUrl(`images/${fileName}`);
      
      imageUrls.push(publicUrl);
    }
  }

  return imageUrls;
};