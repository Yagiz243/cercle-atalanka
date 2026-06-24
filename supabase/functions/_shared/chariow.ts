import { createHmac } from 'https://deno.land/std@0.224.0/crypto/mod.ts';

const CHARIOW_BASE_URL = 'https://api.chariow.com/v1';

function getApiKey() {
  const apiKey = Deno.env.get('CHARIOW_API_KEY');

  if (!apiKey) {
    throw new Error('CHARIOW_API_KEY is not configured.');
  }

  return apiKey;
}

export async function chariowFetch(path: string, init: RequestInit = {}) {
  const response = await fetch(`${CHARIOW_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    const details = payload?.message || 'Chariow request failed.';
    throw new Error(details);
  }

  return payload;
}

export function verifyChariowSignature(rawBody: string, signature: string | null) {
  const secret = Deno.env.get('CHARIOW_WEBHOOK_SECRET');

  if (!secret) {
    throw new Error('CHARIOW_WEBHOOK_SECRET is not configured.');
  }

  if (!signature) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(rawBody).toString('hex');

  return expected === signature;
}