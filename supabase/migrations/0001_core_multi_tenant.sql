-- Dove Riposa - core multi-tenant schema
-- Prepared for the first real municipal pilot.
-- Public citizen traffic should go through controlled Next.js API routes,
-- not direct anonymous table access.

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status text not null default 'pilot' check (status in ('pilot','active','suspended','archived')),
  pilot_free_until date,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('admin','operator','viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.cemeteries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null,
  name text not null,
  address text,
  municipality text,
  province text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.burials (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cemetery_id uuid not null references public.cemeteries(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  birth_year smallint,
  death_year smallint,
  sector text,
  row_label text,
  position_label text,
  map_x numeric,
  map_y numeric,
  status text not null default 'draft' check (status in ('draft','verified','published','hidden')),
  source_updated_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.burial_admin_notes (
  burial_id uuid primary key references public.burials(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  notes text,
  internal_reference text,
  updated_at timestamptz not null default now()
);

create table if not exists public.map_segments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cemetery_id uuid not null references public.cemeteries(id) on delete cascade,
  label text not null,
  geometry jsonb not null default '{}'::jsonb,
  surface text,
  slope_percent numeric,
  width_m numeric,
  has_stairs boolean not null default false,
  has_ramp boolean not null default false,
  has_rest_point boolean not null default false,
  accessibility_status text not null default 'unverified'
    check (accessibility_status in ('unverified','verified','restricted','closed')),
  source_type text,
  verified_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.precision_markers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cemetery_id uuid not null references public.cemeteries(id) on delete cascade,
  code text not null,
  label text not null,
  map_x numeric not null,
  map_y numeric not null,
  orientation_deg numeric,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (cemetery_id, code)
);

create table if not exists public.live_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cemetery_id uuid not null references public.cemeteries(id) on delete cascade,
  segment_id uuid references public.map_segments(id) on delete set null,
  event_type text not null check (event_type in ('works','closure','access_restriction','ceremony','maintenance','other')),
  title text not null,
  message text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  blocks_route boolean not null default false,
  affects_accessible boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cemetery_id uuid not null references public.cemeteries(id) on delete cascade,
  burial_id uuid references public.burials(id) on delete set null,
  segment_id uuid references public.map_segments(id) on delete set null,
  category text not null check (category in ('wrong_position','wrong_data','obstacle','accessibility','closure','other')),
  message text,
  status text not null default 'new' check (status in ('new','reviewing','resolved','rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Privacy-minimized analytics: aggregate counts only.
create table if not exists public.analytics_daily (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cemetery_id uuid references public.cemeteries(id) on delete cascade,
  event_date date not null,
  event_type text not null check (event_type in ('page_view','qr_entry','search','result_open','navigation_start')),
  source text not null default 'direct',
  count bigint not null default 0 check (count >= 0),
  primary key (organization_id, cemetery_id, event_date, event_type, source)
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists burials_search_idx on public.burials (organization_id, cemetery_id, lower(last_name), lower(first_name));
create index if not exists burials_status_idx on public.burials (organization_id, cemetery_id, status);
create index if not exists live_events_window_idx on public.live_events (organization_id, cemetery_id, is_active, starts_at, ends_at);
create index if not exists reports_status_idx on public.reports (organization_id, cemetery_id, status);
create index if not exists audit_logs_org_date_idx on public.audit_logs (organization_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists burials_set_updated_at on public.burials;
create trigger burials_set_updated_at before update on public.burials
for each row execute function public.set_updated_at();

drop trigger if exists map_segments_set_updated_at on public.map_segments;
create trigger map_segments_set_updated_at before update on public.map_segments
for each row execute function public.set_updated_at();

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = target_org
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_org_editor(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = target_org
      and m.user_id = auth.uid()
      and m.role in ('admin','operator')
  );
$$;

create or replace function public.is_org_admin(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = target_org
      and m.user_id = auth.uid()
      and m.role = 'admin'
  );
$$;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.cemeteries enable row level security;
alter table public.burials enable row level security;
alter table public.burial_admin_notes enable row level security;
alter table public.map_segments enable row level security;
alter table public.precision_markers enable row level security;
alter table public.live_events enable row level security;
alter table public.reports enable row level security;
alter table public.analytics_daily enable row level security;
alter table public.audit_logs enable row level security;

create policy "org members read organization" on public.organizations
for select to authenticated using (public.is_org_member(id));

create policy "members read memberships" on public.organization_members
for select to authenticated using (public.is_org_member(organization_id));
create policy "admins manage memberships" on public.organization_members
for all to authenticated using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

create policy "members read cemeteries" on public.cemeteries
for select to authenticated using (public.is_org_member(organization_id));
create policy "editors manage cemeteries" on public.cemeteries
for all to authenticated using (public.is_org_editor(organization_id))
with check (public.is_org_editor(organization_id));

create policy "members read burials" on public.burials
for select to authenticated using (public.is_org_member(organization_id));
create policy "editors manage burials" on public.burials
for all to authenticated using (public.is_org_editor(organization_id))
with check (public.is_org_editor(organization_id));

create policy "members read burial notes" on public.burial_admin_notes
for select to authenticated using (public.is_org_member(organization_id));
create policy "editors manage burial notes" on public.burial_admin_notes
for all to authenticated using (public.is_org_editor(organization_id))
with check (public.is_org_editor(organization_id));

create policy "members read map segments" on public.map_segments
for select to authenticated using (public.is_org_member(organization_id));
create policy "editors manage map segments" on public.map_segments
for all to authenticated using (public.is_org_editor(organization_id))
with check (public.is_org_editor(organization_id));

create policy "members read precision markers" on public.precision_markers
for select to authenticated using (public.is_org_member(organization_id));
create policy "editors manage precision markers" on public.precision_markers
for all to authenticated using (public.is_org_editor(organization_id))
with check (public.is_org_editor(organization_id));

create policy "members read live events" on public.live_events
for select to authenticated using (public.is_org_member(organization_id));
create policy "editors manage live events" on public.live_events
for all to authenticated using (public.is_org_editor(organization_id))
with check (public.is_org_editor(organization_id));

create policy "members read reports" on public.reports
for select to authenticated using (public.is_org_member(organization_id));
create policy "editors manage reports" on public.reports
for all to authenticated using (public.is_org_editor(organization_id))
with check (public.is_org_editor(organization_id));

create policy "members read aggregate analytics" on public.analytics_daily
for select to authenticated using (public.is_org_member(organization_id));
create policy "editors manage aggregate analytics" on public.analytics_daily
for all to authenticated using (public.is_org_editor(organization_id))
with check (public.is_org_editor(organization_id));

create policy "members read audit" on public.audit_logs
for select to authenticated using (public.is_org_member(organization_id));

revoke all on public.organizations from anon;
revoke all on public.organization_members from anon;
revoke all on public.cemeteries from anon;
revoke all on public.burials from anon;
revoke all on public.burial_admin_notes from anon;
revoke all on public.map_segments from anon;
revoke all on public.precision_markers from anon;
revoke all on public.live_events from anon;
revoke all on public.reports from anon;
revoke all on public.analytics_daily from anon;
revoke all on public.audit_logs from anon;
