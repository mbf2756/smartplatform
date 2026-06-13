"use client";
import React, { useState } from "react";
import { C, S } from "@/lib/styles";
import { PageHeader, SectionLabel } from "@/components/ui";
import { MODEL_PORTFOLIOS, CATEGORIES, type ModelPortfolio, type PortfolioCategory } from "@/data/portfolioMarketplace";

// ── Sparkline SVG ─────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 32;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 3) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }} role="img" aria-label="12 month growth trend">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round"/>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity={0.1}/>
    </svg>
  );
}

// ── Risk level bars ───────────────────────────────────────────────────────────
function RiskBars({ level, color }: { level: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 5, height: 5 + i * 4, borderRadius: 2,
          background: i <= level ? color : "var(--color-background-secondary)",
        }}/>
      ))}
    </div>
  );
}

// ── Small badge chip ──────────────────────────────────────────────────────────
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4,
      border: `0.5px solid ${C.gray200}`, color: C.gray500, display: "inline-block" }}>
      {children}
    </span>
  );
}

const RISK_LABEL = ["","Very low","Low–med","Medium","High","Very high"];
const RISK_COLOR = (r: number) => r >= 5 ? C.red : r >= 4 ? C.amber : r >= 3 ? C.amberDark : C.teal;

const CAT_DESC: Record<string, string> = {
  growth:   "Target maximum long-run capital appreciation. Best for investors with a 7+ year horizon.",
  balanced: "Blend growth and income for steady returns with lower volatility. Good for medium-term goals.",
  income:   "Prioritise regular distributions without needing to sell holdings.",
  all:      "All 11 model portfolios across growth, balanced, and income.",
};

// ── Summary card (compact) ────────────────────────────────────────────────────
function SummaryCard({
  p, active, onSelect, inCompare, onToggleCompare,
}: {
  p: ModelPortfolio; active: boolean;
  onSelect: () => void;
  inCompare: boolean; onToggleCompare: (e: React.MouseEvent) => void;
}) {
  const rc = RISK_COLOR(p.risk);
  return (
    <div
      onClick={onSelect}
      style={{
        background: "var(--color-background-primary)",
        border: `0.5px solid ${active ? C.teal : C.gray200}`,
        borderRadius: 12, padding: "1.1rem", cursor: "pointer",
        transition: "border-color .15s",
        outline: active ? `2px solid ${C.tealLight}` : "none",
      }}
    >
      {/* Name + dot */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }}/>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.gray900 }}>{p.name}</div>
      </div>
      <div style={{ fontSize: 11, color: C.gray400, marginBottom: 10 }}>{p.tag}</div>

      {/* Key stat */}
      <div style={{ fontSize: 24, fontWeight: 500, color: p.color, lineHeight: 1 }}>
        +{p.returns["5yr"]}%
      </div>
      <div style={{ fontSize: 11, color: C.gray400, marginTop: 2, marginBottom: 10 }}>5yr p.a.</div>

      {/* Chips */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
        {p.chips.slice(0, 2).map(c => <Chip key={c}>{c}</Chip>)}
      </div>

      {/* Risk + MER footer */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 10 }}>
        <RiskBars level={p.risk} color={rc}/>
        <div style={{ fontSize: 11, color: C.gray400 }}>{p.mer}% MER</div>
      </div>

      {/* Compare + holdings count */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 10, borderTop: `0.5px solid ${C.gray100}`,
      }}>
        <span style={{ fontSize: 11, color: C.gray400 }}>{p.holdings.length} ETFs · {p.horizon}</span>
        <button
          onClick={onToggleCompare}
          style={{
            fontSize: 11, padding: "3px 8px", borderRadius: 5,
            border: `0.5px solid ${C.gray200}`, cursor: "pointer",
            background: inCompare ? C.tealLight : "transparent",
            color: inCompare ? C.tealDark : C.gray500,
          }}
        >
          {inCompare ? "✓ Added" : "+ Compare"}
        </button>
      </div>
    </div>
  );
}

// ── Detail panel (expanded) ───────────────────────────────────────────────────
function DetailPanel({ p, onClose }: { p: ModelPortfolio; onClose: () => void }) {
  const rc = RISK_COLOR(p.risk);
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: `0.5px solid ${C.gray200}`, borderRadius: 12, padding: "1.5rem",
      marginBottom: "1.5rem",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: 12, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }}/>
            <span style={{ fontSize: 18, fontWeight: 500, color: C.gray900 }}>{p.name}</span>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4,
              background: C.gray100, color: C.gray500 }}>{p.tag}</span>
          </div>
          <p style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, margin: 0, maxWidth: 500 }}>
            {p.desc}
          </p>
        </div>
        <button onClick={onClose} style={{
          fontSize: 12, padding: "6px 14px", borderRadius: 7,
          border: `0.5px solid ${C.gray200}`, background: "transparent",
          cursor: "pointer", color: C.gray500,
        }}>
          Close ×
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 8, marginBottom: "1.25rem" }}>
        {[
          { v: `+${p.returns["1yr"]}%`, l: "1yr return",  c: C.teal  },
          { v: `+${p.returns["3yr"]}%`, l: "3yr p.a.",    c: C.teal  },
          { v: `+${p.returns["5yr"]}%`, l: "5yr p.a.",    c: C.teal  },
          { v: `${p.mer}%`,             l: "Blended MER", c: p.mer < 0.1 ? C.teal : C.gray700 },
          { v: `${p.yield}%`,           l: "Yield",       c: C.gray900 },
          { v: RISK_LABEL[p.risk],      l: "Risk level",  c: rc       },
          { v: p.horizon,               l: "Min. horizon",c: C.gray900 },
          { v: `$${Math.round(p.mer * 100)}/yr`, l: "Cost on $10K", c: C.gray900 },
        ].map(({ v, l, c }) => (
          <div key={l} style={{ background: C.gray50, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: c, lineHeight: 1.2 }}>{v}</div>
            <div style={{ fontSize: 11, color: C.gray400, marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Holdings */}
      <SectionLabel>ETF holdings breakdown</SectionLabel>
      <div style={{ borderRadius: 8, border: `0.5px solid ${C.gray200}`, overflow: "hidden" }}>
        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 90px 44px 80px",
          gap: 8, padding: "8px 12px", background: C.gray50,
          borderBottom: `0.5px solid ${C.gray200}` }}>
          {["Ticker","Fund","Weight","MER","Asset class"].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 500, color: C.gray400,
              textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</div>
          ))}
        </div>
        {p.holdings.map((h, i) => (
          <div key={h.ticker} style={{
            display: "grid", gridTemplateColumns: "52px 1fr 90px 44px 80px",
            gap: 8, padding: "10px 12px", alignItems: "center",
            borderBottom: i < p.holdings.length - 1 ? `0.5px solid ${C.gray100}` : "none",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.gray900 }}>{h.ticker}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.gray700, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</div>
              <div style={{ fontSize: 11, color: C.gray400, marginTop: 1,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.index}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, height: 4, background: C.gray100, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${h.pct}%`, height: 4, background: p.color, borderRadius: 2 }}/>
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: C.gray900, minWidth: 28 }}>{h.pct}%</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500,
              color: h.mer < 0.1 ? C.teal : h.mer < 0.3 ? C.amberDark : C.red }}>
              {h.mer}%
            </div>
            <div style={{ fontSize: 11, color: C.gray500 }}>{h.asset}</div>
          </div>
        ))}
      </div>

      {/* Pros / cons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <div style={{ background: "#F0FDF8", borderRadius: 8, padding: "1rem" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.tealDark,
            textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
            Strengths
          </div>
          {p.pros.map((pro, i) => (
            <div key={i} style={{ display: "flex", gap: 7, marginBottom: 7 }}>
              <span style={{ color: C.teal, flexShrink: 0, fontSize: 13 }}>✓</span>
              <span style={{ fontSize: 13, color: C.tealDark, lineHeight: 1.5 }}>{pro}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "1rem" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.amberDark,
            textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
            Watch out for
          </div>
          {p.cons.map((con, i) => (
            <div key={i} style={{ display: "flex", gap: 7, marginBottom: 7 }}>
              <span style={{ color: C.amber, flexShrink: 0, fontSize: 13 }}>!</span>
              <span style={{ fontSize: 13, color: C.amberDark, lineHeight: 1.5 }}>{con}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, color: C.gray400, marginTop: 14, lineHeight: 1.6 }}>
        {p.disclaimer}
      </p>
    </div>
  );
}

// ── Compare panel ──────────────────────────────────────────────────────────────
function ComparePanel({ portfolios, onClose }: { portfolios: ModelPortfolio[]; onClose: () => void }) {
  if (portfolios.length < 2) return null;

  const best1   = Math.max(...portfolios.map(p => p.returns["1yr"]));
  const best5   = Math.max(...portfolios.map(p => p.returns["5yr"]));
  const bestMer = Math.min(...portfolios.map(p => p.mer));
  const bestYld = Math.max(...portfolios.map(p => p.yield));

  const rows = [
    { label: "1yr return",    key: "ret1" as const, fmt: (v: number) => `+${v}%`,   best: best1,   invert: false },
    { label: "5yr p.a.",      key: "ret5" as const, fmt: (v: number) => `+${v}%`,   best: best5,   invert: false },
    { label: "Blended MER",   key: "mer"  as const, fmt: (v: number) => `${v}%`,    best: bestMer, invert: true  },
    { label: "Yield",         key: "yld"  as const, fmt: (v: number) => `${v}%`,    best: bestYld, invert: false },
  ];

  type RowKey = "ret1"|"ret5"|"mer"|"yld";
  const dataMap: Record<string, Record<RowKey, number>> = {};
  portfolios.forEach(p => {
    dataMap[p.id] = { ret1: p.returns["1yr"], ret5: p.returns["5yr"], mer: p.mer, yld: p.yield };
  });

  return (
    <div style={{ background: "var(--color-background-primary)", border: `0.5px solid ${C.gray200}`,
      borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: C.gray900 }}>
          Comparing {portfolios.length} portfolios
        </div>
        <button onClick={onClose} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 7,
          border: `0.5px solid ${C.gray200}`, background: "transparent", cursor: "pointer", color: C.gray500 }}>
          Close
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `0.5px solid ${C.gray200}` }}>
              <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11,
                fontWeight: 500, color: C.gray400, textTransform: "uppercase",
                letterSpacing: ".05em", width: 120 }}>Metric</th>
              {portfolios.map(p => (
                <th key={p.id} style={{ textAlign: "center", padding: "8px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }}/>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.gray900 }}>{p.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label} style={{ borderBottom: `0.5px solid ${C.gray100}` }}>
                <td style={{ padding: "9px 10px", fontSize: 12, color: C.gray500 }}>{r.label}</td>
                {portfolios.map(p => {
                  const v = dataMap[p.id][r.key];
                  const isBest = r.invert ? v === r.best : v === r.best;
                  return (
                    <td key={p.id} style={{ textAlign: "center", padding: "9px 10px",
                      fontWeight: isBest ? 500 : 400,
                      color: isBest ? C.teal : C.gray700 }}>
                      {r.fmt(v)}{isBest ? " ★" : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 10yr projection */}
      <SectionLabel>10yr projection — $50K start + $1,500/mo</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(130px,1fr))`, gap: 8 }}>
        {portfolios.map(p => {
          const r = p.returns["5yr"] / 100;
          const proj = 50000 * Math.pow(1+r, 10) + 1500*12 * (Math.pow(1+r, 10)-1) / r;
          return (
            <div key={p.id} style={{ background: C.gray50, borderRadius: 8, padding: "12px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.color }}/>
                <span style={{ fontSize: 11, color: C.gray600 }}>{p.name}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: p.color }}>
                ${Math.round(proj / 1000)}K
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 11, color: C.gray400, marginTop: 12, lineHeight: 1.6 }}>
        ★ = best in category. 10yr projections use 5yr historical return. Past performance is not a reliable indicator of future returns. General information only — not financial advice.
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PortfolioMarketplace() {
  const [activeCat, setActiveCat] = useState<PortfolioCategory | "all">("growth");
  const [activeId,  setActiveId]  = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  const visiblePortfolios = activeCat === "all"
    ? MODEL_PORTFOLIOS
    : MODEL_PORTFOLIOS.filter(p => p.category === activeCat);

  const activePortfolio = activeId ? MODEL_PORTFOLIOS.find(p => p.id === activeId) : null;
  const comparePortfolios = MODEL_PORTFOLIOS.filter(p => compareIds.has(p.id));

  function selectCard(id: string) {
    setActiveId(prev => prev === id ? null : id);
    setShowCompare(false);
  }

  function toggleCompare(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setCompareIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const catTabs: { id: PortfolioCategory | "all"; label: string }[] = [
    { id: "growth",   label: "Growth" },
    { id: "balanced", label: "Balanced" },
    { id: "income",   label: "Income" },
    { id: "all",      label: "All 11" },
  ];

  return (
    <div>
      <PageHeader
        badge="SmartETF · Subscriber tool"
        title="Portfolio marketplace"
        subtitle="11 model portfolios — research, compare, and build your ideal ETF mix."
      />

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {catTabs.map(t => (
          <button key={t.id}
            onClick={() => { setActiveCat(t.id); setActiveId(null); setShowCompare(false); }}
            style={{
              padding: "7px 18px", fontSize: 13, borderRadius: 20, cursor: "pointer",
              fontWeight: activeCat === t.id ? 500 : 400,
              background: activeCat === t.id ? "var(--color-background-secondary)" : "var(--color-background-primary)",
              color: activeCat === t.id ? "var(--color-text-primary)" : C.gray500,
              border: `0.5px solid ${activeCat === t.id ? C.gray300 : C.gray200}`,
            }}>
            {t.label}
          </button>
        ))}

        {/* Compare button */}
        {compareIds.size >= 2 && (
          <button onClick={() => { setShowCompare(true); setActiveId(null); }}
            style={{ ...S.btnPrimary, padding: "7px 18px", fontSize: 13, marginLeft: "auto" }}>
            Compare ({compareIds.size}) →
          </button>
        )}
        {compareIds.size === 1 && (
          <span style={{ fontSize: 12, color: C.gray400, marginLeft: "auto",
            alignSelf: "center" }}>
            Select one more to compare
          </span>
        )}
      </div>

      {/* Category description */}
      <p style={{ fontSize: 13, color: C.gray500, marginBottom: "1.25rem", lineHeight: 1.6 }}>
        {CAT_DESC[activeCat]}
        {" "}<span style={{ color: C.gray400 }}>General information only. Not financial advice.</span>
      </p>

      {/* Compare panel */}
      {showCompare && comparePortfolios.length >= 2 && (
        <ComparePanel portfolios={comparePortfolios} onClose={() => setShowCompare(false)}/>
      )}

      {/* Detail panel */}
      {activePortfolio && !showCompare && (
        <DetailPanel p={activePortfolio} onClose={() => setActiveId(null)}/>
      )}

      {/* Card grid */}
      <div style={{ display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 10 }}>
        {visiblePortfolios.map(p => (
          <SummaryCard
            key={p.id}
            p={p}
            active={activeId === p.id}
            onSelect={() => selectCard(p.id)}
            inCompare={compareIds.has(p.id)}
            onToggleCompare={(e) => toggleCompare(e, p.id)}
          />
        ))}
      </div>

      <p style={{ fontSize: 11, color: C.gray400, marginTop: "1.25rem", lineHeight: 1.6 }}>
        Returns are indicative based on historical index data to June 2025. Past performance is not a reliable indicator of future returns. SmartETF is an educational platform — general information only, not financial advice. Always consult a licensed financial adviser before making investment decisions.
      </p>
    </div>
  );
}
