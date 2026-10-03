create table public.workshop_settings (
  id smallint primary key default 1 check (id = 1),
  registration_open boolean not null default false,
  closed_message text not null
    check (
      char_length(btrim(closed_message)) between 1 and 500
    ),
  updated_at timestamptz not null default now()
);

alter table public.workshop_settings enable row level security;

revoke all on table public.workshop_settings
from public, anon, authenticated;

grant select, update on table public.workshop_settings to service_role;

insert into public.workshop_settings (
  id,
  registration_open,
  closed_message
)
values (
  1,
  false,
  'Workshop registrations are currently closed. New learning opportunities are coming soon. For more information, please contact our team.'
)
on conflict (id) do nothing;
