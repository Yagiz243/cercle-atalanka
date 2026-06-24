import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { chariowFetch } from '../_shared/chariow.ts';
import { fulfillPurchase } from '../_shared/fulfillment.ts';
import { createServiceClient, createUserClient } from '../_shared/supabase.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authClient = createUserClient(req.headers.get('Authorization'));
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ message: 'Utilisateur non authentifie.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { sessionId } = await req.json();
    const supabase = createServiceClient();
    const { data: session, error: sessionError } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      throw sessionError || new Error('Session de paiement introuvable.');
    }

    if (!session.sale_id) {
      return new Response(JSON.stringify({ status: session.status, message: 'La vente Chariow n\'est pas encore disponible.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await chariowFetch(`/sales/${session.sale_id}`);
    const sale = result.data;
    const saleStatus = sale?.status;
    const paymentStatus = sale?.payment?.status;

    if (saleStatus === 'completed' || paymentStatus === 'success') {
      await fulfillPurchase({
        saleId: session.sale_id,
        userId: session.user_id,
        itemId: session.item_id,
        itemType: session.item_type,
        amount: Number(session.amount),
      });

      await supabase
        .from('payment_sessions')
        .update({ status: 'completed' })
        .eq('id', session.id);

      return new Response(JSON.stringify({ status: 'completed', message: 'Paiement confirme. Votre achat est debloque.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (saleStatus === 'failed' || paymentStatus === 'failed') {
      await supabase.from('payment_sessions').update({ status: 'failed' }).eq('id', session.id);

      return new Response(JSON.stringify({ status: 'failed', message: 'Le paiement Chariow a echoue.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (paymentStatus === 'cancelled' || saleStatus === 'abandoned') {
      await supabase.from('payment_sessions').update({ status: 'cancelled' }).eq('id', session.id);

      return new Response(JSON.stringify({ status: 'cancelled', message: 'Le paiement a ete annule ou abandonne.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ status: 'pending', message: 'Le paiement est toujours en attente de confirmation.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error instanceof Error ? error.message : 'Verification Chariow impossible.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});