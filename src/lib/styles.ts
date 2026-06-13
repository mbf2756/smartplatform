// ─────────────────────────────────────────────────────────────────────────────
// SmartETF Design System — inline styles, no Tailwind dependency
// Mirrors SmartSuper AU's visual quality and consistency
// ─────────────────────────────────────────────────────────────────────────────

export const C = {
  // Brand
  teal:       "#1D9E75",
  tealDark:   "#0F6E56",
  tealLight:  "#E1F5EE",
  tealMid:    "#5DCAA5",

  // Semantic
  amber:      "#EF9F27",
  amberLight: "#FAEEDA",
  amberDark:  "#854F0B",
  red:        "#E24B4A",
  redLight:   "#FCEBEB",
  redDark:    "#A32D2D",
  green:      "#639922",
  greenLight: "#EAF3DE",
  greenDark:  "#3B6D11",
  blue:       "#378ADD",
  blueLight:  "#E6F1FB",
  blueDark:   "#185FA5",
  purple:     "#7F77DD",
  purpleLight:"#EEEDFE",
  purpleDark: "#3C3489",

  // Neutrals
  gray50:  "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  // Surfaces
  white:      "#FFFFFF",
  pageBg:     "#F7F8FA",
  cardBg:     "#FFFFFF",
  sidebarBg:  "#0F172A",
  sidebarText:"#94A3B8",
  sidebarActive:"#1D9E75",
};

export const S = {
  // Cards
  card: {
    background: C.white,
    border: `1px solid ${C.gray200}`,
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 16,
  } as React.CSSProperties,

  cardHover: {
    background: C.white,
    border: `1px solid ${C.gray200}`,
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 16,
    transition: "border-color 0.15s, box-shadow 0.15s",
    cursor: "pointer",
  } as React.CSSProperties,

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: C.gray400,
    marginTop: 20,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: `1px solid ${C.gray100}`,
  } as React.CSSProperties,

  // Metric card (stat box)
  metricBox: {
    background: C.gray50,
    borderRadius: 10,
    padding: "14px 16px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  metricValue: {
    fontSize: 22,
    fontWeight: 600,
    color: C.gray900,
    display: "block",
    lineHeight: 1.2,
  } as React.CSSProperties,

  metricLabel: {
    fontSize: 11,
    color: C.gray400,
    marginTop: 3,
    display: "block",
  } as React.CSSProperties,

  // Buttons
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 500,
    color: C.white,
    background: C.teal,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.15s",
    textDecoration: "none",
  } as React.CSSProperties,

  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 500,
    color: C.gray700,
    background: C.white,
    border: `1px solid ${C.gray200}`,
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.15s",
    textDecoration: "none",
  } as React.CSSProperties,

  btnGhost: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 500,
    color: C.gray600,
    background: "transparent",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  } as React.CSSProperties,

  // Input
  input: {
    width: "100%",
    padding: "9px 12px",
    fontSize: 14,
    color: C.gray900,
    background: C.white,
    border: `1px solid ${C.gray300}`,
    borderRadius: 8,
    outline: "none",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  // Badge
  badgeGreen: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 6,
    background: C.greenLight,
    color: C.greenDark,
  } as React.CSSProperties,

  badgeAmber: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 6,
    background: C.amberLight,
    color: C.amberDark,
  } as React.CSSProperties,

  badgeRed: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 6,
    background: C.redLight,
    color: C.redDark,
  } as React.CSSProperties,

  badgeBlue: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 6,
    background: C.blueLight,
    color: C.blueDark,
  } as React.CSSProperties,

  badgeGray: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 6,
    background: C.gray100,
    color: C.gray600,
  } as React.CSSProperties,
};

// Score colour helper
export function scoreColor(s: number): string {
  return s >= 75 ? C.teal : s >= 50 ? C.amber : C.red;
}

// Format AUD
export function fmtAUD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

export function fmtPct(n: number): string {
  return `${(Math.round(n * 10) / 10).toFixed(1)}%`;
}
