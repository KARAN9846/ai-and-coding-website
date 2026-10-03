import type { WorkshopProgramId } from "@/lib/workshops/workshop-data";

export type WorkshopRegistrationStatus = "open" | "full" | "hidden";

export type WorkshopRegistrationOption = {
  workshopId: WorkshopProgramId;
  status: WorkshopRegistrationStatus;
  registrationHeading: string;
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
  options: WorkshopRegistrationOption[];
};

export type WorkshopGlobalConfigurationUpdate = Omit<
  WorkshopGlobalConfiguration,
  "updatedAt"
>;

export type WorkshopRegistrationOptionUpdate = Omit<
  WorkshopRegistrationOption,
  "workshopId" | "updatedAt"
>;
