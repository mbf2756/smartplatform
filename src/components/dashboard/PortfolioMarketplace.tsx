"use client";
import React, { useState, useEffect, useRef } from "react";
import { C, S, fmtAUD } from "@/lib/styles";
import { PageHeader, Card, SectionLabel } from "@/components/ui";
import { MODEL_PORTFOLIOS, CATEGORIES, type ModelPortfolio, type PortfolioCategory } from "@/data/portfolioMarketplace";

// ── Mini sparkline chart (no Chart.js dependency — pure SVG) ─────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 120, h = 48;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }} role="img" aria-label="Portfolio growth sparkline">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round"/>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity={0.08}/>
    </svg>
  );
}

// ── Risk bars ─────────────────────────────────────────────────────────────────
function RiskBars({ level, color }: { level: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 8, height: 6 + i * 4, borderRadius: 2,
          background: i <= level ? color : "var(--color-background-secondary)",
        }}/>
      ))}
    </div>
  );
}

// ── ETF weight bar ────────────────────────────────────────────────────────────
function WeightBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 5, background: "var(--color-background-secondary)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: 5, background: color, borderRadius: 3 }}/>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ children, variant = "gray" }: { children: React.ReactNode; variant?: "green"|"blue"|"amber"|"gray"|"red" }) {
  const styles: Record<string, React.CSSProperties> = {
    green: { background: C.greenLight, color: C.greenDark },
    blue:  { background: C.blueLight,  color: C.blueDark  },
    amber: { background: C.amberLight, color: C.amberDark },
    gray:  { background: C.gray100,    color: C.gray600   },
    red:   { background: C.redLight,   color: C.redDark   },
  };
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 5,
      display: "inline-block", marginRight: 4, marginBottom: 4, ...styles[variant] }}>
      {children}
    </span>
  );
}

// ── Performance cell ───────────────────────────────────────────────────────────
function PerfCell({ value, isBest }: { value: number; isBest: boolean }) {
  return (
    <span style={{ fontSize: 13, fontWeight: isBest ? 700 : 400,
      color: value > 10 ? C.teal : value > 5 ? C.tealDark : C.gray600 }}>
      {isBest ? "★ " : ""}+{value}%
    </span>
  );
}

// ── Portfolio card ─────────────────────────────────────────────────────────────
function PortfolioCard({
  portfolio, isSelected, onToggleSelect, onToggleExpand, isExpanded,
}: {
  portfolio: ModelPortfolio;
  isSelected: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
}) {
  const p = portfolio;
  const riskColor = p.risk >= 5 ? C.red : p.risk >= 4 ? C.amber : p.risk >= 3 ? C.amberDark : C.teal;

  return (
    <Card style={{ marginBottom: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }}/>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900 }}>{p.name}</div>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: C.gray100, color: C.gray500 }}>
              {p.tag}
            </span>
          </div>
          <p style={{ fontSize: 13, color: C.gray500, lineHeight: 1.6, margin: 0, maxWidth: 500 }}>{p.desc}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={onToggleSelect} style={{
            padding: "7px 14px", fontSize: 12, fontWeight: 500, borderRadius: 7, cursor: "pointer",
            background: isSelected ? C.tealLight : "transparent",
            color: isSelected ? C.tealDark : C.gray600,
            border: `1px solid ${isSelected ? C.teal : C.gray300}`,
          }}>
            {isSelected ? "✓ Selected" : "+ Compare"}
          </button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ marginBottom: 14 }}>
        {p.badges.map(b => <Badge key={b} variant="green">{b}</Badge>)}
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 8, marginBottom: 14 }}>
        {[
          { value: `+${p.returns["1yr"]}%`, label: "1yr return", color: C.teal },
          { value: `+${p.returns["3yr"]}%`, label: "3yr p.a.", color: C.teal },
          { value: `+${p.returns["5yr"]}%`, label: "5yr p.a.", color: C.teal },
          { value: `${p.mer}%`, label: "Blended MER", color: p.mer < 0.1 ? C.teal : p.mer < 0.2 ? C.amberDark : C.gray700 },
          { value: `${p.yield}%`, label: "Yield", color: C.gray900 },
          { value: p.horizon, label: "Horizon", color: C.gray900 },
        ].map(({ value, label, color }) => (
          <div key={label} style={{ background: C.gray50, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 17, fontWeight: 600, color, lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontSize: 11, color: C.gray400, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Risk + sparkline */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <SectionLabel>Risk level</SectionLabel>
          <RiskBars level={p.risk} color={riskColor}/>
          <div style={{ fontSize: 12, fontWeight: 600, color: riskColor, marginTop: 5 }}>{p.riskLabel}</div>
          <div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>Rebalance: {p.rebalance}</div>
        </div>
        <div>
          <SectionLabel>12 month growth ($10K)</SectionLabel>
          <Sparkline data={p.chartData} color={p.color}/>
          <div style={{ fontSize: 11, color: C.gray400, marginTop: 4 }}>
            ${(p.chartData[11] * 100).toLocaleString()} → {p.chartData[11] > 100 ? "+" : ""}{(p.chartData[11] - 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Expand toggle */}
      <button onClick={onToggleExpand} style={{
        width: "100%", padding: "9px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", background: C.gray50, border: `1px solid ${C.gray200}`,
        borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, color: C.gray700,
      }}>
        <span>ETF holdings breakdown · {p.holdings.length} funds</span>
        <span style={{ fontSize: 16, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>
          ⌄
        </span>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div style={{ marginTop: 12 }}>
          {/* Holdings table */}
          <div style={{ borderRadius: 8, border: `1px solid ${C.gray200}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 70px 50px 80px",
              gap: 8, padding: "8px 12px", background: C.gray50, borderBottom: `1px solid ${C.gray200}` }}>
              {["Ticker","Fund name","Weight","MER","Asset class"].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 500, color: C.gray400, textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</div>
              ))}
            </div>
            {p.holdings.map((h, i) => (
              <div key={h.ticker} style={{
                display: "grid", gridTemplateColumns: "60px 1fr 70px 50px 80px",
                gap: 8, padding: "10px 12px", alignItems: "center",
                borderBottom: i < p.holdings.length - 1 ? `1px solid ${C.gray100}` : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gray900 }}>{h.ticker}</div>
                  <div style={{ fontSize: 10, color: C.teal }}>{h.mer}% MER</div>
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: 13, color: C.gray700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: C.gray400, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.index}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <WeightBar pct={h.pct} color={p.color}/>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.gray900, minWidth: 28 }}>{h.pct}%</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600,
                  color: h.mer < 0.1 ? C.teal : h.mer < 0.3 ? C.amberDark : C.red }}>
                  {h.mer}%
                </div>
                <div style={{ fontSize: 11, color: C.gray500 }}>{h.asset}</div>
              </div>
            ))}
          </div>

          {/* Blended MER summary */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 12px",
            fontSize: 12, color: C.gray500, gap: 8 }}>
            <span>Blended MER:</span>
            <span style={{ fontWeight: 700, color: p.mer < 0.1 ? C.teal : p.mer < 0.2 ? C.amberDark : C.gray700 }}>
              {p.mer}% p.a. = ${Math.round(10000 * p.mer / 100)}/yr on $10,000
            </span>
          </div>

          {/* Pros / cons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
            <div style={{ padding: "12px 14px", background: C.tealLight, borderRadius: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.tealDark, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>Strengths</div>
              {p.pros.map((pro, i) => (
                <div key={i} style={{ display: "flex", gap: 7, marginBottom: 6 }}>
                  <span style={{ color: C.teal, flexShrink: 0, fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 12, color: C.tealDark, lineHeight: 1.5 }}>{pro}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 14px", background: C.amberLight, borderRadius: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.amberDark, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>Considerations</div>
              {p.cons.map((con, i) => (
                <div key={i} style={{ display: "flex", gap: 7, marginBottom: 6 }}>
                  <span style={{ color: C.amber, flexShrink: 0, fontSize: 12 }}>!</span>
                  <span style={{ fontSize: 12, color: C.amberDark, lineHeight: 1.5 }}>{con}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: 10, padding: "10px 14px", background: C.gray50,
            borderRadius: 8, fontSize: 11, color: C.gray400, lineHeight: 1.6 }}>
            {p.disclaimer}
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Compare view ───────────────────────────────────────────────────────────────
function CompareView({ selected }: { selected: ModelPortfolio[] }) {
  if (selected.length < 2) return (
    <Card style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.gray700, marginBottom: 6 }}>Select portfolios to compare</div>
      <div style={{ fontSize: 14, color: C.gray400 }}>Use "+ Compare" on any portfolio card, then come back here.</div>
    </Card>
  );

  const best1   = Math.max(...selected.map(p => p.returns["1yr"]));
  const best5   = Math.max(...selected.map(p => p.returns["5yr"]));
  const bestMer = Math.min(...selected.map(p => p.mer));
  const bestYld = Math.max(...selected.map(p => p.yield));

  // All unique tickers
  const allTickers = [...new Set(selected.flatMap(p => p.holdings.map(h => h.ticker)))];
  const sharedTickers = allTickers.filter(t => selected.filter(p => p.holdings.find(h => h.ticker === t)).length > 1);

  return (
    <div>
      <SectionLabel>Side-by-side comparison — {selected.length} portfolios</SectionLabel>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.gray200}` }}>
              {["Portfolio","1yr","3yr p.a.","5yr p.a.","MER","Yield","Risk","Type","ETFs"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11,
                  fontWeight: 500, color: C.gray400, textTransform: "uppercase", letterSpacing: ".05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selected.map(p => {
              const rc = p.risk >= 5 ? C.red : p.risk >= 4 ? C.amber : p.risk >= 3 ? C.amberDark : C.teal;
              return (
                <tr key={p.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }}/>
                      <span style={{ fontWeight: 600, color: C.gray900 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}><PerfCell value={p.returns["1yr"]} isBest={p.returns["1yr"] === best1}/></td>
                  <td style={{ padding: "10px 12px" }}><PerfCell value={p.returns["3yr"]} isBest={false}/></td>
                  <td style={{ padding: "10px 12px" }}><PerfCell value={p.returns["5yr"]} isBest={p.returns["5yr"] === best5}/></td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: 13, fontWeight: p.mer === bestMer ? 700 : 400, color: p.mer < 0.1 ? C.teal : C.gray700 }}>
                      {p.mer === bestMer ? "★ " : ""}{p.mer}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: 13, fontWeight: p.yield === bestYld ? 700 : 400, color: C.gray700 }}>
                      {p.yield === bestYld ? "★ " : ""}{p.yield}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: rc }}>{p.riskLabel}</span>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: C.gray500 }}>{p.type}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: C.gray500 }}>{p.holdings.length} ETFs</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 10yr projection comparison */}
      <SectionLabel>10-year projection on $50,000 starting balance + $1,500/mo</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        {selected.map(p => {
          const r = p.returns["5yr"] / 100;
          const start = 50000;
          const monthly = 1500;
          const proj = start * Math.pow(1 + r, 10) + monthly * 12 * (Math.pow(1 + r, 10) - 1) / r;
          return (
            <div key={p.id} style={{ background: C.gray50, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }}/>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.gray700 }}>{p.name}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: p.color }}>{fmtAUD(proj)}</div>
              <div style={{ fontSize: 11, color: C.gray400, marginTop: 3 }}>est. 10yr balance</div>
            </div>
          );
        })}
      </div>

      {/* Shared ETF holdings */}
      {sharedTickers.length > 0 && (
        <>
          <SectionLabel>Shared ETF holdings across selected portfolios</SectionLabel>
          <Card style={{ background: C.gray50 }}>
            {sharedTickers.map(ticker => {
              const inPortfolios = selected.filter(p => p.holdings.find(h => h.ticker === ticker));
              return (
                <div key={ticker} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
                  borderBottom: `1px solid ${C.gray100}` }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.gray900, width: 52 }}>{ticker}</span>
                  <span style={{ fontSize: 12, color: C.gray500 }}>in {inPortfolios.length} portfolios</span>
                  <div style={{ display: "flex", gap: 6, marginLeft: "auto", flexWrap: "wrap" }}>
                    {inPortfolios.map(p => (
                      <span key={p.id} style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4,
                        background: p.color + "20", color: p.color, fontWeight: 600 }}>
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <p style={{ fontSize: 11, color: C.gray400, margin: "10px 0 0" }}>
              ETFs not shown are unique to a single portfolio.
            </p>
          </Card>
        </>
      )}

      <div style={{ padding: "12px 0", fontSize: 12, color: C.gray400, lineHeight: 1.6 }}>
        ★ = best in category. Projections use 5yr historical return rate and assume constant monthly contributions.
        Past performance is not a reliable indicator of future returns. General information only — not financial advice.
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function PortfolioMarketplace() {
  const [activeCat, setActiveCat] = useState<PortfolioCategory | "compare">("growth");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [activeSubId, setActiveSubId] = useState<string | null>(null);

  const selectedPortfolios = MODEL_PORTFOLIOS.filter(p => selectedIds.has(p.id));
  const currentCatPortfolios = activeCat !== "compare"
    ? MODEL_PORTFOLIOS.filter(p => p.category === activeCat && (!activeSubId || p.id === activeSubId))
    : [];

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const catTabs: { id: PortfolioCategory | "compare"; label: string }[] = [
    { id: "growth",   label: "Growth portfolios" },
    { id: "balanced", label: "Balanced portfolios" },
    { id: "income",   label: "Income portfolios" },
    ...(selectedIds.size >= 2 ? [{ id: "compare" as const, label: `Compare (${selectedIds.size})` }] : []),
  ];

  const subTabsForCat = activeCat !== "compare"
    ? MODEL_PORTFOLIOS.filter(p => p.category === activeCat)
    : [];

  return (
    <div>
      <PageHeader
        badge="SmartETF · Subscriber tool"
        title="Portfolio marketplace"
        subtitle="11 model portfolios — research, compare, and build your ideal ETF mix."
      />

      {/* Selection count banner */}
      {selectedIds.size > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", background: C.tealLight, borderRadius: 8, marginBottom: 16,
          border: `1px solid ${C.tealMid}` }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.tealDark }}>
            {selectedIds.size} portfolio{selectedIds.size > 1 ? "s" : ""} selected for comparison
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {selectedIds.size >= 2 && (
              <button onClick={() => setActiveCat("compare")}
                style={{ ...S.btnPrimary, padding: "6px 14px", fontSize: 12 }}>
                Compare now →
              </button>
            )}
            <button onClick={() => setSelectedIds(new Set())}
              style={{ ...S.btnSecondary, padding: "6px 14px", fontSize: 12 }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {catTabs.map(t => (
          <button key={t.id} onClick={() => { setActiveCat(t.id); setActiveSubId(null); }}
            style={{
              padding: "7px 16px", fontSize: 13, borderRadius: 20, cursor: "pointer",
              fontWeight: activeCat === t.id ? 500 : 400,
              background: activeCat === t.id ? "var(--color-background-secondary)" : "var(--color-background-primary)",
              color: activeCat === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              border: `0.5px solid ${activeCat === t.id ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Sub-tabs (individual portfolios in category) */}
      {activeCat !== "compare" && subTabsForCat.length > 1 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <button onClick={() => setActiveSubId(null)}
            style={{
              padding: "5px 12px", fontSize: 12, borderRadius: 8, cursor: "pointer",
              fontWeight: !activeSubId ? 500 : 400,
              background: !activeSubId ? "var(--color-background-secondary)" : "var(--color-background-primary)",
              color: !activeSubId ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              border: `0.5px solid ${!activeSubId ? "var(--color-border-secondary)" : "var(--color-border-tertiary)"}`,
            }}>
            All {subTabsForCat.length}
          </button>
          {subTabsForCat.map(p => (
            <button key={p.id} onClick={() => setActiveSubId(activeSubId === p.id ? null : p.id)}
              style={{
                padding: "5px 12px", fontSize: 12, borderRadius: 8, cursor: "pointer",
                fontWeight: activeSubId === p.id ? 500 : 400,
                background: activeSubId === p.id ? "var(--color-background-secondary)" : "var(--color-background-primary)",
                color: activeSubId === p.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                border: `0.5px solid ${activeSubId === p.id ? "var(--color-border-secondary)" : "var(--color-border-tertiary)"}`,
              }}>
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Category description */}
      {activeCat !== "compare" && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: C.gray50,
          borderRadius: 8, fontSize: 13, color: C.gray500, lineHeight: 1.5 }}>
          {activeCat === "growth" && "Growth portfolios target maximum long-run capital appreciation. Suitable for investors with a 7+ year horizon who can tolerate short-term volatility."}
          {activeCat === "balanced" && "Balanced portfolios blend growth and income for investors wanting steady returns with lower volatility. Suitable for medium-term goals and investors within 5–10 years of retirement."}
          {activeCat === "income" && "Income portfolios prioritise regular distributions over capital growth. Suitable for investors wanting dividend income without needing to sell holdings."}
          {" "}<strong style={{ color: C.gray700 }}>General information only. Not financial advice.</strong>
        </div>
      )}

      {/* Portfolio cards */}
      {activeCat !== "compare" && currentCatPortfolios.map(p => (
        <PortfolioCard
          key={p.id}
          portfolio={p}
          isSelected={selectedIds.has(p.id)}
          isExpanded={expandedIds.has(p.id)}
          onToggleSelect={() => toggleSelect(p.id)}
          onToggleExpand={() => toggleExpand(p.id)}
        />
      ))}

      {/* Compare view */}
      {activeCat === "compare" && <CompareView selected={selectedPortfolios}/>}
    </div>
  );
}
