/**
 * Safari Lab - layout & UI primitives (Bible 1.2).
 * These are shared, doctrine-consistent building blocks. No page-specific
 * layout hacks in v1 - compose these instead.
 */
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  ReactNode,
} from 'react';
import Link from 'next/link';
import styles from './primitives.module.css';

function cx(...parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/* --- Shell --- */
export function Shell({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.shell, className)} {...rest}>
      {children}
    </div>
  );
}

/* --- Section --- */
export function Section({
  tight,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & { tight?: boolean }) {
  return (
    <section
      className={cx(styles.section, tight && styles.sectionTight, className)}
      {...rest}
    >
      {children}
    </section>
  );
}

/* --- Grid --- */
export function Grid({
  cols = 3,
  className,
  children,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { cols?: number }) {
  return (
    <div
      className={cx(styles.grid, className)}
      style={{ ...style, ['--cols' as string]: cols }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* --- Card --- */
export function Card({
  interactive,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cx(
        styles.card,
        interactive && styles.cardInteractive,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* --- Panel --- */
export function Panel({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.panel, className)} {...rest}>
      {children}
    </div>
  );
}

/* --- Button (renders <button> or <a>) --- */
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
// CSS-module lookups are `string | undefined` under noUncheckedIndexedAccess;
// cx() tolerates undefined, so the maps carry that type through.
const variantClass: Record<ButtonVariant, string | undefined> = {
  primary: styles.btnPrimary,
  secondary: styles.btnSecondary,
  ghost: styles.btnGhost,
};

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cx(styles.btn, variantClass[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant }) {
  return (
    <a className={cx(styles.btn, variantClass[variant], className)} {...rest}>
      {children}
    </a>
  );
}

/** Internal navigation styled as a button (client-side routing via next/link). */
export function LinkButton({
  variant = 'primary',
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link className={cx(styles.btn, variantClass[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

/* --- Button group --- */
export function ButtonGroup({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.btnGroup, className)} {...rest}>
      {children}
    </div>
  );
}

/* --- Pill --- */
export function Pill({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cx(styles.pill, className)} {...rest}>
      {children}
    </span>
  );
}

/* --- Badge --- */
type BadgeTone = 'gold' | 'olive' | 'copper';
const badgeTone: Record<BadgeTone, string | undefined> = {
  gold: styles.badgeGold,
  olive: styles.badgeOlive,
  copper: styles.badgeCopper,
};

export function Badge({
  tone = 'gold',
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span className={cx(styles.badge, badgeTone[tone], className)} {...rest}>
      {children}
    </span>
  );
}

/* --- Field row --- */
export function FieldRow({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.fieldRow}>
      <label className={styles.fieldLabel} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <span className={styles.fieldHint}>{hint}</span> : null}
    </div>
  );
}
