import { Database } from './database.types';
import { Book, Teaching } from './types';
import { isSupabaseConfigured, supabase } from './supabase';
import { mockBooks, mockTeachings } from './mockData';

type BookRow = Database['public']['Tables']['books']['Row'];
type TeachingRow = Database['public']['Tables']['teachings']['Row'];

function mapBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    pdfUrl: row.pdf_url || undefined,
    price: row.price,
    isPremium: row.is_premium,
    category: row.category,
    rating: row.rating || undefined,
    reviews: row.reviews || undefined,
    createdAt: row.created_at,
  };
}

function mapTeaching(row: TeachingRow): Teaching {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    videoUrl: row.video_url || undefined,
    content: row.content || undefined,
    images: Array.isArray(row.images) ? (row.images as string[]) : undefined,
    isPremium: row.is_premium,
    category: row.category,
    duration: row.duration || undefined,
    rating: row.rating || undefined,
    views: row.views || undefined,
    createdAt: row.created_at,
  };
}

export async function fetchBooks() {
  if (!isSupabaseConfigured) {
    return mockBooks;
  }

  const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapBook);
}

export async function fetchBookById(id: string) {
  if (!isSupabaseConfigured) {
    return mockBooks.find((book) => book.id === id) || null;
  }

  const { data, error } = await supabase.from('books').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapBook(data) : null;
}

export async function fetchTeachings() {
  if (!isSupabaseConfigured) {
    return mockTeachings;
  }

  const { data, error } = await supabase.from('teachings').select('*').order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapTeaching);
}

export async function fetchTeachingById(id: string) {
  if (!isSupabaseConfigured) {
    return mockTeachings.find((teaching) => teaching.id === id) || null;
  }

  const { data, error } = await supabase.from('teachings').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapTeaching(data) : null;
}