import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient, createUserClient } from '../_shared/supabase.ts';
import { chariowFetch } from '../_shared/chariow.ts';
import { fulfillPurchase } from '../_shared/fulfillment.ts';

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

    const body = await req.json();
    const {
      itemId,
      itemType,
      itemTitle,
      amount,
      chariowProductId,
      email,
      firstName,
      lastName,
      phoneNumber,
      phoneCountryCode,
      redirectUrl,
    } = body;

    const supabase = createServiceClient();

    const { data: session, error: sessionError } = await supabase
      .from('payment_sessions')
      .insert({
        user_id: user.id,
        item_id: itemId,
        item_type: itemType,
        item_title: itemTitle,
        chariow_product_id: chariowProductId,
        amount,
        customer_email: email,
        customer_name: `${firstName} ${lastName}`.trim(),
        phone_number: phoneNumber,
        phone_country_code: phoneCountryCode,
        metadata: {
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
        },
      })
      .select()
      .single();

    if (sessionError || !session) {
      throw sessionError || new Error('Impossible de creer la session de paiement.');
    }

    const result = await chariowFetch('/checkout', {
      method: 'POST',
      body: JSON.stringify({
        product_id: chariowProductId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: {
          number: phoneNumber,
          country_code: phoneCountryCode,
        },
        payment_currency: 'XOF',
        redirect_url: `${redirectUrl}?session=${session.id}`,
        custom_metadata: {
          payment_session_id: session.id,
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
        },
      }),
    });

    const step = result?.data?.step;
    const saleId = result?.data?.purchase?.id ?? null;
    const transactionId = result?.data?.payment?.transaction_id ?? null;
    const checkoutUrl = result?.data?.payment?.checkout_url ?? null;

    await supabase
      .from('payment_sessions')
      .update({
        sale_id: saleId,
        transaction_id: transactionId,
        checkout_url: checkoutUrl,
        status: step === 'payment' ? 'redirected' : step === 'completed' ? 'completed' : 'already_purchased',
      })
      .eq('id', session.id);

    if (step === 'completed' && saleId) {
      await fulfillPurchase({
        saleId,
        userId: user.id,
        itemId,
        itemType,
        amount,
      });
    }

    return new Response(JSON.stringify({
      sessionId: session.id,
      step,
      saleId,
      checkoutUrl,
      message: result?.data?.message ?? null,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error instanceof Error ? error.message : 'Checkout Chariow impossible.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});