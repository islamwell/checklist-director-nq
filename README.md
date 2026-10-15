# DIRECTOR'S GOVERNANCE, INSPECTION & OPERATING PORTAL — NURULQURAN PAKISTAN

> **Live Cloudflare Production URL:** [https://checklist-director-nq.nurulquran.workers.dev](https://checklist-director-nq.nurulquran.workers.dev)  
> **GitHub Repository:** [https://github.com/islamwell/checklist-director-nq](https://github.com/islamwell/checklist-director-nq)

This integrated portal combines two core executive governance frameworks:
1. **Director's Branch Visit & Inspection System** (Campus walk-throughs, evidence, photos, live scorecards, and action plans).
2. **Director's Operating Checklist** (Target time allocation, daily/weekly/biweekly/monthly/quarterly/annual operational accountability, 14-KPI scorecard, delegation rules, and board review terms).

---

## 🏛️ System Overview

- **Branches Covered:** HQ Jauharabad, Al Baraka, Punjab College, Masjid, and any other campus or unit.
- **Visit Frequency:**
  - Each branch visited at least once every 8 weeks.
  - HQ visited monthly.
  - Minimum quota: **24 documented visits per year**.
- **Director Governance & Accountability:**
  - **Rule:** *"If it is not in the OMS or the accounts system, it did not happen. Every item below requires a system record, a signed document, or a written report."*
- **Tech Stack:**
  - **Edge Runtime:** Cloudflare Workers with Hono Framework.
  - **Relational Persistence:** Cloudflare D1 (Serverless SQLite).
  - **Security:** Standard Web Crypto PBKDF2-SHA256 password hashing (100,000 iterations), HTTP-only cookies, session revocation.
  - **Sharing:** Tokenized read-only link generation with configurable expiration and instant revocation.
  - **Sign-off:** Digital HTML5 canvas signature pad for Director & Branch Manager acknowledgment.
  - **Scorecard:** Automatic live scoring, progress bars, and official rating badge generation.

---

## 📋 Module 1: Director's Operating Checklist

### 1. Target Time Allocation (48–50 Hours/Week)
- **Financial oversight and controls:** 25% (12 hrs/wk)
- **Staff leadership and campus oversight:** 20% (10 hrs/wk)
- **Donor, community and masjid relations:** 15% (7 hrs/wk)
- **Academic and course oversight:** 10% (5 hrs/wk)
- **Systems enforcement (OMS, accounts):** 10% (5 hrs/wk)
- **Compliance, legal, audit, tax:** 10% (5 hrs/wk)
- **Strategy, board, planning:** 10% (5 hrs/wk)

### 2. Daily Checklist (16 Verifiable Proof Points)
- **Morning (before 9:30 AM):**
  1. Review OMS overnight alerts (>24h critical escalation).
  2. Check cash position across all banks (>PKR 50,000 variance escalation).
  3. Verify masjid and counter collections banked (<24h banking rule).
  4. Review urgent email/WhatsApp (Norway, donors, Ustadha's office).
  5. 15-minute HQ morning huddle & attendance.
  6. Confirm security/outage alert clearance.
- **Midday:**
  7. Approve purchase requests within limit (forward above-limit to board).
  8. Vendor advance ageing review (>30d delivery chase).
  9. Rotating unit transaction spot-check.
  10. Handle walk-ins, grievances, and donor relations.
- **Afternoon:**
  11. Personally close 3–5 open OMS work items.
  12. Review escalated student/fee/scholarship concessions.
  13. Sign cheques & payment approvals as second signatory (never sole).
- **End of Day:**
  14. Verify daily OMS updates submitted by all staff.
  15. Log own daily executive activity in OMS.
  16. Inbox zero or tomorrow's prioritized flags.

### 3. Weekly Checklist (Fixed Rhythm)
- **Monday:** Campus managers leadership meeting, OMS weekly summary, HR attendance review.
- **Tuesday:** Finance review with accountant (bank rec, cash flow, receivables), tax/withholding calendar.
- **Wednesday:** Rotating campus inspection walk-through.
- **Thursday:** Major donor calls (5 donors), procurement/vendor review.
- **Friday:** Jumu'ah at Masjid, donation counts review, Zakat & restricted fund check.
- **Saturday:** Academic review, system adoption check, personal top-5 weekly planning.
- **Sunday:** Rest day (emergency contact only).

### 4. Biweekly Checklist
1. Payroll review & dual approval before processing.
2. Vendor payment run approval.
3. Deep-dive unit audit (Al Baraka → Punjab College → Institute → Masjid → HQ → Norway).
4. Staff 1-on-1 check-ins (half the team every 2 weeks).
5. Overdue receivables chase instructions.
6. Norway coordination call (compliance, transfers, GDPR).
7. Ustadha's tour & event check.
8. System adoption metrics enforcement.
9. Legal, tax, and regulatory review.
10. Physical cash & petty cash count audit.

### 5. Monthly Checklist (Strict Deadlines)
- **By 7th:** Month-end close sign-off, bank reconciliations for all accounts.
- **By 10th:** Donation & Zakat segregation report, fee collection report, vendor advance ageing.
- **By 12th:** Budget vs actual variance analysis (>10% written explanation).
- **By 15th:** Board report submission, compliance calendar, 3-month cash flow forecast.
- **By 20th:** Campus manager performance reviews, course revenue reports.
- **By 25th:** Staff monthly check-ins, data protection log, HQ petty cash audit.
- **By 28th:** Fixed asset register check, security review, policy approvals, grievance review.

### 6. Quarterly & Yearly Governance
- **Quarterly:** Board presentations, risk register updates, external audit readiness, budget reforecasts, system developer performance review, Shariah advisor sign-off.
- **Yearly Calendar:** Pakistan Fiscal Year (July–June) & Norway Calendar Year synchronization.
- **Annual Duties:** External audit sign-off, AGM, board elections, strategy refresh, disaster recovery test, salary benchmarking, DPIA review.

### 7. Director's Performance Scorecard (14 KPIs)
1. Month-end close completed by 7th (Target: 12/12 months)
2. Bank reconciliations current (Target: 100%)
3. Zakat and restricted funds segregated (Target: 100%)
4. Audit findings (Target: Zero material findings)
5. Fee collection rate (Target: Improvement over baseline)
6. Donation growth (Target: Positive YoY)
7. Vendor advance recovery (Target: 90% in 60 days)
8. OMS daily update compliance (Target: >95% staff)
9. Purchase approvals within limit and on time (Target: 100%)
10. Critical compliance findings (Target: Zero)
11. Staff turnover (Target: Below sector average)
12. Campus visits completed (Target: 100% of schedule, min 24/yr)
13. Board reports submitted on time (Target: 12/12)
14. Data breaches (Target: Zero)

### 8. Delegation Rules (10 Things The Director Must NOT Do)
1. Never be sole signatory on any payment. Dual signature always.
2. Never enter transactions in accounts (accountant posts, Director approves).
3. Never handle cash directly.
4. Never approve a payment without invoice, PO, and delivery confirmation.
5. Never approve own expense/reimbursement (board approval required).
6. Never negotiate developer contract alone.
7. Never hold sole credentials to bank, hosting, or gateway accounts.
8. Never instruct staff verbally on financial matters (OMS written instructions only).
9. Never bypass OMS for task assignments or approvals.
10. Never let a month close without signed financial statements.

---

## 📑 Module 2: Branch Visit Checklist (Parts A — Q)

- **Part A:** Pre-Visit Preparation (12 tasks, unannounced protocol)
- **Part B:** Arrival & First Impressions (12 scored observations + photo gallery)
- **Part C:** Financial Controls & Cash (18 checks with evidence)
- **Part D:** Accounts & System Adoption (15 checks)
- **Part E:** Staff Performance & Welfare (15 checks)
- **Part F:** Academic Quality (15 checks, toggleable)
- **Part G:** Masjid Operations (15 checks, toggleable)
- **Part H:** Physical Assets & Infrastructure (15 checks)
- **Part I:** Procurement & Vendors (12 checks)
- **Part J:** Compliance, Safety & Security (15 checks)
- **Part K:** Community & Donor Relations (8 checks)
- **Part L:** Key Findings (Strengths, Weaknesses, Upgrades, Downgrades, Improvements, Deficiencies)
- **Part M:** Private Staff & Student Interviews (10 structured questions)
- **Part N:** Post-Visit Actions (12 time-bound actions within 48h)
- **Part O:** Live Scorecard & Rating Badge
- **Part P:** Director & Manager Touch/Stylus Signatures & OMS Reference
- **Part Q:** Annual Rotation Schedule Matrix (Tracking 24-visit minimum quota)

---

## 🔐 Default Sign-In Accounts

| Role | Username | Password | Access Level |
|---|---|---|---|
| **Director** | `director` | `NurulQuran2026!` | Full Admin, Sign-off, Operating Log, Schedule, Users |
| **Auditor** | `auditor` | `Auditor2026!` | Inspection entry, photos, findings, schedule update |
| **Branch Manager** | `manager` | `Manager2026!` | View branch reports, sign acknowledgment |
| **Board Member** | `board` | `Board2026!` | Read-only executive review & scorecard |

---

## 🚀 Commands & Deployment

```bash
# Install dependencies
npm install

# Initialize local database
npm run d1:init

# Start local server
npm run dev

# Deploy to Cloudflare Workers & D1
npm run deploy
```

---

## 📄 Footer Versioning & Compliance

- **Current Version:** `v1.0.3 (updated 2026-10-15 14:56)`
- **Cloudflare Endpoint:** [https://checklist-director-nq.nurulquran.workers.dev](https://checklist-director-nq.nurulquran.workers.dev)
- **GitHub Repository:** [https://github.com/islamwell/checklist-director-nq](https://github.com/islamwell/checklist-director-nq)
