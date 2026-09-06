create extension if not exists "pgcrypto";

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default 'Unknown artist',
  album text,
  duration numeric,
  url text not null,
  cover_url text,
  lrc_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cover_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_tracks (
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  primary key (playlist_id, track_id)
);

alter table public.tracks enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_tracks enable row level security;

create policy "public read tracks" on public.tracks for select using (true);
create policy "public read playlists" on public.playlists for select using (true);
create policy "public read playlist tracks" on public.playlist_tracks for select using (true);

create policy "public insert tracks" on public.tracks for insert with check (true);
create policy "public delete tracks" on public.tracks for delete using (true);

insert into storage.buckets (id, name, public)
values ('audio', 'audio', true), ('covers', 'covers', true), ('lyrics', 'lyrics', true)
on conflict (id) do update set public = true;

create policy "public read music files" on storage.objects for select
using (bucket_id in ('audio', 'covers', 'lyrics'));

create policy "public upload music files" on storage.objects for insert
with check (bucket_id in ('audio', 'covers', 'lyrics'));

create policy "public update music files" on storage.objects for update
using (bucket_id in ('audio', 'covers', 'lyrics'));
create policy "public delete music files" on storage.objects for delete
using (bucket_id in ('audio', 'covers', 'lyrics'));
