export const LEARNER_STAGES = [
  "School Student",
  "College Student",
  "Graduate",
  "Working Professional",
  "Other",
] as const;

export const LEARNER_PROGRAMS = [
  "F2P - Fresher to Professional",
  "Skill Development",
  "AI Tools for Creators",
] as const;

export const LEARNER_EXPERIENCE_LEVELS = [
  "Complete Beginner",
  "Learning the Basics",
  "Have Some Experience",
  "Already Building Projects",
] as const;

export const LEARNER_PRIMARY_GOALS = [
  "Learn from Basics",
  "Build Real Projects",
  "Improve Existing Skills",
  "Career Direction",
  "Explore AI Tools",
  "Other",
] as const;

export type LearnerStage = (typeof LEARNER_STAGES)[number];
export type LearnerProgram = (typeof LEARNER_PROGRAMS)[number];
export type LearnerExperience = (typeof LEARNER_EXPERIENCE_LEVELS)[number];
export type LearnerPrimaryGoal = (typeof LEARNER_PRIMARY_GOALS)[number];

export type LearnerEnquiryValues = {
  name: string;
  phone: string;
  email: string;
  stage: string;
  program: string;
  experience: string;
  primaryGoal: string;
  message: string;
};

export type LearnerEnquiryData = Omit<
  LearnerEnquiryValues,
  "stage" | "program" | "experience" | "primaryGoal"
> & {
  stage: LearnerStage;
  program: LearnerProgram;
  experience: LearnerExperience;
  primaryGoal: LearnerPrimaryGoal;
};

export type LearnerField = keyof LearnerEnquiryValues;
export type LearnerFieldErrors = Partial<Record<LearnerField, string>>;

export const LEARNER_FIELD_ORDER: LearnerField[] = [
  "name",
  "phone",
  "email",
  "stage",
  "program",
  "experience",
  "primaryGoal",
  "message",
];

const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 254;
export const MESSAGE_MAX_LENGTH = 600;

const NAME_ALLOWED_CHARACTERS = /^[\p{L}\p{M} .'-]+$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INDIAN_MOBILE_PATTERN = /^[6-9][0-9]{9}$/;

function includesValue<T extends string>(
  options: readonly T[],
  value: string,
): value is T {
  return options.some((option) => option === value);
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeMessage(value: string) {
  return value.replace(/\r\n?/g, "\n").trim();
}

export function validateLearnerField(
  field: LearnerField,
  rawValue: string,
): string | undefined {
  const value = rawValue.trim();

  switch (field) {
    case "name": {
      const name = normalizeName(rawValue);
      const meaningfulCharacters = name.match(/[\p{L}\p{M}]/gu)?.length ?? 0;

      if (!name) return "Enter your full name.";
      if (name.length > NAME_MAX_LENGTH) {
        return `Keep your name under ${NAME_MAX_LENGTH} characters.`;
      }
      if (!NAME_ALLOWED_CHARACTERS.test(name)) {
        return "Use letters, spaces, apostrophes, hyphens, or periods only.";
      }
      if (meaningfulCharacters < 2) {
        return "Enter at least 2 letters for your name.";
      }
      return undefined;
    }

    case "phone":
      if (!value) return "Enter your 10-digit mobile number.";
      if (!/^\d+$/.test(value)) return "Use digits only for your mobile number.";
      if (value.length !== 10) return "Enter exactly 10 digits.";
      if (!INDIAN_MOBILE_PATTERN.test(value)) {
        return "Enter a valid Indian mobile number starting with 6, 7, 8, or 9.";
      }
      return undefined;

    case "email": {
      const email = value.toLowerCase();

      if (!email) return "Enter your email address.";
      if (email.length > EMAIL_MAX_LENGTH) {
        return "Enter an email address under 254 characters.";
      }
      if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
      return undefined;
    }

    case "stage":
      if (!value) return "Select your current stage.";
      if (!includesValue(LEARNER_STAGES, value)) {
        return "Select a valid current stage.";
      }
      return undefined;

    case "program":
      if (!value) return "Choose the program you are interested in.";
      if (!includesValue(LEARNER_PROGRAMS, value)) {
        return "Choose a valid program.";
      }
      return undefined;

    case "experience":
      if (!value) return "Select your current experience.";
      if (!includesValue(LEARNER_EXPERIENCE_LEVELS, value)) {
        return "Select a valid experience level.";
      }
      return undefined;

    case "primaryGoal":
      if (!value) return "Choose your primary learning goal.";
      if (!includesValue(LEARNER_PRIMARY_GOALS, value)) {
        return "Choose a valid learning goal.";
      }
      return undefined;

    case "message":
      if (normalizeMessage(rawValue).length > MESSAGE_MAX_LENGTH) {
        return `Keep your message under ${MESSAGE_MAX_LENGTH} characters.`;
      }
      return undefined;
  }
}

function readString(source: Record<string, unknown>, field: string) {
  return typeof source[field] === "string" ? source[field] : "";
}

export function validateLearnerEnquiry(
  input: unknown,
):
  | { success: true; data: LearnerEnquiryData }
  | { success: false; errors: LearnerFieldErrors } {
  const source =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const values: LearnerEnquiryValues = {
    name: readString(source, "name"),
    phone: readString(source, "phone"),
    email: readString(source, "email"),
    stage: readString(source, "stage"),
    program: readString(source, "program"),
    experience: readString(source, "experience"),
    primaryGoal: readString(source, "primaryGoal"),
    message: readString(source, "message"),
  };

  const errors: LearnerFieldErrors = {};

  for (const field of LEARNER_FIELD_ORDER) {
    const error = validateLearnerField(field, values[field]);
    if (error) errors[field] = error;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: normalizeName(values.name),
      phone: values.phone.trim(),
      email: values.email.trim().toLowerCase(),
      stage: values.stage.trim() as LearnerStage,
      program: values.program.trim() as LearnerProgram,
      experience: values.experience.trim() as LearnerExperience,
      primaryGoal: values.primaryGoal.trim() as LearnerPrimaryGoal,
      message: normalizeMessage(values.message),
    },
  };
}
