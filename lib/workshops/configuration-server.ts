import "server-only";

import { createAdminClient } from "@/lib/supabase/admin-server";
import { WORKSHOP_SLOT_IDS, type WorkshopSlotId } from "./workshop-data";
import type {
  WorkshopConfiguration,
  WorkshopGlobalConfiguration,
  WorkshopGlobalConfigurationUpdate,
  WorkshopProgram,
  WorkshopProgramUpdate,
  WorkshopRegistrationStatus,
} from "./configuration";
import { isWorkshopSlotId } from "./configuration-validation";

type GlobalRow = {
  registrations_enabled: boolean;
  no_registration_message: string;
  discount_enabled: boolean;
  discount_message: string;
  discount_deadline: string | null;
  discount_expired_message: string;
  updated_at: string;
};

type ProgramRow = {
  workshop_id: string;
  is_active: boolean;
  display_order: number;
  title: string;
  description: string;
  main_icon: WorkshopProgram["mainIcon"];
  theme: WorkshopProgram["theme"];
  focus_areas: WorkshopProgram["focusAreas"];
  audience_enabled: boolean;
  audience_values: WorkshopProgram["audiences"];
  standards_enabled: boolean;
  standards: number[];
  age_enabled: boolean;
  min_age: number | null;
  max_age: number | null;
  registration_status: WorkshopRegistrationStatus;
  registration_heading: string;
  registration_icon: WorkshopProgram["registrationIcon"];
  google_form_url: string | null;
  button_label: string;
  full_message: string;
  updated_at: string;
};

const GLOBAL_SELECT = `
  registrations_enabled,
  no_registration_message,
  discount_enabled,
  discount_message,
  discount_deadline,
  discount_expired_message,
  updated_at
`;
const PROGRAM_SELECT = `
  workshop_id,
  is_active,
  display_order,
  title,
  description,
  main_icon,
  theme,
  focus_areas,
  audience_enabled,
  audience_values,
  standards_enabled,
  standards,
  age_enabled,
  min_age,
  max_age,
  registration_status,
  registration_heading,
  registration_icon,
  google_form_url,
  button_label,
  full_message,
  updated_at
`;

function normalizeGlobal(row: GlobalRow): WorkshopGlobalConfiguration {
  return {
    registrationsEnabled: row.registrations_enabled,
    noRegistrationMessage: row.no_registration_message,
    discountEnabled: row.discount_enabled,
    discountMessage: row.discount_message,
    discountDeadline: row.discount_deadline,
    discountExpiredMessage: row.discount_expired_message,
    updatedAt: row.updated_at,
  };
}

function normalizeProgram(row: ProgramRow): WorkshopProgram {
  if (!isWorkshopSlotId(row.workshop_id)) {
    throw new Error("Workshop configuration contains an unknown slot ID.");
  }
  return {
    workshopId: row.workshop_id,
    isActive: row.is_active,
    displayOrder: row.display_order,
    title: row.title,
    description: row.description,
    mainIcon: row.main_icon,
    theme: row.theme,
    focusAreas: row.focus_areas,
    audienceEnabled: row.audience_enabled,
    audiences: row.audience_values,
    standardsEnabled: row.standards_enabled,
    standards: row.standards,
    ageEnabled: row.age_enabled,
    minAge: row.min_age,
    maxAge: row.max_age,
    registrationStatus: row.registration_status,
    registrationHeading: row.registration_heading,
    registrationIcon: row.registration_icon,
    googleFormUrl: row.google_form_url,
    buttonLabel: row.button_label,
    fullMessage: row.full_message,
    updatedAt: row.updated_at,
  };
}

function normalizePrograms(rows: ProgramRow[]): WorkshopProgram[] {
  const programs = rows.map(normalizeProgram);
  const ids = new Set(programs.map((program) => program.workshopId));
  const orders = new Set(programs.map((program) => program.displayOrder));
  if (
    programs.length !== WORKSHOP_SLOT_IDS.length ||
    ids.size !== WORKSHOP_SLOT_IDS.length ||
    orders.size !== WORKSHOP_SLOT_IDS.length ||
    WORKSHOP_SLOT_IDS.some((id) => !ids.has(id))
  ) {
    throw new Error("Workshop slot configuration is incomplete.");
  }
  return programs.sort((a, b) => a.displayOrder - b.displayOrder);
}

async function getWorkshopPrograms(): Promise<WorkshopProgram[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("workshop_programs")
    .select(PROGRAM_SELECT)
    .order("display_order", { ascending: true });
  if (error) throw new Error("Unable to load Workshop programs.", { cause: error });
  return normalizePrograms((data ?? []) as ProgramRow[]);
}

export async function getWorkshopConfiguration(): Promise<WorkshopConfiguration> {
  const supabase = createAdminClient();
  const [globalResult, workshops] = await Promise.all([
    supabase.from("workshop_settings").select(GLOBAL_SELECT).eq("id", 1).maybeSingle<GlobalRow>(),
    getWorkshopPrograms(),
  ]);
  if (globalResult.error) {
    throw new Error("Unable to load Workshop configuration.", { cause: globalResult.error });
  }
  if (!globalResult.data) throw new Error("Workshop settings singleton is not configured.");
  return { global: normalizeGlobal(globalResult.data), workshops };
}

export async function updateWorkshopGlobalConfiguration(
  update: WorkshopGlobalConfigurationUpdate,
): Promise<WorkshopGlobalConfiguration> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("workshop_settings")
    .update({
      registrations_enabled: update.registrationsEnabled,
      no_registration_message: update.noRegistrationMessage,
      discount_enabled: update.discountEnabled,
      discount_message: update.discountMessage,
      discount_deadline: update.discountDeadline,
      discount_expired_message: update.discountExpiredMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select(GLOBAL_SELECT)
    .maybeSingle<GlobalRow>();
  if (error) throw new Error("Unable to update Workshop global configuration.", { cause: error });
  if (!data) throw new Error("Workshop settings singleton is not configured.");
  return normalizeGlobal(data);
}

export async function updateWorkshopProgram(
  workshopId: WorkshopSlotId,
  update: WorkshopProgramUpdate,
): Promise<WorkshopProgram> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("workshop_programs")
    .update({
      is_active: update.isActive,
      title: update.title,
      description: update.description,
      main_icon: update.mainIcon,
      theme: update.theme,
      focus_areas: update.focusAreas,
      audience_enabled: update.audienceEnabled,
      audience_values: update.audiences,
      standards_enabled: update.standardsEnabled,
      standards: update.standards,
      age_enabled: update.ageEnabled,
      min_age: update.minAge,
      max_age: update.maxAge,
      registration_status: update.registrationStatus,
      registration_heading: update.registrationHeading,
      registration_icon: update.registrationIcon,
      google_form_url: update.googleFormUrl,
      button_label: update.buttonLabel,
      full_message: update.fullMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("workshop_id", workshopId)
    .select(PROGRAM_SELECT)
    .maybeSingle<ProgramRow>();
  if (error) throw new Error("Unable to update Workshop.", { cause: error });
  if (!data) throw new Error("Workshop slot is not configured.");
  return normalizeProgram(data);
}

export async function reorderWorkshopPrograms(
  workshopIds: WorkshopSlotId[],
): Promise<WorkshopProgram[]> {
  const supabase = createAdminClient();
  const { error } = await supabase.rpc("reorder_workshop_programs", {
    workshop_ids: workshopIds,
  });
  if (error) throw new Error("Unable to reorder Workshops.", { cause: error });
  return getWorkshopPrograms();
}
