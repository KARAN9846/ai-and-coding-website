import type {
  WorkshopAudienceKey,
  WorkshopIconKey,
  WorkshopSlotId,
  WorkshopTheme,
} from "@/lib/workshops/workshop-data";

export type WorkshopRegistrationStatus = "open" | "full" | "hidden";
export type WorkshopFocusArea = { label: string; icon: WorkshopIconKey };

export type WorkshopProgram = {
  workshopId: WorkshopSlotId;
  isActive: boolean;
  displayOrder: number;
  title: string;
  description: string;
  mainIcon: WorkshopIconKey;
  theme: WorkshopTheme;
  focusAreas: WorkshopFocusArea[];
  audienceEnabled: boolean;
  audiences: WorkshopAudienceKey[];
  standardsEnabled: boolean;
  standards: number[];
  ageEnabled: boolean;
  minAge: number | null;
  maxAge: number | null;
  registrationStatus: WorkshopRegistrationStatus;
  registrationHeading: string;
  registrationIcon: WorkshopIconKey;
  googleFormUrl: string | null;
  buttonLabel: string;
  fullMessage: string;
  updatedAt: string;
};

export type WorkshopGlobalConfiguration = {
  registrationsEnabled: boolean;
  noRegistrationMessage: string;
  discountEnabled: boolean;
  discountMessage: string;
  discountDeadline: string | null;
  discountExpiredMessage: string;
  updatedAt: string;
};

export type WorkshopConfiguration = {
  global: WorkshopGlobalConfiguration;
  workshops: WorkshopProgram[];
};

export type WorkshopGlobalConfigurationUpdate = Omit<WorkshopGlobalConfiguration, "updatedAt">;
export type WorkshopProgramUpdate = Omit<WorkshopProgram, "workshopId" | "displayOrder" | "updatedAt">;
export type WorkshopOrderUpdate = { workshopIds: WorkshopSlotId[] };
