alter table public.workshop_settings
  add column registrations_enabled boolean not null default false,
  add column no_registration_message text not null default
    'Workshop registrations are currently unavailable. There are no upcoming workshop registrations at the moment. For more information about our workshops, please contact our team.',
  add column discount_enabled boolean not null default false,
  add column discount_message text not null default
    'Early registration discount is available for a limited time.',
  add column discount_deadline timestamptz,
  add column discount_expired_message text not null default
    'The current workshop discount has ended.',
  add constraint workshop_settings_no_registration_message_length_check
    check (
      char_length(btrim(no_registration_message)) between 1 and 500
    ),
  add constraint workshop_settings_discount_message_length_check
    check (
      char_length(btrim(discount_message)) between 1 and 250
    ),
  add constraint workshop_settings_discount_expired_message_length_check
    check (
      char_length(btrim(discount_expired_message)) between 1 and 250
    );

create table public.workshop_registration_options (
  workshop_id text primary key
    check (
      workshop_id in (
        'ai-tools-prompting',
        'ai-coding-developer-growth',
        'ai-robotics'
      )
    ),
  status text not null
    check (status in ('open', 'full', 'hidden')),
  registration_heading text not null
    check (
      char_length(btrim(registration_heading)) between 1 and 150
    ),
  google_form_url text
    check (
      google_form_url is null
      or char_length(btrim(google_form_url)) between 1 and 2048
    ),
  button_label text not null
    check (
      char_length(btrim(button_label)) between 1 and 80
    ),
  full_message text not null
    check (
      char_length(btrim(full_message)) between 1 and 500
    ),
  updated_at timestamptz not null default now()
);

alter table public.workshop_registration_options enable row level security;

revoke all privileges
on table public.workshop_registration_options
from public, anon, authenticated, service_role;

grant select, update
on table public.workshop_registration_options
to service_role;

insert into public.workshop_registration_options (
  workshop_id,
  status,
  registration_heading,
  google_form_url,
  button_label,
  full_message
)
values
  (
    'ai-tools-prompting',
    'hidden',
    'AI Tools & Prompting Registration',
    null,
    'Register Now',
    'Seats are full for this workshop.'
  ),
  (
    'ai-coding-developer-growth',
    'hidden',
    'AI for Coding & Developer Growth Registration',
    null,
    'Register Now',
    'Seats are full for this workshop.'
  ),
  (
    'ai-robotics',
    'hidden',
    'AI & Robotics Registration',
    null,
    'Register Now',
    'Seats are full for this workshop.'
  );
