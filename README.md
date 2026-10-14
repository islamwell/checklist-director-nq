# DIRECTOR'S BRANCH VISIT & INSPECTION SYSTEM — NURULQURAN PAKISTAN

**Standardised inspection system for every campus and branch unit.**
Every visit produces a written report with scores, photos, findings, and an action plan. The report goes into the OMS within 48 hours.

---

## 🏛️ System Overview

- **Branches Covered:** HQ Jauharabad, Al Baraka, Punjab College, Masjid, and any other campus or unit.
- **Visit Frequency:**
  - Each branch visited at least once every 8 weeks.
  - HQ visited monthly.
  - Minimum quota: **24 documented visits per year**.
- **Tech Stack:**
  - **Edge Runtime:** Cloudflare Workers with Hono Framework.
  - **Relational Persistence:** Cloudflare D1 (Serverless SQLite).
  - **Security:** Standard Web Crypto PBKDF2-SHA256 password hashing (100,000 iterations), HTTP-only cookies, session revocation.
  - **Sharing:** Tokenized read-only link generation with configurable expiration and instant revocation.
  - **Sign-off:** Digital HTML5 canvas signature pad for Director & Branch Manager acknowledgment.
  - **Scorecard:** Automatic live scoring, progress bars, and official rating badge generation.

---

## 📑 Complete Inspection Structure (Parts A — Q)

1. **PART A — Pre-Visit Preparation (2 Days Before):** 12 preparatory tasks (unannounced arrival policy, financials, OMS, HR, academic data, surprise items, logistics).
2. **PART B — Arrival and First Impressions (Unannounced Walk-Through):** 12 scored observation checks + mandatory photo uploads (Entrance, Notice Board, Cash Storage, Deficiencies, Strengths).
3. **PART C — Financial Controls and Cash:** 18 audit checks with physical evidence requirements (cash counts, receipt books, bank slips, dual signatures, segregation of duties).
4. **PART D — Accounts and System Adoption:** 15 checks on OMS daily updates, timestamps, 2FA, backups, and user access.
5. **PART E — Staff Performance and Welfare:** 15 checks on attendance, contracts, timely payroll, grievances, and safeguarding.
6. **PART F — Academic Quality (Institute and College Branches):** 15 checks on curriculum alignment, exams, lesson plans, and parent communication (toggleable per branch).
7. **PART G — Masjid Operations (Masjid Branch):** 15 checks on prayer times, wudu cleanliness, donation box dual-counting, and Zakat segregation (toggleable per branch).
8. **PART H — Physical Assets and Infrastructure:** 15 checks on asset register matching, IT, generator/UPS, building condition, and repair identification.
9. **PART I — Procurement and Vendors:** 12 checks on agreed rates, 3-quotes threshold, advance aging, and delivery verification.
10. **PART J — Compliance, Safety and Security:** 15 checks on tax filings, fire safety, CCTV, visitor logs, and guard alertness.
11. **PART K — Community and Donor Relations:** 8 checks on donor acknowledgments, community standing, and welfare records.
12. **PART L — Strengths, Weaknesses, and Recommendations:**
    - Strengths (Pros) & Replication strategy
    - Weaknesses (Cons) with Severity (Critical/High/Medium/Low), Root causes, and Immediate actions
    - Upgrades needed (Cost, Priority, Deadline, Responsible)
    - Downgrades or savings identified
    - Improvements recommended
    - Deficiencies found with Legal/Policy breach classification
13. **PART M — Staff and Student Interviews (Private):** 10 structured questions conducted privately across 3 Staff and 3 Students.
14. **PART N — Post-Visit Actions (Within 48 Hours):** 12 time-bound actions with deadlines (24h, Same day, 48h, Immediately, 7 days).
15. **PART O — Branch Scorecard:** Real-time automatic calculation of scores across all sections, maximum denominator adaptation, overall percentage, and rating scale:
    - **90–100%:** Excellent — model branch, share practices
    - **75–89%:** Good — minor improvements needed
    - **60–74%:** Satisfactory — action plan required
    - **40–59%:** Weak — immediate intervention, re-visit in 4 weeks
    - **Below 40%:** Critical — escalate to board, consider management change
16. **PART P — Director's Sign-Off:** Formal certification statement, digital touch/stylus signature pad for Director and Branch Manager, and OMS filing details.
17. **PART Q — Branch Visit Rotation Schedule (Annual):** Matrix view tracking visits planned vs completed across Jan—Dec to ensure the 24-visit minimum quota is met.

---

## 🔐 Default Access Accounts

When the database is first initialized, the following demo accounts are available:

| Role | Username | Password | Access Level |
|---|---|---|---|
| **Director** | `director` | `NurulQuran2026!` | Full Admin, Sign-off, User Management, Schedule Edit |
| **Auditor** | `auditor` | `Auditor2026!` | Inspection entry, photos, findings, schedule update |
| **Branch Manager** | `manager` | `Manager2026!` | View branch reports, sign acknowledgment |
| **Board Member** | `board` | `Board2026!` | Read-only executive review |

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Initialize local D1 database schema
npm run d1:init

# 3. Start Cloudflare development server
npm run dev
```

Visit `http://localhost:8787` in your browser.

---

## ☁️ Deploying to Cloudflare

```bash
# 1. Create your remote D1 database on Cloudflare
npx wrangler d1 create director_checklist_db

# 2. Update wrangler.jsonc with the returned database_id

# 3. Run migrations on the remote database
npm run d1:init:remote

# 4. Deploy worker and static assets
npm run deploy
```

---

## 🔗 Share Option (Inside Admin)

Directors and Auditors can click **"🔗 Share Link"** on any inspection report:
- Generate tokenized read-only links with custom expiration (7 days, 30 days, 90 days, or permanent).
- Copy the public executive presentation link (`/shared.html?token=...`).
- Copy pre-formatted WhatsApp briefing with scores and direct report URL.
- Revoke active share tokens instantly at any time.

---

## 📄 Footer Versioning & Compliance

- Current Version: `v1.0.1 (updated 2026-10-14 11:08)`
- Maintained per NurulQuran Pakistan Governance Guidelines.
