create extension if not exists vector;

create table if not exists stock_items (
  id uuid primary key default gen_random_uuid(),
  stock_code text not null,
  description text,
  category text,
  store_location text,
  created_at timestamptz not null default now()
);

create table if not exists stock_item_images (
  id uuid primary key default gen_random_uuid(),
  stock_item_id uuid not null references stock_items(id) on delete cascade,
  image_path text not null,
  image_url text not null,
  embedding vector(512) not null,
  created_at timestamptz not null default now()
);

create table if not exists stock_match_feedback (
  id uuid primary key default gen_random_uuid(),
  stock_item_id uuid references stock_items(id) on delete set null,
  stock_code text,
  similarity float,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists stock_items_stock_code_idx
  on stock_items (stock_code);

create index if not exists stock_item_images_embedding_idx
  on stock_item_images
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function match_stock_images(
  query_embedding vector(512),
  match_count int default 5
)
returns table (
  stock_item_id uuid,
  stock_code text,
  description text,
  category text,
  store_location text,
  image_url text,
  similarity float
)
language sql
stable
as $$
  select
    si.id as stock_item_id,
    si.stock_code,
    si.description,
    si.category,
    si.store_location,
    sii.image_url,
    1 - (sii.embedding <=> query_embedding) as similarity
  from stock_item_images sii
  join stock_items si on si.id = sii.stock_item_id
  order by sii.embedding <=> query_embedding
  limit match_count;
$$;

alter table stock_items enable row level security;
alter table stock_item_images enable row level security;
alter table stock_match_feedback enable row level security;

create policy "service role can manage stock items"
  on stock_items for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage stock images"
  on stock_item_images for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role can manage feedback"
  on stock_match_feedback for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
