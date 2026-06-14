"use client";
import React, { useState } from "react";
import { C, S } from "@/lib/styles";
import Link from "next/link";

// ── Design tokens ─────────────────────────────────────────────────────────────
const ACC = "#1D9E75";
const NAVY = "#1E1B4B";
const PBG = "#F8FAFC";
const BR = "#E2E8F0";

// ── Shared sub-components ─────────────────────────────────────────────────────
function SectionHeader({ step, title, subtitle }: { step:string; title:string; subtitle:string }) {
  return (
    <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:20}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:NAVY,flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:14,fontWeight:800,color:"#fff",marginTop:2}}>{step}</div>
      <div>
        <h2 style={{fontSize:19,fontWeight:700,color:"#0F172A",margin:"0 0 3px"}}>{title}</h2>
        <p style={{fontSize:13,color:"#64748B",margin:0,lineHeight:1.5}}>{subtitle}</p>
      </div>
    </div>
  );
}

function Card({ children, accent, style: extra }:
  { children:React.ReactNode; accent?:string; style?:React.CSSProperties }) {
  return (
    <div style={{background:"#fff",border:`1px solid ${BR}`,borderRadius:10,
      padding:"18px 22px",marginBottom:14,
      ...(accent?{borderLeft:`4px solid ${accent}`,paddingLeft:18}:{}),
      ...extra}}>
      {children}
    </div>
  );
}

function InfoBox({ icon, title, children, color="blue" }:
  { icon:string; title:string; children:React.ReactNode; color?:"blue"|"green"|"amber"|"purple" }) {
  const map = {
    blue:   { bg:"#EFF6FF", border:"#BFDBFE", text:"#1E40AF", hd:"#1E40AF" },
    green:  { bg:"#F0FDF4", border:"#BBF7D0", text:"#166534", hd:"#166534" },
    amber:  { bg:"#FFFBEB", border:"#FDE68A", text:"#78350F", hd:"#92400E" },
    purple: { bg:"#F5F3FF", border:"#DDD6FE", text:"#3730A3", hd:"#3730A3" },
  };
  const c = map[color];
  return (
    <div style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:8,
      padding:"12px 16px",marginBottom:12}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:c.hd,marginBottom:4}}>{title}</div>
          <div style={{fontSize:13,color:c.text,lineHeight:1.6}}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function CheckRow({ children }: { children:React.ReactNode }) {
  return (
    <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
      <span style={{color:ACC,fontSize:14,flexShrink:0,marginTop:1}}>✓</span>
      <span style={{fontSize:13,color:"#475569",lineHeight:1.5}}>{children}</span>
    </div>
  );
}

function StepRow({ n, title, desc }: { n:string; title:string; desc:string }) {
  return (
    <div style={{display:"flex",gap:12,alignItems:"flex-start",
      padding:"12px 0",borderBottom:`1px solid ${BR}`}}>
      <div style={{width:26,height:26,borderRadius:"50%",
        background:C.tealLight,color:C.tealDark,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:12,fontWeight:700,flexShrink:0}}>{n}</div>
      <div>
        <div style={{fontSize:13,fontWeight:600,color:"#0F172A",marginBottom:2}}>{title}</div>
        <div style={{fontSize:12,color:"#64748B",lineHeight:1.5}}>{desc}</div>
      </div>
    </div>
  );
}

// ── Broker cards ──────────────────────────────────────────────────────────────
interface Broker {
  name:string; logo:string; market:string; brokerage:string; min:string;
  bestFor:string; pros:string[]; cons:string[]; url:string;
  highlight?:string; color:string;
}

const BROKERS_AU: Broker[] = [
  {
    name:"CommSec", logo:"🏦", market:"ASX + Global",
    brokerage:"$5–$29.95 per trade (tiered by value)",
    min:"No minimum", bestFor:"Beginners — backed by CBA, easy to use",
    color:"#FFB703",
    pros:["Integrated with CBA bank account","ASX and international markets","CHESS-sponsored holdings"],
    cons:["Higher brokerage for small trades","International FX fees above average"],
    url:"https://www.commsec.com.au",
    highlight:"Most popular in AU",
  },
  {
    name:"Pearler", logo:"🌱", market:"ASX + US",
    brokerage:"$6.50 per trade (AU) · $9.50 US",
    min:"No minimum", bestFor:"Long-term ETF investors — built for DCA",
    color:ACC,
    pros:["Autoinvest — automatic DCA on a schedule","Community features showing real portfolios","Fractional shares on US stocks"],
    cons:["Smaller stock universe than CommSec","US market limited to major stocks"],
    url:"https://pearler.com",
    highlight:"Best for ETF investors",
  },
  {
    name:"Superhero", logo:"🦸", market:"ASX + US",
    brokerage:"$2 per ASX trade · $0 for ETFs",
    min:"$100 minimum", bestFor:"Cost-conscious investors — lowest brokerage for ETFs",
    color:"#7F77DD",
    pros:["$0 brokerage on ASX ETFs","US stocks available","Simple modern app"],
    cons:["CHESS-sponsored only for some stocks","Limited research tools","Newer platform"],
    url:"https://superhero.com.au",
    highlight:"$0 ETF brokerage",
  },
  {
    name:"SelfWealth", logo:"📊", market:"ASX + US",
    brokerage:"$9.50 flat rate all trades",
    min:"No minimum", bestFor:"Frequent traders wanting flat pricing",
    color:"#185FA5",
    pros:["Flat $9.50 — no tiered complexity","CHESS-sponsored","Community benchmarking against other members"],
    cons:["No autoinvest feature","FX fees on US trades"],
    url:"https://www.selfwealth.com.au",
  },
];

const BROKERS_US: Broker[] = [
  {
    name:"Interactive Brokers (IBKR)", logo:"🌐", market:"Global (70+ markets)",
    brokerage:"$0 US stocks · $1.35 AU stocks",
    min:"No minimum", bestFor:"Serious investors wanting global access",
    color:"#DC2626",
    pros:["Access to 70+ global markets from one account","Lowest margin rates","Professional-grade tools"],
    cons:["Complex interface — not for beginners","Inactivity fees if under $100k"],
    url:"https://www.interactivebrokers.com.au",
    highlight:"Most powerful",
  },
  {
    name:"Stake", logo:"🗽", market:"US + ASX",
    brokerage:"$0 US stocks · $3 ASX stocks",
    min:"$50 minimum", bestFor:"Australians wanting $0 US stock trading",
    color:"#639922",
    pros:["$0 US brokerage (commission-free)","Clean modern interface","Fractional shares"],
    cons:["US stocks settled in USD — FX cost to repatriate","No CHESS sponsorship for ASX"],
    url:"https://hellostake.com",
    highlight:"$0 US brokerage",
  },
];

function BrokerCard({ b }: { b:Broker }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{background:"#fff",border:`1px solid ${BR}`,borderRadius:10,
      padding:"16px 18px",marginBottom:10,
      boxShadow:expanded?`0 0 0 2px ${b.color}22`:"none",
      transition:"box-shadow .15s"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
        <div style={{width:44,height:44,borderRadius:10,
          background:`${b.color}18`,border:`1px solid ${b.color}30`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:22,flexShrink:0}}>{b.logo}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
            <span style={{fontSize:15,fontWeight:700,color:"#0F172A"}}>{b.name}</span>
            {b.highlight && (
              <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,
                background:`${b.color}18`,color:b.color}}>{b.highlight}</span>
            )}
          </div>
          <div style={{fontSize:12,color:"#64748B",marginBottom:6}}>
            <span style={{fontWeight:600,color:"#0F172A"}}>{b.brokerage}</span>
            {" · "}{b.market}
          </div>
          <div style={{fontSize:12,color:ACC,fontWeight:500}}>✓ Best for: {b.bestFor}</div>
        </div>
        <button onClick={()=>setExpanded(e=>!e)} style={{
          padding:"7px 14px",fontSize:12,fontWeight:500,borderRadius:7,cursor:"pointer",
          border:`1px solid ${BR}`,background:"transparent",color:"#475569",flexShrink:0}}>
          {expanded?"Less ↑":"Details ↓"}
        </button>
      </div>

      {expanded && (
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${BR}`}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",
                textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Strengths</div>
              {b.pros.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:7,marginBottom:5}}>
                  <span style={{color:ACC,flexShrink:0}}>✓</span>
                  <span style={{fontSize:12,color:"#475569",lineHeight:1.45}}>{p}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",
                textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Watch out for</div>
              {b.cons.map((c,i)=>(
                <div key={i} style={{display:"flex",gap:7,marginBottom:5}}>
                  <span style={{color:"#D97706",flexShrink:0}}>!</span>
                  <span style={{fontSize:12,color:"#475569",lineHeight:1.45}}>{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{fontSize:12,color:"#64748B"}}>
              <span style={{fontWeight:600,color:"#0F172A"}}>Min. investment: </span>{b.min}
            </div>
            <span style={{color:BR}}>·</span>
            <a href={b.url} target="_blank" rel="noopener noreferrer"
              style={{fontSize:12,color:ACC,fontWeight:600,textDecoration:"none",
                display:"flex",alignItems:"center",gap:4}}>
              Visit {b.name} ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab content sections ──────────────────────────────────────────────────────
function SetupSection() {
  return (
    <div>
      <SectionHeader step="1" title="Choose your broker"
        subtitle="A broker is the middleman between you and the share market. You open an account, deposit funds, then buy and sell through them."/>

      <InfoBox icon="🏛️" title="What is a broker?" color="blue">
        A brokerage is a licensed financial intermediary that executes your buy and sell orders
        on the share market. When you buy CBA shares or a VGS ETF, your broker processes that
        trade and holds the securities in your name. You never hold shares directly — they're
        recorded on a central register (CHESS in Australia).
      </InfoBox>

      <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:10,marginTop:18}}>
        🇦🇺 Australian brokers — for ASX stocks and ETFs
      </div>
      {BROKERS_AU.map(b=><BrokerCard key={b.name} b={b}/>)}

      <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:10,marginTop:18}}>
        🌐 For US stocks (S&P 500, Nasdaq)
      </div>
      {BROKERS_US.map(b=><BrokerCard key={b.name} b={b}/>)}

      <InfoBox icon="💡" title="Which broker should I choose?" color="green">
        <strong>Starting out with ETFs?</strong> Pearler (autoinvest) or Superhero ($0 ETF brokerage) are
        both excellent. <strong>Want US stocks too?</strong> Stake ($0 US brokerage) or IBKR (most powerful).
        <strong> Using CBA?</strong> CommSec integrates directly with your bank account — simplest setup.
        All AU brokers above are ASIC-regulated.
      </InfoBox>
    </div>
  );
}

function AccountSection() {
  return (
    <div>
      <SectionHeader step="2" title="Open your account"
        subtitle="Takes 10–20 minutes online. You'll need ID and your tax file number."/>

      <Card accent={ACC}>
        <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:12}}>
          What you'll need to open a brokerage account in Australia
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            {icon:"🪪",item:"Australian driver's licence or passport"},
            {icon:"🔢",item:"Tax File Number (TFN) — not mandatory but avoids 47% withholding"},
            {icon:"📧",item:"Email address (your login credential)"},
            {icon:"📱",item:"Mobile number for two-factor authentication"},
            {icon:"🏦",item:"Bank account BSB and account number for deposits"},
            {icon:"📮",item:"Residential address — must match your ID"},
          ].map(({icon,item})=>(
            <div key={item} style={{display:"flex",gap:8,alignItems:"flex-start",
              padding:"8px 10px",background:C.gray50,borderRadius:7}}>
              <span style={{fontSize:14,flexShrink:0}}>{icon}</span>
              <span style={{fontSize:12,color:"#475569",lineHeight:1.5}}>{item}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:8,marginTop:4}}>
        Account opening steps
      </div>
      {[
        {n:"1",title:"Go to your chosen broker's website",
         desc:"Use the links above. Always type the URL directly — never click email links to financial sites."},
        {n:"2",title:"Click 'Open account' or 'Sign up'",
         desc:"Choose 'Individual' account type (not company or SMSF unless applicable)."},
        {n:"3",title:"Complete the online form",
         desc:"Enter personal details, TFN, employment status, and investing experience. Takes 10–15 minutes."},
        {n:"4",title:"Verify your identity",
         desc:"Most brokers use electronic ID verification (driver's licence or passport) — instant in most cases."},
        {n:"5",title:"Account activation",
         desc:"CommSec and SelfWealth typically activate within 1 business day. Pearler and Superhero often instant."},
        {n:"6",title:"Link your bank account",
         desc:"Add your BSB and account number. Some brokers require a small test deposit to verify ownership."},
      ].map(s=><StepRow key={s.n} {...s}/>)}

      <InfoBox icon="🔒" title="Is my money safe?" color="green">
        All brokers listed above are ASIC-regulated and hold client money in trust accounts
        separate from the broker's own funds. ASX-listed securities are CHESS-sponsored — held
        in your name on the ASX register, not the broker's. If your broker collapses,
        your shares are still yours. Cash held in your broker account is the only exposure.
      </InfoBox>
    </div>
  );
}

function FundSection() {
  return (
    <div>
      <SectionHeader step="3" title="Deposit funds"
        subtitle="Transfer money from your bank to your broker account before you can buy anything."/>

      {[
        {title:"BPAY (most common)",icon:"🏧",
         desc:"Use the BPAY biller code and reference number from your broker account. Money arrives next business day. Free."},
        {title:"Direct bank transfer (EFT)",icon:"🏦",
         desc:"Transfer to your broker's trust account BSB/account number. Arrives same or next business day. Free."},
        {title:"POLi (instant)",icon:"⚡",
         desc:"Available on some brokers (CommSec). Direct transfer from your bank — instant settlement. May have small fee."},
        {title:"Credit/debit card",icon:"💳",
         desc:"Available on some platforms. Instant but often has a fee (1–2%). Generally not recommended."},
      ].map(({title,icon,desc})=>(
        <div key={title} style={{display:"flex",gap:14,alignItems:"flex-start",
          padding:"14px 0",borderBottom:`1px solid ${BR}`}}>
          <div style={{width:38,height:38,borderRadius:8,background:C.tealLight,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:18,flexShrink:0}}>{icon}</div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"#0F172A",marginBottom:2}}>{title}</div>
            <div style={{fontSize:12,color:"#64748B",lineHeight:1.5}}>{desc}</div>
          </div>
        </div>
      ))}

      <InfoBox icon="📅" title="How long does it take?" color="blue">
        Most deposits settle within <strong>1 business day</strong>. BPAY cut-off times vary —
        send before 5pm for next-day credit. Some brokers (Pearler, Superhero) show funds
        immediately but may restrict trading until cleared.
      </InfoBox>

      <InfoBox icon="💰" title="How much should I start with?" color="green">
        There's no single right answer, but consider:
        <br/><br/>
        <strong>ETF investors:</strong> $1,000–$5,000 minimum makes brokerage costs reasonable
        as a percentage (e.g. $9.50 on $2,000 = 0.48%, still meaningful but not excessive).
        <br/><br/>
        <strong>Individual stocks:</strong> $2,000+ per position is a common rule of thumb —
        enough that brokerage doesn't dominate your return, but not so concentrated it risks your portfolio.
        <br/><br/>
        <strong>Ongoing DCA:</strong> Even $200–$500/month compounds powerfully over 10+ years.
        Use the Monthly Buy Planner to optimise each month's purchase.
      </InfoBox>
    </div>
  );
}

function BuySection() {
  return (
    <div>
      <SectionHeader step="4" title="Buy your first investment"
        subtitle="Placing your first trade — what order types mean and how to use them safely."/>

      <InfoBox icon="📚" title="Key terms before you buy" color="purple">
        <strong>Market order</strong> — buy right now at whatever the current market price is.
        Fast, but price can differ from what you see. Fine for liquid ETFs like VGS, VAS.
        <br/><br/>
        <strong>Limit order</strong> — you set a maximum price you'll pay. The order only fills
        if the market price reaches your limit. Protects against buying at a spike. Recommended for
        less liquid stocks or volatile conditions.
        <br/><br/>
        <strong>Bid/Ask spread</strong> — the difference between what buyers will pay (bid)
        and sellers want (ask). Wide spread = less liquid stock. ETFs typically have very tight spreads.
      </InfoBox>

      <Card accent={ACC}>
        <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:12}}>
          Step-by-step: placing your first buy order
        </div>
        {[
          {n:"1",title:"Search for the stock or ETF by ticker",
           desc:"Type the ticker (e.g. VGS, CBA, NVDA) in your broker's search. Confirm it's the right security before proceeding."},
          {n:"2",title:"Check the price and spread",
           desc:"Look at the current bid and ask. For major ETFs, the spread should be tiny (1–2 cents). Wide spread = consider a limit order."},
          {n:"3",title:"Enter the dollar amount or number of units",
           desc:"Most brokers let you enter by dollar amount (recommended for ETFs) or number of units. Dollar amount is simpler."},
          {n:"4",title:"Choose your order type",
           desc:"Market order for major ETFs and liquid large caps. Limit order for smaller stocks or if you have a specific price target."},
          {n:"5",title:"Review and confirm",
           desc:"Check: correct ticker ✓, correct amount ✓, estimated brokerage shown ✓. Then confirm. Your order goes to market immediately."},
          {n:"6",title:"Receive your confirmation",
           desc:"You'll get an email confirmation within minutes. Your holding appears in your portfolio — settlement takes T+2 (2 business days)."},
        ].map(s=><StepRow key={s.n} {...s}/>)}
      </Card>

      <InfoBox icon="⏰" title="Best time to buy?" color="green">
        For ASX stocks and ETFs — market is open <strong>10:00am–4:00pm AEST weekdays</strong>.
        Avoid placing market orders in the first 10 minutes (pre-open auction can be volatile).
        <br/><br/>
        For US stocks — market is open <strong>10:30pm–5:00am AEDT (summer) / 11:30pm–6:00am AEST (winter)</strong>.
        Many AU brokers let you place orders during AU business hours that queue for the US open.
      </InfoBox>
    </div>
  );
}

function SellSection() {
  return (
    <div>
      <SectionHeader step="5" title="Selling — when and how"
        subtitle="Selling is the same process as buying, but there are tax implications to understand first."/>

      <InfoBox icon="⚠️" title="Think before you sell — CGT applies" color="amber">
        In Australia, when you sell a share or ETF at a profit, you pay <strong>Capital Gains Tax (CGT)</strong>
        on the profit at your marginal tax rate. However, if you've held the investment for{" "}
        <strong>more than 12 months</strong>, you get a 50% CGT discount — you only pay tax on half the gain.
        This is one of the most powerful tax incentives in the Australian tax system.
        <br/><br/>
        <strong>Example:</strong> Buy VGS at $100, sell at $140 after 18 months.
        Gain = $40. With the 50% discount, only $20 is taxable. At 32.5% marginal rate, tax = $6.50.
        Without the discount (sold in under 12 months), tax = $13.00.
      </InfoBox>

      <Card>
        <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:12}}>
          Good reasons to sell
        </div>
        <CheckRow>Rebalancing — your allocation has drifted significantly from target (e.g. 10%+)</CheckRow>
        <CheckRow>Life event — you need the funds for a specific goal (house deposit, retirement)</CheckRow>
        <CheckRow>Fundamental change — a company's business model has permanently changed for the worse</CheckRow>
        <CheckRow>Tax loss harvesting — selling at a loss to offset gains elsewhere in the same financial year</CheckRow>
      </Card>

      <Card accent="#DC2626">
        <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:12}}>
          Poor reasons to sell
        </div>
        {[
          "The market dropped and you're scared — short-term volatility is normal. Don't sell low.",
          "You saw a tip on social media — social media stock tips are overwhelmingly noise.",
          "You want to 'lock in gains' — staying invested compounding is usually better than timing.",
          "It feels uncomfortable to hold through a dip — discomfort is the price of long-run returns.",
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
            <span style={{color:"#DC2626",flexShrink:0}}>✗</span>
            <span style={{fontSize:13,color:"#475569",lineHeight:1.5}}>{r}</span>
          </div>
        ))}
      </Card>

      <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:8}}>
        How to place a sell order
      </div>
      {[
        {n:"1",title:"Go to your portfolio in the broker app",
         desc:"Click on the holding you want to sell. You'll see your cost base, current value, and unrealised gain/loss."},
        {n:"2",title:"Click 'Sell' and enter the quantity",
         desc:"Enter number of units or dollar value. Most brokers allow partial sells — you don't have to sell everything."},
        {n:"3",title:"Choose order type and confirm",
         desc:"Market order for liquid ETFs. Limit order if you want a minimum price. Review and confirm."},
        {n:"4",title:"Cash available after T+2",
         desc:"Sale proceeds appear in your cash account after 2 business days. You can then withdraw to your bank."},
        {n:"5",title:"Record your cost base for tax",
         desc:"Your broker's annual tax report (usually July) shows all transactions. Keep records or use a tax agent."},
      ].map(s=><StepRow key={s.n} {...s}/>)}
    </div>
  );
}

function MonitorSection() {
  return (
    <div>
      <SectionHeader step="6" title="Monitor your portfolio"
        subtitle="How to track performance, when to check, and how to avoid common mistakes."/>

      <InfoBox icon="🧘" title="Check less often than you think" color="blue">
        Research consistently shows that investors who check their portfolios less frequently
        make better decisions — they're less likely to panic-sell in downturns.
        For a long-term ETF portfolio, <strong>monthly is enough</strong>. Even quarterly is fine.
      </InfoBox>

      <Card accent={ACC}>
        <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:12}}>
          Recommended monitoring schedule
        </div>
        {[
          {freq:"Monthly",tasks:["Check your SmartETF health score","Run the Monthly Buy Planner for DCA instruction","Update holdings if you've made new purchases"]},
          {freq:"Quarterly",tasks:["Review allocation vs targets — rebalance if drifted 10%+","Check if any ETFs have changed their index or MER","Review your financial goal timeline"]},
          {freq:"Annually (June/July)",tasks:["Review broker's annual tax statement for CGT","Consider tax-loss harvesting before June 30","Review emergency fund — is it still 3–6 months of expenses?","Adjust monthly contributions if income has changed"]},
        ].map(({freq,tasks})=>(
          <div key={freq} style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:ACC,marginBottom:6,
              textTransform:"uppercase",letterSpacing:".06em"}}>{freq}</div>
            {tasks.map((t,i)=>(<CheckRow key={i}>{t}</CheckRow>))}
          </div>
        ))}
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <InfoBox icon="📉" title="Dealing with market drops" color="amber">
          Markets drop regularly — 10% corrections happen roughly every year, 20%+ bear markets
          every 3–5 years. The right response for a long-term investor is almost always:
          keep investing via DCA, don't sell, consider buying more. Time in market beats timing the market.
        </InfoBox>
        <InfoBox icon="📊" title="What is a 'good' return?" color="purple">
          The Australian share market (ASX 200) has returned ~10% p.a. historically including
          dividends. Global (MSCI World) ~11% p.a. in AUD. Your portfolio should be measured
          against a comparable index over 3–5 years, not against the best-performing asset of last year.
        </InfoBox>
      </div>

      <Card>
        <div style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:12}}>
          Tools inside SmartETF — use these monthly
        </div>
        {[
          {icon:"⊕",title:"Health score",href:"/dashboard",
           desc:"Overall 0–100 score — tells you if your portfolio has issues to address"},
          {icon:"⊗",title:"Overlap scanner",href:"/overlap",
           desc:"Checks if you're paying double fees for the same underlying stocks"},
          {icon:"◎",title:"Exposure map",href:"/exposure",
           desc:"Geographic and sector breakdown — are you properly diversified?"},
          {icon:"⟳",title:"Monthly buy planner",href:"/sip",
           desc:"Tells you exactly which ETF to buy this month with your DCA amount"},
          {icon:"↗",title:"Portfolio optimiser",href:"/optimiser",
           desc:"Suggests an improved ETF mix based on your goal"},
        ].map(({icon,title,href,desc})=>(
          <div key={title} style={{display:"flex",gap:12,alignItems:"flex-start",
            padding:"10px 0",borderBottom:`1px solid ${BR}`}}>
            <div style={{width:34,height:34,borderRadius:8,background:C.tealLight,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:16,color:C.tealDark,flexShrink:0}}>{icon}</div>
            <div style={{flex:1}}>
              <Link href={href} style={{fontSize:13,fontWeight:600,color:ACC,
                textDecoration:"none",display:"block",marginBottom:2}}>{title} →</Link>
              <div style={{fontSize:12,color:"#64748B"}}>{desc}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function GlossarySection() {
  const terms = [
    {t:"ASX",d:"Australian Securities Exchange — the primary share market in Australia where AU stocks and ETFs are listed and traded."},
    {t:"Brokerage",d:"The fee charged by your broker each time you buy or sell. Ranges from $0 to $29.95 depending on broker and trade size."},
    {t:"CHESS",d:"Clearing House Electronic Sub-register System — the ASX system that records share ownership in your name. CHESS-sponsored = you legally own the shares."},
    {t:"CGT",d:"Capital Gains Tax — tax on profit when you sell an investment. Held 12+ months? You get a 50% discount on the gain."},
    {t:"Cost base",d:"What you paid for an investment (including brokerage). Your CGT is calculated as sale price minus cost base."},
    {t:"DCA",d:"Dollar-Cost Averaging — investing a fixed amount regularly regardless of price. Reduces timing risk over long periods."},
    {t:"Dividend",d:"Cash payment from a company to shareholders, usually quarterly or semi-annually. AU dividends often come with franking credits."},
    {t:"ETF",d:"Exchange-Traded Fund — a basket of stocks that tracks an index, traded on the share market like a stock. Lower cost than managed funds."},
    {t:"Franking credits",d:"Tax credits attached to Australian dividends. Represent company tax already paid. Reduce your personal tax bill or generate a refund."},
    {t:"MER",d:"Management Expense Ratio — annual fee charged by an ETF or managed fund as a % of your investment. 0.07% = very cheap, 1%+ = expensive."},
    {t:"Market order",d:"Buy or sell at the current market price immediately. Fast, but you accept whatever price the market gives."},
    {t:"Limit order",d:"Buy or sell only at a specified price or better. Protects against unfavourable prices but may not fill if market doesn't reach your limit."},
    {t:"Portfolio",d:"Your complete set of investments — stocks, ETFs, super, cash — together."},
    {t:"Rebalancing",d:"Selling overweight positions and buying underweight ones to return to your target allocation. Typically done annually."},
    {t:"T+2",d:"Trade plus 2 days — the settlement period for Australian shares. Money and shares formally change hands 2 business days after the trade."},
    {t:"TFN",d:"Tax File Number — your ATO identifier. Providing your TFN to your broker prevents 47% withholding tax on dividends."},
    {t:"Yield",d:"Annual income (dividends) as a percentage of share price. 5% yield = $5 per year per $100 invested."},
  ];
  return (
    <div>
      <SectionHeader step="★" title="Glossary — key terms explained"
        subtitle="Plain English definitions of the most important investing terms."/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {terms.map(({t,d})=>(
          <div key={t} style={{background:"#fff",border:`1px solid ${BR}`,
            borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontSize:13,fontWeight:700,color:NAVY,marginBottom:3}}>{t}</div>
            <div style={{fontSize:12,color:"#64748B",lineHeight:1.55}}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const TABS = [
  {id:"brokers",  label:"1. Choose a broker",  icon:"🏦"},
  {id:"account",  label:"2. Open account",      icon:"📝"},
  {id:"fund",     label:"3. Deposit funds",     icon:"💵"},
  {id:"buy",      label:"4. Buy",               icon:"🛒"},
  {id:"sell",     label:"5. Sell",              icon:"📤"},
  {id:"monitor",  label:"6. Monitor",           icon:"📊"},
  {id:"glossary", label:"Glossary",             icon:"📖"},
];

export default function BuildGuide() {
  const [tab, setTab] = useState("brokers");

  return (
    <div>
      {/* Subtitle */}
      <p style={{fontSize:13,color:"#64748B",margin:"0 0 14px",lineHeight:1.5}}>
        Everything you need to start investing — brokers, accounts, buying, selling, and monitoring
      </p>

      {/* Hero banner */}
      <div style={{background:NAVY,borderRadius:10,padding:"20px 24px",
        marginBottom:18,display:"flex",alignItems:"center",
        justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:4}}>
            New to investing? Start here.
          </div>
          <div style={{fontSize:13,color:"#A5B4FC",lineHeight:1.6,maxWidth:520}}>
            This guide walks you through every step — from choosing a broker to placing your
            first trade and building a long-term portfolio. Takes about 30 minutes to read,
            then 20 minutes to open an account.
          </div>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          {[
            {icon:"⏱️",label:"30 min read"},
            {icon:"🇦🇺",label:"AU focused"},
            {icon:"✅",label:"Beginner friendly"},
          ].map(({icon,label})=>(
            <div key={label} style={{textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
              <div style={{fontSize:11,color:"#34D399",fontWeight:700}}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:20,
        background:"#fff",padding:4,borderRadius:10,border:`1px solid ${BR}`}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:"1 0 auto",minWidth:0,
            padding:"8px 12px",fontSize:12,fontWeight:tab===t.id?700:500,
            borderRadius:8,border:"none",cursor:"pointer",
            background:tab===t.id?NAVY:"transparent",
            color:tab===t.id?"#fff":"#475569",
            whiteSpace:"nowrap",
          }}>
            <span style={{marginRight:4}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab==="brokers"  && <SetupSection/>}
      {tab==="account"  && <AccountSection/>}
      {tab==="fund"     && <FundSection/>}
      {tab==="buy"      && <BuySection/>}
      {tab==="sell"     && <SellSection/>}
      {tab==="monitor"  && <MonitorSection/>}
      {tab==="glossary" && <GlossarySection/>}

      {/* Next step prompt */}
      {tab !== "glossary" && (
        <div style={{marginTop:20,background:"#F8FAFC",border:`1px solid ${BR}`,
          borderRadius:10,padding:"14px 18px",display:"flex",
          alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:13,color:"#64748B"}}>
            {tab==="brokers"?"Next: open your account →"
             :tab==="account"?"Next: deposit your first funds →"
             :tab==="fund"?"Next: place your first buy order →"
             :tab==="buy"?"Next: understand when to sell →"
             :tab==="sell"?"Next: set up your monitoring routine →"
             :"Explore SmartETF tools to manage your portfolio →"}
          </span>
          <button onClick={()=>{
            const order=["brokers","account","fund","buy","sell","monitor","glossary"];
            const idx=order.indexOf(tab);
            if(idx<order.length-1) setTab(order[idx+1]);
          }} style={{padding:"8px 18px",fontSize:13,fontWeight:600,borderRadius:8,
            background:ACC,color:"#fff",border:"none",cursor:"pointer"}}>
            Continue →
          </button>
        </div>
      )}

      <p style={{fontSize:11,color:"#94A3B8",marginTop:16,lineHeight:1.6}}>
        SmartETF provides general information and educational content only.
        Broker information is accurate to June 2025 — always verify current fees on the broker's website.
        Not financial advice. Always consult a licensed financial adviser before making investment decisions.
      </p>
    </div>
  );
}
