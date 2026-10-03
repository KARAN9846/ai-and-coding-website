"use client";

import { useEffect, useState } from "react";

export type PublicWorkshopStatus = {
  registrationOpen: boolean;
  closedMessage: string;
};

type WorkshopStatusSnapshot =
  | { phase: "loading"; status: null }
  | { phase: "ready"; status: PublicWorkshopStatus }
  | { phase: "unavailable"; status: null };

type StatusListener = (snapshot: WorkshopStatusSnapshot) => void;

let snapshot: WorkshopStatusSnapshot = { phase: "loading", status: null };
let statusRequest: Promise<void> | null = null;
const listeners = new Set<StatusListener>();

function publish(nextSnapshot: WorkshopStatusSnapshot) {
  snapshot = nextSnapshot;

  for (const listener of listeners) listener(snapshot);
}

function readStatus(value: unknown): PublicWorkshopStatus | null {
  if (typeof value !== "object" || value === null) return null;

  const source = value as Record<string, unknown>;
  if (
    typeof source.registrationOpen !== "boolean" ||
    typeof source.closedMessage !== "string"
  ) {
    return null;
  }

  return {
    registrationOpen: source.registrationOpen,
    closedMessage: source.closedMessage,
  };
}

export function revalidateWorkshopStatus() {
  if (statusRequest) return statusRequest;

  statusRequest = (async () => {
    try {
      const response = await fetch("/api/workshops/status", {
        cache: "no-store",
      });
      const body: unknown = await response.json().catch(() => null);
      const status = readStatus(body);

      if (!response.ok || !status) {
        if (snapshot.phase !== "ready") {
          publish({ phase: "unavailable", status: null });
        }
        return;
      }

      publish({ phase: "ready", status });
    } catch {
      if (snapshot.phase !== "ready") {
        publish({ phase: "unavailable", status: null });
      }
    }
  })().finally(() => {
    statusRequest = null;
  });

  return statusRequest;
}

export function publishWorkshopStatus(status: PublicWorkshopStatus) {
  publish({ phase: "ready", status });
}

export function useWorkshopStatus() {
  const [currentSnapshot, setCurrentSnapshot] = useState(snapshot);

  useEffect(() => {
    listeners.add(setCurrentSnapshot);
    void revalidateWorkshopStatus();

    return () => {
      listeners.delete(setCurrentSnapshot);
    };
  }, []);

  return currentSnapshot;
}
