create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.is_org_member(target_org uuid)
returns boolean language sql stable security definer set search_path=public as $$
select exists(select 1 from public.organization_members m where m.organization_id=target_org and m.user_id=auth.uid());
$$;
create or replace function private.is_org_editor(target_org uuid)
returns boolean language sql stable security definer set search_path=public as $$
select exists(select 1 from public.organization_members m where m.organization_id=target_org and m.user_id=auth.uid() and m.role in ('admin','operator'));
$$;
create or replace function private.is_org_admin(target_org uuid)
returns boolean language sql stable security definer set search_path=public as $$
select exists(select 1 from public.organization_members m where m.organization_id=target_org and m.user_id=auth.uid() and m.role='admin');
$$;

grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.is_org_editor(uuid) to authenticated;
grant execute on function private.is_org_admin(uuid) to authenticated;

-- Existing policies were rewritten in the live database so write policies no longer
-- overlap with read policies, and SECURITY DEFINER helpers are no longer exposed
-- through the public API schema.

create index if not exists analytics_daily_cemetery_idx on public.analytics_daily(cemetery_id);
create index if not exists audit_logs_user_idx on public.audit_logs(user_id);
create index if not exists burial_admin_notes_org_idx on public.burial_admin_notes(organization_id);
create index if not exists burials_cemetery_idx on public.burials(cemetery_id);
create index if not exists live_events_cemetery_idx on public.live_events(cemetery_id);
create index if not exists live_events_created_by_idx on public.live_events(created_by);
create index if not exists live_events_segment_idx on public.live_events(segment_id);
create index if not exists map_segments_cemetery_idx on public.map_segments(cemetery_id);
create index if not exists map_segments_org_idx on public.map_segments(organization_id);
create index if not exists organization_members_user_idx on public.organization_members(user_id);
create index if not exists precision_markers_org_idx on public.precision_markers(organization_id);
create index if not exists reports_burial_idx on public.reports(burial_id);
create index if not exists reports_cemetery_idx on public.reports(cemetery_id);
create index if not exists reports_segment_idx on public.reports(segment_id);
