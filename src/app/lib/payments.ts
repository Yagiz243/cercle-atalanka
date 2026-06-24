import { CartItem } from './types';
import { getChariowProductId } from './chariowProducts';
import { supabase } from './supabase';

export interface ChariowCheckoutInput {
  item: CartItem;
  email: string;
  fullName: string;
  phoneNumber: string;
  phoneCountryCode: string;
  origin: string;
}

interface CheckoutResult {
  sessionId: string;
  step: 'payment' | 'completed' | 'already_purchased';
  saleId: string | null;
  checkoutUrl: string | null;
  message: string | null;
}

interface VerifyResult {
  status: 'completed' | 'pending' | 'failed' | 'cancelled' | 'already_purchased';
  message: string;
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || 'Client',
    lastName: parts.slice(1).join(' ') || parts[0] || 'Client',
  };
}

export async function startChariowCheckout(input: ChariowCheckoutInput) {
  const chariowProductId = getChariowProductId(input.item.item.id);

  if (!chariowProductId) {
    throw new Error('Aucun produit Chariow n\'est configure pour ce contenu.');
  }

  const { firstName, lastName } = splitFullName(input.fullName);
  const price = 'price' in input.item.item ? input.item.item.price : 0;

  const { data, error } = await supabase.functions.invoke<CheckoutResult>('chariow-checkout', {
    body: {
      itemId: input.item.item.id,
      itemType: input.item.type,
      itemTitle: input.item.item.title,
      amount: price,
      chariowProductId,
      email: input.email,
      firstName,
      lastName,
      phoneNumber: input.phoneNumber,
      phoneCountryCode: input.phoneCountryCode,
      redirectUrl: `${input.origin}/payment/return`,
    },
  });

  if (error) {
    throw new Error(error.message || 'Impossible d\'initialiser le paiement Chariow.');
  }

  return data;
}

export async function verifyChariowPayment(sessionId: string) {
  const { data, error } = await supabase.functions.invoke<VerifyResult>('chariow-verify-sale', {
    body: { sessionId },
  });

  if (error) {
    throw new Error(error.message || 'Impossible de verifier le paiement.');
  }

  return data;
}