import {
  WORKSHOP_PROGRAMS,
  type WorkshopProgramId,
} from "@/lib/workshops/workshop-data";

import type {
  WorkshopGlobalConfigurationUpdate,
  WorkshopRegistrationOptionUpdate,
  WorkshopRegistrationStatus,
} from "./configuration";

export const WORKSHOP_NO_REGISTRATION_MESSAGE_MAX_LENGTH = 500;
export const WORKSHOP_DISCOUNT_MESSAGE_MAX_LENGTH = 250;
export const WORKSHOP_DISCOUNT_EXPIRED_MESSAGE_MAX_LENGTH = 250;
export const WORKSHOP_REGISTRATION_HEADING_MAX_LENGTH = 150;
export const WORKSHOP_GOOGLE_FORM_URL_MAX_LENGTH = 2048;
export const WORKSHOP_REGISTRATION_BUTTON_LABEL_MAX_LENGTH = 80;
export const WORKSHOP_FULL_MESSAGE_MAX_LENGTH = 500;

const GLOBAL_FIELDS = new Set([
  "registrationsEnabled",
  "noRegistrationMessage",
  "discountEnabled",
  "discountMessage",
  "discountDeadline",
  "discountExpiredMessage",
]);
const OPTION_FIELDS = new Set([
  "status",
  "registrationHeading",
  "googleFormUrl",
  "buttonLabel",
  "fullMessage",
]);
const REGISTRATION_STATUSES = new Set<WorkshopRegistrationStatus>([
  "open",
  "full",
  "hidden",
]);
const WORKSHOP_PROGRAM_IDS = new Set<string>(
  WORKSHOP_PROGRAMS.map((program) => program.id),
);
const ISO_DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/;

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function hasValidCalendarDate(value: string) {
  const [year, month, day] = value
    .slice(0, 10)
    .split("-")
    .map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function readRequiredText(
  source: Record<string, unknown>,
  field: string,
  label: string,
  maxLength: number,
): ValidationResult<string> {
  if (typeof source[field] !== "string") {
    return { success: false, error: `${label} is required.` };
  }

  const value = source[field].trim();

  if (!value) {
    return { success: false, error: `${label} is required.` };
  }

  if (value.length > maxLength) {
    return {
      success: false,
      error: `${label} must be ${maxLength} characters or fewer.`,
    };
  }

  return { success: true, data: value };
}

export function isWorkshopProgramId(
  value: string,
): value is WorkshopProgramId {
  return WORKSHOP_PROGRAM_IDS.has(value);
}

export function validateGoogleFormUrl(
  input: unknown,
): ValidationResult<string | null> {
  if (input === null) {
    return { success: true, data: null };
  }

  if (typeof input !== "string") {
    return { success: false, error: "Google Form URL must be a valid URL or null." };
  }

  const value = input.trim();

  if (!value || value.length > WORKSHOP_GOOGLE_FORM_URL_MAX_LENGTH) {
    return {
      success: false,
      error: `Google Form URL must be ${WORKSHOP_GOOGLE_FORM_URL_MAX_LENGTH} characters or fewer.`,
    };
  }

  try {
    const url = new URL(value);
    const validHostAndPath =
      (url.hostname === "forms.gle" && url.pathname.length > 1) ||
      (url.hostname === "docs.google.com" &&
        url.pathname.startsWith("/forms/"));

    if (
      url.protocol !== "https:" ||
      url.port ||
      url.username ||
      url.password ||
      !validHostAndPath
    ) {
      return { success: false, error: "Enter a valid HTTPS Google Forms URL." };
    }
  } catch {
    return { success: false, error: "Enter a valid HTTPS Google Forms URL." };
  }

  return { success: true, data: value };
}

export function validateWorkshopGlobalConfiguration(
  input: unknown,
): ValidationResult<WorkshopGlobalConfigurationUpdate> {
  if (!isRecord(input)) {
    return { success: false, error: "Invalid Workshop configuration data." };
  }

  if (Object.keys(input).some((field) => !GLOBAL_FIELDS.has(field))) {
    return { success: false, error: "Workshop configuration contains unsupported fields." };
  }

  if (
    typeof input.registrationsEnabled !== "boolean" ||
    typeof input.discountEnabled !== "boolean"
  ) {
    return { success: false, error: "Configuration switches must be true or false." };
  }

  const noRegistrationMessage = readRequiredText(
    input,
    "noRegistrationMessage",
    "No-registration message",
    WORKSHOP_NO_REGISTRATION_MESSAGE_MAX_LENGTH,
  );
  const discountMessage = readRequiredText(
    input,
    "discountMessage",
    "Discount message",
    WORKSHOP_DISCOUNT_MESSAGE_MAX_LENGTH,
  );
  const discountExpiredMessage = readRequiredText(
    input,
    "discountExpiredMessage",
    "Discount expired message",
    WORKSHOP_DISCOUNT_EXPIRED_MESSAGE_MAX_LENGTH,
  );

  if (!noRegistrationMessage.success) return noRegistrationMessage;
  if (!discountMessage.success) return discountMessage;
  if (!discountExpiredMessage.success) return discountExpiredMessage;

  let discountDeadline: string | null = null;

  if (input.discountDeadline !== null) {
    if (
      typeof input.discountDeadline !== "string" ||
      !ISO_DATE_TIME_PATTERN.test(input.discountDeadline.trim()) ||
      !hasValidCalendarDate(input.discountDeadline.trim())
    ) {
      return { success: false, error: "Discount deadline must be a valid ISO date/time or null." };
    }

    const parsedDeadline = new Date(input.discountDeadline.trim());

    if (Number.isNaN(parsedDeadline.getTime())) {
      return { success: false, error: "Discount deadline must be a valid ISO date/time or null." };
    }

    discountDeadline = parsedDeadline.toISOString();
  }

  if (input.discountEnabled && !discountDeadline) {
    return { success: false, error: "Discount deadline is required when the discount is enabled." };
  }

  return {
    success: true,
    data: {
      registrationsEnabled: input.registrationsEnabled,
      noRegistrationMessage: noRegistrationMessage.data,
      discountEnabled: input.discountEnabled,
      discountMessage: discountMessage.data,
      discountDeadline,
      discountExpiredMessage: discountExpiredMessage.data,
    },
  };
}

export function validateWorkshopRegistrationOption(
  input: unknown,
): ValidationResult<WorkshopRegistrationOptionUpdate> {
  if (!isRecord(input)) {
    return { success: false, error: "Invalid Workshop registration option data." };
  }

  if (Object.keys(input).some((field) => !OPTION_FIELDS.has(field))) {
    return { success: false, error: "Workshop registration option contains unsupported fields." };
  }

  if (
    typeof input.status !== "string" ||
    !REGISTRATION_STATUSES.has(input.status as WorkshopRegistrationStatus)
  ) {
    return { success: false, error: "Registration status must be open, full, or hidden." };
  }

  const registrationHeading = readRequiredText(
    input,
    "registrationHeading",
    "Registration heading",
    WORKSHOP_REGISTRATION_HEADING_MAX_LENGTH,
  );
  const buttonLabel = readRequiredText(
    input,
    "buttonLabel",
    "Button label",
    WORKSHOP_REGISTRATION_BUTTON_LABEL_MAX_LENGTH,
  );
  const fullMessage = readRequiredText(
    input,
    "fullMessage",
    "Full-registration message",
    WORKSHOP_FULL_MESSAGE_MAX_LENGTH,
  );
  const googleFormUrl = validateGoogleFormUrl(input.googleFormUrl);

  if (!registrationHeading.success) return registrationHeading;
  if (!buttonLabel.success) return buttonLabel;
  if (!fullMessage.success) return fullMessage;
  if (!googleFormUrl.success) return googleFormUrl;

  const status = input.status as WorkshopRegistrationStatus;

  if (status === "open" && !googleFormUrl.data) {
    return { success: false, error: "An HTTPS Google Form URL is required when registration is open." };
  }

  return {
    success: true,
    data: {
      status,
      registrationHeading: registrationHeading.data,
      googleFormUrl: googleFormUrl.data,
      buttonLabel: buttonLabel.data,
      fullMessage: fullMessage.data,
    },
  };
}
