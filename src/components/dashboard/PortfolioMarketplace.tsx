"use client";
import React, { useState } from "react";
import { C, S } from "@/lib/styles";
import { PageHeader } from "@/components/ui";
import {
  MODEL_PORTFOLIOS, CATEGORIES, RISK_FILTERS,
  getByCategory, type ModelPortfolio, type PortfolioCategory,
} from "@/data/portfolioMarketplace";

// ── Donut chart (pure SVG, no libs) ──────────────────────────────────────────
function Donut({ holdings, size = 72 }: { holdings: ModelPortfolio["holdings"]; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;
  let cumAngle = -90;
  const slices = holdings.map(h => {
    const startAngle = cumAngle;
    const sweep = (h.pct / 100) * 360;
    cumAngle += sweep;
    const start = polarToXY(cx, cy, r, startAngle);
    const end   = polarToXY(cx, cy, r, startAngle + sweep);
    const large = sweep > 180 ? 1 : 0;
    const path  = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
    return { path, color: h.color };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Portfolio allocation donut chart">
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth={1.5}/>)}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#F8FAFC"/>
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={size * 0.13} fontWeight={600} fill="#475569">
        {holdings[0].ticker}
      </text>
    </svg>
  );
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: +(cx + r * Math.cos(rad)).toFixed(2), y: +(cy + r * Math.sin(rad)).toFixed(2) };
}

// ── Risk dots ─────────────────────────────────────────────────────────────────
function RiskDots({ level, color }: { level: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 4, height: 4 + i * 3, borderRadius: 2,
          background: i <= level ? color : "#E2E8F0",
        }}/>
      ))}
    </div>
  );
}

// ── Pill ──────────────────────────────────────────────────────────────────────
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", fontSize: 13, borderRadius: 20, cursor: "pointer",
      border: active ? "2px solid #0F172A" : "1px solid #CBD5E1",
      background: active ? "#0F172A" : "#fff",
      color: active ? "#fff" : "#475569",
      fontWeight: active ? 600 : 400,
    }}>
      {children}
    </button>
  );
}

// ── Risk badge ────────────────────────────────────────────────────────────────
function RiskBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
      background: bg, color }}>
      {label}
    </span>
  );
}

// ── Portfolio card (2-column SmartSuper style) ────────────────────────────────
function PortfolioCard({
  p, selected, onSelect, inCompare, onToggleCompare,
}: {
  p: ModelPortfolio;
  selected: boolean;
  onSelect: () => void;
  inCompare: boolean;
  onToggleCompare: (e: React.MouseEvent) => void;
}) {
  const riskColor = p.risk >= 5 ? "#E24B4A" : p.risk >= 4 ? "#EF9F27" : p.risk >= 3 ? "#BA7517" : "#1D9E75";

  return (
    <div onClick={onSelect} style={{
      background: "#fff",
      border: `1px solid ${selected ? "#1D9E75" : "#E2E8F0"}`,
      borderRadius: 10,
      padding: "18px 20px",
      cursor: "pointer",
      transition: "border-color .15s, box-shadow .15s",
      boxShadow: selected ? "0 0 0 3px rgba(29,158,117,0.12)" : "none",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* Donut */}
        <div style={{ flexShrink: 0 }}>
          <Donut holdings={p.holdings} size={68}/>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#0F172A" }}>{p.name}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
              background: p.tagBg, color: p.tagColor }}>
              {p.tag}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.55, margin: 0, marginBottom: 10 }}>
            {p.desc}
          </p>

          {/* Key metrics inline — SmartSuper style */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "baseline" }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1D9E75" }}>{p.mer}%</span>
              <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 3 }}>MER p.a.</span>
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1D9E75" }}>{p.returns["3yr"]}%</span>
              <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 3 }}>3yr est.</span>
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1D9E75" }}>{p.returns["5yr"]}%</span>
              <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 3 }}>5yr est.</span>
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                ${p.annualCostOn430k.toLocaleString()}/yr
              </span>
              <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 3 }}>on $430k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 12, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <RiskDots level={p.risk} color={riskColor}/>
          <span style={{ fontSize: 11, fontWeight: 600, color: riskColor }}>{p.riskLabel}</span>
          <span style={{ fontSize: 11, color: "#CBD5E1" }}>·</span>
          <span style={{ fontSize: 11, color: "#94A3B8" }}>{p.holdings.length} ETFs</span>
          <span style={{ fontSize: 11, color: "#CBD5E1" }}>·</span>
          <span style={{ fontSize: 11, color: "#94A3B8" }}>{p.horizon}</span>
        </div>
        <button onClick={onToggleCompare} style={{
          fontSize: 11, padding: "3px 10px", borderRadius: 5, cursor: "pointer",
          background: inCompare ? "#E1F5EE" : "transparent",
          color: inCompare ? "#0F6E56" : "#94A3B8",
          border: `1px solid ${inCompare ? "#1D9E75" : "#E2E8F0"}`,
          fontWeight: inCompare ? 600 : 400,
        }}>
          {inCompare ? "✓ Added" : "+ Compare"}
        </button>
      </div>
    </div>
  );
}

// ── Detail drawer ─────────────────────────────────────────────────────────────
function DetailDrawer({ p, onClose }: { p: ModelPortfolio; onClose: () => void }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
      padding: "20px 24px", marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <Donut holdings={p.holdings} size={80}/>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{p.name}</span>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 9px", borderRadius: 4,
                background: p.tagBg, color: p.tagColor }}>{p.tag}</span>
            </div>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0, maxWidth: 540 }}>
              {p.desc}
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 7,
          border: "1px solid #E2E8F0", background: "transparent", cursor: "pointer", color: "#64748B",
          flexShrink: 0 }}>
          Close ×
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 8, marginBottom: 16 }}>
        {[
          { v: `+${p.returns["1yr"]}%`, l: "1yr return",       c: "#1D9E75" },
          { v: `+${p.returns["3yr"]}%`, l: "3yr p.a.",          c: "#1D9E75" },
          { v: `+${p.returns["5yr"]}%`, l: "5yr p.a.",          c: "#1D9E75" },
          { v: `${p.mer}%`,             l: "Blended MER",       c: p.mer < 0.1 ? "#1D9E75" : "#475569" },
          { v: `${p.yield}%`,           l: "Yield",             c: "#475569" },
          { v: p.riskLabel,             l: "Risk level",        c: p.risk >= 5 ? "#E24B4A" : p.risk >= 4 ? "#EF9F27" : "#1D9E75" },
          { v: p.horizon,               l: "Min. horizon",      c: "#475569" },
          { v: `$${p.annualCostOn430k.toLocaleString()}/yr`, l: "Cost on $430k", c: "#475569" },
        ].map(({ v, l, c }) => (
          <div key={l} style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: c, lineHeight: 1.2 }}>{v}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Holdings */}
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em",
        color: "#94A3B8", marginBottom: 8 }}>ETF holdings</div>
      <div style={{ border: "1px solid #F1F5F9", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 80px 44px 100px",
          gap: 8, padding: "8px 12px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
          {["Ticker","Fund name","Weight","MER","Asset class"].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8",
              textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</div>
          ))}
        </div>
        {p.holdings.map((h, i) => (
          <div key={h.ticker} style={{
            display: "grid", gridTemplateColumns: "52px 1fr 80px 44px 100px",
            gap: 8, padding: "10px 12px", alignItems: "center",
            borderBottom: i < p.holdings.length - 1 ? "1px solid #F1F5F9" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: h.color, flexShrink: 0 }}/>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{h.ticker}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#475569", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.index}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, height: 4, background: "#F1F5F9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${h.pct}%`, height: 4, background: h.color, borderRadius: 2 }}/>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", minWidth: 26 }}>{h.pct}%</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600,
              color: h.mer < 0.1 ? "#1D9E75" : h.mer < 0.3 ? "#BA7517" : "#E24B4A" }}>
              {h.mer}%
            </div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{h.asset}</div>
          </div>
        ))}
      </div>

      {/* Pros / cons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "#F0FDF8", borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0F6E56", textTransform: "uppercase",
            letterSpacing: ".06em", marginBottom: 8 }}>Strengths</div>
          {p.pros.map((pro, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
              <span style={{ color: "#1D9E75", flexShrink: 0, fontSize: 13 }}>✓</span>
              <span style={{ fontSize: 13, color: "#0F6E56", lineHeight: 1.5 }}>{pro}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#854F0B", textTransform: "uppercase",
            letterSpacing: ".06em", marginBottom: 8 }}>Watch out for</div>
          {p.cons.map((con, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
              <span style={{ color: "#EF9F27", flexShrink: 0, fontSize: 13 }}>!</span>
              <span style={{ fontSize: 13, color: "#854F0B", lineHeight: 1.5 }}>{con}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 12, lineHeight: 1.6 }}>{p.disclaimer}</p>
    </div>
  );
}

// ── Compare panel ─────────────────────────────────────────────────────────────
function ComparePanel({ portfolios, onClose }: { portfolios: ModelPortfolio[]; onClose: () => void }) {
  const best1   = Math.max(...portfolios.map(p => p.returns["1yr"]));
  const best5   = Math.max(...portfolios.map(p => p.returns["5yr"]));
  const bestMer = Math.min(...portfolios.map(p => p.mer));
  const bestYld = Math.max(...portfolios.map(p => p.yield));

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
      padding: "20px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
          Comparing {portfolios.length} portfolios
        </div>
        <button onClick={onClose} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 7,
          border: "1px solid #E2E8F0", background: "transparent", cursor: "pointer", color: "#64748B" }}>
          Close
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
              <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11,
                fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".05em", width: 130 }}>
                Metric
              </th>
              {portfolios.map(p => (
                <th key={p.id} style={{ textAlign: "center", padding: "8px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }}/>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{p.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label:"1yr return",  vals: portfolios.map(p=>p.returns["1yr"]), best:best1,   fmt:(v:number)=>`+${v}%`,  invert:false },
              { label:"5yr p.a.",    vals: portfolios.map(p=>p.returns["5yr"]), best:best5,   fmt:(v:number)=>`+${v}%`,  invert:false },
              { label:"Blended MER", vals: portfolios.map(p=>p.mer),            best:bestMer, fmt:(v:number)=>`${v}%`,   invert:true  },
              { label:"Yield",       vals: portfolios.map(p=>p.yield),          best:bestYld, fmt:(v:number)=>`${v}%`,   invert:false },
              { label:"Risk level",  vals: portfolios.map(p=>p.risk),           best:0,       fmt:(_v:number,i:number)=>portfolios[i].riskLabel, invert:false, noStar:true },
            ].map(row => (
              <tr key={row.label} style={{ borderBottom: "1px solid #F8FAFC" }}>
                <td style={{ padding: "9px 10px", fontSize: 12, color: "#475569" }}>{row.label}</td>
                {portfolios.map((p, i) => {
                  const v = row.vals[i];
                  const isBest = !row.noStar && (row.invert ? v === row.best : v === row.best);
                  return (
                    <td key={p.id} style={{ textAlign: "center", padding: "9px 10px",
                      fontWeight: isBest ? 700 : 400,
                      color: isBest ? "#1D9E75" : "#475569" }}>
                      {(row.fmt as any)(v, i)}{isBest ? " ★" : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 10yr projection */}
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em",
        color: "#94A3B8", margin: "16px 0 8px" }}>10yr projection — $50K start + $1,500/mo</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(130px,1fr))`, gap: 8 }}>
        {portfolios.map(p => {
          const r = p.returns["5yr"] / 100;
          const proj = 50000 * Math.pow(1+r, 10) + 1500*12 * (Math.pow(1+r,10)-1) / r;
          return (
            <div key={p.id} style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.color }}/>
                <span style={{ fontSize: 11, color: "#64748B" }}>{p.name}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: p.color }}>
                ${Math.round(proj / 1000)}K
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 12, lineHeight: 1.6 }}>
        ★ = best in category. Projections use 5yr historical return rate. Past performance is not a reliable indicator of future returns. General information only — not financial advice.
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PortfolioMarketplace() {
  const [activeCat, setActiveCat] = useState<PortfolioCategory | "all">("all");
  const [activeRisk, setActiveRisk] = useState("all");
  const [activeId,   setActiveId]   = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  // Filter portfolios
  let visible = getByCategory(activeCat);
  if (activeRisk !== "all") {
    visible = visible.filter(p => {
      if (activeRisk === "1-2") return p.risk <= 2;
      if (activeRisk === "3")   return p.risk === 3;
      if (activeRisk === "4")   return p.risk === 4;
      if (activeRisk === "5")   return p.risk === 5;
      return true;
    });
  }

  const activePortfolio = activeId ? MODEL_PORTFOLIOS.find(p => p.id === activeId) : null;
  const comparePortfolios = MODEL_PORTFOLIOS.filter(p => compareIds.has(p.id));

  const catTabs: { id: PortfolioCategory | "all"; label: string }[] = [
    { id:"all",         label:"All 15" },
    { id:"high-growth", label:"High growth" },
    { id:"growth",      label:"Growth" },
    { id:"balanced",    label:"Balanced" },
    { id:"income",      label:"Income" },
  ];

  function toggleCompare(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setCompareIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function selectCard(id: string) {
    setActiveId(prev => prev === id ? null : id);
    setShowCompare(false);
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase",
          color: "#1D9E75", marginBottom: 4 }}>SmartETF · Subscriber tool</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>
          Model ETF portfolios
        </h1>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
          15 model portfolios — research, compare, and build your ideal ETF mix
        </p>
      </div>

      {/* Info banner */}
      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8,
        padding: "10px 14px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>ℹ</span>
        <p style={{ fontSize: 13, color: "#1E40AF", margin: 0, lineHeight: 1.55 }}>
          Returns are indicative based on historical index data to June 2025.
          Click any portfolio to see the full ETF breakdown. Use + Compare to compare side by side.
          <strong> General information only — not financial advice.</strong>
        </p>
      </div>

      {/* Category + Risk filter row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Category:</span>
        {catTabs.map(t => (
          <Pill key={t.id} active={activeCat === t.id}
            onClick={() => { setActiveCat(t.id); setActiveId(null); setShowCompare(false); }}>
            {t.label}
          </Pill>
        ))}
        <span style={{ color: "#E2E8F0", margin: "0 4px" }}>|</span>
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Risk:</span>
        {RISK_FILTERS.map(r => (
          <Pill key={r.id} active={activeRisk === r.id}
            onClick={() => setActiveRisk(r.id)}>
            {r.label}
          </Pill>
        ))}
      </div>

      {/* Compare bar */}
      {compareIds.size > 0 && (
        <div style={{ background: "#F0FDF8", border: "1px solid #86EFAC", borderRadius: 8,
          padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#0F6E56" }}>
            {compareIds.size} portfolio{compareIds.size > 1 ? "s" : ""} selected
            {compareIds.size === 1 ? " — select one more to compare" : ""}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {compareIds.size >= 2 && (
              <button onClick={() => { setShowCompare(true); setActiveId(null); }}
                style={{ padding: "7px 18px", fontSize: 13, fontWeight: 600, borderRadius: 7,
                  background: "#1D9E75", color: "#fff", border: "none", cursor: "pointer" }}>
                Compare now →
              </button>
            )}
            <button onClick={() => setCompareIds(new Set())}
              style={{ padding: "7px 14px", fontSize: 13, borderRadius: 7,
                background: "transparent", color: "#64748B", border: "1px solid #E2E8F0", cursor: "pointer" }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Compare panel */}
      {showCompare && comparePortfolios.length >= 2 && (
        <ComparePanel portfolios={comparePortfolios} onClose={() => setShowCompare(false)}/>
      )}

      {/* Selected detail drawer */}
      {activePortfolio && !showCompare && (
        <DetailDrawer p={activePortfolio} onClose={() => setActiveId(null)}/>
      )}

      {/* 2-column card grid */}
      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#94A3B8", fontSize: 14 }}>
          No portfolios match your current filters.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(400px,1fr))", gap: 12 }}>
          {visible.map(p => (
            <PortfolioCard
              key={p.id} p={p}
              selected={activeId === p.id}
              onSelect={() => selectCard(p.id)}
              inCompare={compareIds.has(p.id)}
              onToggleCompare={e => toggleCompare(e, p.id)}
            />
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 20, lineHeight: 1.6 }}>
        Returns are indicative based on historical index data to June 2025. Past performance is not a reliable indicator of future returns. SmartETF is an educational platform — general information only, not financial advice. Always consult a licensed financial adviser before making investment decisions.
      </p>
    </div>
  );
}
