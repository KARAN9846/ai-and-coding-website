"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";

import styles from "./navbar.module.css";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Why Us", href: "/why-us" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`${styles.header} ${
        isScrolled ? styles.scrolled : ""
      } ${isMenuOpen ? styles.menuOpen : ""}`}
    >
      <nav className={styles.navbar} aria-label="Main navigation">
        <div className={styles.container}>
          {/* Brand */}
          <Link
            href="/"
            className={styles.brand}
            aria-label="AI & Coding home"
            onClick={closeMenu}
          >
            <span className={styles.brandMark} aria-hidden="true">
              <span className={styles.brandMarkCore} />
            </span>

            <span className={styles.brandText}>
              AI <span>&amp;</span> Coding
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNavigation}>
            <div className={styles.navLinks}>
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActiveLink(item.href) ? styles.active : ""
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.themeButton}
                onClick={toggleTheme}
                aria-label={
                  !isMounted || theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
              >
                <Sun
                  className={`${styles.themeIcon} ${styles.sunIcon}`}
                  size={16}
                  strokeWidth={1.8}
                />

                <Moon
                  className={`${styles.themeIcon} ${styles.moonIcon}`}
                  size={16}
                  strokeWidth={1.8}
                />
              </button>

              <a href="#enquiry" className={styles.enquireButton}>
                <span>Enquire Now</span>

                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className={styles.mobileActions}>
            <button
              type="button"
              className={styles.themeButton}
              onClick={toggleTheme}
              aria-label={
                !isMounted || theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              <Sun
                className={`${styles.themeIcon} ${styles.sunIcon}`}
                size={16}
                strokeWidth={1.8}
              />

              <Moon
                className={`${styles.themeIcon} ${styles.moonIcon}`}
                size={16}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
            >
              {isMenuOpen ? (
                <X size={21} strokeWidth={1.8} />
              ) : (
                <Menu size={21} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-navigation"
          className={`${styles.mobileMenu} ${
            isMenuOpen ? styles.mobileMenuOpen : ""
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className={styles.mobileMenuInner}>
            <div className={styles.mobileLinks}>
              {navigation.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`${styles.mobileLink} ${
                    isActiveLink(item.href) ? styles.mobileLinkActive : ""
                  }`}
                  onClick={closeMenu}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 45}ms` : "0ms",
                  }}
                >
                  <span>{item.label}</span>

                  <ArrowRight size={18} strokeWidth={1.7} aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className={styles.mobileMenuFooter}>
              <a
                href="#enquiry"
                className={styles.mobileEnquireButton}
                onClick={closeMenu}
              >
                <span>Enquire Now</span>

                <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
              </a>

              <p>Learn Today. Lead Tomorrow.</p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
