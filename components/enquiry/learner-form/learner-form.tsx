"use client";

import Link from "next/link";
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  Compass,
  GraduationCap,
  LoaderCircle,
  Mail,
  MessageCircle,
  MessageSquareText,
  Phone,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  LEARNER_EXPERIENCE_LEVELS,
  LEARNER_FIELD_ORDER,
  LEARNER_PRIMARY_GOALS,
  LEARNER_PROGRAMS,
  LEARNER_STAGES,
  MESSAGE_MAX_LENGTH,
  type LearnerEnquiryValues,
  type LearnerField,
  type LearnerFieldErrors,
  validateLearnerEnquiry,
  validateLearnerField,
} from "@/lib/enquiry/learner-validation";

import styles from "./learner-form.module.css";

const WHATSAPP_URL = "https://wa.me/919904425105";

const EMPTY_VALUES: LearnerEnquiryValues = {
  name: "",
  phone: "",
  email: "",
  stage: "",
  program: "",
  experience: "",
  primaryGoal: "",
  message: "",
};

const ALL_FIELDS_TOUCHED = LEARNER_FIELD_ORDER.reduce<
  Partial<Record<LearnerField, boolean>>
>((result, field) => {
  result[field] = true;
  return result;
}, {});

const programDetails = {
  "F2P - Fresher to Professional": Rocket,
  "Skill Development": Wrench,
  "AI Tools for Creators": Sparkles,
} as const;

const goalDetails = {
  "Learn from Basics": { icon: BookOpenCheck, tone: styles.goalBlue },
  "Build Real Projects": { icon: Code2, tone: styles.goalViolet },
  "Improve Existing Skills": { icon: BrainCircuit, tone: styles.goalTeal },
  "Career Direction": { icon: Compass, tone: styles.goalOrange },
  "Explore AI Tools": { icon: Sparkles, tone: styles.goalCyan },
  Other: { icon: Target, tone: styles.goalNeutral },
} as const;

type SuccessDetails = {
  name: string;
  email: string;
};

type CompactSelectProps = {
  id: string;
  name: "stage" | "experience";
  value: string;
  placeholder: string;
  options: readonly string[];
  error?: string;
  describedBy?: string;
  valid: boolean;
  onChange: (value: string) => void;
  onTouched: (value: string) => void;
};

function getApiErrors(value: unknown): LearnerFieldErrors | undefined {
  if (typeof value !== "object" || value === null) return undefined;

  const possibleErrors = (value as Record<string, unknown>).errors;
  if (typeof possibleErrors !== "object" || possibleErrors === null) {
    return undefined;
  }

  const source = possibleErrors as Record<string, unknown>;
  const errors: LearnerFieldErrors = {};

  for (const field of LEARNER_FIELD_ORDER) {
    if (typeof source[field] === "string") errors[field] = source[field];
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

function RequiredLabel({ children }: { children: ReactNode }) {
  return (
    <span className={styles.label}>
      {children} <span aria-hidden="true">*</span>
    </span>
  );
}

function ValidMark({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <span className={styles.validMark} aria-label="Valid">
      <Check size={12} strokeWidth={2.7} aria-hidden="true" />
    </span>
  );
}

function CompactSelect({
  id,
  name,
  value,
  placeholder,
  options,
  error,
  describedBy,
  valid,
  onChange,
  onTouched,
}: CompactSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = `${id}-listbox`;
  const selectedIndex = options.indexOf(value);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
        onTouched(value);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [isOpen, onTouched, value]);

  function openMenu() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  }

  function selectOption(index: number) {
    const option = options[index];
    if (!option) return;

    onChange(option);
    onTouched(option);
    setActiveIndex(index);
    setIsOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) openMenu();
        else setActiveIndex((index) => (index + 1) % options.length);
        break;

      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) openMenu();
        else
          setActiveIndex(
            (index) => (index - 1 + options.length) % options.length,
          );
        break;

      case "Home":
        event.preventDefault();
        if (!isOpen) setIsOpen(true);
        setActiveIndex(0);
        break;

      case "End":
        event.preventDefault();
        if (!isOpen) setIsOpen(true);
        setActiveIndex(options.length - 1);
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) selectOption(activeIndex);
        else openMenu();
        break;

      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        break;

      case "Tab":
        if (isOpen) setIsOpen(false);
        onTouched(value);
        break;
    }
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.selectRoot} ${isOpen ? styles.selectOpen : ""}`}
    >
      <button
        ref={buttonRef}
        id={id}
        name={name}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen ? `${id}-option-${activeIndex}` : undefined
        }
        aria-invalid={Boolean(error)}
        aria-required="true"
        aria-describedby={describedBy}
        value={value}
        className={`${styles.selectButton} ${
          error ? styles.invalidControl : ""
        } ${value ? "" : styles.selectPlaceholder}`}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            onTouched(value);
          } else {
            openMenu();
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          const nextFocus = event.relatedTarget;
          if (
            !(nextFocus instanceof Node) ||
            !rootRef.current?.contains(nextFocus)
          ) {
            setIsOpen(false);
            onTouched(value);
          }
        }}
      >
        <span>{value || placeholder}</span>
        <span className={styles.selectStatus} aria-hidden="true">
          <ValidMark visible={valid} />
          <ChevronDown
            className={styles.selectChevron}
            size={17}
            strokeWidth={2}
          />
        </span>
      </button>

      {isOpen && (
        <ul id={listboxId} className={styles.selectMenu} role="listbox">
          {options.map((option, index) => {
            const selected = value === option;
            const active = activeIndex === index;

            return (
              <li role="presentation" key={option}>
                <button
                  id={`${id}-option-${index}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={selected}
                  className={`${styles.selectOption} ${
                    active ? styles.selectOptionActive : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(index)}
                >
                  <span>{option}</span>
                  {selected && <Check size={15} strokeWidth={2.5} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function LearnerForm() {
  const [values, setValues] = useState<LearnerEnquiryValues>(EMPTY_VALUES);
  const [touched, setTouched] = useState<
    Partial<Record<LearnerField, boolean>>
  >({});
  const [errors, setErrors] = useState<LearnerFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState<SuccessDetails | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (success) successHeadingRef.current?.focus();
  }, [success]);

  function isValid(field: LearnerField) {
    return Boolean(touched[field] && values[field].trim() && !errors[field]);
  }

  function setFieldError(field: LearnerField, error?: string) {
    setErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  }

  function updateField(field: LearnerField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError(false);

    if (touched[field]) {
      setFieldError(field, validateLearnerField(field, value));
    }
  }

  function handleBlur(field: LearnerField, value = values[field]) {
    setTouched((current) => ({ ...current, [field]: true }));
    setFieldError(field, validateLearnerField(field, value));
  }

  function focusFirstInvalid(fieldErrors: LearnerFieldErrors) {
    const firstInvalidField = LEARNER_FIELD_ORDER.find(
      (field) => fieldErrors[field],
    );
    if (!firstInvalidField) return;

    requestAnimationFrame(() => {
      const control = formRef.current?.elements.namedItem(firstInvalidField);
      const focusTarget =
        control instanceof RadioNodeList ? control.item(0) : control;

      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
        focusTarget.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "center",
        });
      }
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    setFormError(false);
    const validation = validateLearnerEnquiry(values);

    if (!validation.success) {
      setTouched(ALL_FIELDS_TOUCHED);
      setErrors(validation.errors);
      focusFirstInvalid(validation.errors);
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    const websiteControl = event.currentTarget.elements.namedItem("website");
    const website =
      websiteControl instanceof HTMLInputElement ? websiteControl.value : "";

    try {
      const response = await fetch("/api/enquiry/learner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, website }),
      });
      const responseBody: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const apiErrors = getApiErrors(responseBody);

        if (apiErrors) {
          setTouched(ALL_FIELDS_TOUCHED);
          setErrors(apiErrors);
          focusFirstInvalid(apiErrors);
        } else {
          setFormError(true);
        }
        return;
      }

      setSuccess({
        name: validation.data.name,
        email: validation.data.email,
      });
    } catch {
      setFormError(true);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setValues(EMPTY_VALUES);
    setTouched({});
    setErrors({});
    setFormError(false);
    setSuccess(null);

    requestAnimationFrame(() => {
      const nameField = formRef.current?.elements.namedItem("name");
      if (nameField instanceof HTMLElement) nameField.focus();
    });
  }

  return (
    <section className={styles.section} aria-labelledby="learner-form-title">
      <div className={styles.layout}>
        <aside className={styles.introPanel}>
          <div className={styles.introIcon} aria-hidden="true">
            <BookOpenCheck size={26} strokeWidth={1.9} />
          </div>

          <div className={styles.eyebrow}>
            <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
            <span>LEARNER ENQUIRY</span>
          </div>

          <h3 id="learner-form-title">Tell us where you want to go next.</h3>
          <p className={styles.introCopy}>
            A few quick details will help us understand your learning goals and
            guide you toward a relevant path.
          </p>

          <div className={styles.trustList} aria-label="Form information">
            <span>
              <ShieldCheck size={17} strokeWidth={1.9} aria-hidden="true" />
              Your details stay private
            </span>
            <span>
              <Target size={17} strokeWidth={1.9} aria-hidden="true" />
              Takes about 2 minutes
            </span>
          </div>

          <div className={styles.introAccent} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </aside>

        {success ? (
          <div className={styles.successPanel} role="status">
            <span className={styles.successIcon} aria-hidden="true">
              <CheckCircle2 size={29} strokeWidth={1.9} />
            </span>
            <p className={styles.successEyebrow}>LEARNER ENQUIRY</p>
            <h4 ref={successHeadingRef} tabIndex={-1}>
              Enquiry received.
            </h4>
            <p className={styles.successCopy}>
              Thanks, {success.name}. We&apos;ve received your learner enquiry
              and sent a confirmation to <strong>{success.email}</strong>. Our
              team will review your details and get back to you.
            </p>

            <div className={styles.successActions}>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle size={18} strokeWidth={1.9} aria-hidden="true" />
                Chat on WhatsApp
              </a>
              <Link href="/courses" className={styles.secondaryAction}>
                Explore Courses
                <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>

            <button
              type="button"
              className={styles.resetButton}
              onClick={resetForm}
            >
              Send another enquiry
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting}
          >
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="learner-website">Leave this field empty</label>
              <input
                id="learner-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <section
              className={styles.formGroup}
              aria-labelledby="learner-about-title"
            >
              <div className={styles.groupHeading}>
                <span aria-hidden="true">
                  <UserRound size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h4 id="learner-about-title">About You</h4>
                  <p>How can we reach you?</p>
                </div>
              </div>

              <div className={styles.fieldsGrid}>
                <div className={styles.field}>
                  <label htmlFor="learner-name">
                    <RequiredLabel>Full Name</RequiredLabel>
                  </label>
                  <div className={styles.controlWrap}>
                    <input
                      id="learner-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      required
                      value={values.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      onBlur={(event) =>
                        handleBlur("name", event.currentTarget.value)
                      }
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? "learner-name-error" : undefined
                      }
                      className={
                        errors.name ? styles.invalidControl : undefined
                      }
                    />
                    <ValidMark visible={isValid("name")} />
                  </div>
                  {errors.name && (
                    <p id="learner-name-error" className={styles.errorText}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="learner-phone">
                    <RequiredLabel>Phone / WhatsApp Number</RequiredLabel>
                  </label>
                  <div
                    className={`${styles.phoneControl} ${
                      errors.phone ? styles.invalidControl : ""
                    }`}
                  >
                    <span className={styles.phonePrefix} aria-hidden="true">
                      <Phone size={15} strokeWidth={1.8} />
                      +91
                    </span>
                    <input
                      id="learner-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      required
                      value={values.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      onBlur={(event) =>
                        handleBlur("phone", event.currentTarget.value)
                      }
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone
                          ? "learner-phone-error"
                          : "learner-phone-help"
                      }
                    />
                    <ValidMark visible={isValid("phone")} />
                  </div>
                  {errors.phone ? (
                    <p id="learner-phone-error" className={styles.errorText}>
                      {errors.phone}
                    </p>
                  ) : (
                    <p id="learner-phone-help" className={styles.helperText}>
                      10 digits without +91
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="learner-email">
                    <RequiredLabel>Email Address</RequiredLabel>
                  </label>
                  <div className={styles.controlWrap}>
                    <Mail
                      className={styles.leadingIcon}
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <input
                      id="learner-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      required
                      value={values.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      onBlur={(event) =>
                        handleBlur("email", event.currentTarget.value)
                      }
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "learner-email-error" : undefined
                      }
                      className={`${styles.withLeadingIcon} ${
                        errors.email ? styles.invalidControl : ""
                      }`}
                    />
                    <ValidMark visible={isValid("email")} />
                  </div>
                  {errors.email && (
                    <p id="learner-email-error" className={styles.errorText}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="learner-stage">
                    <RequiredLabel>Current Stage</RequiredLabel>
                  </label>
                  <CompactSelect
                    id="learner-stage"
                    name="stage"
                    value={values.stage}
                    placeholder="Select your current stage"
                    options={LEARNER_STAGES}
                    error={errors.stage}
                    describedBy={
                      errors.stage ? "learner-stage-error" : undefined
                    }
                    valid={isValid("stage")}
                    onChange={(value) => updateField("stage", value)}
                    onTouched={(value) => handleBlur("stage", value)}
                  />
                  {errors.stage && (
                    <p id="learner-stage-error" className={styles.errorText}>
                      {errors.stage}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className={styles.groupDivider} />

            <section
              className={styles.formGroup}
              aria-labelledby="learner-preferences-title"
            >
              <div className={styles.groupHeading}>
                <span className={styles.violetHeadingIcon} aria-hidden="true">
                  <GraduationCap size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h4 id="learner-preferences-title">Learning Preferences</h4>
                  <p>Choose what fits you best.</p>
                </div>
              </div>

              <fieldset
                className={styles.choiceGroup}
                aria-invalid={Boolean(errors.program)}
                aria-describedby={
                  errors.program ? "learner-program-error" : undefined
                }
                onBlur={() => handleBlur("program")}
              >
                <legend>
                  <RequiredLabel>Interested Program</RequiredLabel>
                  <ValidMark visible={isValid("program")} />
                </legend>
                <div className={styles.programGrid}>
                  {LEARNER_PROGRAMS.map((program) => {
                    const Icon = programDetails[program];
                    const selected = values.program === program;

                    return (
                      <label
                        className={`${styles.choiceCard} ${
                          styles.programCard
                        } ${selected ? styles.choiceSelected : ""}`}
                        key={program}
                      >
                        <input
                          className={styles.radioInput}
                          type="radio"
                          name="program"
                          value={program}
                          required
                          checked={selected}
                          onChange={(event) =>
                            updateField("program", event.target.value)
                          }
                          aria-describedby={
                            errors.program ? "learner-program-error" : undefined
                          }
                        />
                        <span className={styles.choiceIcon} aria-hidden="true">
                          <Icon size={17} strokeWidth={1.85} />
                        </span>
                        <span className={styles.choiceCopy}>
                          <strong>{program}</strong>
                        </span>
                        <span className={styles.radioMark} aria-hidden="true">
                          {selected && <Check size={12} strokeWidth={2.8} />}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.program && (
                  <p id="learner-program-error" className={styles.errorText}>
                    {errors.program}
                  </p>
                )}
              </fieldset>

              <div className={`${styles.field} ${styles.experienceField}`}>
                <label htmlFor="learner-experience">
                  <RequiredLabel>Current Experience</RequiredLabel>
                </label>
                <CompactSelect
                  id="learner-experience"
                  name="experience"
                  value={values.experience}
                  placeholder="Select your experience"
                  options={LEARNER_EXPERIENCE_LEVELS}
                  error={errors.experience}
                  describedBy={
                    errors.experience ? "learner-experience-error" : undefined
                  }
                  valid={isValid("experience")}
                  onChange={(value) => updateField("experience", value)}
                  onTouched={(value) => handleBlur("experience", value)}
                />
                {errors.experience && (
                  <p id="learner-experience-error" className={styles.errorText}>
                    {errors.experience}
                  </p>
                )}
              </div>

              <fieldset
                className={styles.choiceGroup}
                aria-invalid={Boolean(errors.primaryGoal)}
                aria-describedby={
                  errors.primaryGoal ? "learner-goal-error" : undefined
                }
                onBlur={() => handleBlur("primaryGoal")}
              >
                <legend>
                  <RequiredLabel>Primary Goal</RequiredLabel>
                  <ValidMark visible={isValid("primaryGoal")} />
                </legend>
                <div className={styles.goalGrid}>
                  {LEARNER_PRIMARY_GOALS.map((goal) => {
                    const detail = goalDetails[goal];
                    const Icon = detail.icon;
                    const selected = values.primaryGoal === goal;

                    return (
                      <label
                        className={`${styles.choiceCard} ${styles.goalCard} ${
                          detail.tone
                        } ${selected ? styles.choiceSelected : ""}`}
                        key={goal}
                      >
                        <input
                          className={styles.radioInput}
                          type="radio"
                          name="primaryGoal"
                          value={goal}
                          required
                          checked={selected}
                          onChange={(event) =>
                            updateField("primaryGoal", event.target.value)
                          }
                          aria-describedby={
                            errors.primaryGoal
                              ? "learner-goal-error"
                              : undefined
                          }
                        />
                        <span className={styles.choiceIcon} aria-hidden="true">
                          <Icon size={16} strokeWidth={1.9} />
                        </span>
                        <span className={styles.choiceCopy}>
                          <strong>{goal}</strong>
                        </span>
                        <span className={styles.radioMark} aria-hidden="true">
                          {selected && <Check size={12} strokeWidth={2.8} />}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.primaryGoal && (
                  <p id="learner-goal-error" className={styles.errorText}>
                    {errors.primaryGoal}
                  </p>
                )}
              </fieldset>
            </section>

            <div className={styles.groupDivider} />

            <section
              className={styles.formGroup}
              aria-labelledby="learner-message-title"
            >
              <div className={styles.groupHeading}>
                <span className={styles.tealHeadingIcon} aria-hidden="true">
                  <MessageSquareText size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h4 id="learner-message-title">Additional Context</h4>
                  <p>Optional, but useful.</p>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="learner-message">
                  <span className={styles.label}>
                    What would you like help with?
                  </span>
                </label>
                <div className={styles.controlWrap}>
                  <textarea
                    id="learner-message"
                    name="message"
                    rows={4}
                    maxLength={MESSAGE_MAX_LENGTH}
                    placeholder="Tell us what you'd like to learn or build."
                    value={values.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    onBlur={(event) =>
                      handleBlur("message", event.currentTarget.value)
                    }
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby="learner-message-help"
                    className={
                      errors.message ? styles.invalidControl : undefined
                    }
                  />
                  <ValidMark visible={isValid("message")} />
                </div>
                <div id="learner-message-help" className={styles.messageMeta}>
                  <span>
                    {errors.message ?? "Share only what feels relevant."}
                  </span>
                  <span>
                    {values.message.length}/{MESSAGE_MAX_LENGTH}
                  </span>
                </div>
              </div>
            </section>

            {formError && (
              <div className={styles.formError} role="alert">
                <span aria-hidden="true">!</span>
                <p>
                  We couldn&apos;t send your enquiry right now. Please try again
                  or{" "}
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                    contact us on WhatsApp
                  </a>
                  .
                </p>
              </div>
            )}

            <div className={styles.submitArea}>
              <div className={styles.submitNote}>
                <ShieldCheck size={17} strokeWidth={1.9} aria-hidden="true" />
                <span>Your details are used only for this enquiry.</span>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle
                    className={styles.spinner}
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : (
                  <Send size={17} strokeWidth={1.9} aria-hidden="true" />
                )}
                <span>
                  {isSubmitting ? "Sending Enquiry..." : "Send Learner Enquiry"}
                </span>
                {!isSubmitting && (
                  <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
