import "server-only";

import { createAdminClient } from "@/lib/supabase/admin-server";
import { WORKSHOP_PROGRAMS, type WorkshopProgramId } from "@/lib/workshops/workshop-data";

import type {
  WorkshopConfiguration,
  WorkshopGlobalConfiguration,
  WorkshopGlobalConfigurationUpdate,
  WorkshopRegistrationOption,
  WorkshopRegistrationOptionUpdate,
  WorkshopRegistrationStatus,
} from "./configuration";
import { isWorkshopProgramId } from "./configuration-validation";

type GlobalRow = {
  registrations_enabled: boolean;
  no_registration_message: string;
  discount_enabled: boolean;
  discount_message: string;
  discount_deadline: string | null;
  discount_expired_message: string;
  updated_at: string;
};

type OptionRow = {
  workshop_id: string;
  status: WorkshopRegistrationStatus;
  registration_heading: string;
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
const OPTION_SELECT = `
  workshop_id,
  status,
  registration_heading,
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

function normalizeOption(row: OptionRow): WorkshopRegistrationOption {
  if (!isWorkshopProgramId(row.workshop_id)) {
    throw new Error("Workshop registration configuration contains an unknown Workshop ID.");
  }

  return {
    workshopId: row.workshop_id,
    status: row.status,
    registrationHeading: row.registration_heading,
    googleFormUrl: row.google_form_url,
    buttonLabel: row.button_label,
    fullMessage: row.full_message,
    updatedAt: row.updated_at,
  };
}

function normalizeOptions(rows: OptionRow[]): WorkshopRegistrationOption[] {
  const byId = new Map<WorkshopProgramId, WorkshopRegistrationOption>();

  for (const row of rows) {
    const option = normalizeOption(row);

    if (byId.has(option.workshopId)) {
      throw new Error("Workshop registration configuration contains a duplicate Workshop ID.");
    }

    byId.set(option.workshopId, option);
  }

  if (byId.size !== WORKSHOP_PROGRAMS.length) {
    throw new Error("Workshop registration configuration is incomplete.");
  }

  return WORKSHOP_PROGRAMS.map((program) => {
    const option = byId.get(program.id);

    if (!option) {
      throw new Error("Workshop registration configuration is incomplete.");
    }

    return option;
  });
}

export async function getWorkshopConfiguration(): Promise<WorkshopConfiguration> {
  const supabase = createAdminClient();
  const [globalResult, optionsResult] = await Promise.all([
    supabase
      .from("workshop_settings")
      .select(GLOBAL_SELECT)
      .eq("id", 1)
      .maybeSingle<GlobalRow>(),
    supabase.from("workshop_registration_options").select(OPTION_SELECT),
  ]);

  if (globalResult.error || optionsResult.error) {
    throw new Error("Unable to load Workshop configuration.", {
      cause: globalResult.error ?? optionsResult.error,
    });
  }

  if (!globalResult.data) {
    throw new Error("Workshop settings singleton is not configured.");
  }

  return {
    global: normalizeGlobal(globalResult.data),
    options: normalizeOptions((optionsResult.data ?? []) as OptionRow[]),
  };
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

  if (error) {
    throw new Error("Unable to update Workshop global configuration.", { cause: error });
  }

  if (!data) {
    throw new Error("Workshop settings singleton is not configured.");
  }

  return normalizeGlobal(data);
}

export async function updateWorkshopRegistrationOption(
  workshopId: WorkshopProgramId,
  update: WorkshopRegistrationOptionUpdate,
): Promise<WorkshopRegistrationOption> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("workshop_registration_options")
    .update({
      status: update.status,
      registration_heading: update.registrationHeading,
      google_form_url: update.googleFormUrl,
      button_label: update.buttonLabel,
      full_message: update.fullMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("workshop_id", workshopId)
    .select(OPTION_SELECT)
    .maybeSingle<OptionRow>();

  if (error) {
    throw new Error("Unable to update Workshop registration option.", { cause: error });
  }

  if (!data) {
    throw new Error("Workshop registration option is not configured.");
  }

  return normalizeOption(data);
}
