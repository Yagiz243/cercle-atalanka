alter table public.purchases
  add column if not exists external_sale_id text unique,
  add column if not exists provider text not null default 'internal' check (provider in ('internal', 'chariow'));

create table if not exists public.payment_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'chariow',
  status text not null default 'pending' check (status in ('pending', 'redirected', 'completed', 'failed', 'cancelled', 'already_purchased')),
  sale_id text unique,
  transaction_id text,
  item_id uuid not null,
  item_type text not null check (item_type in ('book', 'teaching')),
  item_title text not null,
  chariow_product_id text not null,
  amount numeric(10,2) not null check (amount >= 0),
  currency text not null default 'XOF',
  customer_email text not null,
  customer_name text not null,
  phone_number text not null,
  phone_country_code text not null,
  checkout_url text,
  metadata jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payment_sessions_user_id on public.payment_sessions(user_id);
create index if not exists idx_payment_sessions_status on public.payment_sessions(status);

alter table public.payment_sessions enable row level security;

create policy "payment_sessions_select_owner_or_admin"
on public.payment_sessions
for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop trigger if exists update_payment_sessions_updated_at on public.payment_sessions;
create trigger update_payment_sessions_updated_at
before update on public.payment_sessions
for each row
execute function public.update_updated_at();