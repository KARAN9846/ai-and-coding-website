"use client";

import { useEffect, useState } from "react";

import type {
  PublicWorkshopConfiguration,
  PublicWorkshopProgram,
  PublicWorkshopRegistration,
} from "@/lib/workshops/public-configuration";
import { validateGoogleFormUrl } from "@/lib/workshops/configuration-validation";
import {
  isWorkshopAudienceKey,
  isWorkshopIconKey,
  isWorkshopSlotId,
  isWorkshopTheme,
} from "@/lib/workshops/workshop-data";

type Snapshot =
  | { phase: "loading"; configuration: null }
  | { phase: "ready"; configuration: PublicWorkshopConfiguration }
  | { phase: "unavailable"; configuration: null };
type Listener = (snapshot: Snapshot) => void;
type InitialConfiguration = PublicWorkshopConfiguration | null;

let snapshot: Snapshot = { phase: "loading", configuration: null };
let request: Promise<boolean> | null = null;
const listeners = new Set<Listener>();

function publish(next: Snapshot) {
  snapshot = next;
  for (const listener of listeners) listener(snapshot);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRegistration(value: unknown): PublicWorkshopRegistration | null | false {
  if (value === null) return null;
  if (!isRecord(value) || (value.status !== "open" && value.status !== "full") ||
      typeof value.heading !== "string" || typeof value.icon !== "string" ||
      !isWorkshopIconKey(value.icon)) {
    return false;
  }
  if (value.status === "open") {
    const url = validateGoogleFormUrl(value.googleFormUrl);
    if (!url.success || !url.data || typeof value.buttonLabel !== "string") return false;
    return {
      status: "open",
      heading: value.heading,
      icon: value.icon,
      googleFormUrl: url.data,
      buttonLabel: value.buttonLabel,
    };
  }
  if (typeof value.fullMessage !== "string" || "googleFormUrl" in value) return false;
  return { status: "full", heading: value.heading, icon: value.icon, fullMessage: value.fullMessage };
}

function readWorkshop(value: unknown): PublicWorkshopProgram | null {
  if (!isRecord(value) || typeof value.id !== "string" || !isWorkshopSlotId(value.id) ||
      typeof value.title !== "string" || typeof value.description !== "string" ||
      typeof value.mainIcon !== "string" || !isWorkshopIconKey(value.mainIcon) ||
      typeof value.theme !== "string" || !isWorkshopTheme(value.theme) ||
      !Array.isArray(value.focusAreas) || !isRecord(value.targeting)) return null;

  const focusAreas = value.focusAreas.map((focus) => {
    if (!isRecord(focus) || typeof focus.label !== "string" ||
        typeof focus.icon !== "string" || !isWorkshopIconKey(focus.icon)) return null;
    return { label: focus.label, icon: focus.icon };
  });
  if (focusAreas.some((focus) => focus === null) || focusAreas.length > 6) return null;

  const audiences = value.targeting.audiences;
  const standards = value.targeting.standards;
  const ageRange = value.targeting.ageRange;
  if (audiences !== null && (!Array.isArray(audiences) ||
      audiences.some((audience) => typeof audience !== "string" || !isWorkshopAudienceKey(audience)))) return null;
  if (standards !== null && (!Array.isArray(standards) ||
      standards.some((standard) => !Number.isInteger(standard) || standard < 5 || standard > 12))) return null;
  if (ageRange !== null && (!isRecord(ageRange) || !Number.isInteger(ageRange.min) ||
      !Number.isInteger(ageRange.max) || (ageRange.min as number) > (ageRange.max as number))) return null;

  const registration = readRegistration(value.registration);
  if (registration === false) return null;
  return {
    id: value.id,
    title: value.title,
    description: value.description,
    mainIcon: value.mainIcon,
    theme: value.theme,
    focusAreas: focusAreas as PublicWorkshopProgram["focusAreas"],
    targeting: {
      audiences: audiences as PublicWorkshopProgram["targeting"]["audiences"],
      standards: standards as PublicWorkshopProgram["targeting"]["standards"],
      ageRange: ageRange as PublicWorkshopProgram["targeting"]["ageRange"],
    },
    registration,
  };
}

function readConfiguration(value: unknown): PublicWorkshopConfiguration | null {
  if (!isRecord(value) || !isRecord(value.discount) || !Array.isArray(value.workshops) ||
      typeof value.registrationsEnabled !== "boolean" ||
      typeof value.noRegistrationMessage !== "string" ||
      typeof value.registrationOpen !== "boolean" ||
      typeof value.discount.enabled !== "boolean" ||
      typeof value.discount.message !== "string" ||
      (value.discount.deadline !== null && typeof value.discount.deadline !== "string") ||
      typeof value.discount.expiredMessage !== "string") return null;
  if (value.discount.enabled && (value.discount.deadline === null ||
      !Number.isFinite(new Date(value.discount.deadline).getTime()))) return null;

  const workshops = value.workshops.map(readWorkshop);
  if (workshops.some((workshop) => workshop === null) || workshops.length > 4) return null;
  const safeWorkshops = workshops as PublicWorkshopProgram[];
  if (new Set(safeWorkshops.map((workshop) => workshop.id)).size !== safeWorkshops.length) return null;
  const derivedOpen = value.registrationsEnabled &&
    safeWorkshops.some((workshop) => workshop.registration?.status === "open");
  if (value.registrationOpen !== derivedOpen ||
      (!value.registrationsEnabled && safeWorkshops.some((workshop) => workshop.registration !== null))) return null;

  return {
    registrationsEnabled: value.registrationsEnabled,
    noRegistrationMessage: value.noRegistrationMessage,
    discount: {
      enabled: value.discount.enabled,
      message: value.discount.message,
      deadline: value.discount.deadline,
      expiredMessage: value.discount.expiredMessage,
    },
    registrationOpen: derivedOpen,
    workshops: safeWorkshops,
  };
}

export function revalidateWorkshopConfiguration(): Promise<boolean> {
  if (request) return request;
  request = (async () => {
    try {
      const response = await fetch("/api/workshops/configuration", { cache: "no-store" });
      const configuration = readConfiguration(await response.json().catch(() => null));
      if (!response.ok || !configuration) {
        if (snapshot.phase !== "ready") publish({ phase: "unavailable", configuration: null });
        return false;
      }
      publish({ phase: "ready", configuration });
      return true;
    } catch {
      if (snapshot.phase !== "ready") publish({ phase: "unavailable", configuration: null });
      return false;
    }
  })().finally(() => { request = null; });
  return request;
}

export function useWorkshopConfiguration(initialConfiguration?: InitialConfiguration) {
  const [current, setCurrent] = useState<Snapshot>(() =>
    initialConfiguration
      ? { phase: "ready", configuration: initialConfiguration }
      : snapshot,
  );
  useEffect(() => {
    let revalidating = true;
    const listener: Listener = (next) => {
      if (!revalidating) setCurrent(next);
    };
    listeners.add(listener);
    void revalidateWorkshopConfiguration().then((succeeded) => {
      revalidating = false;
      if (succeeded) setCurrent(snapshot);
      else if (!initialConfiguration) setCurrent(snapshot);
    });
    return () => { revalidating = false; listeners.delete(listener); };
  }, [initialConfiguration]);
  return current;
}
