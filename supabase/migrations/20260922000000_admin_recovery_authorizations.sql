create table if not exists public.admin_recovery_authorizations (
  token_hash text primary key check (length(token_hash) = 64),
  user_id uuid not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.admin_recovery_authorizations enable row level security;

revoke all on table public.admin_recovery_authorizations
from anon, authenticated;

grant all on table public.admin_recovery_authorizations to service_role;

create or replace function public.consume_admin_recovery_authorization(
  p_token_hash text,
  p_user_id uuid
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.admin_recovery_authorizations
  set consumed_at = now()
  where token_hash = p_token_hash
    and user_id = p_user_id
    and consumed_at is null
    and expires_at > now();

  return found;
end;
$$;

revoke all on function public.consume_admin_recovery_authorization(text, uuid)
from public, anon, authenticated;

grant execute on function public.consume_admin_recovery_authorization(text, uuid)
to service_role;
