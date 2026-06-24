import { createServiceClient } from './supabase.ts';

interface FulfillmentArgs {
  saleId: string;
  userId: string;
  itemId: string;
  itemType: 'book' | 'teaching';
  amount: number;
}

export async function fulfillPurchase(args: FulfillmentArgs) {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('purchases')
    .upsert(
      {
        user_id: args.userId,
        item_id: args.itemId,
        item_type: args.itemType,
        amount: args.amount,
        status: 'completed',
        external_sale_id: args.saleId,
        provider: 'chariow',
      },
      { onConflict: 'external_sale_id' },
    );

  if (error) {
    throw error;
  }
}