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
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Handshake,
  Lightbulb,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Phone,
  Presentation,
  School2,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";

import {
  INSTITUTION_FIELD_ORDER,
  INSTITUTION_INTERESTS,
  INSTITUTION_STUDENT_COUNTS,
  INSTITUTION_STUDENT_GROUPS,
  INSTITUTION_TIMEFRAMES,
  INSTITUTION_TYPES,
  MESSAGE_MAX_LENGTH,
  type InstitutionEnquiryValues,
  type InstitutionField,
  type InstitutionFieldErrors,
  type InstitutionInterest,
  validateInstitutionEnquiry,
  validateInstitutionField,
} from "@/lib/enquiry/institution-validation";

import styles from "./institution-form.module.css";

const WHATSAPP_URL = "https://wa.me/919904425105";

const EMPTY_VALUES: InstitutionEnquiryValues = {
  institutionName: "",
  institutionType: "",
  contactName: "",
  designation: "",
  phone: "",
  email: "",
  city: "",
  studentGroup: "",
  studentCount: "",
  timeframe: "",
  interests: [],
  message: "",
};

const ALL_FIELDS_TOUCHED = INSTITUTION_FIELD_ORDER.reduce<
  Partial<Record<InstitutionField, boolean>>
>((result, field) => {
  result[field] = true;
  return result;
}, {});

const interestDetails = {
  "AI & Coding Career Awareness Session": {
    icon: Lightbulb,
    tone: styles.interestOrange,
  },
  "Technology / Career Seminar": {
    icon: Presentation,
    tone: styles.interestCyan,
  },
  "Practical Workshop": { icon: Wrench, tone: styles.interestViolet },
  "Student Skill Development Program": {
    icon: GraduationCap,
    tone: styles.interestTeal,
  },
  "Institutional Collaboration": {
    icon: Handshake,
    tone: styles.interestPurple,
  },
  "Discuss Opportunities": {
    icon: MessageCircle,
    tone: styles.interestBlue,
  },
} as const;

type SuccessDetails = {
  contactName: string;
  institutionName: string;
  email: string;
};

type SelectField =
  | "institutionType"
  | "studentGroup"
  | "studentCount"
  | "timeframe";

type CompactSelectProps = {
  id: string;
  name: SelectField;
  value: string;
  placeholder: string;
  options: readonly string[];
  error?: string;
  describedBy?: string;
  valid: boolean;
  onChange: (value: string) => void;
  onTouched: (value: string) => void;
};

function getApiErrors(value: unknown): InstitutionFieldErrors | undefined {
  if (typeof value !== "object" || value === null) return undefined;

  const possibleErrors = (value as Record<string, unknown>).errors;
  if (typeof possibleErrors !== "object" || possibleErrors === null) {
    return undefined;
  }

  const source = possibleErrors as Record<string, unknown>;
  const errors: InstitutionFieldErrors = {};

  for (const field of INSTITUTION_FIELD_ORDER) {
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

function sanitizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length > 10 && digits.startsWith("91")) {
    return digits.slice(2, 12);
  }

  return digits.slice(0, 10);
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

export function InstitutionForm() {
  const [values, setValues] = useState<InstitutionEnquiryValues>(EMPTY_VALUES);
  const [touched, setTouched] = useState<
    Partial<Record<InstitutionField, boolean>>
  >({});
  const [errors, setErrors] = useState<InstitutionFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState<SuccessDetails | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (success) successHeadingRef.current?.focus();
  }, [success]);

  function isValid(field: InstitutionField) {
    const value = values[field];
    const hasValue = Array.isArray(value)
      ? value.length > 0
      : Boolean(value.trim());
    return Boolean(touched[field] && hasValue && !errors[field]);
  }

  function setFieldError(field: InstitutionField, error?: string) {
    setErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  }

  function updateField(
    field: Exclude<InstitutionField, "interests">,
    value: string,
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError(false);

    if (touched[field]) {
      setFieldError(field, validateInstitutionField(field, value));
    }
  }

  function updateInterest(interest: InstitutionInterest, checked: boolean) {
    const nextInterests = checked
      ? [...values.interests, interest]
      : values.interests.filter((current) => current !== interest);

    setValues((current) => ({ ...current, interests: nextInterests }));
    setFormError(false);

    if (touched.interests) {
      setFieldError(
        "interests",
        validateInstitutionField("interests", nextInterests),
      );
    }
  }

  function handleBlur(
    field: InstitutionField,
    value: string | readonly string[] = values[field],
  ) {
    setTouched((current) => ({ ...current, [field]: true }));
    setFieldError(field, validateInstitutionField(field, value));
  }

  function focusFirstInvalid(fieldErrors: InstitutionFieldErrors) {
    const firstInvalidField = INSTITUTION_FIELD_ORDER.find(
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
    const validation = validateInstitutionEnquiry(values);

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
      const response = await fetch("/api/enquiry/institution", {
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
        contactName: validation.data.contactName,
        institutionName: validation.data.institutionName,
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
      const institutionNameField =
        formRef.current?.elements.namedItem("institutionName");
      if (institutionNameField instanceof HTMLElement) {
        institutionNameField.focus();
      }
    });
  }

  return (
    <section
      className={styles.section}
      aria-labelledby="institution-form-title"
    >
      <div className={styles.layout}>
        <aside className={styles.introPanel}>
          <div className={styles.introIcon} aria-hidden="true">
            <School2 size={27} strokeWidth={1.85} />
          </div>

          <div className={styles.eyebrow}>
            <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
            <span>INSTITUTION ENQUIRY</span>
          </div>

          <h3 id="institution-form-title">
            Let&apos;s create something meaningful for your students.
          </h3>
          <p className={styles.introCopy}>
            Tell us about your institution, students, and the kind of learning
            experience you&apos;re planning. We&apos;ll use these details to
            understand your requirement and discuss the most suitable way
            forward.
          </p>

          <div className={styles.trustList} aria-label="Form information">
            <span>
              <MessageCircle size={17} strokeWidth={1.9} aria-hidden="true" />
              Clear discussion before anything is decided
            </span>
            <span>
              <ShieldCheck size={17} strokeWidth={1.9} aria-hidden="true" />
              Your details are used only for this enquiry
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
            <p className={styles.successEyebrow}>INSTITUTION ENQUIRY</p>
            <h4 ref={successHeadingRef} tabIndex={-1}>
              Institution enquiry received.
            </h4>
            <p className={styles.successCopy}>
              Thanks, {success.contactName}. We&apos;ve received the enquiry
              from {success.institutionName} and sent a confirmation to{" "}
              <strong>{success.email}</strong>. Our team will review the details
              and get back to you.
            </p>

            <div className={styles.successActions}>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle size={18} strokeWidth={1.9} aria-hidden="true" />
                Chat on WhatsApp
              </a>
              <Link
                href="/courses#explore-programs"
                className={styles.secondaryAction}
              >
                Explore Programs
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
              <label htmlFor="institution-website">
                Leave this field empty
              </label>
              <input
                id="institution-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <section
              className={styles.formGroup}
              aria-labelledby="institution-details-title"
            >
              <div className={styles.groupHeading}>
                <span aria-hidden="true">
                  <Building2 size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h4 id="institution-details-title">Institution Details</h4>
                  <p>Tell us who you represent.</p>
                </div>
              </div>

              <div className={styles.fieldsGrid}>
                <div className={styles.field}>
                  <label htmlFor="institution-name">
                    <RequiredLabel>School / Institute Name</RequiredLabel>
                  </label>
                  <div className={styles.controlWrap}>
                    <input
                      id="institution-name"
                      name="institutionName"
                      type="text"
                      autoComplete="organization"
                      placeholder="Enter institution name"
                      maxLength={120}
                      required
                      value={values.institutionName}
                      onChange={(event) =>
                        updateField("institutionName", event.target.value)
                      }
                      onBlur={(event) =>
                        handleBlur("institutionName", event.currentTarget.value)
                      }
                      aria-invalid={Boolean(errors.institutionName)}
                      aria-describedby={
                        errors.institutionName
                          ? "institution-name-error"
                          : undefined
                      }
                      className={
                        errors.institutionName
                          ? styles.invalidControl
                          : undefined
                      }
                    />
                    <ValidMark visible={isValid("institutionName")} />
                  </div>
                  {errors.institutionName && (
                    <p id="institution-name-error" className={styles.errorText}>
                      {errors.institutionName}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution-type">
                    <RequiredLabel>Institution Type</RequiredLabel>
                  </label>
                  <CompactSelect
                    id="institution-type"
                    name="institutionType"
                    value={values.institutionType}
                    placeholder="Select institution type"
                    options={INSTITUTION_TYPES}
                    error={errors.institutionType}
                    describedBy={
                      errors.institutionType
                        ? "institution-type-error"
                        : undefined
                    }
                    valid={isValid("institutionType")}
                    onChange={(value) => updateField("institutionType", value)}
                    onTouched={(value) => handleBlur("institutionType", value)}
                  />
                  {errors.institutionType && (
                    <p id="institution-type-error" className={styles.errorText}>
                      {errors.institutionType}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution-contact-name">
                    <RequiredLabel>Contact Person Name</RequiredLabel>
                  </label>
                  <div className={styles.controlWrap}>
                    <UserRound
                      className={styles.leadingIcon}
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <input
                      id="institution-contact-name"
                      name="contactName"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter contact person's name"
                      maxLength={80}
                      required
                      value={values.contactName}
                      onChange={(event) =>
                        updateField("contactName", event.target.value)
                      }
                      onBlur={(event) =>
                        handleBlur("contactName", event.currentTarget.value)
                      }
                      aria-invalid={Boolean(errors.contactName)}
                      aria-describedby={
                        errors.contactName
                          ? "institution-contact-name-error"
                          : undefined
                      }
                      className={`${styles.withLeadingIcon} ${
                        errors.contactName ? styles.invalidControl : ""
                      }`}
                    />
                    <ValidMark visible={isValid("contactName")} />
                  </div>
                  {errors.contactName && (
                    <p
                      id="institution-contact-name-error"
                      className={styles.errorText}
                    >
                      {errors.contactName}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution-designation">
                    <RequiredLabel>Designation / Role</RequiredLabel>
                  </label>
                  <div className={styles.controlWrap}>
                    <input
                      id="institution-designation"
                      name="designation"
                      type="text"
                      autoComplete="organization-title"
                      placeholder="Principal, Director, Coordinator..."
                      maxLength={80}
                      required
                      value={values.designation}
                      onChange={(event) =>
                        updateField("designation", event.target.value)
                      }
                      onBlur={(event) =>
                        handleBlur("designation", event.currentTarget.value)
                      }
                      aria-invalid={Boolean(errors.designation)}
                      aria-describedby={
                        errors.designation
                          ? "institution-designation-error"
                          : undefined
                      }
                      className={
                        errors.designation ? styles.invalidControl : undefined
                      }
                    />
                    <ValidMark visible={isValid("designation")} />
                  </div>
                  {errors.designation && (
                    <p
                      id="institution-designation-error"
                      className={styles.errorText}
                    >
                      {errors.designation}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className={styles.groupDivider} />

            <section
              className={styles.formGroup}
              aria-labelledby="institution-students-title"
            >
              <div className={styles.groupHeading}>
                <span className={styles.orangeHeadingIcon} aria-hidden="true">
                  <UsersRound size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h4 id="institution-students-title">
                    Students &amp; Contact
                  </h4>
                  <p>The essentials for a useful discussion.</p>
                </div>
              </div>

              <div className={styles.fieldsGrid}>
                <div className={styles.field}>
                  <label htmlFor="institution-phone">
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
                      id="institution-phone"
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
                          sanitizeIndianPhone(event.target.value),
                        )
                      }
                      onBlur={(event) =>
                        handleBlur("phone", event.currentTarget.value)
                      }
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone
                          ? "institution-phone-error"
                          : "institution-phone-help"
                      }
                    />
                    <ValidMark visible={isValid("phone")} />
                  </div>
                  {errors.phone ? (
                    <p
                      id="institution-phone-error"
                      className={styles.errorText}
                    >
                      {errors.phone}
                    </p>
                  ) : (
                    <p
                      id="institution-phone-help"
                      className={styles.helperText}
                    >
                      10 digits without +91
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution-email">
                    <RequiredLabel>Official Email</RequiredLabel>
                  </label>
                  <div className={styles.controlWrap}>
                    <Mail
                      className={styles.leadingIcon}
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <input
                      id="institution-email"
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
                        errors.email ? "institution-email-error" : undefined
                      }
                      className={`${styles.withLeadingIcon} ${
                        errors.email ? styles.invalidControl : ""
                      }`}
                    />
                    <ValidMark visible={isValid("email")} />
                  </div>
                  {errors.email && (
                    <p
                      id="institution-email-error"
                      className={styles.errorText}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution-city">
                    <RequiredLabel>City / Location</RequiredLabel>
                  </label>
                  <div className={styles.controlWrap}>
                    <MapPin
                      className={styles.leadingIcon}
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <input
                      id="institution-city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      maxLength={100}
                      required
                      value={values.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                      onBlur={(event) =>
                        handleBlur("city", event.currentTarget.value)
                      }
                      aria-invalid={Boolean(errors.city)}
                      aria-describedby={
                        errors.city ? "institution-city-error" : undefined
                      }
                      className={`${styles.withLeadingIcon} ${
                        errors.city ? styles.invalidControl : ""
                      }`}
                    />
                    <ValidMark visible={isValid("city")} />
                  </div>
                  {errors.city && (
                    <p id="institution-city-error" className={styles.errorText}>
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution-student-group">
                    <RequiredLabel>Student Group / Level</RequiredLabel>
                  </label>
                  <CompactSelect
                    id="institution-student-group"
                    name="studentGroup"
                    value={values.studentGroup}
                    placeholder="Select student group"
                    options={INSTITUTION_STUDENT_GROUPS}
                    error={errors.studentGroup}
                    describedBy={
                      errors.studentGroup
                        ? "institution-student-group-error"
                        : undefined
                    }
                    valid={isValid("studentGroup")}
                    onChange={(value) => updateField("studentGroup", value)}
                    onTouched={(value) => handleBlur("studentGroup", value)}
                  />
                  {errors.studentGroup && (
                    <p
                      id="institution-student-group-error"
                      className={styles.errorText}
                    >
                      {errors.studentGroup}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution-student-count">
                    <RequiredLabel>
                      Approximate Number of Students
                    </RequiredLabel>
                  </label>
                  <CompactSelect
                    id="institution-student-count"
                    name="studentCount"
                    value={values.studentCount}
                    placeholder="Select an approximate range"
                    options={INSTITUTION_STUDENT_COUNTS}
                    error={errors.studentCount}
                    describedBy={
                      errors.studentCount
                        ? "institution-student-count-error"
                        : undefined
                    }
                    valid={isValid("studentCount")}
                    onChange={(value) => updateField("studentCount", value)}
                    onTouched={(value) => handleBlur("studentCount", value)}
                  />
                  {errors.studentCount && (
                    <p
                      id="institution-student-count-error"
                      className={styles.errorText}
                    >
                      {errors.studentCount}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution-timeframe">
                    <RequiredLabel>Preferred Date / Timeframe</RequiredLabel>
                  </label>
                  <CompactSelect
                    id="institution-timeframe"
                    name="timeframe"
                    value={values.timeframe}
                    placeholder="Select a preferred timeframe"
                    options={INSTITUTION_TIMEFRAMES}
                    error={errors.timeframe}
                    describedBy={
                      errors.timeframe
                        ? "institution-timeframe-error"
                        : "institution-timeframe-help"
                    }
                    valid={isValid("timeframe")}
                    onChange={(value) => updateField("timeframe", value)}
                    onTouched={(value) => handleBlur("timeframe", value)}
                  />
                  {errors.timeframe ? (
                    <p
                      id="institution-timeframe-error"
                      className={styles.errorText}
                    >
                      {errors.timeframe}
                    </p>
                  ) : (
                    <p
                      id="institution-timeframe-help"
                      className={styles.helperText}
                    >
                      A preference only—nothing is booked yet.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className={styles.groupDivider} />

            <section
              className={styles.formGroup}
              aria-labelledby="institution-interests-title"
            >
              <div className={styles.groupHeading}>
                <span className={styles.cyanHeadingIcon} aria-hidden="true">
                  <Presentation size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h4 id="institution-interests-title">
                    What You&apos;re Looking For
                  </h4>
                  <p>Select all that feel relevant.</p>
                </div>
              </div>

              <fieldset
                className={styles.choiceGroup}
                aria-invalid={Boolean(errors.interests)}
                aria-describedby={
                  errors.interests ? "institution-interests-error" : undefined
                }
                onBlur={(event) => {
                  const nextFocus = event.relatedTarget;
                  if (
                    !(nextFocus instanceof Node) ||
                    !event.currentTarget.contains(nextFocus)
                  ) {
                    handleBlur("interests");
                  }
                }}
              >
                <legend>
                  <RequiredLabel>Areas of Interest</RequiredLabel>
                  <ValidMark visible={isValid("interests")} />
                </legend>
                <div className={styles.interestGrid}>
                  {INSTITUTION_INTERESTS.map((interest) => {
                    const detail = interestDetails[interest];
                    const Icon = detail.icon;
                    const selected = values.interests.includes(interest);

                    return (
                      <label
                        className={`${styles.choiceCard} ${detail.tone} ${
                          selected ? styles.choiceSelected : ""
                        }`}
                        key={interest}
                      >
                        <input
                          className={styles.checkboxInput}
                          type="checkbox"
                          name="interests"
                          value={interest}
                          checked={selected}
                          onChange={(event) =>
                            updateInterest(interest, event.target.checked)
                          }
                          aria-describedby={
                            errors.interests
                              ? "institution-interests-error"
                              : undefined
                          }
                        />
                        <span className={styles.choiceIcon} aria-hidden="true">
                          <Icon size={17} strokeWidth={1.85} />
                        </span>
                        <span className={styles.choiceCopy}>
                          <strong>{interest}</strong>
                        </span>
                        <span
                          className={styles.checkboxMark}
                          aria-hidden="true"
                        >
                          {selected && <Check size={12} strokeWidth={2.8} />}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p
                    id="institution-interests-error"
                    className={styles.errorText}
                  >
                    {errors.interests}
                  </p>
                )}
              </fieldset>
            </section>

            <div className={styles.groupDivider} />

            <section
              className={styles.formGroup}
              aria-labelledby="institution-message-title"
            >
              <div className={styles.groupHeading}>
                <span className={styles.tealHeadingIcon} aria-hidden="true">
                  <MessageSquareText size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h4 id="institution-message-title">Additional Context</h4>
                  <p>Optional, but useful.</p>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="institution-message">
                  <span className={styles.label}>
                    Tell us what you&apos;re planning
                  </span>
                </label>
                <div className={styles.controlWrap}>
                  <textarea
                    id="institution-message"
                    name="message"
                    rows={4}
                    maxLength={MESSAGE_MAX_LENGTH}
                    placeholder="Share a little about your students, the kind of session you're considering, or anything you'd like us to understand before we connect."
                    value={values.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    onBlur={(event) =>
                      handleBlur("message", event.currentTarget.value)
                    }
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby="institution-message-help"
                    className={
                      errors.message ? styles.invalidControl : undefined
                    }
                  />
                  <ValidMark visible={isValid("message")} />
                </div>
                <div
                  id="institution-message-help"
                  className={styles.messageMeta}
                >
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
                  {isSubmitting
                    ? "Sending Enquiry..."
                    : "Send Institution Enquiry"}
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
