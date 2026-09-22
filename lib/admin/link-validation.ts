export type AdminLinkInput = {
  title: string;
  url: string;
  category: string | null;
  description: string | null;
};

type ValidationResult =
  | {
      success: true;
      data: AdminLinkInput;
    }
  | {
      success: false;
      error: string;
    };

const TITLE_MAX_LENGTH = 120;
const URL_MAX_LENGTH = 2048;
const CATEGORY_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 500;

function normalizeOptionalText(
  value: unknown,
  maxLength: number,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function validateUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function validateAdminLinkInput(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return {
      success: false,
      error: "Invalid request data.",
    };
  }

  const input = body as Record<string, unknown>;

  if (typeof input.title !== "string") {
    return {
      success: false,
      error: "Link title is required.",
    };
  }

  const title = input.title.trim();

  if (!title) {
    return {
      success: false,
      error: "Link title is required.",
    };
  }

  if (title.length > TITLE_MAX_LENGTH) {
    return {
      success: false,
      error: `Link title must be ${TITLE_MAX_LENGTH} characters or fewer.`,
    };
  }

  if (typeof input.url !== "string") {
    return {
      success: false,
      error: "Destination URL is required.",
    };
  }

  const url = input.url.trim();

  if (!url) {
    return {
      success: false,
      error: "Destination URL is required.",
    };
  }

  if (url.length > URL_MAX_LENGTH) {
    return {
      success: false,
      error: `Destination URL must be ${URL_MAX_LENGTH} characters or fewer.`,
    };
  }

  if (!validateUrl(url)) {
    return {
      success: false,
      error: "Please enter a valid HTTP or HTTPS URL.",
    };
  }

  const category = normalizeOptionalText(input.category, CATEGORY_MAX_LENGTH);

  if (
    typeof input.category === "string" &&
    input.category.trim().length > CATEGORY_MAX_LENGTH
  ) {
    return {
      success: false,
      error: `Category must be ${CATEGORY_MAX_LENGTH} characters or fewer.`,
    };
  }

  const description = normalizeOptionalText(
    input.description,
    DESCRIPTION_MAX_LENGTH,
  );

  if (
    typeof input.description === "string" &&
    input.description.trim().length > DESCRIPTION_MAX_LENGTH
  ) {
    return {
      success: false,
      error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    };
  }

  return {
    success: true,
    data: {
      title,
      url,
      category,
      description,
    },
  };
}
