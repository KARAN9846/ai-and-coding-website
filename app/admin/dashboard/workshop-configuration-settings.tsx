"use client";

import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { WORKSHOP_ICON_MAP } from "@/components/workshops/workshop-icon";
import type {
  WorkshopConfiguration,
  WorkshopGlobalConfiguration,
  WorkshopProgram,
  WorkshopProgramUpdate,
  WorkshopRegistrationStatus,
} from "@/lib/workshops/configuration";
import {
  WORKSHOP_DESCRIPTION_MAX_LENGTH,
  WORKSHOP_DISCOUNT_EXPIRED_MESSAGE_MAX_LENGTH,
  WORKSHOP_DISCOUNT_MESSAGE_MAX_LENGTH,
  WORKSHOP_FOCUS_AREA_MAX_COUNT,
  WORKSHOP_FOCUS_LABEL_MAX_LENGTH,
  WORKSHOP_FULL_MESSAGE_MAX_LENGTH,
  WORKSHOP_GOOGLE_FORM_URL_MAX_LENGTH,
  WORKSHOP_NO_REGISTRATION_MESSAGE_MAX_LENGTH,
  WORKSHOP_REGISTRATION_BUTTON_LABEL_MAX_LENGTH,
  WORKSHOP_REGISTRATION_HEADING_MAX_LENGTH,
  WORKSHOP_TITLE_MAX_LENGTH,
  validateWorkshopGlobalConfiguration,
  validateWorkshopProgramUpdate,
} from "@/lib/workshops/configuration-validation";
import {
  WORKSHOP_AUDIENCE_OPTIONS,
  WORKSHOP_ICON_OPTIONS,
  WORKSHOP_SLOT_IDS,
  WORKSHOP_STANDARDS,
  WORKSHOP_THEME_OPTIONS,
  type WorkshopAudienceKey,
  type WorkshopIconKey,
  type WorkshopSlotId,
  type WorkshopTheme,
} from "@/lib/workshops/workshop-data";

import styles from "./workshop-configuration-settings.module.css";

type GlobalDraft = Omit<WorkshopGlobalConfiguration, "updatedAt" | "discountDeadline"> & {
  discountDeadline: string;
};
type ProgramDraft = Omit<WorkshopProgramUpdate, "googleFormUrl" | "minAge" | "maxAge"> & {
  googleFormUrl: string;
  minAge: string;
  maxAge: string;
};
type FeedbackValue = { error: string; success: string };

const EMPTY_FEEDBACK: FeedbackValue = { error: "", success: "" };

function errorOf(value: unknown, fallback: string) {
  return typeof value === "object" && value !== null &&
    typeof (value as { error?: unknown }).error === "string"
    ? (value as { error: string }).error
    : fallback;
}

function isConfiguration(value: unknown): value is WorkshopConfiguration {
  if (typeof value !== "object" || value === null) return false;
  const source = value as { global?: unknown; workshops?: unknown };
  return typeof source.global === "object" && Array.isArray(source.workshops) &&
    source.workshops.length === WORKSHOP_SLOT_IDS.length;
}

function toIst(value: string | null) {
  return value
    ? new Date(new Date(value).getTime() + 330 * 60_000).toISOString().slice(0, 16)
    : "";
}

function fromIst(value: string) {
  return value ? new Date(`${value}:00+05:30`).toISOString() : null;
}

function toGlobalDraft(value: WorkshopGlobalConfiguration): GlobalDraft {
  return {
    registrationsEnabled: value.registrationsEnabled,
    noRegistrationMessage: value.noRegistrationMessage,
    discountEnabled: value.discountEnabled,
    discountMessage: value.discountMessage,
    discountDeadline: toIst(value.discountDeadline),
    discountExpiredMessage: value.discountExpiredMessage,
  };
}

function toProgramDraft(value: WorkshopProgram): ProgramDraft {
  return {
    isActive: value.isActive,
    title: value.title,
    description: value.description,
    mainIcon: value.mainIcon,
    theme: value.theme,
    focusAreas: value.focusAreas,
    audienceEnabled: value.audienceEnabled,
    audiences: value.audiences,
    standardsEnabled: value.standardsEnabled,
    standards: value.standards,
    ageEnabled: value.ageEnabled,
    minAge: value.minAge?.toString() ?? "",
    maxAge: value.maxAge?.toString() ?? "",
    registrationStatus: value.registrationStatus,
    registrationHeading: value.registrationHeading,
    registrationIcon: value.registrationIcon,
    googleFormUrl: value.googleFormUrl ?? "",
    buttonLabel: value.buttonLabel,
    fullMessage: value.fullMessage,
  };
}

function toProgramPayload(value: ProgramDraft): WorkshopProgramUpdate {
  return {
    ...value,
    minAge: value.ageEnabled && value.minAge ? Number(value.minAge) : null,
    maxAge: value.ageEnabled && value.maxAge ? Number(value.maxAge) : null,
    googleFormUrl: value.googleFormUrl.trim() || null,
  };
}

function Toggle({
  id,
  checked,
  disabled,
  onClick,
}: {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div className={styles.toggle}>
      <span>{checked ? "ON" : "OFF"}</span>
      <button id={id} type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={onClick}>
        <span />
      </button>
    </div>
  );
}

function Feedback({ value }: { value?: FeedbackValue }) {
  return (
    <div className={styles.feedback}>
      {value?.error && <p role="alert">{value.error}</p>}
      {value?.success && <p role="status" aria-live="polite">{value.success}</p>}
    </div>
  );
}

function IconSelect({
  value,
  onChange,
  disabled,
  label,
}: {
  value: WorkshopIconKey;
  onChange: (value: WorkshopIconKey) => void;
  disabled: boolean;
  label?: string;
}) {
  const Icon = WORKSHOP_ICON_MAP[value];
  return (
    <div className={styles.iconSelect}>
      <span aria-hidden="true"><Icon size={18} /></span>
      <select aria-label={label} value={value} disabled={disabled}
        onChange={(event) => onChange(event.target.value as WorkshopIconKey)}>
        {WORKSHOP_ICON_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

export function WorkshopConfigurationSettings() {
  const [saved, setSaved] = useState<WorkshopConfiguration | null>(null);
  const [global, setGlobal] = useState<GlobalDraft | null>(null);
  const [drafts, setDrafts] = useState<Partial<Record<WorkshopSlotId, ProgramDraft>>>({});
  const [order, setOrder] = useState<WorkshopSlotId[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [globalSaving, setGlobalSaving] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [saving, setSaving] = useState<Partial<Record<WorkshopSlotId, boolean>>>({});
  const [globalFeedback, setGlobalFeedback] = useState<FeedbackValue>(EMPTY_FEEDBACK);
  const [orderFeedback, setOrderFeedback] = useState<FeedbackValue>(EMPTY_FEEDBACK);
  const [feedback, setFeedback] = useState<Partial<Record<WorkshopSlotId, FeedbackValue>>>({});
  const globalLock = useRef(false);
  const orderLock = useRef(false);
  const locks = useRef(new Set<WorkshopSlotId>());

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/admin/workshops/configuration", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const result: unknown = await response.json();
      if (!response.ok || !isConfiguration(result)) {
        setSaved(null);
        setLoadError(errorOf(result, "Unable to load Workshop configuration."));
        return;
      }
      const workshops = [...result.workshops].sort((a, b) => a.displayOrder - b.displayOrder);
      setSaved({ ...result, workshops });
      setGlobal(toGlobalDraft(result.global));
      setDrafts(Object.fromEntries(workshops.map((workshop) => [
        workshop.workshopId,
        toProgramDraft(workshop),
      ])));
      setOrder(workshops.map((workshop) => workshop.workshopId));
    } catch {
      setSaved(null);
      setLoadError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial authenticated configuration load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  const globalPayload = global && { ...global, discountDeadline: fromIst(global.discountDeadline) };
  const globalValidation = validateWorkshopGlobalConfiguration(globalPayload);
  const globalDirty = Boolean(saved && globalPayload &&
    JSON.stringify(globalPayload) !== JSON.stringify({
      registrationsEnabled: saved.global.registrationsEnabled,
      noRegistrationMessage: saved.global.noRegistrationMessage,
      discountEnabled: saved.global.discountEnabled,
      discountMessage: saved.global.discountMessage,
      discountDeadline: saved.global.discountDeadline,
      discountExpiredMessage: saved.global.discountExpiredMessage,
    }));
  const orderDirty = Boolean(saved &&
    JSON.stringify(order) !== JSON.stringify(saved.workshops.map((workshop) => workshop.workshopId)));

  function setGlobalField<K extends keyof GlobalDraft>(key: K, value: GlobalDraft[K]) {
    setGlobal((current) => current && ({ ...current, [key]: value }));
    setGlobalFeedback(EMPTY_FEEDBACK);
  }

  function setProgram(workshopId: WorkshopSlotId, patch: Partial<ProgramDraft>) {
    setDrafts((current) => ({
      ...current,
      [workshopId]: { ...current[workshopId]!, ...patch },
    }));
    setFeedback((current) => ({ ...current, [workshopId]: EMPTY_FEEDBACK }));
  }

  async function saveGlobal(event: FormEvent) {
    event.preventDefault();
    if (!globalValidation.success || !globalDirty || globalLock.current) return;
    globalLock.current = true;
    setGlobalSaving(true);
    setGlobalFeedback(EMPTY_FEEDBACK);
    try {
      const response = await fetch("/api/admin/workshops/configuration", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(globalValidation.data),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setGlobalFeedback({ error: errorOf(result, "Unable to save global settings."), success: "" });
        return;
      }
      const next = result as WorkshopGlobalConfiguration;
      setSaved((current) => current && ({ ...current, global: next }));
      setGlobal(toGlobalDraft(next));
      setGlobalFeedback({ error: "", success: "Global Workshop settings updated." });
    } catch {
      setGlobalFeedback({ error: "Unable to connect to the server.", success: "" });
    } finally {
      globalLock.current = false;
      setGlobalSaving(false);
    }
  }

  async function saveProgram(event: FormEvent, workshopId: WorkshopSlotId) {
    event.preventDefault();
    const draft = drafts[workshopId];
    if (!draft || locks.current.has(workshopId)) return;
    const validation = validateWorkshopProgramUpdate(toProgramPayload(draft));
    if (!validation.success) {
      setFeedback((current) => ({ ...current, [workshopId]: { error: validation.error, success: "" } }));
      return;
    }
    locks.current.add(workshopId);
    setSaving((current) => ({ ...current, [workshopId]: true }));
    try {
      const response = await fetch(`/api/admin/workshops/${workshopId}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setFeedback((current) => ({
          ...current,
          [workshopId]: { error: errorOf(result, "Unable to save Workshop."), success: "" },
        }));
        return;
      }
      const next = result as WorkshopProgram;
      setSaved((current) => current && ({
        ...current,
        workshops: current.workshops.map((workshop) =>
          workshop.workshopId === workshopId ? next : workshop),
      }));
      setDrafts((current) => ({ ...current, [workshopId]: toProgramDraft(next) }));
      setFeedback((current) => ({
        ...current,
        [workshopId]: { error: "", success: "Workshop updated." },
      }));
    } catch {
      setFeedback((current) => ({
        ...current,
        [workshopId]: { error: "Unable to connect to the server.", success: "" },
      }));
    } finally {
      locks.current.delete(workshopId);
      setSaving((current) => ({ ...current, [workshopId]: false }));
    }
  }

  function moveWorkshop(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setOrderFeedback(EMPTY_FEEDBACK);
  }

  async function saveOrder() {
    if (!orderDirty || orderLock.current) return;
    orderLock.current = true;
    setOrderSaving(true);
    setOrderFeedback(EMPTY_FEEDBACK);
    try {
      const response = await fetch("/api/admin/workshops/order", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopIds: order }),
      });
      const result: unknown = await response.json();
      if (!response.ok || typeof result !== "object" || result === null ||
          !Array.isArray((result as { workshops?: unknown }).workshops)) {
        setOrderFeedback({ error: errorOf(result, "Unable to save Workshop order."), success: "" });
        return;
      }
      const workshops = (result as { workshops: WorkshopProgram[] }).workshops;
      setSaved((current) => current && ({ ...current, workshops }));
      setOrder(workshops.map((workshop) => workshop.workshopId));
      setOrderFeedback({ error: "", success: "Workshop order updated." });
    } catch {
      setOrderFeedback({ error: "Unable to connect to the server.", success: "" });
    } finally {
      orderLock.current = false;
      setOrderSaving(false);
    }
  }

  return (
    <section className={styles.card} aria-labelledby="workshop-config-title">
      <header>
        <CalendarClock aria-hidden="true" />
        <div><p>WORKSHOP CONTROLS</p><h2 id="workshop-config-title">Workshop Configuration</h2></div>
      </header>

      {loading && <div className={styles.state} role="status"><LoaderCircle /> Loading configuration...</div>}
      {!loading && loadError && (
        <div className={styles.state} role="alert">
          {loadError}
          <button type="button" onClick={() => void load()}><RefreshCw size={15} />Retry</button>
        </div>
      )}

      {!loading && saved && global && (
        <>
          <form className={styles.global} onSubmit={saveGlobal}>
            <fieldset>
              <legend>Global Registration Settings</legend>
              <div className={styles.toggleRow}>
                <div>
                  <label htmlFor="registrations-enabled">Workshop Registrations Available</label>
                  <small>Controls whether registration options can be shown publicly.</small>
                </div>
                <Toggle id="registrations-enabled" checked={global.registrationsEnabled} disabled={globalSaving}
                  onClick={() => setGlobalField("registrationsEnabled", !global.registrationsEnabled)} />
              </div>
              <label>No-registration message
                <textarea rows={3} maxLength={WORKSHOP_NO_REGISTRATION_MESSAGE_MAX_LENGTH}
                  value={global.noRegistrationMessage}
                  onChange={(event) => setGlobalField("noRegistrationMessage", event.target.value)} />
                <small>{global.noRegistrationMessage.length}/{WORKSHOP_NO_REGISTRATION_MESSAGE_MAX_LENGTH}</small>
              </label>
            </fieldset>
            <fieldset>
              <legend>Discount Countdown</legend>
              <div className={styles.toggleRow}>
                <div><label htmlFor="discount-enabled">Enable Discount Countdown</label><small>Show the configured limited-time offer.</small></div>
                <Toggle id="discount-enabled" checked={global.discountEnabled} disabled={globalSaving}
                  onClick={() => setGlobalField("discountEnabled", !global.discountEnabled)} />
              </div>
              <div className={styles.fields}>
                <label>Discount Message
                  <input maxLength={WORKSHOP_DISCOUNT_MESSAGE_MAX_LENGTH} value={global.discountMessage}
                    onChange={(event) => setGlobalField("discountMessage", event.target.value)} />
                </label>
                <label>Deadline <small>India time (IST)</small>
                  <input type="datetime-local" value={global.discountDeadline}
                    onChange={(event) => setGlobalField("discountDeadline", event.target.value)}
                    aria-invalid={global.discountEnabled && !global.discountDeadline} />
                </label>
              </div>
              <label>Expired Message
                <input maxLength={WORKSHOP_DISCOUNT_EXPIRED_MESSAGE_MAX_LENGTH} value={global.discountExpiredMessage}
                  onChange={(event) => setGlobalField("discountExpiredMessage", event.target.value)} />
              </label>
            </fieldset>
            <div className={styles.footer}>
              <Feedback value={globalFeedback} />
              {!globalValidation.success && globalDirty && <p className={styles.error}>{globalValidation.error}</p>}
              <button className={styles.save} disabled={!globalDirty || !globalValidation.success || globalSaving}>
                <Save size={15} />{globalSaving ? "Saving..." : "Save Global Settings"}
              </button>
            </div>
          </form>

          <div
            className={styles.publicState}
            data-enabled={global.registrationsEnabled}
            role="status"
          >
            <span aria-hidden="true" />
            <div>
              <strong>
                {global.registrationsEnabled
                  ? "Workshop registration options are enabled"
                  : "Workshop registrations are unavailable"}
              </strong>
              <p>
                {global.registrationsEnabled
                  ? "OPEN and SEATS FULL options can appear on the public Workshops page."
                  : "The public page uses the unavailable contact panel. Per-workshop registration statuses and Google Form links are disabled here but remain safely saved."}
              </p>
            </div>
          </div>

          <section className={styles.orderPanel} aria-labelledby="workshop-order-title">
            <div>
              <h3 id="workshop-order-title">Workshop Order</h3>
              <p>Use the arrow controls to set the public card and registration order.</p>
            </div>
            <ol>
              {order.map((workshopId, index) => {
                const workshop = saved.workshops.find((item) => item.workshopId === workshopId);
                return (
                  <li key={workshopId}>
                    <span>{index + 1}. {workshop?.title ?? workshopId}</span>
                    <div>
                      <button type="button" disabled={index === 0 || orderSaving}
                        onClick={() => moveWorkshop(index, -1)} aria-label={`Move ${workshop?.title ?? workshopId} up`}>
                        <ChevronUp size={15} />
                      </button>
                      <button type="button" disabled={index === order.length - 1 || orderSaving}
                        onClick={() => moveWorkshop(index, 1)} aria-label={`Move ${workshop?.title ?? workshopId} down`}>
                        <ChevronDown size={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className={styles.footer}>
              <Feedback value={orderFeedback} />
              <button type="button" className={styles.save} disabled={!orderDirty || orderSaving}
                onClick={() => void saveOrder()}>
                <Save size={15} />{orderSaving ? "Saving..." : "Save Order"}
              </button>
            </div>
          </section>

          <div className={styles.workshops}>
            {order.map((workshopId) => {
              const draft = drafts[workshopId];
              const original = saved.workshops.find((workshop) => workshop.workshopId === workshopId);
              if (!draft || !original) return null;
              const validation = validateWorkshopProgramUpdate(toProgramPayload(draft));
              const dirty = JSON.stringify(toProgramPayload(draft)) !== JSON.stringify({
                ...toProgramPayload(toProgramDraft(original)),
              });
              const MainIcon = WORKSHOP_ICON_MAP[draft.mainIcon];

              return (
                <details key={workshopId} className={styles.option}>
                  <summary>
                    <span className={styles.summaryIcon} aria-hidden="true"><MainIcon size={20} /></span>
                    <span><small>{workshopId.toUpperCase()}</small><strong>{draft.title}</strong></span>
                    <em data-active={draft.isActive}>{draft.isActive ? "ACTIVE" : "INACTIVE"}</em>
                  </summary>
                  <form onSubmit={(event) => void saveProgram(event, workshopId)}>
                    <fieldset>
                      <legend>Content & Visuals</legend>
                      <div className={styles.toggleRow}>
                        <div><label htmlFor={`${workshopId}-active`}>Show Workshop Publicly</label><small>Inactive slots do not render publicly.</small></div>
                        <Toggle id={`${workshopId}-active`} checked={draft.isActive} disabled={saving[workshopId]}
                          onClick={() => setProgram(workshopId, { isActive: !draft.isActive })} />
                      </div>
                      <div className={styles.fields}>
                        <label>Title
                          <input maxLength={WORKSHOP_TITLE_MAX_LENGTH} value={draft.title}
                            onChange={(event) => setProgram(workshopId, { title: event.target.value })} />
                        </label>
                        <label>Main Icon
                          <IconSelect value={draft.mainIcon} disabled={Boolean(saving[workshopId])}
                            onChange={(mainIcon) => setProgram(workshopId, { mainIcon })} />
                        </label>
                        <label className={styles.wide}>Description
                          <textarea rows={3} maxLength={WORKSHOP_DESCRIPTION_MAX_LENGTH} value={draft.description}
                            onChange={(event) => setProgram(workshopId, { description: event.target.value })} />
                        </label>
                        <label>Theme
                          <select value={draft.theme} onChange={(event) =>
                            setProgram(workshopId, { theme: event.target.value as WorkshopTheme })}>
                            {WORKSHOP_THEME_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend>Focus Areas</legend>
                      <div className={styles.focusEditor}>
                        {draft.focusAreas.map((focus, focusIndex) => (
                          <div key={focusIndex} className={styles.focusRow}>
                            <input aria-label={`Focus area ${focusIndex + 1} label`}
                              maxLength={WORKSHOP_FOCUS_LABEL_MAX_LENGTH} value={focus.label}
                              onChange={(event) => {
                                const focusAreas = draft.focusAreas.map((item, itemIndex) =>
                                  itemIndex === focusIndex ? { ...item, label: event.target.value } : item);
                                setProgram(workshopId, { focusAreas });
                              }} />
                            <IconSelect value={focus.icon} disabled={Boolean(saving[workshopId])}
                              label={`Focus area ${focusIndex + 1} icon`}
                              onChange={(icon) => {
                                const focusAreas = draft.focusAreas.map((item, itemIndex) =>
                                  itemIndex === focusIndex ? { ...item, icon } : item);
                                setProgram(workshopId, { focusAreas });
                              }} />
                            <button type="button" aria-label={`Remove focus area ${focusIndex + 1}`}
                              onClick={() => setProgram(workshopId, {
                                focusAreas: draft.focusAreas.filter((_, itemIndex) => itemIndex !== focusIndex),
                              })}><Trash2 size={15} /></button>
                          </div>
                        ))}
                        <button type="button" className={styles.addFocus}
                          disabled={draft.focusAreas.length >= WORKSHOP_FOCUS_AREA_MAX_COUNT}
                          onClick={() => setProgram(workshopId, {
                            focusAreas: [...draft.focusAreas, { label: "", icon: "sparkles" }],
                          })}><Plus size={15} />Add Focus Area</button>
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend>Targeting</legend>
                      <div className={styles.targetBlock}>
                        <div className={styles.toggleRow}>
                          <div><label htmlFor={`${workshopId}-audience`}>Audience Targeting</label><small>Select one or more audiences.</small></div>
                          <Toggle id={`${workshopId}-audience`} checked={draft.audienceEnabled}
                            onClick={() => setProgram(workshopId, {
                              audienceEnabled: !draft.audienceEnabled,
                              audiences: [],
                            })} />
                        </div>
                        {draft.audienceEnabled && (
                          <div className={styles.checkGrid}>
                            {WORKSHOP_AUDIENCE_OPTIONS.map((option) => (
                              <label key={option.value}><input type="checkbox"
                                checked={draft.audiences.includes(option.value)}
                                onChange={(event) => {
                                  let audiences: WorkshopAudienceKey[];
                                  if (!event.target.checked) {
                                    audiences = draft.audiences.filter((value) => value !== option.value);
                                  } else if (option.value === "everyone") {
                                    audiences = ["everyone"];
                                  } else {
                                    audiences = [...draft.audiences.filter((value) => value !== "everyone"), option.value];
                                  }
                                  setProgram(workshopId, { audiences });
                                }} />{option.label}</label>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={styles.targetBlock}>
                        <div className={styles.toggleRow}>
                          <div><label htmlFor={`${workshopId}-standards`}>School Standards</label><small>Standards 5 through 12.</small></div>
                          <Toggle id={`${workshopId}-standards`} checked={draft.standardsEnabled}
                            onClick={() => setProgram(workshopId, {
                              standardsEnabled: !draft.standardsEnabled,
                              standards: [],
                            })} />
                        </div>
                        {draft.standardsEnabled && (
                          <div className={styles.standardGrid}>
                            {WORKSHOP_STANDARDS.map((standard) => (
                              <label key={standard}><input type="checkbox"
                                checked={draft.standards.includes(standard)}
                                onChange={(event) => setProgram(workshopId, {
                                  standards: event.target.checked
                                    ? [...draft.standards, standard].sort((a, b) => a - b)
                                    : draft.standards.filter((value) => value !== standard),
                                })} />Std {standard}</label>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={styles.targetBlock}>
                        <div className={styles.toggleRow}>
                          <div><label htmlFor={`${workshopId}-age`}>Age Range</label><small>Accepted range: 5–100.</small></div>
                          <Toggle id={`${workshopId}-age`} checked={draft.ageEnabled}
                            onClick={() => setProgram(workshopId, {
                              ageEnabled: !draft.ageEnabled,
                              minAge: "",
                              maxAge: "",
                            })} />
                        </div>
                        {draft.ageEnabled && (
                          <div className={styles.fields}>
                            <label>Minimum Age<input type="number" min={5} max={100} value={draft.minAge}
                              onChange={(event) => setProgram(workshopId, { minAge: event.target.value })} /></label>
                            <label>Maximum Age<input type="number" min={5} max={100} value={draft.maxAge}
                              onChange={(event) => setProgram(workshopId, { maxAge: event.target.value })} /></label>
                          </div>
                        )}
                      </div>
                    </fieldset>

                    <fieldset
                      className={styles.registrationFieldset}
                      disabled={
                        !global.registrationsEnabled ||
                        Boolean(saving[workshopId])
                      }
                    >
                      <legend>Registration</legend>
                      {!global.registrationsEnabled && (
                        <p className={styles.registrationDisabledNote}>
                          Enable Global Registration Settings to edit this
                          Workshop&apos;s status and registration link.
                        </p>
                      )}
                      <div className={styles.fields}>
                        <label>Status
                          <select value={draft.registrationStatus} onChange={(event) =>
                            setProgram(workshopId, { registrationStatus: event.target.value as WorkshopRegistrationStatus })}>
                            <option value="open">OPEN</option>
                            <option value="full">SEATS FULL</option>
                            <option value="hidden">HIDDEN</option>
                          </select>
                        </label>
                        <label>Registration Icon
                          <IconSelect value={draft.registrationIcon} disabled={Boolean(saving[workshopId])}
                            onChange={(registrationIcon) => setProgram(workshopId, { registrationIcon })} />
                        </label>
                        <label>Registration Heading
                          <input maxLength={WORKSHOP_REGISTRATION_HEADING_MAX_LENGTH} value={draft.registrationHeading}
                            onChange={(event) => setProgram(workshopId, { registrationHeading: event.target.value })} />
                        </label>
                        <label>Button Label
                          <input maxLength={WORKSHOP_REGISTRATION_BUTTON_LABEL_MAX_LENGTH} value={draft.buttonLabel}
                            onChange={(event) => setProgram(workshopId, { buttonLabel: event.target.value })} />
                        </label>
                        <label className={styles.wide}>Google Form URL
                          <input type="url" maxLength={WORKSHOP_GOOGLE_FORM_URL_MAX_LENGTH} value={draft.googleFormUrl}
                            onChange={(event) => setProgram(workshopId, { googleFormUrl: event.target.value })} />
                          <small>Stored for all states; exposed publicly only for an available OPEN registration.</small>
                        </label>
                        <label className={styles.wide}>Seats-Full Message
                          <textarea rows={2} maxLength={WORKSHOP_FULL_MESSAGE_MAX_LENGTH} value={draft.fullMessage}
                            onChange={(event) => setProgram(workshopId, { fullMessage: event.target.value })} />
                        </label>
                      </div>
                    </fieldset>

                    <div className={styles.footer}>
                      <Feedback value={feedback[workshopId]} />
                      {!validation.success && dirty && <p className={styles.error}>{validation.error}</p>}
                      <button className={styles.save}
                        disabled={!dirty || !validation.success || saving[workshopId]}>
                        <Save size={15} />{saving[workshopId] ? "Saving..." : "Save Workshop"}
                      </button>
                    </div>
                  </form>
                </details>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
