do $$
begin
  if (
    select count(*) <> 3
      or count(distinct workshop_id) <> 3
      or bool_or(
        workshop_id not in (
          'ai-tools-prompting',
          'ai-coding-developer-growth',
          'ai-robotics'
        )
      )
    from public.workshop_registration_options
  ) then
    raise exception 'Expected exactly the three existing Workshop registration rows.';
  end if;
end;
$$;

create function public.workshop_focus_areas_are_valid(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  item jsonb;
  label_text text;
  icon_text text;
  seen_labels text[] := array[]::text[];
begin
  if value is null
    or jsonb_typeof(value) <> 'array'
    or jsonb_array_length(value) > 6 then
    return false;
  end if;

  for item in select * from jsonb_array_elements(value)
  loop
    if jsonb_typeof(item) <> 'object'
      or not (item ? 'label')
      or not (item ? 'icon')
      or item - 'label' - 'icon' <> '{}'::jsonb
      or jsonb_typeof(item -> 'label') <> 'string'
      or jsonb_typeof(item -> 'icon') <> 'string' then
      return false;
    end if;

    label_text := btrim(item ->> 'label');
    icon_text := item ->> 'icon';

    if char_length(label_text) not between 1 and 80
      or icon_text not in (
        'bot', 'brain', 'sparkles', 'code', 'terminal', 'cpu',
        'circuit-board', 'graduation-cap', 'briefcase', 'workflow',
        'lightbulb', 'rocket', 'book-open', 'bug', 'git-branch', 'camera',
        'radio', 'palette', 'message-square-text', 'panels-top-left',
        'scan-search', 'blocks', 'scan-eye'
      )
      or lower(label_text) = any(seen_labels) then
      return false;
    end if;

    seen_labels := array_append(seen_labels, lower(label_text));
  end loop;

  return true;
end;
$$;

create function public.workshop_audiences_are_valid(
  enabled boolean,
  selected_values text[]
)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  value text;
  seen text[] := array[]::text[];
begin
  if selected_values is null then
    return false;
  end if;
  if not enabled then
    return cardinality(selected_values) = 0;
  end if;
  if cardinality(selected_values) = 0 then
    return false;
  end if;
  foreach value in array selected_values
  loop
    if value not in (
      'school-students', 'college-students', 'working-professionals',
      'homemakers-career-restarters', 'beginners-tech-enthusiasts',
      'developers-engineers', 'everyone'
    ) or value = any(seen) then
      return false;
    end if;
    seen := array_append(seen, value);
  end loop;
  return not ('everyone' = any(selected_values)) or cardinality(selected_values) = 1;
end;
$$;

create function public.workshop_standards_are_valid(
  enabled boolean,
  selected_values smallint[]
)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  value smallint;
  seen smallint[] := array[]::smallint[];
begin
  if selected_values is null then
    return false;
  end if;
  if not enabled then
    return cardinality(selected_values) = 0;
  end if;
  if cardinality(selected_values) = 0 then
    return false;
  end if;
  foreach value in array selected_values
  loop
    if value not between 5 and 12 or value = any(seen) then
      return false;
    end if;
    seen := array_append(seen, value);
  end loop;
  return true;
end;
$$;

revoke all on function public.workshop_focus_areas_are_valid(jsonb)
from public, anon, authenticated;
revoke all on function public.workshop_audiences_are_valid(boolean, text[])
from public, anon, authenticated;
revoke all on function public.workshop_standards_are_valid(boolean, smallint[])
from public, anon, authenticated;

grant execute on function public.workshop_focus_areas_are_valid(jsonb)
to service_role;
grant execute on function public.workshop_audiences_are_valid(boolean, text[])
to service_role;
grant execute on function public.workshop_standards_are_valid(boolean, smallint[])
to service_role;

create table public.workshop_programs (
  workshop_id text primary key
    check (workshop_id in ('workshop-1', 'workshop-2', 'workshop-3', 'workshop-4')),
  is_active boolean not null default false,
  display_order smallint not null
    check (display_order between 1 and 4),
  title text not null
    check (char_length(btrim(title)) between 1 and 120),
  description text not null
    check (char_length(btrim(description)) between 1 and 600),
  main_icon text not null
    check (
      main_icon in (
        'bot', 'brain', 'sparkles', 'code', 'terminal', 'cpu',
        'circuit-board', 'graduation-cap', 'briefcase', 'workflow',
        'lightbulb', 'rocket', 'book-open', 'bug', 'git-branch', 'camera',
        'radio', 'palette', 'message-square-text', 'panels-top-left',
        'scan-search', 'blocks', 'scan-eye'
      )
    ),
  theme text not null
    check (theme in ('cyan-blue', 'blue-violet', 'orange-cyan', 'emerald-blue')),
  focus_areas jsonb not null default '[]'::jsonb
    check (public.workshop_focus_areas_are_valid(focus_areas)),
  audience_enabled boolean not null default false,
  audience_values text[] not null default array[]::text[]
    check (public.workshop_audiences_are_valid(audience_enabled, audience_values)),
  standards_enabled boolean not null default false,
  standards smallint[] not null default array[]::smallint[]
    check (public.workshop_standards_are_valid(standards_enabled, standards)),
  age_enabled boolean not null default false,
  min_age smallint,
  max_age smallint,
  registration_status text not null
    check (registration_status in ('open', 'full', 'hidden')),
  registration_heading text not null
    check (char_length(btrim(registration_heading)) between 1 and 150),
  registration_icon text not null
    check (
      registration_icon in (
        'bot', 'brain', 'sparkles', 'code', 'terminal', 'cpu',
        'circuit-board', 'graduation-cap', 'briefcase', 'workflow',
        'lightbulb', 'rocket', 'book-open', 'bug', 'git-branch', 'camera',
        'radio', 'palette', 'message-square-text', 'panels-top-left',
        'scan-search', 'blocks', 'scan-eye'
      )
    ),
  google_form_url text
    check (
      google_form_url is null
      or char_length(btrim(google_form_url)) between 1 and 2048
    ),
  button_label text not null
    check (char_length(btrim(button_label)) between 1 and 80),
  full_message text not null
    check (char_length(btrim(full_message)) between 1 and 500),
  updated_at timestamptz not null default now(),
  constraint workshop_programs_display_order_key
    unique (display_order) deferrable initially immediate,
  constraint workshop_programs_age_check
    check (
      (
        not age_enabled
        and min_age is null
        and max_age is null
      )
      or (
        age_enabled
        and min_age between 5 and 100
        and max_age between 5 and 100
        and min_age <= max_age
      )
    ),
  constraint workshop_programs_open_url_check
    check (registration_status <> 'open' or google_form_url is not null)
);

insert into public.workshop_programs (
  workshop_id, is_active, display_order, title, description, main_icon, theme,
  focus_areas, audience_enabled, audience_values, standards_enabled, standards,
  age_enabled, min_age, max_age, registration_status, registration_heading,
  registration_icon, google_form_url, button_label, full_message, updated_at
)
select
  case old.workshop_id
    when 'ai-tools-prompting' then 'workshop-1'
    when 'ai-coding-developer-growth' then 'workshop-2'
    when 'ai-robotics' then 'workshop-3'
  end,
  true,
  case old.workshop_id
    when 'ai-tools-prompting' then 1
    when 'ai-coding-developer-growth' then 2
    when 'ai-robotics' then 3
  end,
  case old.workshop_id
    when 'ai-tools-prompting' then 'AI Tools & Prompting'
    when 'ai-coding-developer-growth' then 'AI for Coding & Developer Growth'
    when 'ai-robotics' then 'AI & Robotics'
  end,
  case old.workshop_id
    when 'ai-tools-prompting' then
      'Learn to use modern AI tools, write better prompts, and build practical workflows for learning, work and creativity.'
    when 'ai-coding-developer-growth' then
      'Use AI as a development partner to build, debug, review and improve software while strengthening your own understanding.'
    when 'ai-robotics' then
      'Explore how artificial intelligence, electronics and automation come together to create intelligent robotic systems.'
  end,
  case old.workshop_id
    when 'ai-tools-prompting' then 'bot'
    when 'ai-coding-developer-growth' then 'code'
    when 'ai-robotics' then 'cpu'
  end,
  case old.workshop_id
    when 'ai-tools-prompting' then 'cyan-blue'
    when 'ai-coding-developer-growth' then 'blue-violet'
    when 'ai-robotics' then 'orange-cyan'
  end,
  case old.workshop_id
    when 'ai-tools-prompting' then
      '[{"label":"AI Foundations","icon":"brain"},{"label":"Prompt Engineering","icon":"message-square-text"},{"label":"Study & Research with AI","icon":"book-open"},{"label":"Work & Productivity","icon":"briefcase"},{"label":"Content & Creativity","icon":"palette"},{"label":"Smart AI Workflows","icon":"workflow"}]'::jsonb
    when 'ai-coding-developer-growth' then
      '[{"label":"AI-Assisted Coding","icon":"code"},{"label":"Build Applications with AI","icon":"panels-top-left"},{"label":"Debugging & Problem Solving","icon":"bug"},{"label":"Code Review & Refactoring","icon":"scan-search"},{"label":"Git & GitHub Workflow","icon":"git-branch"},{"label":"AI-Powered Software Engineering","icon":"blocks"}]'::jsonb
    when 'ai-robotics' then
      '[{"label":"Robotics Foundations","icon":"bot"},{"label":"Sensors & Actuators","icon":"radio"},{"label":"Microcontrollers & Control","icon":"cpu"},{"label":"AI-Powered Decision Making","icon":"brain"},{"label":"Computer Vision & Automation","icon":"scan-eye"},{"label":"Smart Robotics Projects","icon":"circuit-board"}]'::jsonb
  end,
  false,
  array[]::text[],
  false,
  array[]::smallint[],
  false,
  null,
  null,
  old.status,
  old.registration_heading,
  case old.workshop_id
    when 'ai-tools-prompting' then 'bot'
    when 'ai-coding-developer-growth' then 'code'
    when 'ai-robotics' then 'cpu'
  end,
  old.google_form_url,
  old.button_label,
  old.full_message,
  old.updated_at
from public.workshop_registration_options as old;

insert into public.workshop_programs (
  workshop_id, is_active, display_order, title, description, main_icon, theme,
  focus_areas, audience_enabled, audience_values, standards_enabled, standards,
  age_enabled, min_age, max_age, registration_status, registration_heading,
  registration_icon, google_form_url, button_label, full_message
)
values (
  'workshop-4', false, 4, 'New Workshop',
  'Configure this Workshop before making it active.',
  'sparkles', 'emerald-blue', '[]'::jsonb, false, array[]::text[],
  false, array[]::smallint[], false, null, null, 'hidden',
  'Workshop Registration', 'sparkles', null, 'Register Now',
  'Seats are full for this workshop.'
);

do $$
begin
  if (
    select count(*) <> 4
      or count(distinct workshop_id) <> 4
      or count(distinct display_order) <> 4
    from public.workshop_programs
  ) then
    raise exception 'Workshop slot migration did not produce exactly four valid rows.';
  end if;
end;
$$;

alter table public.workshop_programs enable row level security;

revoke all privileges on table public.workshop_programs
from public, anon, authenticated, service_role;

grant select, update on table public.workshop_programs
to service_role;

create function public.reorder_workshop_programs(workshop_ids text[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  affected integer;
begin
  if cardinality(workshop_ids) <> 4
    or not (
      array['workshop-1', 'workshop-2', 'workshop-3', 'workshop-4']::text[]
      <@ workshop_ids
    )
    or not (
      workshop_ids
      <@ array['workshop-1', 'workshop-2', 'workshop-3', 'workshop-4']::text[]
    ) then
    raise exception 'Workshop order must contain all four slots exactly once.';
  end if;

  set constraints workshop_programs_display_order_key deferred;

  update public.workshop_programs as program
  set
    display_order = requested.ordinality,
    updated_at = now()
  from unnest(workshop_ids) with ordinality as requested(workshop_id, ordinality)
  where program.workshop_id = requested.workshop_id;

  get diagnostics affected = row_count;
  if affected <> 4 then
    raise exception 'Workshop order update did not affect all four slots.';
  end if;
end;
$$;

revoke all on function public.reorder_workshop_programs(text[])
from public, anon, authenticated;
grant execute on function public.reorder_workshop_programs(text[])
to service_role;

drop table public.workshop_registration_options;
