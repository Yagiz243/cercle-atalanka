import { CartItem } from './types';
import { Database } from './database.types';
import { isSupabaseConfigured, supabase } from './supabase';

type PurchaseRow = Database['public']['Tables']['purchases']['Row'];

async function requireAuthenticatedUser() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('Vous devez etre connecte pour continuer.');
  }

  return user;
}

export async function createPurchasesFromCart(items: CartItem[]) {
  const user = await requireAuthenticatedUser();

  if (!user) {
    throw new Error('Achat indisponible en mode demo local. Configurez Supabase pour activer le checkout.');
  }

  const rows = items.map((cartItem) => {
    const price = 'price' in cartItem.item ? cartItem.item.price : 0;

    return {
      user_id: user.id,
      item_id: cartItem.item.id,
      item_type: cartItem.type,
      amount: price * cartItem.quantity,
      status: 'completed' as const,
    };
  });

  const { data, error } = await supabase
    .from('purchases')
    .insert(rows)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCurrentUserPurchases() {
  const user = await requireAuthenticatedUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function hasPurchasedItem(itemType: 'book' | 'teaching', itemId: string) {
  if (!isSupabaseConfigured) {
    return false;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .eq('status', 'completed')
    .limit(1);

  if (error) {
    throw error;
  }

  return data.length > 0;
}

export type { PurchaseRow };