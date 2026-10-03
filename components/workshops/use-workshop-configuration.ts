"use client";

import { useEffect, useState } from "react";

import type {
  PublicWorkshopConfiguration,
  PublicWorkshopRegistrationOption,
} from "@/lib/workshops/public-configuration";
import {
  isWorkshopProgramId,
  validateGoogleFormUrl,
} from "@/lib/workshops/configuration-validation";
import { WORKSHOP_PROGRAMS } from "@/lib/workshops/workshop-data";

type WorkshopConfigurationSnapshot =
  | { phase: "loading"; configuration: null }
  | { phase: "ready"; configuration: PublicWorkshopConfiguration }
  | { phase: "unavailable"; configuration: null };

type ConfigurationListener = (
  snapshot: WorkshopConfigurationSnapshot,
) => void;

const REGISTRATION_STATUSES = new Set(["open", "full", "hidden"]);

let snapshot: WorkshopConfigurationSnapshot = {
  phase: "loading",
  configuration: null,
};
let configurationRequest: Promise<void> | null = null;
const listeners = new Set<ConfigurationListener>();

function publish(nextSnapshot: WorkshopConfigurationSnapshot) {
  snapshot = nextSnapshot;

  for (const listener of listeners) listener(snapshot);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readOption(value: unknown): PublicWorkshopRegistrationOption | null {
  if (!isRecord(value)) return null;

  const {
    workshopId,
    status,
    registrationHeading,
    googleFormUrl,
    buttonLabel,
    fullMessage,
  } = value;

  if (
    typeof workshopId !== "string" ||
    !isWorkshopProgramId(workshopId) ||
    typeof status !== "string" ||
    !REGISTRATION_STATUSES.has(status) ||
    typeof registrationHeading !== "string" ||
    typeof buttonLabel !== "string" ||
    typeof fullMessage !== "string"
  ) {
    return null;
  }

  const validatedUrl = validateGoogleFormUrl(googleFormUrl);

  if (
    !validatedUrl.success ||
    (status === "open" && validatedUrl.data === null) ||
    (status !== "open" && validatedUrl.data !== null)
  ) {
    return null;
  }

  return {
    workshopId,
    status: status as PublicWorkshopRegistrationOption["status"],
    registrationHeading,
    googleFormUrl: validatedUrl.data,
    buttonLabel,
    fullMessage,
  };
}

function readConfiguration(value: unknown): PublicWorkshopConfiguration | null {
  if (!isRecord(value) || !isRecord(value.discount)) return null;

  const { discount } = value;

  if (
    typeof value.registrationsEnabled !== "boolean" ||
    typeof value.noRegistrationMessage !== "string" ||
    typeof value.registrationOpen !== "boolean" ||
    typeof discount.enabled !== "boolean" ||
    typeof discount.message !== "string" ||
    (discount.deadline !== null && typeof discount.deadline !== "string") ||
    typeof discount.expiredMessage !== "string" ||
    !Array.isArray(value.options)
  ) {
    return null;
  }

  if (
    discount.enabled &&
    (discount.deadline === null ||
      !Number.isFinite(new Date(discount.deadline).getTime()))
  ) {
    return null;
  }

  const options = value.options.map(readOption);

  if (options.some((option) => option === null)) return null;

  const safeOptions = options as PublicWorkshopRegistrationOption[];
  const optionIds = new Set(safeOptions.map((option) => option.workshopId));

  if (
    safeOptions.length !== WORKSHOP_PROGRAMS.length ||
    optionIds.size !== WORKSHOP_PROGRAMS.length ||
    WORKSHOP_PROGRAMS.some((program) => !optionIds.has(program.id))
  ) {
    return null;
  }

  const registrationOpen =
    value.registrationsEnabled &&
    safeOptions.some(
      (option) => option.status === "open" && option.googleFormUrl !== null,
    );

  if (value.registrationOpen !== registrationOpen) return null;

  return {
    registrationsEnabled: value.registrationsEnabled,
    noRegistrationMessage: value.noRegistrationMessage,
    discount: {
      enabled: discount.enabled,
      message: discount.message,
      deadline: discount.deadline,
      expiredMessage: discount.expiredMessage,
    },
    registrationOpen,
    options: safeOptions,
  };
}

export function revalidateWorkshopConfiguration() {
  if (configurationRequest) return configurationRequest;

  configurationRequest = (async () => {
    try {
      const response = await fetch("/api/workshops/configuration", {
        cache: "no-store",
      });
      const body: unknown = await response.json().catch(() => null);
      const configuration = readConfiguration(body);

      if (!response.ok || !configuration) {
        if (snapshot.phase !== "ready") {
          publish({ phase: "unavailable", configuration: null });
        }
        return;
      }

      publish({ phase: "ready", configuration });
    } catch {
      if (snapshot.phase !== "ready") {
        publish({ phase: "unavailable", configuration: null });
      }
    }
  })().finally(() => {
    configurationRequest = null;
  });

  return configurationRequest;
}

export function useWorkshopConfiguration() {
  const [currentSnapshot, setCurrentSnapshot] = useState(snapshot);

  useEffect(() => {
    listeners.add(setCurrentSnapshot);
    void revalidateWorkshopConfiguration();

    return () => {
      listeners.delete(setCurrentSnapshot);
    };
  }, []);

  return currentSnapshot;
}
