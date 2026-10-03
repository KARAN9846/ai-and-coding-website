export const WORKSHOP_SLOT_IDS = [
  "workshop-1",
  "workshop-2",
  "workshop-3",
  "workshop-4",
] as const;

export type WorkshopSlotId = (typeof WORKSHOP_SLOT_IDS)[number];

export const WORKSHOP_ICON_KEYS = [
  "bot", "brain", "sparkles", "code", "terminal", "cpu",
  "circuit-board", "graduation-cap", "briefcase", "workflow",
  "lightbulb", "rocket", "book-open", "bug", "git-branch", "camera",
  "radio", "palette", "message-square-text", "panels-top-left",
  "scan-search", "blocks", "scan-eye",
] as const;

export type WorkshopIconKey = (typeof WORKSHOP_ICON_KEYS)[number];

export const WORKSHOP_ICON_OPTIONS: ReadonlyArray<{
  value: WorkshopIconKey;
  label: string;
}> = [
  { value: "bot", label: "Bot" },
  { value: "brain", label: "Brain" },
  { value: "sparkles", label: "Sparkles" },
  { value: "code", label: "Code" },
  { value: "terminal", label: "Terminal" },
  { value: "cpu", label: "CPU" },
  { value: "circuit-board", label: "Circuit Board" },
  { value: "graduation-cap", label: "Graduation Cap" },
  { value: "briefcase", label: "Briefcase" },
  { value: "workflow", label: "Workflow" },
  { value: "lightbulb", label: "Lightbulb" },
  { value: "rocket", label: "Rocket" },
  { value: "book-open", label: "Book Open" },
  { value: "bug", label: "Bug" },
  { value: "git-branch", label: "Git Branch" },
  { value: "camera", label: "Camera" },
  { value: "radio", label: "Radio" },
  { value: "palette", label: "Palette" },
  { value: "message-square-text", label: "Message" },
  { value: "panels-top-left", label: "Application Panels" },
  { value: "scan-search", label: "Scan Search" },
  { value: "blocks", label: "Blocks" },
  { value: "scan-eye", label: "Computer Vision" },
];

export const WORKSHOP_THEMES = [
  "cyan-blue", "blue-violet", "orange-cyan", "emerald-blue",
] as const;

export type WorkshopTheme = (typeof WORKSHOP_THEMES)[number];

export const WORKSHOP_THEME_OPTIONS: ReadonlyArray<{
  value: WorkshopTheme;
  label: string;
}> = [
  { value: "cyan-blue", label: "Cyan / Blue" },
  { value: "blue-violet", label: "Blue / Violet" },
  { value: "orange-cyan", label: "Orange / Cyan" },
  { value: "emerald-blue", label: "Emerald / Blue" },
];

export const WORKSHOP_AUDIENCE_KEYS = [
  "school-students", "college-students", "working-professionals",
  "homemakers-career-restarters", "beginners-tech-enthusiasts",
  "developers-engineers", "everyone",
] as const;

export type WorkshopAudienceKey = (typeof WORKSHOP_AUDIENCE_KEYS)[number];

export const WORKSHOP_AUDIENCE_OPTIONS: ReadonlyArray<{
  value: WorkshopAudienceKey;
  label: string;
}> = [
  { value: "school-students", label: "School Students" },
  { value: "college-students", label: "College Students" },
  { value: "working-professionals", label: "Working Professionals" },
  { value: "homemakers-career-restarters", label: "Homemakers & Career Restarters" },
  { value: "beginners-tech-enthusiasts", label: "Beginners & Tech Enthusiasts" },
  { value: "developers-engineers", label: "Developers & Engineers" },
  { value: "everyone", label: "Everyone" },
];

export const WORKSHOP_STANDARDS = [5, 6, 7, 8, 9, 10, 11, 12] as const;

export function isWorkshopSlotId(value: string): value is WorkshopSlotId {
  return (WORKSHOP_SLOT_IDS as readonly string[]).includes(value);
}

export function isWorkshopIconKey(value: string): value is WorkshopIconKey {
  return (WORKSHOP_ICON_KEYS as readonly string[]).includes(value);
}

export function isWorkshopTheme(value: string): value is WorkshopTheme {
  return (WORKSHOP_THEMES as readonly string[]).includes(value);
}

export function isWorkshopAudienceKey(value: string): value is WorkshopAudienceKey {
  return (WORKSHOP_AUDIENCE_KEYS as readonly string[]).includes(value);
}
