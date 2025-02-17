
-- Créer la table stripe_customers
create table if not exists public.stripe_customers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_customer_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id),
  unique(stripe_customer_id)
);

-- Activer RLS
alter table public.stripe_customers enable row level security;

-- Créer les politiques RLS
create policy "Users can view their own stripe customer data"
  on public.stripe_customers for select
  using (auth.uid() = user_id);

create policy "Users can insert their own stripe customer data"
  on public.stripe_customers for insert
  with check (auth.uid() = user_id);
