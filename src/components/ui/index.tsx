"use client";
// ─────────────────────────────────────────────────────────────────────────────
// Shared UI primitives — used by both SmartETF and SmartSuper
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { clsx } from "clsx";

// ── cn utility ────────────────────────────────────────────────────────────────
export function cn(...inputs: (string | undefined | null | false)[]) {
  return clsx(inputs);
}

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "secondary", size = "md", loading, children, className, disabled, ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:   "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500",
    secondary: "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
    ghost:     "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
    danger:    "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2", lg: "text-base px-6 py-3" };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: "teal" | "blue" | "amber" | "red" | "purple";
}
export function Card({ children, accent, className, ...props }: CardProps) {
  const accents = {
    teal:   "border-l-4 border-l-teal-500 rounded-r-xl",
    blue:   "border-l-4 border-l-blue-500 rounded-r-xl",
    amber:  "border-l-4 border-l-amber-500 rounded-r-xl",
    red:    "border-l-4 border-l-red-500 rounded-r-xl",
    purple: "border-l-4 border-l-purple-500 rounded-r-xl",
  };
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5 mb-3",
        accent && accents[accent],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mt-5 mb-2 pb-1 border-b border-gray-100 dark:border-gray-800">
      {children}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps { children: React.ReactNode; color?: "green"|"blue"|"amber"|"red"|"purple"|"gray" }
export function Badge({ children, color = "gray" }: BadgeProps) {
  const colors = {
    green:  "bg-teal-50 text-teal-700 border border-teal-200",
    blue:   "bg-blue-50 text-blue-700 border border-blue-200",
    amber:  "bg-amber-50 text-amber-700 border border-amber-200",
    red:    "bg-red-50 text-red-700 border border-red-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    gray:   "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded-md mr-1 mb-1", colors[color])}>
      {children}
    </span>
  );
}

// ── ScoreRing ─────────────────────────────────────────────────────────────────
export function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score / 100);
  const color = score >= 75 ? "#1D9E75" : score >= 50 ? "#EF9F27" : "#E24B4A";

  return (
    <svg width={size} height={size} className="flex-shrink-0" aria-label={`Health score: ${score}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={5} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={fill}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size * 0.25} fontWeight={500} fontFamily="inherit"
      >
        {score}
      </text>
    </svg>
  );
}

// ── MiniBar ───────────────────────────────────────────────────────────────────
export function MiniBar({
  value, max = 100, color = "#1D9E75", height = 5,
}: {
  value: number; max?: number; color?: string; height?: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden" style={{ height }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color, height }} />
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
export function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
      <div className="text-xl font-medium text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

// ── ScoreRow ──────────────────────────────────────────────────────────────────
export function ScoreRow({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? "#1D9E75" : score >= 50 ? "#EF9F27" : "#E24B4A";
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-36 text-xs text-gray-500 flex-shrink-0">{label}</div>
      <MiniBar value={score} color={color} />
      <span className="text-xs font-medium min-w-[24px] text-right" style={{ color }}>{score}</span>
    </div>
  );
}

// ── IssuePill ─────────────────────────────────────────────────────────────────
export function IssuePill({ severity }: { severity: "high"|"medium"|"low" }) {
  const styles = {
    high:   "bg-red-50 text-red-700 border border-red-200",
    medium: "bg-amber-50 text-amber-700 border border-amber-200",
    low:    "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return <span className={cn("text-xs px-2 py-0.5 rounded-md font-medium", styles[severity])}>{severity}</span>;
}

// ── LockOverlay ───────────────────────────────────────────────────────────────
export function LockOverlay({ onUnlock, label = "Subscriber feature" }: { onUnlock: () => void; label?: string }) {
  return (
    <div className="relative mt-2">
      <div className="blur-sm pointer-events-none opacity-40 select-none bg-gray-50 rounded-lg p-4 text-sm text-gray-400 leading-loose dark:bg-gray-800">
        Score: 72/100 ████████ Fee: 88/100 ████████ Div: 68/100 ████████
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <Button variant="primary" size="sm" onClick={onUnlock}>Unlock full access — $19/mo</Button>
      </div>
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export function Input({ label, className, ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <input
        className={cn(
          "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
          "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",
          className
        )}
        {...props}
      />
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}
export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <select
        className={cn(
          "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
          "focus:outline-none focus:ring-2 focus:ring-teal-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────
export function TabBar({
  tabs, active, onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 flex-wrap mb-5">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-colors",
            active === t.id
              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-300 dark:border-gray-600"
              : "text-gray-500 hover:text-gray-700 border border-transparent hover:border-gray-200"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
