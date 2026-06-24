-- Cercle Atalanka - Initial schema
-- Run with Supabase CLI: supabase db push

create extension if not exists pgcrypto;

-- Utility function used in RLS policies.
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id and p.role = 'admin'
  );
$$;

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Books table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  description text not null,
  cover_image_url text not null,
  pdf_url text,
  price numeric(10,2) not null check (price >= 0),
  is_premium boolean not null default false,
  category text not null,
  rating numeric(2,1) check (rating between 0 and 5),
  reviews integer not null default 0 check (reviews >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Teachings table
create table if not exists public.teachings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type text not null check (type in ('video', 'text_video', 'text_photo', 'text')),
  video_url text,
  content text,
  images jsonb,
  is_premium boolean not null default false,
  category text not null,
  duration text,
  rating numeric(2,1) check (rating between 0 and 5),
  views integer not null default 0 check (views >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Purchases table
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null,
  item_type text not null check (item_type in ('book', 'teaching')),
  amount numeric(10,2) not null check (amount >= 0),
  status text not null default 'completed' check (status in ('completed', 'pending', 'failed')),
  created_at timestamptz not null default now()
);

-- Messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  is_admin_reply boolean not null default false,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Community members table
create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  bio text,
  interests text[] not null default '{}',
  joined_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_purchases_user_id on public.purchases(user_id);
create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_community_members_user_id on public.community_members(user_id);
create index if not exists idx_books_category on public.books(category);
create index if not exists idx_teachings_category on public.teachings(category);
create index if not exists idx_purchases_item on public.purchases(item_type, item_id);

-- Updated-at trigger function
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger: automatically update updated_at columns
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at();

drop trigger if exists update_books_updated_at on public.books;
create trigger update_books_updated_at
before update on public.books
for each row
execute function public.update_updated_at();

drop trigger if exists update_teachings_updated_at on public.teachings;
create trigger update_teachings_updated_at
before update on public.teachings
for each row
execute function public.update_updated_at();

-- Trigger: auto-create profile when an auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.teachings enable row level security;
alter table public.purchases enable row level security;
alter table public.messages enable row level security;
alter table public.community_members enable row level security;

-- Profiles policies
create policy "profiles_select_all"
on public.profiles
for select
using (true);

create policy "profiles_insert_self_or_admin"
on public.profiles
for insert
with check (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_self_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

-- Books policies
create policy "books_select_all"
on public.books
for select
using (true);

create policy "books_admin_insert"
on public.books
for insert
with check (public.is_admin(auth.uid()));

create policy "books_admin_update"
on public.books
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "books_admin_delete"
on public.books
for delete
using (public.is_admin(auth.uid()));

-- Teachings policies
create policy "teachings_select_all"
on public.teachings
for select
using (true);

create policy "teachings_admin_insert"
on public.teachings
for insert
with check (public.is_admin(auth.uid()));

create policy "teachings_admin_update"
on public.teachings
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "teachings_admin_delete"
on public.teachings
for delete
using (public.is_admin(auth.uid()));

-- Purchases policies
create policy "purchases_select_owner_or_admin"
on public.purchases
for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "purchases_insert_owner_or_admin"
on public.purchases
for insert
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "purchases_admin_update"
on public.purchases
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Messages policies
create policy "messages_select_owner_or_admin"
on public.messages
for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "messages_insert_owner_or_admin_reply"
on public.messages
for insert
with check (
  auth.uid() = user_id
  or (public.is_admin(auth.uid()) and is_admin_reply = true)
);

create policy "messages_owner_or_admin_update"
on public.messages
for update
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

-- Community policies
create policy "community_select_all"
on public.community_members
for select
using (true);

create policy "community_insert_self_or_admin"
on public.community_members
for insert
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "community_update_self_or_admin"
on public.community_members
for update
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

-- RPC: check if authenticated user has access to a paid resource.
create or replace function public.has_access_to_item(p_item_type text, p_item_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select case
    when p_item_type = 'book' then exists (
      select 1 from public.books b
      where b.id = p_item_id
      and (
        b.is_premium = false
        or exists (
          select 1
          from public.purchases p
          where p.user_id = auth.uid()
            and p.item_type = 'book'
            and p.item_id = p_item_id
            and p.status = 'completed'
        )
      )
    )
    when p_item_type = 'teaching' then exists (
      select 1 from public.teachings t
      where t.id = p_item_id
      and (
        t.is_premium = false
        or exists (
          select 1
          from public.purchases p
          where p.user_id = auth.uid()
            and p.item_type = 'teaching'
            and p.item_id = p_item_id
            and p.status = 'completed'
        )
      )
    )
    else false
  end;
$$;

comment on function public.has_access_to_item(text, uuid)
is 'Returns true when current user can access the given book or teaching.';
