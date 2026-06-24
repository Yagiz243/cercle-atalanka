import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function createUnconfiguredSupabaseProxy() {
  return new Proxy({} as ReturnType<typeof createClient<Database>>, {
    get() {
      throw new Error('Supabase n\'est pas configure. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
    },
  });
}

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createUnconfiguredSupabaseProxy();

export async function uploadFile(bucket: string, path: string, file: File) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
