"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  LoaderCircle,
  LogOut,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import styles from "./dashboard.module.css";

type AdminLink = {
  id: string;
  title: string;
  url: string;
  category: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type LinkFormData = {
  title: string;
  url: string;
  category: string;
  description: string;
};

const EMPTY_FORM: LinkFormData = {
  title: "",
  url: "",
  category: "",
  description: "",
};

export function AdminLinksDashboard() {
  const [links, setLinks] = useState<AdminLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<AdminLink | null>(null);

  const [formData, setFormData] = useState<LinkFormData>(EMPTY_FORM);

  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminLink | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formDialogRef = useRef<HTMLElement>(null);
  const formFirstFieldRef = useRef<HTMLInputElement>(null);
  const deleteDialogRef = useRef<HTMLElement>(null);
  const deleteCancelRef = useRef<HTMLButtonElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const formTriggerRef = useRef<HTMLElement | null>(null);
  const deleteTriggerRef = useRef<HTMLElement | null>(null);
  const isSavingRef = useRef(false);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    void loadLinks();
  }, []);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    isDeletingRef.current = isDeleting;
  }, [isDeleting]);

  useEffect(() => {
    const dialog = isFormOpen
      ? formDialogRef.current
      : deleteTarget
        ? deleteDialogRef.current
        : null;

    if (!dialog) {
      return;
    }

    const activeDialog = dialog;

    const restoreTarget = isFormOpen
      ? formTriggerRef.current
      : deleteTriggerRef.current;
    const fallbackRestoreTarget = addButtonRef.current;
    const initialTarget = isFormOpen
      ? formFirstFieldRef.current
      : deleteCancelRef.current;

    initialTarget?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isFormOpen && !isSavingRef.current) {
          event.preventDefault();
          setIsFormOpen(false);
          setEditingLink(null);
          setFormData(EMPTY_FORM);
          setFormError("");
        } else if (deleteTarget && !isDeletingRef.current) {
          event.preventDefault();
          setDeleteTarget(null);
        }

        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        activeDialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        activeDialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      const focusTarget = restoreTarget?.isConnected
        ? restoreTarget
        : fallbackRestoreTarget;

      focusTarget?.focus();
    };
  }, [isFormOpen, deleteTarget]);

  async function loadLinks() {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch("/api/admin/links", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        setLoadError(
          typeof result.error === "string"
            ? result.error
            : "Unable to load links.",
        );

        return;
      }

      setLinks(Array.isArray(result.links) ? result.links : []);
    } catch {
      setLoadError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const categories = useMemo(() => {
    const values = new Set<string>();

    links.forEach((link) => {
      const category = link.category?.trim();

      if (category) {
        values.add(category);
      }
    });

    return ["All", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [links]);

  const filteredLinks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return links.filter((link) => {
      const matchesCategory =
        activeCategory === "All" || link.category === activeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        link.title,
        link.url,
        link.category ?? "",
        link.description ?? "",
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [links, searchQuery, activeCategory]);

  function openAddForm() {
    formTriggerRef.current = document.activeElement as HTMLElement | null;
    setEditingLink(null);
    setFormData(EMPTY_FORM);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditForm(link: AdminLink) {
    formTriggerRef.current = document.activeElement as HTMLElement | null;
    setEditingLink(link);

    setFormData({
      title: link.title,
      url: link.url,
      category: link.category ?? "",
      description: link.description ?? "",
    });

    setFormError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingLink(null);
    setFormData(EMPTY_FORM);
    setFormError("");
  }

  function openDeleteDialog(link: AdminLink) {
    deleteTriggerRef.current = document.activeElement as HTMLElement | null;
    setDeleteTarget(link);
  }

  async function handleSaveLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setFormError("");

    const endpoint = editingLink
      ? `/api/admin/links/${editingLink.id}`
      : "/api/admin/links";

    const method = editingLink ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "same-origin",

        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          category: formData.category,
          description: formData.description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(
          typeof result.error === "string"
            ? result.error
            : "Unable to save the link.",
        );

        return;
      }

      const savedLink = result.link as AdminLink;

      if (editingLink) {
        setLinks((currentLinks) =>
          currentLinks.map((link) =>
            link.id === savedLink.id ? savedLink : link,
          ),
        );
      } else {
        setLinks((currentLinks) => [savedLink, ...currentLinks]);
      }

      setIsFormOpen(false);
      setEditingLink(null);
      setFormData(EMPTY_FORM);
      setFormError("");
    } catch {
      setFormError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteLink() {
    if (!deleteTarget || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/links/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      const result = await response.json();

      if (!response.ok) {
        window.alert(
          typeof result.error === "string"
            ? result.error
            : "Unable to delete the link.",
        );

        return;
      }

      setLinks((currentLinks) =>
        currentLinks.filter((link) => link.id !== deleteTarget.id),
      );

      setDeleteTarget(null);
    } catch {
      window.alert("Unable to connect to the server. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCopyLink(link: AdminLink) {
    try {
      await navigator.clipboard.writeText(link.url);

      setCopiedId(link.id);

      window.setTimeout(() => {
        setCopiedId((currentId) => (currentId === link.id ? null : currentId));
      }, 1800);
    } catch {
      window.alert("Unable to copy the link to your clipboard.");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div
        className={styles.shell}
        inert={isFormOpen || deleteTarget !== null ? true : undefined}
      >
        <header className={styles.header}>
          <div className={styles.brandArea}>
            <div className={styles.brandMark} aria-hidden="true">
              <Link2 size={21} strokeWidth={1.9} />
            </div>

            <div>
              <p className={styles.brand}>
                AI <span>&amp;</span> Coding
              </p>

              <p className={styles.adminLabel}>Admin Dashboard</p>
            </div>
          </div>

          <form action="/api/admin/logout" method="POST">
            <button type="submit" className={styles.logoutButton}>
              <LogOut size={16} strokeWidth={1.9} aria-hidden="true" />

              <span>Logout</span>
            </button>
          </form>
        </header>

        <section className={styles.hero}>
          <div>
            <div className={styles.secureLabel}>
              <ShieldCheck size={15} strokeWidth={1.9} aria-hidden="true" />
              SECURE LINK MANAGEMENT
            </div>

            <h1>Manage Your Links</h1>

            <p>
              Add and organize forms, resources, registrations, documents, and
              other important links from one place.
            </p>
          </div>

          <button
            ref={addButtonRef}
            type="button"
            className={styles.addButton}
            onClick={openAddForm}
          >
            <Plus size={18} strokeWidth={2} aria-hidden="true" />
            Add New Link
          </button>
        </section>

        <section className={styles.controls} aria-label="Link filters">
          <div className={styles.searchWrapper}>
            <Search size={18} strokeWidth={1.8} aria-hidden="true" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search links..."
              aria-label="Search links"
            />
          </div>

          <div
            className={styles.categoryList}
            aria-label="Filter links by category"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? `${styles.categoryButton} ${styles.categoryButtonActive}`
                    : styles.categoryButton
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {isLoading && (
          <section className={styles.stateCard} aria-live="polite">
            <LoaderCircle
              className={styles.spinner}
              size={27}
              aria-hidden="true"
            />

            <h2>Loading links</h2>

            <p>Fetching your saved resources.</p>
          </section>
        )}

        {!isLoading && loadError && (
          <section className={styles.stateCard}>
            <h2>Unable to load links</h2>

            <p>{loadError}</p>

            <button
              type="button"
              className={styles.retryButton}
              onClick={() => void loadLinks()}
            >
              Try Again
            </button>
          </section>
        )}

        {!isLoading && !loadError && links.length === 0 && (
          <section className={styles.stateCard}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <Link2 size={26} strokeWidth={1.7} />
            </div>

            <h2>No links yet</h2>

            <p>Add your first form, document, resource, or important link.</p>

            <button
              type="button"
              className={styles.emptyAddButton}
              onClick={openAddForm}
            >
              <Plus size={17} strokeWidth={2} aria-hidden="true" />
              Add First Link
            </button>
          </section>
        )}

        {!isLoading &&
          !loadError &&
          links.length > 0 &&
          filteredLinks.length === 0 && (
            <section className={styles.stateCard}>
              <Search size={26} strokeWidth={1.7} aria-hidden="true" />

              <h2>No matching links</h2>

              <p>Try a different search term or category.</p>
            </section>
          )}

        {!isLoading && !loadError && filteredLinks.length > 0 && (
          <section className={styles.linkGrid} aria-label="Saved links">
            {filteredLinks.map((link) => (
              <article key={link.id} className={styles.linkCard}>
                <div className={styles.cardTop}>
                  <div className={styles.linkIcon} aria-hidden="true">
                    <Link2 size={19} strokeWidth={1.8} />
                  </div>

                  {link.category && (
                    <span className={styles.categoryBadge}>
                      {link.category}
                    </span>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <h2>{link.title}</h2>

                  {link.description && (
                    <p className={styles.description}>{link.description}</p>
                  )}

                  <p className={styles.url}>{link.url}</p>
                </div>

                <div className={styles.cardActions}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primaryAction}
                  >
                    <ExternalLink
                      size={15}
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    Open
                  </a>

                  <button
                    type="button"
                    onClick={() => void handleCopyLink(link)}
                    className={styles.secondaryAction}
                  >
                    {copiedId === link.id ? (
                      <Check size={15} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Copy size={15} strokeWidth={1.9} aria-hidden="true" />
                    )}

                    {copiedId === link.id ? "Copied" : "Copy"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditForm(link)}
                    className={styles.secondaryAction}
                  >
                    <Pencil size={15} strokeWidth={1.9} aria-hidden="true" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => openDeleteDialog(link)}
                    className={styles.deleteAction}
                  >
                    <Trash2 size={15} strokeWidth={1.9} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {isFormOpen && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            ref={formDialogRef}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="link-form-title"
            tabIndex={-1}
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalEyebrow}>
                  {editingLink ? "EDIT LINK" : "NEW LINK"}
                </span>

                <h2 id="link-form-title">
                  {editingLink ? "Update Link" : "Add New Link"}
                </h2>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeForm}
                disabled={isSaving}
                aria-label="Close link form"
              >
                <X size={20} strokeWidth={1.9} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className={styles.linkForm}>
              <div className={styles.formField}>
                <label htmlFor="link-title">
                  Link Title
                  <span aria-hidden="true">*</span>
                </label>

                <input
                  ref={formFirstFieldRef}
                  id="link-title"
                  type="text"
                  required
                  maxLength={120}
                  autoFocus
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Student Admission Form"
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="link-url">
                  Destination URL
                  <span aria-hidden="true">*</span>
                </label>

                <input
                  id="link-url"
                  type="url"
                  required
                  maxLength={2048}
                  value={formData.url}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      url: event.target.value,
                    }))
                  }
                  placeholder="https://forms.google.com/..."
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="link-category">
                  Category
                  <small>Optional</small>
                </label>

                <input
                  id="link-category"
                  type="text"
                  maxLength={80}
                  value={formData.category}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  placeholder="Admissions"
                  disabled={isSaving}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="link-description">
                  Description
                  <small>Optional</small>
                </label>

                <textarea
                  id="link-description"
                  maxLength={500}
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Add a short description..."
                  disabled={isSaving}
                />

                <span className={styles.characterCount}>
                  {formData.description.length}/500
                </span>
              </div>

              {formError && (
                <p className={styles.formError} role="alert">
                  {formError}
                </p>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeForm}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isSaving}
                >
                  {isSaving && (
                    <LoaderCircle
                      size={17}
                      className={styles.spinner}
                      aria-hidden="true"
                    />
                  )}

                  {isSaving
                    ? "Saving..."
                    : editingLink
                      ? "Save Changes"
                      : "Add Link"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            ref={deleteDialogRef}
            className={styles.deleteDialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-link-title"
            aria-describedby="delete-link-description"
            tabIndex={-1}
          >
            <div className={styles.deleteIcon} aria-hidden="true">
              <Trash2 size={23} strokeWidth={1.8} />
            </div>

            <h2 id="delete-link-title">Delete this link?</h2>

            <p id="delete-link-description">
              <strong>{deleteTarget.title}</strong> will be permanently removed
              from your dashboard.
            </p>

            <div className={styles.deleteDialogActions}>
              <button
                ref={deleteCancelRef}
                type="button"
                className={styles.cancelButton}
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.confirmDeleteButton}
                onClick={() => void handleDeleteLink()}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Link"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
