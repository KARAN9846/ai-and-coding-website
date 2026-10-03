import type { WorkshopConfiguration } from "./configuration";
import {
  validateGoogleFormUrl,
  validateWorkshopGlobalConfiguration,
  validateWorkshopProgramUpdate,
} from "./configuration-validation";
import type {
  WorkshopAudienceKey,
  WorkshopIconKey,
  WorkshopSlotId,
  WorkshopTheme,
} from "./workshop-data";

export type PublicWorkshopRegistration =
  | {
      status: "open";
      heading: string;
      icon: WorkshopIconKey;
      googleFormUrl: string;
      buttonLabel: string;
    }
  | {
      status: "full";
      heading: string;
      icon: WorkshopIconKey;
      fullMessage: string;
    };

export type PublicWorkshopProgram = {
  id: WorkshopSlotId;
  title: string;
  description: string;
  mainIcon: WorkshopIconKey;
  theme: WorkshopTheme;
  focusAreas: Array<{ label: string; icon: WorkshopIconKey }>;
  targeting: {
    audiences: WorkshopAudienceKey[] | null;
    standards: number[] | null;
    ageRange: { min: number; max: number } | null;
  };
  registration: PublicWorkshopRegistration | null;
};

export type PublicWorkshopConfiguration = {
  registrationsEnabled: boolean;
  noRegistrationMessage: string;
  discount: {
    enabled: boolean;
    message: string;
    deadline: string | null;
    expiredMessage: string;
  };
  registrationOpen: boolean;
  workshops: PublicWorkshopProgram[];
};

export function toPublicWorkshopConfiguration(
  configuration: WorkshopConfiguration,
): PublicWorkshopConfiguration {
  const global = validateWorkshopGlobalConfiguration({
    registrationsEnabled: configuration.global.registrationsEnabled,
    noRegistrationMessage: configuration.global.noRegistrationMessage,
    discountEnabled: configuration.global.discountEnabled,
    discountMessage: configuration.global.discountMessage,
    discountDeadline: configuration.global.discountDeadline,
    discountExpiredMessage: configuration.global.discountExpiredMessage,
  });
  if (!global.success) throw new Error("Workshop public configuration is invalid.");

  const workshops = configuration.workshops
    .map((workshop) => {
      const validated = validateWorkshopProgramUpdate({
        isActive: workshop.isActive,
        title: workshop.title,
        description: workshop.description,
        mainIcon: workshop.mainIcon,
        theme: workshop.theme,
        focusAreas: workshop.focusAreas,
        audienceEnabled: workshop.audienceEnabled,
        audiences: workshop.audiences,
        standardsEnabled: workshop.standardsEnabled,
        standards: workshop.standards,
        ageEnabled: workshop.ageEnabled,
        minAge: workshop.minAge,
        maxAge: workshop.maxAge,
        registrationStatus: workshop.registrationStatus,
        registrationHeading: workshop.registrationHeading,
        registrationIcon: workshop.registrationIcon,
        googleFormUrl: workshop.googleFormUrl,
        buttonLabel: workshop.buttonLabel,
        fullMessage: workshop.fullMessage,
      });
      if (!validated.success) throw new Error("Workshop public program configuration is invalid.");
      return { source: workshop, value: validated.data };
    })
    .filter(({ value }) => value.isActive)
    .sort((a, b) => a.source.displayOrder - b.source.displayOrder)
    .map(({ source, value }): PublicWorkshopProgram => {
      let registration: PublicWorkshopRegistration | null = null;
      if (global.data.registrationsEnabled && value.registrationStatus === "open") {
        const url = validateGoogleFormUrl(value.googleFormUrl);
        if (!url.success || !url.data) throw new Error("Open Workshop registration URL is invalid.");
        registration = {
          status: "open",
          heading: value.registrationHeading,
          icon: value.registrationIcon,
          googleFormUrl: url.data,
          buttonLabel: value.buttonLabel,
        };
      } else if (global.data.registrationsEnabled && value.registrationStatus === "full") {
        registration = {
          status: "full",
          heading: value.registrationHeading,
          icon: value.registrationIcon,
          fullMessage: value.fullMessage,
        };
      }
      return {
        id: source.workshopId,
        title: value.title,
        description: value.description,
        mainIcon: value.mainIcon,
        theme: value.theme,
        focusAreas: value.focusAreas,
        targeting: {
          audiences: value.audienceEnabled ? value.audiences : null,
          standards: value.standardsEnabled ? value.standards : null,
          ageRange: value.ageEnabled && value.minAge !== null && value.maxAge !== null
            ? { min: value.minAge, max: value.maxAge }
            : null,
        },
        registration,
      };
    });

  return {
    registrationsEnabled: global.data.registrationsEnabled,
    noRegistrationMessage: global.data.noRegistrationMessage,
    discount: {
      enabled: global.data.discountEnabled,
      message: global.data.discountMessage,
      deadline: global.data.discountDeadline,
      expiredMessage: global.data.discountExpiredMessage,
    },
    registrationOpen: workshops.some((workshop) => workshop.registration?.status === "open"),
    workshops,
  };
}
