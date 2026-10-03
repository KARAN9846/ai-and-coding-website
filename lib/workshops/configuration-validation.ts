import type {
  WorkshopGlobalConfigurationUpdate,
  WorkshopOrderUpdate,
  WorkshopProgramUpdate,
  WorkshopRegistrationStatus,
} from "./configuration";
import {
  WORKSHOP_SLOT_IDS,
  WORKSHOP_STANDARDS,
  isWorkshopAudienceKey,
  isWorkshopIconKey,
  isWorkshopSlotId,
  isWorkshopTheme,
  type WorkshopAudienceKey,
  type WorkshopIconKey,
} from "./workshop-data";

export const WORKSHOP_NO_REGISTRATION_MESSAGE_MAX_LENGTH = 500;
export const WORKSHOP_DISCOUNT_MESSAGE_MAX_LENGTH = 250;
export const WORKSHOP_DISCOUNT_EXPIRED_MESSAGE_MAX_LENGTH = 250;
export const WORKSHOP_TITLE_MAX_LENGTH = 120;
export const WORKSHOP_DESCRIPTION_MAX_LENGTH = 600;
export const WORKSHOP_FOCUS_LABEL_MAX_LENGTH = 80;
export const WORKSHOP_FOCUS_AREA_MAX_COUNT = 6;
export const WORKSHOP_REGISTRATION_HEADING_MAX_LENGTH = 150;
export const WORKSHOP_GOOGLE_FORM_URL_MAX_LENGTH = 2048;
export const WORKSHOP_REGISTRATION_BUTTON_LABEL_MAX_LENGTH = 80;
export const WORKSHOP_FULL_MESSAGE_MAX_LENGTH = 500;
export const WORKSHOP_MIN_AGE = 5;
export const WORKSHOP_MAX_AGE = 100;

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const GLOBAL_FIELDS = new Set([
  "registrationsEnabled", "noRegistrationMessage", "discountEnabled",
  "discountMessage", "discountDeadline", "discountExpiredMessage",
]);
const PROGRAM_FIELDS = new Set([
  "isActive", "title", "description", "mainIcon", "theme", "focusAreas",
  "audienceEnabled", "audiences", "standardsEnabled", "standards",
  "ageEnabled", "minAge", "maxAge", "registrationStatus",
  "registrationHeading", "registrationIcon", "googleFormUrl", "buttonLabel",
  "fullMessage",
]);
const ORDER_FIELDS = new Set(["workshopIds"]);
const REGISTRATION_STATUSES = new Set<WorkshopRegistrationStatus>([
  "open", "full", "hidden",
]);
const ISO_DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/;

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function hasOnlyFields(input: Record<string, unknown>, fields: Set<string>) {
  return Object.keys(input).every((field) => fields.has(field));
}

function requiredText(
  input: unknown,
  label: string,
  maxLength: number,
): ValidationResult<string> {
  if (typeof input !== "string" || !input.trim()) {
    return { success: false, error: `${label} is required.` };
  }
  const value = input.trim();
  return value.length <= maxLength
    ? { success: true, data: value }
    : { success: false, error: `${label} must be ${maxLength} characters or fewer.` };
}

function hasValidCalendarDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

export function validateGoogleFormUrl(input: unknown): ValidationResult<string | null> {
  if (input === null) return { success: true, data: null };
  if (typeof input !== "string") {
    return { success: false, error: "Google Form URL must be a valid URL or null." };
  }
  const value = input.trim();
  if (!value || value.length > WORKSHOP_GOOGLE_FORM_URL_MAX_LENGTH) {
    return { success: false, error: `Google Form URL must be ${WORKSHOP_GOOGLE_FORM_URL_MAX_LENGTH} characters or fewer.` };
  }
  try {
    const url = new URL(value);
    const allowed =
      (url.hostname === "forms.gle" && url.pathname.length > 1) ||
      (url.hostname === "docs.google.com" && url.pathname.startsWith("/forms/"));
    if (url.protocol !== "https:" || url.port || url.username || url.password || !allowed) {
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
  if (!isRecord(input) || !hasOnlyFields(input, GLOBAL_FIELDS)) {
    return { success: false, error: "Invalid Workshop configuration data." };
  }
  if (typeof input.registrationsEnabled !== "boolean" || typeof input.discountEnabled !== "boolean") {
    return { success: false, error: "Configuration switches must be true or false." };
  }
  const noRegistrationMessage = requiredText(input.noRegistrationMessage, "No-registration message", WORKSHOP_NO_REGISTRATION_MESSAGE_MAX_LENGTH);
  const discountMessage = requiredText(input.discountMessage, "Discount message", WORKSHOP_DISCOUNT_MESSAGE_MAX_LENGTH);
  const discountExpiredMessage = requiredText(input.discountExpiredMessage, "Discount expired message", WORKSHOP_DISCOUNT_EXPIRED_MESSAGE_MAX_LENGTH);
  if (!noRegistrationMessage.success) return noRegistrationMessage;
  if (!discountMessage.success) return discountMessage;
  if (!discountExpiredMessage.success) return discountExpiredMessage;

  let discountDeadline: string | null = null;
  if (input.discountDeadline !== null) {
    if (typeof input.discountDeadline !== "string" ||
        !ISO_DATE_TIME_PATTERN.test(input.discountDeadline.trim()) ||
        !hasValidCalendarDate(input.discountDeadline.trim())) {
      return { success: false, error: "Discount deadline must be a valid ISO date/time or null." };
    }
    const date = new Date(input.discountDeadline.trim());
    if (Number.isNaN(date.getTime())) {
      return { success: false, error: "Discount deadline must be a valid ISO date/time or null." };
    }
    discountDeadline = date.toISOString();
  }
  if (input.discountEnabled && !discountDeadline) {
    return { success: false, error: "Discount deadline is required when the discount is enabled." };
  }
  return { success: true, data: {
    registrationsEnabled: input.registrationsEnabled,
    noRegistrationMessage: noRegistrationMessage.data,
    discountEnabled: input.discountEnabled,
    discountMessage: discountMessage.data,
    discountDeadline,
    discountExpiredMessage: discountExpiredMessage.data,
  }};
}

function validateFocusAreas(input: unknown): ValidationResult<Array<{label: string; icon: WorkshopIconKey}>> {
  if (!Array.isArray(input) || input.length > WORKSHOP_FOCUS_AREA_MAX_COUNT) {
    return { success: false, error: "Focus areas must contain no more than 6 items." };
  }
  const values: Array<{label: string; icon: WorkshopIconKey}> = [];
  const labels = new Set<string>();
  for (const item of input) {
    if (!isRecord(item) || !hasOnlyFields(item, new Set(["label", "icon"]))) {
      return { success: false, error: "Each focus area must contain a label and icon." };
    }
    const label = requiredText(item.label, "Focus-area label", WORKSHOP_FOCUS_LABEL_MAX_LENGTH);
    if (!label.success) return label;
    if (typeof item.icon !== "string" || !isWorkshopIconKey(item.icon)) {
      return { success: false, error: "Select a valid focus-area icon." };
    }
    const normalizedLabel = label.data.toLocaleLowerCase();
    if (labels.has(normalizedLabel)) {
      return { success: false, error: "Focus-area labels must be unique." };
    }
    labels.add(normalizedLabel);
    values.push({ label: label.data, icon: item.icon });
  }
  return { success: true, data: values };
}

function validateAudiences(enabled: boolean, input: unknown): ValidationResult<WorkshopAudienceKey[]> {
  if (!Array.isArray(input) || input.some((value) => typeof value !== "string" || !isWorkshopAudienceKey(value))) {
    return { success: false, error: "Select only supported audience groups." };
  }
  const values = input as WorkshopAudienceKey[];
  if (new Set(values).size !== values.length) {
    return { success: false, error: "Audience groups must be unique." };
  }
  if (!enabled && values.length !== 0) {
    return { success: false, error: "Disable audience targeting only after clearing its selections." };
  }
  if (enabled && values.length === 0) {
    return { success: false, error: "Select at least one audience group." };
  }
  if (values.includes("everyone") && values.length !== 1) {
    return { success: false, error: "Everyone cannot be combined with another audience group." };
  }
  return { success: true, data: values };
}

function validateStandards(enabled: boolean, input: unknown): ValidationResult<number[]> {
  if (!Array.isArray(input) || input.some((value) =>
    !Number.isInteger(value) || !(WORKSHOP_STANDARDS as readonly number[]).includes(value as number)
  )) {
    return { success: false, error: "Standards must contain only integers from 5 to 12." };
  }
  if (new Set(input).size !== input.length) {
    return { success: false, error: "Standards must be unique." };
  }
  if (!enabled && input.length !== 0) {
    return { success: false, error: "Disable standard targeting only after clearing its selections." };
  }
  if (enabled && input.length === 0) {
    return { success: false, error: "Select at least one school standard." };
  }
  return { success: true, data: [...input].sort((a, b) => (a as number) - (b as number)) as number[] };
}

export function validateWorkshopProgramUpdate(input: unknown): ValidationResult<WorkshopProgramUpdate> {
  if (!isRecord(input) || !hasOnlyFields(input, PROGRAM_FIELDS)) {
    return { success: false, error: "Invalid Workshop data." };
  }
  if (typeof input.isActive !== "boolean" || typeof input.audienceEnabled !== "boolean" ||
      typeof input.standardsEnabled !== "boolean" || typeof input.ageEnabled !== "boolean") {
    return { success: false, error: "Workshop switches must be true or false." };
  }
  const title = requiredText(input.title, "Workshop title", WORKSHOP_TITLE_MAX_LENGTH);
  const description = requiredText(input.description, "Workshop description", WORKSHOP_DESCRIPTION_MAX_LENGTH);
  const focusAreas = validateFocusAreas(input.focusAreas);
  const audiences = validateAudiences(input.audienceEnabled, input.audiences);
  const standards = validateStandards(input.standardsEnabled, input.standards);
  const registrationHeading = requiredText(input.registrationHeading, "Registration heading", WORKSHOP_REGISTRATION_HEADING_MAX_LENGTH);
  const buttonLabel = requiredText(input.buttonLabel, "Button label", WORKSHOP_REGISTRATION_BUTTON_LABEL_MAX_LENGTH);
  const fullMessage = requiredText(input.fullMessage, "Seats-full message", WORKSHOP_FULL_MESSAGE_MAX_LENGTH);
  const googleFormUrl = validateGoogleFormUrl(input.googleFormUrl);
  for (const result of [title, description, focusAreas, audiences, standards, registrationHeading, buttonLabel, fullMessage, googleFormUrl]) {
    if (!result.success) return result;
  }
  if (typeof input.mainIcon !== "string" || !isWorkshopIconKey(input.mainIcon) ||
      typeof input.registrationIcon !== "string" || !isWorkshopIconKey(input.registrationIcon)) {
    return { success: false, error: "Select a valid Workshop icon." };
  }
  if (typeof input.theme !== "string" || !isWorkshopTheme(input.theme)) {
    return { success: false, error: "Select a valid Workshop theme." };
  }
  if (typeof input.registrationStatus !== "string" ||
      !REGISTRATION_STATUSES.has(input.registrationStatus as WorkshopRegistrationStatus)) {
    return { success: false, error: "Registration status must be open, full, or hidden." };
  }
  const registrationStatus = input.registrationStatus as WorkshopRegistrationStatus;
  if (registrationStatus === "open" && (!googleFormUrl.success || !googleFormUrl.data)) {
    return { success: false, error: "An HTTPS Google Form URL is required when registration is open." };
  }

  let minAge: number | null = null;
  let maxAge: number | null = null;
  if (input.ageEnabled) {
    if (!Number.isInteger(input.minAge) || !Number.isInteger(input.maxAge) ||
        (input.minAge as number) < WORKSHOP_MIN_AGE || (input.maxAge as number) > WORKSHOP_MAX_AGE ||
        (input.minAge as number) > (input.maxAge as number)) {
      return { success: false, error: "Age range must use integers from 5 to 100 with minimum not greater than maximum." };
    }
    minAge = input.minAge as number;
    maxAge = input.maxAge as number;
  } else if (input.minAge !== null || input.maxAge !== null) {
    return { success: false, error: "Disabled age targeting must not contain an age range." };
  }

  return { success: true, data: {
    isActive: input.isActive,
    title: title.success ? title.data : "",
    description: description.success ? description.data : "",
    mainIcon: input.mainIcon as WorkshopIconKey,
    theme: input.theme as WorkshopProgramUpdate["theme"],
    focusAreas: focusAreas.success ? focusAreas.data : [],
    audienceEnabled: input.audienceEnabled,
    audiences: audiences.success ? audiences.data : [],
    standardsEnabled: input.standardsEnabled,
    standards: standards.success ? standards.data : [],
    ageEnabled: input.ageEnabled,
    minAge,
    maxAge,
    registrationStatus,
    registrationHeading: registrationHeading.success ? registrationHeading.data : "",
    registrationIcon: input.registrationIcon as WorkshopIconKey,
    googleFormUrl: googleFormUrl.success ? googleFormUrl.data : null,
    buttonLabel: buttonLabel.success ? buttonLabel.data : "",
    fullMessage: fullMessage.success ? fullMessage.data : "",
  }};
}

export function validateWorkshopOrderInput(input: unknown): ValidationResult<WorkshopOrderUpdate> {
  if (!isRecord(input) || !hasOnlyFields(input, ORDER_FIELDS) || !Array.isArray(input.workshopIds) ||
      input.workshopIds.length !== WORKSHOP_SLOT_IDS.length ||
      input.workshopIds.some((id) => typeof id !== "string" || !isWorkshopSlotId(id)) ||
      new Set(input.workshopIds).size !== WORKSHOP_SLOT_IDS.length) {
    return { success: false, error: "Workshop order must contain each of the four Workshop slots exactly once." };
  }
  return { success: true, data: { workshopIds: input.workshopIds as WorkshopOrderUpdate["workshopIds"] } };
}

export { isWorkshopSlotId };
