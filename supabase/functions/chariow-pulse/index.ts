import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyChariowSignature } from '../_shared/chariow.ts';
import { fulfillPurchase } from '../_shared/fulfillment.ts';
import { createServiceClient } from '../_shared/supabase.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-chariow-signature');

    if (!verifyChariowSignature(rawBody, signature)) {
      return new Response(JSON.stringify({ message: 'Invalid Chariow signature.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;
    const metadata = data?.custom_metadata || {};
    const sessionId = metadata.payment_session_id;
    const userId = metadata.user_id;
    const itemId = metadata.item_id;
    const itemType = metadata.item_type;
    const supabase = createServiceClient();

    if (!sessionId) {
      return new Response(JSON.stringify({ message: 'No payment session metadata.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (event === 'sale.completed') {
      await fulfillPurchase({
        saleId: data.id,
        userId,
        itemId,
        itemType,
        amount: Number(data?.amount?.value || 0),
      });

      await supabase
        .from('payment_sessions')
        .update({ status: 'completed', sale_id: data.id })
        .eq('id', sessionId);
    }

    if (event === 'sale.refunded' || event === 'sale.failed') {
      await supabase
        .from('payment_sessions')
        .update({ status: event === 'sale.refunded' ? 'cancelled' : 'failed', sale_id: data.id })
        .eq('id', sessionId);
    }

    return new Response(JSON.stringify({ message: 'ok' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error instanceof Error ? error.message : 'Webhook Chariow impossible.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});