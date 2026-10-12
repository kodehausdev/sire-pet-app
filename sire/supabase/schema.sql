create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 5 and 140),
  body text not null default '' check (char_length(body) <= 600),
  tag text not null default 'Other' check (tag in ('Breeding', 'Whelping', 'Health', 'Studs', 'Other')),
  helpful int not null default 0 check (helpful >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 600),
  created_at timestamptz not null default now()
);

create index if not exists replies_post_idx on public.replies (post_id, created_at);

alter table public.posts enable row level security;
alter table public.replies enable row level security;

create policy "anyone reads posts" on public.posts for select using (true);
create policy "anyone reads replies" on public.replies for select using (true);
create policy "anyone posts" on public.posts for insert with check (helpful = 0);
create policy "anyone replies" on public.replies for insert with check (true);

create or replace function public.bump_helpful(post_id uuid, delta int)
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts
  set helpful = greatest(helpful + least(greatest(delta, -1), 1), 0)
  where id = post_id;
$$;

grant execute on function public.bump_helpful(uuid, int) to anon;

alter publication supabase_realtime add table public.posts, public.replies;
