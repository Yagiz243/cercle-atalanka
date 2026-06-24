import { fetchBooks, fetchTeachings } from './content';
import { fetchCommunityMembers, fetchProfiles } from './community';
import { getCurrentUserPurchases, PurchaseRow } from './purchases';
import { isSupabaseConfigured, supabase } from './supabase';
import { Database } from './database.types';
import { Book, Teaching, User } from './types';

type BookRow = Database['public']['Tables']['books']['Row'];
type TeachingRow = Database['public']['Tables']['teachings']['Row'];

export interface CreateBookInput {
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  price: number;
  isPremium: boolean;
  category: string;
  pdfUrl?: string;
}

export interface CreateTeachingInput {
  title: string;
  description: string;
  type: 'video' | 'text_video' | 'text_photo' | 'text';
  category: string;
  duration?: string;
  content?: string;
  videoUrl?: string;
  images?: string[];
  isPremium: boolean;
}

function mapBookRow(row: BookRow): Book {
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

function mapTeachingRow(row: TeachingRow): Teaching {
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

export async function createBook(input: CreateBookInput) {
  if (!isSupabaseConfigured) {
    return {
      id: `demo-book-${Date.now()}`,
      title: input.title,
      author: input.author,
      description: input.description,
      coverImageUrl: input.coverImageUrl,
      pdfUrl: input.pdfUrl,
      price: input.price,
      isPremium: input.isPremium,
      category: input.category,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
    } as Book;
  }

  const { data, error } = await supabase
    .from('books')
    .insert({
      title: input.title,
      author: input.author,
      description: input.description,
      cover_image_url: input.coverImageUrl,
      pdf_url: input.pdfUrl || null,
      price: input.price,
      is_premium: input.isPremium,
      category: input.category,
      rating: 0,
      reviews: 0,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapBookRow(data);
}

export async function createTeaching(input: CreateTeachingInput) {
  if (!isSupabaseConfigured) {
    return {
      id: `demo-teaching-${Date.now()}`,
      title: input.title,
      description: input.description,
      type: input.type,
      videoUrl: input.videoUrl,
      content: input.content,
      images: input.images,
      isPremium: input.isPremium,
      category: input.category,
      duration: input.duration,
      rating: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    } as Teaching;
  }

  const { data, error } = await supabase
    .from('teachings')
    .insert({
      title: input.title,
      description: input.description,
      type: input.type,
      video_url: input.videoUrl || null,
      content: input.content || null,
      images: input.images || null,
      is_premium: input.isPremium,
      category: input.category,
      duration: input.duration || null,
      rating: 0,
      views: 0,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapTeachingRow(data);
}

export async function fetchAllPurchases() {
  if (!isSupabaseConfigured) {
    return [] as PurchaseRow[];
  }

  const { data, error } = await supabase.from('purchases').select('*').order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchAdminOverviewData() {
  const [books, teachings, profiles, purchases, communityMembers, messagesResult] = await Promise.all([
    fetchBooks(),
    fetchTeachings(),
    fetchProfiles(),
    fetchAllPurchases(),
    fetchCommunityMembers(),
    isSupabaseConfigured ? supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(10) : Promise.resolve({ data: [], error: null }),
  ]);

  if (messagesResult.error) {
    throw messagesResult.error;
  }

  return {
    books,
    teachings,
    profiles,
    purchases,
    communityMembers,
    messages: messagesResult.data || [],
  };
}

export async function deleteBookById(id: string) {
  if (!isSupabaseConfigured) {
    return;
  }

  const { error } = await supabase.from('books').delete().eq('id', id);

  if (error) {
    throw error;
  }
}

export async function deleteTeachingById(id: string) {
  if (!isSupabaseConfigured) {
    return;
  }

  const { error } = await supabase.from('teachings').delete().eq('id', id);

  if (error) {
    throw error;
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  if (!isSupabaseConfigured) {
    return;
  }

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);

  if (error) {
    throw error;
  }
}

export async function fetchDashboardOverviewData() {
  const [books, teachings, purchases] = await Promise.all([
    fetchBooks(),
    fetchTeachings(),
    getCurrentUserPurchases(),
  ]);

  return {
    books,
    teachings,
    purchases,
  };
}

export function resolvePurchasedItem(
  purchase: PurchaseRow,
  books: Book[],
  teachings: Teaching[],
) {
  return purchase.item_type === 'book'
    ? books.find((book) => book.id === purchase.item_id) || null
    : teachings.find((teaching) => teaching.id === purchase.item_id) || null;
}

export type { User };