export const INSTITUTION_TYPES = [
  "School",
  "College",
  "Coaching / Training Institute",
  "University",
  "Other",
] as const;

export const INSTITUTION_STUDENT_GROUPS = [
  "School Students",
  "Higher Secondary Students",
  "College Students",
  "Graduates / Young Professionals",
  "Mixed Group",
] as const;

export const INSTITUTION_STUDENT_COUNTS = [
  "Up to 30",
  "31–60",
  "61–100",
  "101–200",
  "200+",
] as const;

export const INSTITUTION_TIMEFRAMES = [
  "As soon as possible",
  "Within 2–4 weeks",
  "Next month",
  "Choose an exact date",
] as const;

export const EXACT_DATE_TIMEFRAME = "Choose an exact date";

export const INSTITUTION_INTERESTS = [
  "AI & Coding Career Awareness Session",
  "Technology / Career Seminar",
  "Practical Workshop",
  "Student Skill Development Program",
  "Institutional Collaboration",
  "Discuss Opportunities",
] as const;

export type InstitutionType = (typeof INSTITUTION_TYPES)[number];
export type InstitutionStudentGroup =
  (typeof INSTITUTION_STUDENT_GROUPS)[number];
export type InstitutionStudentCount =
  (typeof INSTITUTION_STUDENT_COUNTS)[number];
export type InstitutionTimeframe = (typeof INSTITUTION_TIMEFRAMES)[number];
export type InstitutionInterest = (typeof INSTITUTION_INTERESTS)[number];

export type InstitutionEnquiryValues = {
  institutionName: string;
  institutionType: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  city: string;
  studentGroup: string;
  studentCount: string;
  timeframe: string;
  preferredDate: string;
  interests: string[];
  message: string;
};

export type InstitutionEnquiryData = Omit<
  InstitutionEnquiryValues,
  | "institutionType"
  | "studentGroup"
  | "studentCount"
  | "timeframe"
  | "interests"
> & {
  institutionType: InstitutionType;
  studentGroup: InstitutionStudentGroup;
  studentCount: InstitutionStudentCount;
  timeframe: InstitutionTimeframe;
  interests: InstitutionInterest[];
};

export type InstitutionField = keyof InstitutionEnquiryValues;
export type InstitutionFieldErrors = Partial<
  Record<InstitutionField, string>
>;

export const INSTITUTION_FIELD_ORDER: InstitutionField[] = [
  "institutionName",
  "institutionType",
  "contactName",
  "designation",
  "phone",
  "email",
  "city",
  "studentGroup",
  "studentCount",
  "timeframe",
  "preferredDate",
  "interests",
  "message",
];

const INSTITUTION_NAME_MAX_LENGTH = 120;
const CONTACT_NAME_MAX_LENGTH = 80;
const DESIGNATION_MAX_LENGTH = 80;
const CITY_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
export const MESSAGE_MAX_LENGTH = 600;

const INSTITUTION_NAME_PATTERN = /^[\p{L}\p{M}\p{N} .,'&()\-]+$/u;
const CONTACT_NAME_PATTERN = /^[\p{L}\p{M} .'-]+$/u;
const DESIGNATION_PATTERN = /^[\p{L}\p{M}\p{N} .,'&()/:\-]+$/u;
const CITY_PATTERN = /^[\p{L}\p{M} .,'\-]+$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INDIAN_MOBILE_PATTERN = /^[6-9][0-9]{9}$/;

function includesValue<T extends string>(
  options: readonly T[],
  value: string,
): value is T {
  return options.some((option) => option === value);
}

function normalizeSingleLine(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeMessage(value: string) {
  return value.replace(/\r\n?/g, "\n").trim();
}

export function getTodayInKolkata(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function isValidDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) return false;

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return day >= 1 && day <= daysInMonth[month - 1];
}

export function formatDateOnly(value: string) {
  if (!isValidDateOnly(value)) return value;

  const [year, month, day] = value.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${day} ${months[month - 1]} ${year}`;
}

function meaningfulCharacterCount(value: string) {
  return value.match(/[\p{L}\p{M}\p{N}]/gu)?.length ?? 0;
}

export function validateInstitutionField(
  field: InstitutionField,
  rawValue: string | readonly string[],
  context?: Pick<InstitutionEnquiryValues, "timeframe">,
): string | undefined {
  if (field === "interests") {
    if (!Array.isArray(rawValue) || rawValue.length === 0) {
      return "Select at least one option.";
    }

    if (
      rawValue.some(
        (interest) =>
          typeof interest !== "string" ||
          !includesValue(INSTITUTION_INTERESTS, interest.trim()),
      )
    ) {
      return "Select only valid interest options.";
    }

    return undefined;
  }

  const stringValue = typeof rawValue === "string" ? rawValue : "";
  const value = stringValue.trim();

  switch (field) {
    case "institutionName": {
      const institutionName = normalizeSingleLine(stringValue);

      if (!institutionName) return "Enter your school or institute name.";
      if (institutionName.length > INSTITUTION_NAME_MAX_LENGTH) {
        return `Keep the institution name under ${INSTITUTION_NAME_MAX_LENGTH} characters.`;
      }
      if (!INSTITUTION_NAME_PATTERN.test(institutionName)) {
        return "Use letters, numbers, spaces, and common name punctuation only.";
      }
      if (meaningfulCharacterCount(institutionName) < 2) {
        return "Enter at least 2 meaningful characters.";
      }
      return undefined;
    }

    case "institutionType":
      if (!value) return "Select your institution type.";
      if (!includesValue(INSTITUTION_TYPES, value)) {
        return "Select a valid institution type.";
      }
      return undefined;

    case "contactName": {
      const contactName = normalizeSingleLine(stringValue);
      const letters = contactName.match(/[\p{L}\p{M}]/gu)?.length ?? 0;

      if (!contactName) return "Enter the contact person's name.";
      if (contactName.length > CONTACT_NAME_MAX_LENGTH) {
        return `Keep the contact name under ${CONTACT_NAME_MAX_LENGTH} characters.`;
      }
      if (!CONTACT_NAME_PATTERN.test(contactName)) {
        return "Use letters, spaces, apostrophes, hyphens, or periods only.";
      }
      if (letters < 2) return "Enter at least 2 letters for the contact name.";
      return undefined;
    }

    case "designation": {
      const designation = normalizeSingleLine(stringValue);

      if (!designation) return "Enter the contact person's role.";
      if (designation.length > DESIGNATION_MAX_LENGTH) {
        return `Keep the designation under ${DESIGNATION_MAX_LENGTH} characters.`;
      }
      if (!DESIGNATION_PATTERN.test(designation)) {
        return "Use letters, numbers, and common role punctuation only.";
      }
      if (meaningfulCharacterCount(designation) < 2) {
        return "Enter a meaningful designation or role.";
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

      if (!email) return "Enter your official email address.";
      if (email.length > EMAIL_MAX_LENGTH) {
        return "Enter an email address under 254 characters.";
      }
      if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
      return undefined;
    }

    case "city": {
      const city = normalizeSingleLine(stringValue);
      const letters = city.match(/[\p{L}\p{M}]/gu)?.length ?? 0;

      if (!city) return "Enter your city or location.";
      if (city.length > CITY_MAX_LENGTH) {
        return `Keep the city or location under ${CITY_MAX_LENGTH} characters.`;
      }
      if (!CITY_PATTERN.test(city)) {
        return "Use letters, spaces, commas, hyphens, apostrophes, or periods only.";
      }
      if (letters < 2) return "Enter a meaningful city or location.";
      return undefined;
    }

    case "studentGroup":
      if (!value) return "Select the student group or level.";
      if (!includesValue(INSTITUTION_STUDENT_GROUPS, value)) {
        return "Select a valid student group.";
      }
      return undefined;

    case "studentCount":
      if (!value) return "Select an approximate number of students.";
      if (!includesValue(INSTITUTION_STUDENT_COUNTS, value)) {
        return "Select a valid student count range.";
      }
      return undefined;

    case "timeframe":
      if (!value) return "Select your preferred timeframe.";
      if (!includesValue(INSTITUTION_TIMEFRAMES, value)) {
        return "Select a valid preferred timeframe.";
      }
      return undefined;

    case "preferredDate":
      if (context?.timeframe.trim() !== EXACT_DATE_TIMEFRAME) return undefined;
      if (!value) return "Please choose an exact preferred date.";
      if (!isValidDateOnly(value)) {
        return "Please choose a valid exact preferred date.";
      }
      if (value < getTodayInKolkata()) {
        return "Please choose today or a future date.";
      }
      return undefined;

    case "message":
      if (normalizeMessage(stringValue).length > MESSAGE_MAX_LENGTH) {
        return `Keep your message under ${MESSAGE_MAX_LENGTH} characters.`;
      }
      return undefined;

  }
}

function readString(source: Record<string, unknown>, field: string) {
  return typeof source[field] === "string" ? source[field] : "";
}

function readStringArray(source: Record<string, unknown>, field: string) {
  const value = source[field];
  if (!Array.isArray(value)) return [];

  return value.map((item) => (typeof item === "string" ? item : "\u0000"));
}

export function validateInstitutionEnquiry(
  input: unknown,
):
  | { success: true; data: InstitutionEnquiryData }
  | { success: false; errors: InstitutionFieldErrors } {
  const source =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const values: InstitutionEnquiryValues = {
    institutionName: readString(source, "institutionName"),
    institutionType: readString(source, "institutionType"),
    contactName: readString(source, "contactName"),
    designation: readString(source, "designation"),
    phone: readString(source, "phone"),
    email: readString(source, "email"),
    city: readString(source, "city"),
    studentGroup: readString(source, "studentGroup"),
    studentCount: readString(source, "studentCount"),
    timeframe: readString(source, "timeframe"),
    preferredDate: readString(source, "preferredDate"),
    interests: readStringArray(source, "interests"),
    message: readString(source, "message"),
  };

  const errors: InstitutionFieldErrors = {};

  for (const field of INSTITUTION_FIELD_ORDER) {
    const error = validateInstitutionField(field, values[field], values);
    if (error) errors[field] = error;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      institutionName: normalizeSingleLine(values.institutionName),
      institutionType: values.institutionType.trim() as InstitutionType,
      contactName: normalizeSingleLine(values.contactName),
      designation: normalizeSingleLine(values.designation),
      phone: values.phone.trim(),
      email: values.email.trim().toLowerCase(),
      city: normalizeSingleLine(values.city),
      studentGroup: values.studentGroup.trim() as InstitutionStudentGroup,
      studentCount: values.studentCount.trim() as InstitutionStudentCount,
      timeframe: values.timeframe.trim() as InstitutionTimeframe,
      preferredDate:
        values.timeframe.trim() === EXACT_DATE_TIMEFRAME
          ? values.preferredDate.trim()
          : "",
      interests: Array.from(
        new Set(values.interests.map((interest) => interest.trim())),
      ) as InstitutionInterest[],
      message: normalizeMessage(values.message),
    },
  };
}
