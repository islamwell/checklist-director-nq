// NurulQuran Pakistan - Director's Operating Checklist Data & Governance Rules

export interface TimeAllocationArea {
  id: string;
  area: string;
  percent: number;
  hoursPerWeek: number;
}

export interface OperatingTaskItem {
  id: number;
  action: string;
  evidence: string;
  escalationTrigger?: string;
  deadline?: string;
  day?: string;
  done?: boolean;
  notes?: string;
  omsRef?: string;
}

export interface KPIDefinition {
  kpiNum: number;
  kpi: string;
  target: string;
  measuredBy: string;
  currentValue?: string;
  status?: 'on_track' | 'attention' | 'critical' | 'achieved';
  notes?: string;
}

export const TIME_ALLOCATIONS: TimeAllocationArea[] = [
  { id: 'fin', area: 'Financial oversight and controls', percent: 25, hoursPerWeek: 12 },
  { id: 'staff', area: 'Staff leadership and campus oversight', percent: 20, hoursPerWeek: 10 },
  { id: 'donor', area: 'Donor, community and masjid relations', percent: 15, hoursPerWeek: 7 },
  { id: 'acad', area: 'Academic and course oversight', percent: 10, hoursPerWeek: 5 },
  { id: 'sys', area: 'Systems enforcement (OMS, accounts)', percent: 10, hoursPerWeek: 5 },
  { id: 'comp', area: 'Compliance, legal, audit, tax', percent: 10, hoursPerWeek: 5 },
  { id: 'strat', area: 'Strategy, board, planning', percent: 10, hoursPerWeek: 5 }
];

export const DAILY_CHECKLIST_TEMPLATE = {
  morning: [
    { id: 1, action: 'Review OMS overnight alerts: overdue tasks, unapproved purchase requests, flagged items', evidence: 'OMS dashboard screenshot / sign-off log', escalationTrigger: 'Any Critical item >24h old', done: false, notes: '', omsRef: '' },
    { id: 2, action: "Check cash position: all bank balances, previous day's receipts, daily cash report", evidence: 'Accounts dashboard entry in daily log', escalationTrigger: 'Any unexplained variance >PKR 50,000', done: false, notes: '', omsRef: '' },
    { id: 3, action: 'Verify masjid and counter receipting from previous day is entered and banked', evidence: 'Receipt register + bank deposit slip', escalationTrigger: 'Any unbanked cash >24h', done: false, notes: '', omsRef: '' },
    { id: 4, action: "Review urgent email and WhatsApp: Norway, donors, Ustadha's office, officials", evidence: 'Inbox action log', escalationTrigger: 'Anything requiring board within 48h', done: false, notes: '', omsRef: '' },
    { id: 5, action: '15-minute HQ huddle: priorities, blockers, staff attendance', evidence: 'Attendance record + huddle note in OMS', escalationTrigger: 'Two or more staff absent without notice', done: false, notes: '', omsRef: '' },
    { id: 6, action: 'Confirm no Critical security or system outage alerts', evidence: 'OMS/IT log', escalationTrigger: 'Any breach — notify within 24h', done: false, notes: '', omsRef: '' }
  ],
  midday: [
    { id: 7, action: 'Approve pending purchase requests within own limit; forward above-limit to board', evidence: 'OMS approval record', escalationTrigger: 'Any request above limit without two quotes', done: false, notes: '', omsRef: '' },
    { id: 8, action: 'Review vendor advance ageing; chase overdue deliveries', evidence: 'OMS vendor log updated', escalationTrigger: 'Advance >30 days with no delivery', done: false, notes: '', omsRef: '' },
    { id: 9, action: 'Spot-check one transaction or receipt from a rotating unit', evidence: 'Signed spot-check note in OMS', escalationTrigger: 'Any discrepancy — investigate same day', done: false, notes: '', omsRef: '' },
    { id: 10, action: 'Handle walk-ins: donors, parents, staff grievances, officials', evidence: 'Grievance log / meeting note', escalationTrigger: 'Grievance unresolved >7 days', done: false, notes: '', omsRef: '' }
  ],
  afternoon: [
    { id: 11, action: 'Personally close 3–5 open OMS work items assigned to the Director', evidence: 'OMS task closure', escalationTrigger: 'Any item open >14 days', done: false, notes: '', omsRef: '' },
    { id: 12, action: 'Review escalated student, fee, or scholarship matters', evidence: 'Case note in OMS', escalationTrigger: 'Any refund or concession above policy', done: false, notes: '', omsRef: '' },
    { id: 13, action: 'Sign cheques and payment approvals as second signatory (never sole)', evidence: 'Cheque register + dual signature', escalationTrigger: 'Any payment without invoice or PO', done: false, notes: '', omsRef: '' }
  ],
  endOfDay: [
    { id: 14, action: 'Confirm all staff submitted daily OMS updates; chase non-submitters', evidence: 'OMS compliance report', escalationTrigger: 'Repeat non-submitter → written warning', done: false, notes: '', omsRef: '' },
    { id: 15, action: 'Update own daily log in OMS: decisions, follow-ups, money approved', evidence: 'OMS daily log', escalationTrigger: 'Missing log = performance issue', done: false, notes: '', omsRef: '' },
    { id: 16, action: 'Clear inbox to zero or flag for tomorrow', evidence: 'Inbox state', escalationTrigger: 'More than 10 unresolved flags', done: false, notes: '', omsRef: '' }
  ]
};

export const WEEKLY_CHECKLIST = [
  { day: 'Monday', action: "Leadership meeting with all campus managers: last week's KPIs, this week's plan, blockers", evidence: 'Minutes + action list in OMS', done: false, notes: '' },
  { day: 'Monday', action: 'Review weekly executive summary report from OMS', evidence: 'Signed report', done: false, notes: '' },
  { day: 'Monday', action: 'Review staff attendance, leave, and overtime across all units', evidence: 'HR summary', done: false, notes: '' },
  { day: 'Tuesday', action: 'Finance review with accountant: bank reconciliation, cash flow, payables, receivables ageing, fee collection, donation report', evidence: 'Signed finance pack', done: false, notes: '' },
  { day: 'Tuesday', action: 'Review withholding tax and compliance calendar for the week', evidence: 'Compliance log', done: false, notes: '' },
  { day: 'Wednesday', action: 'Campus visit (rotating): physical walkthrough, asset check, staff meeting, student interaction', evidence: 'Visit report with photos in OMS', done: false, notes: '' },
  { day: 'Thursday', action: 'Donor and fundraising: call 5 major donors, review pipeline, sign acknowledgment letters', evidence: 'Donor log + call notes', done: false, notes: '' },
  { day: 'Thursday', action: 'Vendor and procurement review: open POs, pending deliveries, disputes', evidence: 'Procurement report', done: false, notes: '' },
  { day: 'Friday', action: "Masjid day: attend Jumu'ah, review collections, community engagement, meet worshippers", evidence: 'Masjid report', done: false, notes: '' },
  { day: 'Friday', action: 'Review Zakat and restricted fund transactions for the week', evidence: 'Fund report', done: false, notes: '' },
  { day: 'Saturday', action: 'Academic review: course progress, teacher performance, exam schedules, student complaints', evidence: 'Academic report', done: false, notes: '' },
  { day: 'Saturday', action: 'Review system adoption: OMS usage by user, accounts entries per unit', evidence: 'Usage dashboard', done: false, notes: '' },
  { day: 'Saturday', action: "Personal planning: review week, set next week's top 5 priorities", evidence: 'Written plan', done: false, notes: '' },
  { day: 'Sunday', action: 'Rest day. Emergency contact only.', evidence: '—', done: true, notes: 'Rest day' }
];

export const BIWEEKLY_CHECKLIST: OperatingTaskItem[] = [
  { id: 1, action: 'Payroll review and approval (before processing)', evidence: 'Signed payroll register', done: false, notes: '' },
  { id: 2, action: 'Vendor payment run review and approval', evidence: 'Payment schedule with dual approval', done: false, notes: '' },
  { id: 3, action: "Deep-dive audit of one unit's books (rotating: Al Baraka → Punjab College → Institute → Masjid → HQ → Norway)", evidence: 'Audit note with findings and corrections', done: false, notes: '' },
  { id: 4, action: 'One-on-one meetings with half the staff (each staff member every 4 weeks)', evidence: 'Meeting notes', done: false, notes: '' },
  { id: 5, action: 'Review overdue receivables; issue follow-up instructions', evidence: 'Ageing report with actions', done: false, notes: '' },
  { id: 6, action: 'Norway coordination call: compliance, donations, transfers, GDPR', evidence: 'Call minutes', done: false, notes: '' },
  { id: 7, action: "Ustadha's tour and event planning check: logistics, sign-ups, budget", evidence: 'Event tracker', done: false, notes: '' },
  { id: 8, action: 'Review system adoption metrics; address non-adoption', evidence: 'Adoption report', done: false, notes: '' },
  { id: 9, action: 'Review open legal, tax, or regulatory matters', evidence: 'Compliance tracker', done: false, notes: '' },
  { id: 10, action: 'Check petty cash and physical cash counts at one unit', evidence: 'Cash count sheet', done: false, notes: '' }
];

export const MONTHLY_CHECKLIST: OperatingTaskItem[] = [
  { id: 1, action: 'Month-end close: sign off trial balance, income & expenditure, balance sheet, cash flow per unit and combined', evidence: 'Signed financial statements', deadline: '7th of following month', done: false, notes: '' },
  { id: 2, action: 'Bank reconciliation review for all accounts', evidence: 'Signed reconciliation', deadline: '7th', done: false, notes: '' },
  { id: 3, action: 'Donation and Zakat report: verify fund segregation, restricted fund balances, distributions', evidence: 'Fund report + Shariah advisor note', deadline: '10th', done: false, notes: '' },
  { id: 4, action: 'Fee collection report: billed vs collected, defaulter list, follow-up plan', evidence: 'Report + action plan', deadline: '10th', done: false, notes: '' },
  { id: 5, action: 'Vendor ageing and advance reconciliation', evidence: 'Report', deadline: '10th', done: false, notes: '' },
  { id: 6, action: 'Budget vs actual variance analysis with written explanations for variances >10%', evidence: 'Variance report', deadline: '12th', done: false, notes: '' },
  { id: 7, action: 'Board report preparation and submission', evidence: 'Board pack', deadline: '15th', done: false, notes: '' },
  { id: 8, action: 'Compliance calendar: tax filings, withholding, NPO filings, Norway obligations', evidence: 'Compliance checklist', deadline: '15th', done: false, notes: '' },
  { id: 9, action: 'Cash flow forecast for next 3 months', evidence: 'Forecast', deadline: '15th', done: false, notes: '' },
  { id: 10, action: 'Campus manager performance review', evidence: 'Written review', deadline: '20th', done: false, notes: '' },
  { id: 11, action: 'Course revenue and enrollment report', evidence: 'Report', deadline: '20th', done: false, notes: '' },
  { id: 12, action: 'Staff monthly check-ins completed', evidence: 'HR log', deadline: '25th', done: false, notes: '' },
  { id: 13, action: 'Data protection review: access logs, breach reports, retention compliance', evidence: 'Privacy log', deadline: '25th', done: false, notes: '' },
  { id: 14, action: 'Petty cash audit at HQ', evidence: 'Audit sheet', deadline: '25th', done: false, notes: '' },
  { id: 15, action: 'Fixed asset register check', evidence: 'Asset register', deadline: '28th', done: false, notes: '' },
  { id: 16, action: 'Security review: physical and digital', evidence: 'Security report', deadline: '28th', done: false, notes: '' },
  { id: 17, action: 'Review and approve new policies or procedure changes', evidence: 'Signed policy', deadline: '28th', done: false, notes: '' },
  { id: 18, action: 'Review open grievances and disciplinary matters', evidence: 'Grievance log', deadline: '28th', done: false, notes: '' }
];

export const QUARTERLY_CHECKLIST: OperatingTaskItem[] = [
  { id: 1, action: 'Board meeting presentation: financials, KPIs, risks, strategy', evidence: 'Board minutes', done: false, notes: '' },
  { id: 2, action: 'Strategy review: progress against annual plan', evidence: 'Strategy scorecard', done: false, notes: '' },
  { id: 3, action: 'Risk register update: financial, legal, operational, reputational, data', evidence: 'Risk register', done: false, notes: '' },
  { id: 4, action: 'External audit preparation review', evidence: 'Audit readiness checklist', done: false, notes: '' },
  { id: 5, action: 'Budget reforecast', evidence: 'Revised budget', done: false, notes: '' },
  { id: 6, action: 'Staff training needs assessment', evidence: 'Training plan', done: false, notes: '' },
  { id: 7, action: 'System performance review with developer: uptime, defects, support tickets, change requests', evidence: 'Meeting minutes', done: false, notes: '' },
  { id: 8, action: 'Donor stewardship report: acknowledgments, impact, retention', evidence: 'Donor report', done: false, notes: '' },
  { id: 9, action: 'Zakat distribution review with Shariah advisor', evidence: 'Shariah sign-off', done: false, notes: '' },
  { id: 10, action: 'Insurance and contract compliance review', evidence: 'Insurance certificates', done: false, notes: '' },
  { id: 11, action: 'Succession and key-person risk review', evidence: 'HR note', done: false, notes: '' }
];

export const YEARLY_CALENDAR = [
  { month: 'July', duties: 'New fiscal year: implement approved budget, confirm opening balances, launch annual plan', evidence: 'Budget adoption + opening TB' },
  { month: 'August', duties: 'Mid-year academic review; Independence Day events; staff retreat planning', evidence: 'Academic report' },
  { month: 'September', duties: 'Admission cycle review; fee structure review; campus capacity plan', evidence: 'Fee policy + capacity report' },
  { month: 'October', duties: 'Q2 board preparation; audit preparation begins; donor annual appeal planning', evidence: 'Audit plan' },
  { month: 'November', duties: 'Donor annual appeal launch; Norway year-end preparation; insurance renewal review', evidence: 'Appeal plan' },
  { month: 'December', duties: 'Norway calendar-year close; GDPR annual review; Norway audit preparation', evidence: 'Norway close pack' },
  { month: 'January', duties: 'Pakistan mid-year review; Norway audit; new-year goal setting', evidence: 'Mid-year report' },
  { month: 'February', duties: 'Staff annual appraisals; salary review; training plan for year', evidence: 'Appraisal records' },
  { month: 'March', duties: 'Annual audit fieldwork; policy review; compliance audit', evidence: 'Audit findings' },
  { month: 'April', duties: 'Zakat season preparation (Ramadan); iftar and fundraising programs', evidence: 'Ramadan plan' },
  { month: 'May', duties: 'Ramadan: Zakat distribution, iftar programs, peak fundraising, donor engagement', evidence: 'Zakat distribution report' },
  { month: 'June', duties: 'Fiscal year-end close; audit finalization; next year budget; AGM', evidence: 'Signed accounts + budget' }
];

export const ANNUAL_ONE_TIME_DUTIES: OperatingTaskItem[] = [
  { id: 1, action: 'External audit completed and signed', evidence: 'Audit report', done: false, notes: '' },
  { id: 2, action: 'AGM / general body meeting', evidence: 'Minutes', done: false, notes: '' },
  { id: 3, action: 'Board elections or renewal', evidence: 'Governance record', done: false, notes: '' },
  { id: 4, action: '3–5 year strategy review and refresh', evidence: 'Strategy document', done: false, notes: '' },
  { id: 5, action: 'Capital and infrastructure plan', evidence: 'Capital plan', done: false, notes: '' },
  { id: 6, action: 'Insurance renewal (property, liability, cyber, staff)', evidence: 'Policies', done: false, notes: '' },
  { id: 7, action: 'Legal compliance review (Pakistan and Norway)', evidence: 'Legal memo', done: false, notes: '' },
  { id: 8, action: 'Disaster recovery and backup restore test', evidence: 'Test report', done: false, notes: '' },
  { id: 9, action: 'Full system security review with developer', evidence: 'Security report', done: false, notes: '' },
  { id: 10, action: 'Vendor and contract register review', evidence: 'Contract register', done: false, notes: '' },
  { id: 11, action: 'Staff salary benchmarking', evidence: 'Benchmark report', done: false, notes: '' },
  { id: 12, action: 'Annual report to donors and community', evidence: 'Published report', done: false, notes: '' },
  { id: 13, action: 'Data protection impact assessment review', evidence: 'DPIA', done: false, notes: '' },
  { id: 14, action: 'Business continuity plan test', evidence: 'Test report', done: false, notes: '' }
];

export const DIRECTOR_KPIS: KPIDefinition[] = [
  { kpiNum: 1, kpi: 'Month-end close completed by 7th', target: '12/12 months', measuredBy: 'Accounts system', currentValue: 'Current', status: 'on_track' },
  { kpiNum: 2, kpi: 'Bank reconciliations current', target: '100%', measuredBy: 'Accounts system', currentValue: '100%', status: 'on_track' },
  { kpiNum: 3, kpi: 'Zakat and restricted funds fully segregated and reconciled', target: '100%', measuredBy: 'Auditor', currentValue: '100%', status: 'on_track' },
  { kpiNum: 4, kpi: 'Audit findings', target: 'Zero material findings', measuredBy: 'Audit report', currentValue: '0 findings', status: 'on_track' },
  { kpiNum: 5, kpi: 'Fee collection rate', target: 'Improvement over baseline', measuredBy: 'Fee report', currentValue: '+14% vs baseline', status: 'on_track' },
  { kpiNum: 6, kpi: 'Donation growth', target: 'Positive year-on-year', measuredBy: 'Donor report', currentValue: '+18% YoY', status: 'on_track' },
  { kpiNum: 7, kpi: 'Vendor advance recovery', target: '90% of advances resolved within 60 days', measuredBy: 'OMS', currentValue: '92% resolved', status: 'on_track' },
  { kpiNum: 8, kpi: 'OMS daily update compliance', target: '>95% of staff', measuredBy: 'OMS dashboard', currentValue: '96.4%', status: 'on_track' },
  { kpiNum: 9, kpi: 'Purchase approvals within limit and on time', target: '100%', measuredBy: 'OMS', currentValue: '100%', status: 'on_track' },
  { kpiNum: 10, kpi: 'Critical audit or compliance findings', target: 'Zero', measuredBy: 'Audit / regulator', currentValue: '0', status: 'on_track' },
  { kpiNum: 11, kpi: 'Staff turnover', target: 'Below sector average', measuredBy: 'HR', currentValue: '4.2% (Low)', status: 'on_track' },
  { kpiNum: 12, kpi: 'Campus visits completed', target: '100% of schedule (min 24/yr)', measuredBy: 'Visit reports', currentValue: 'On schedule', status: 'on_track' },
  { kpiNum: 13, kpi: 'Board reports submitted on time', target: '12/12', measuredBy: 'Board minutes', currentValue: '100% on time', status: 'on_track' },
  { kpiNum: 14, kpi: 'Data breaches', target: 'Zero', measuredBy: 'Privacy log', currentValue: '0', status: 'on_track' }
];

export const DELEGATION_RULES = [
  { num: 1, rule: 'Never be sole signatory on any payment. Dual signature always.' },
  { num: 2, rule: 'Never enter transactions in the accounts system. That is the accountant’s role; the Director approves, not posts.' },
  { num: 3, rule: 'Never handle cash directly. Counter staff receipt; the Director verifies.' },
  { num: 4, rule: 'Never approve a payment without an invoice, PO, and delivery confirmation.' },
  { num: 5, rule: 'Never approve their own reimbursement or expense. Board approval required.' },
  { num: 6, rule: 'Never negotiate the developer contract alone. Board and legal review required.' },
  { num: 7, rule: 'Never hold sole credentials to any bank, hosting, or gateway account. Institute ownership, dual access.' },
  { num: 8, rule: 'Never instruct staff verbally on financial matters. Written instruction in OMS only.' },
  { num: 9, rule: 'Never bypass the OMS for task assignment or approvals. If it is not in the system, it is not authorised.' },
  { num: 10, rule: 'Never let a month close without signed financial statements.' }
];

export const ACCOUNTABILITY_TERMS = [
  'This checklist is part of the Director’s contract and performance review.',
  'Failure to maintain evidence for any monthly item for two consecutive months is a formal performance issue.',
  'Failure on any KPI marked Critical (audit findings, bank reconciliation, Zakat segregation, dual signature) is grounds for a performance improvement plan.',
  'The board reviews this checklist quarterly and the Director’s scorecard annually.',
  'The Director may propose changes to the checklist; the board approves them in writing.'
];
