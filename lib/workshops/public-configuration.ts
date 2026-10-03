import type { WorkshopProgramId } from "@/lib/workshops/workshop-data";

import type {
  WorkshopConfiguration,
  WorkshopRegistrationStatus,
} from "./configuration";
import {
  validateWorkshopGlobalConfiguration,
  validateWorkshopRegistrationOption,
} from "./configuration-validation";

export type PublicWorkshopRegistrationOption = {
  workshopId: WorkshopProgramId;
  status: WorkshopRegistrationStatus;
  registrationHeading: string;
  googleFormUrl: string | null;
  buttonLabel: string;
  fullMessage: string;
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
  options: PublicWorkshopRegistrationOption[];
};

export function toPublicWorkshopConfiguration(
  configuration: WorkshopConfiguration,
): PublicWorkshopConfiguration {
  const validatedGlobal = validateWorkshopGlobalConfiguration({
    registrationsEnabled: configuration.global.registrationsEnabled,
    noRegistrationMessage: configuration.global.noRegistrationMessage,
    discountEnabled: configuration.global.discountEnabled,
    discountMessage: configuration.global.discountMessage,
    discountDeadline: configuration.global.discountDeadline,
    discountExpiredMessage: configuration.global.discountExpiredMessage,
  });

  if (!validatedGlobal.success) {
    throw new Error("Workshop public configuration is invalid.");
  }

  const options = configuration.options.map((option) => {
    const validatedOption = validateWorkshopRegistrationOption({
      status: option.status,
      registrationHeading: option.registrationHeading,
      googleFormUrl: option.googleFormUrl,
      buttonLabel: option.buttonLabel,
      fullMessage: option.fullMessage,
    });

    if (!validatedOption.success) {
      throw new Error("Workshop public registration configuration is invalid.");
    }

    return {
      workshopId: option.workshopId,
      status: validatedOption.data.status,
      registrationHeading: validatedOption.data.registrationHeading,
      googleFormUrl:
        validatedOption.data.status === "open"
          ? validatedOption.data.googleFormUrl
          : null,
      buttonLabel: validatedOption.data.buttonLabel,
      fullMessage: validatedOption.data.fullMessage,
    } satisfies PublicWorkshopRegistrationOption;
  });

  const registrationOpen =
    validatedGlobal.data.registrationsEnabled &&
    options.some(
      (option) => option.status === "open" && option.googleFormUrl !== null,
    );

  return {
    registrationsEnabled: validatedGlobal.data.registrationsEnabled,
    noRegistrationMessage: validatedGlobal.data.noRegistrationMessage,
    discount: {
      enabled: validatedGlobal.data.discountEnabled,
      message: validatedGlobal.data.discountMessage,
      deadline: validatedGlobal.data.discountDeadline,
      expiredMessage: validatedGlobal.data.discountExpiredMessage,
    },
    registrationOpen,
    options,
  };
}
