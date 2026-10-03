revoke all privileges
on table public.workshop_settings
from service_role;

grant select, update
on table public.workshop_settings
to service_role;
