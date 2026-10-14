import { VisitData, ScorecardData } from './types';

export function createDefaultVisitData(hasMasjid = false, isAcademic = true): VisitData {
  return {
    partA: [
      { id: 1, task: 'Announce visit date in writing. Do not announce exact arrival time or agenda to prevent staging.', done: false, notes: '' },
      { id: 2, task: "Pull last visit's report and open action items for this branch", done: false, notes: '' },
      { id: 3, task: 'Pull branch financials: last 3 months income/expenditure, cash position, fee collection, donation report', done: false, notes: '' },
      { id: 4, task: 'Pull OMS data: task completion rate, overdue items, purchase requests, vendor advances, daily update compliance by staff', done: false, notes: '' },
      { id: 5, task: 'Pull HR data: attendance, leave, overtime, vacancies, disciplinary matters', done: false, notes: '' },
      { id: 6, task: 'Pull academic data: enrollment, attendance, exam results, teacher feedback, complaints', done: false, notes: '' },
      { id: 7, task: 'Pull asset register for the branch', done: false, notes: '' },
      { id: 8, task: 'Pull outstanding audit, compliance, or tax items', done: false, notes: '' },
      { id: 9, task: 'List unresolved grievances from staff or students', done: false, notes: '' },
      { id: 10, task: 'Prepare surprise items: documents to inspect without prior notice', done: false, notes: '' },
      { id: 11, task: 'Book transport and confirm logistics', done: false, notes: '' },
      { id: 12, task: 'Brief the auditor or accountant if accompanying', done: false, notes: '' }
    ],

    partB: [
      { id: 1, observation: 'Exterior: gate, signage, cleanliness, security guard present and alert', score: null, notes: '' },
      { id: 2, observation: 'Entrance: welcoming, safe, accessible, no hazards', score: null, notes: '' },
      { id: 3, observation: 'Reception: staffed, records maintained, visitors logged', score: null, notes: '' },
      { id: 4, observation: 'Cleanliness: floors, walls, toilets, kitchen, prayer area', score: null, notes: '' },
      { id: 5, observation: 'Lighting and ventilation', score: null, notes: '' },
      { id: 6, observation: 'Safety: fire extinguishers, emergency exits, first aid, electrical wiring', score: null, notes: '' },
      { id: 7, observation: 'Noise level and discipline in corridors and classrooms', score: null, notes: '' },
      { id: 8, observation: 'Students: present, engaged, respectful, in uniform (if applicable)', score: null, notes: '' },
      { id: 9, observation: 'Staff: present, attentive, not idle or on phones', score: null, notes: '' },
      { id: 10, observation: 'Notice boards: current, informative, not outdated or torn', score: null, notes: '' },
      { id: 11, observation: 'Unattended cash, documents, or valuables visible?', score: null, notes: '' },
      { id: 12, observation: 'Locks, cupboards, and cash storage secured?', score: null, notes: '' }
    ],

    photos: [],

    partC: [
      { id: 1, check: 'Cash on hand counted physically and matched to register', evidence: 'Cash count sheet signed by Director and cashier', score: null, notes: '' },
      { id: 2, check: 'All receipts pre-numbered and accounted for', evidence: 'Receipt book inspection', score: null, notes: '' },
      { id: 3, check: "Yesterday's collections banked; deposit slip available", evidence: 'Bank slip', score: null, notes: '' },
      { id: 4, check: 'Bank reconciliation up to date', evidence: 'Accounts system', score: null, notes: '' },
      { id: 5, check: 'Petty cash: balance correct, vouchers complete, no IOUs', evidence: 'Petty cash book', score: null, notes: '' },
      { id: 6, check: 'Fee collection: receipts issued, register updated, system entry same day', evidence: 'Fee register vs accounts', score: null, notes: '' },
      { id: 7, check: 'Donation receipts issued with proper acknowledgment', evidence: 'Donation register', score: null, notes: '' },
      { id: 8, check: 'Zakat and restricted funds kept separately and correctly recorded', evidence: 'Fund register', score: null, notes: '' },
      { id: 9, check: 'Vendor payments: PO, invoice, delivery note, approval all present', evidence: 'Voucher sample of 5', score: null, notes: '' },
      { id: 10, check: 'Vendor advances: documented, tracked, aged, no overdue unchased', evidence: 'OMS vendor log', score: null, notes: '' },
      { id: 11, check: 'No payment without dual signature', evidence: 'Cheque register', score: null, notes: '' },
      { id: 12, check: 'No cash payment above policy limit', evidence: 'Voucher review', score: null, notes: '' },
      { id: 13, check: 'Outstanding receivables: list exists, follow-up documented', evidence: 'Ageing report', score: null, notes: '' },
      { id: 14, check: 'No undocumented loans or inter-unit transfers', evidence: 'Ledger review', score: null, notes: '' },
      { id: 15, check: 'Cashier has no access to ledger posting (segregation of duties)', evidence: 'System access review', score: null, notes: '' },
      { id: 16, check: 'No personal money mixed with Institute money', evidence: 'Cash count', score: null, notes: '' },
      { id: 17, check: 'Safe combination known only to authorised persons', evidence: 'Interview', score: null, notes: '' },
      { id: 18, check: 'Cash insurance in place and current', evidence: 'Policy document', score: null, notes: '' }
    ],

    partD: [
      { id: 1, check: 'All transactions entered in the accounts system, not Excel or paper only', evidence: 'System vs physical records', score: null, notes: '' },
      { id: 2, check: 'Entries made within 24 hours of transaction', evidence: 'System timestamps', score: null, notes: '' },
      { id: 3, check: 'No silent edits or deletions; reversals used correctly', evidence: 'Audit trail', score: null, notes: '' },
      { id: 4, check: 'Two-step sign-in active for all financial users', evidence: 'System check', score: null, notes: '' },
      { id: 5, check: 'Access rights correct: no staff has more access than needed', evidence: 'User list review', score: null, notes: '' },
      { id: 6, check: 'Month-end close completed on time last 3 months', evidence: 'Signed statements', score: null, notes: '' },
      { id: 7, check: 'OMS daily updates submitted by all staff', evidence: 'OMS compliance report', score: null, notes: '' },
      { id: 8, check: 'Work items closed within deadline', evidence: 'OMS report', score: null, notes: '' },
      { id: 9, check: 'Purchase requests raised in OMS, not WhatsApp or verbal', evidence: 'OMS log', score: null, notes: '' },
      { id: 10, check: 'Vendor records complete: advance, pending, delivery, communication', evidence: 'OMS vendor records', score: null, notes: '' },
      { id: 11, check: 'Attachments (receipts, invoices, photos, voice notes) present', evidence: 'OMS sample', score: null, notes: '' },
      { id: 12, check: 'Staff can use the system without help', evidence: 'Live demonstration by staff', score: null, notes: '' },
      { id: 13, check: 'No parallel paper system undermining the system', evidence: 'Observation', score: null, notes: '' },
      { id: 14, check: 'Backups working; last restore test date confirmed', evidence: 'IT log', score: null, notes: '' },
      { id: 15, check: 'Passwords not shared; no written passwords visible', evidence: 'Physical check', score: null, notes: '' }
    ],

    partE: [
      { id: 1, check: 'Attendance register matches actual presence', evidence: 'Register vs headcount', score: null, notes: '' },
      { id: 2, check: 'Late arrivals and absences documented with reasons', evidence: 'Attendance record', score: null, notes: '' },
      { id: 3, check: 'Staff job descriptions available and understood', evidence: 'Interview sample', score: null, notes: '' },
      { id: 4, check: 'Staff know their supervisor and reporting line', evidence: 'Interview', score: null, notes: '' },
      { id: 5, check: 'Salaries paid on time, no deductions without written reason', evidence: 'Payroll record', score: null, notes: '' },
      { id: 6, check: 'Staff have contracts and appointment letters', evidence: 'HR file sample', score: null, notes: '' },
      { id: 7, check: 'No child labour or underage staff', evidence: 'Observation and records', score: null, notes: '' },
      { id: 8, check: 'Staff grievances: log maintained, resolved within 7 days', evidence: 'Grievance register', score: null, notes: '' },
      { id: 9, check: 'Disciplinary matters documented and fair', evidence: 'HR file', score: null, notes: '' },
      { id: 10, check: 'Training needs identified and recorded', evidence: 'Training log', score: null, notes: '' },
      { id: 11, check: 'Staff morale: interviews reveal satisfaction or issues', evidence: 'Interview 3 staff privately', score: null, notes: '' },
      { id: 12, check: 'No staff working excessive hours without overtime or compensation', evidence: 'Attendance + payroll', score: null, notes: '' },
      { id: 13, check: 'Staff understand safeguarding and child protection rules', evidence: 'Interview', score: null, notes: '' },
      { id: 14, check: 'Staff know how to report a concern', evidence: 'Interview', score: null, notes: '' },
      { id: 15, check: 'No favouritism or nepotism visible in roles or duties', evidence: 'Observation', score: null, notes: '' }
    ],

    partF: [
      { id: 1, check: 'Timetable displayed and followed', evidence: 'Observation', score: null, notes: '' },
      { id: 2, check: 'Teachers present and on time', evidence: 'Register', score: null, notes: '' },
      { id: 3, check: 'Lesson plans or course outlines available', evidence: 'Teacher file', score: null, notes: '' },
      { id: 4, check: 'Student attendance recorded daily', evidence: 'Register', score: null, notes: '' },
      { id: 5, check: 'Assessment records maintained; marks entered timely', evidence: 'Mark sheets', score: null, notes: '' },
      { id: 6, check: 'Student progress tracked; weak students identified', evidence: 'Progress report', score: null, notes: '' },
      { id: 7, check: 'Exam schedules followed; no leaks or irregularities', evidence: 'Exam records', score: null, notes: '' },
      { id: 8, check: 'Certificates issued only after genuine completion', evidence: 'Certificate register', score: null, notes: '' },
      { id: 9, check: 'Library or learning resources available and used', evidence: 'Observation', score: null, notes: '' },
      { id: 10, check: 'Student complaints: log maintained, resolved', evidence: 'Complaint register', score: null, notes: '' },
      { id: 11, check: 'Parent communication: meetings held, feedback recorded', evidence: 'Parent meeting log', score: null, notes: '' },
      { id: 12, check: "Teachers' performance reviewed regularly", evidence: 'Appraisal record', score: null, notes: '' },
      { id: 13, check: 'Curriculum current and approved', evidence: 'Curriculum document', score: null, notes: '' },
      { id: 14, check: "Course content aligns with NurulQuran's mission", evidence: 'Sample review', score: null, notes: '' },
      { id: 15, check: 'Online and on-campus students treated consistently', evidence: 'Interview', score: null, notes: '' }
    ],

    partG: [
      { id: 1, check: 'Cleanliness of prayer area, wudu area, toilets', evidence: 'Observation', score: null, notes: '' },
      { id: 2, check: 'Five daily prayers conducted on time', evidence: 'Attendance log', score: null, notes: '' },
      { id: 3, check: "Jumu'ah arrangements: capacity, sound, safety", evidence: 'Observation', score: null, notes: '' },
      { id: 4, check: 'Donation boxes sealed, numbered, dual-counted', evidence: 'Collection record', score: null, notes: '' },
      { id: 5, check: 'Collections counted in presence of two people, recorded', evidence: 'Count sheet', score: null, notes: '' },
      { id: 6, check: 'Collections banked within 24 hours', evidence: 'Bank slip', score: null, notes: '' },
      { id: 7, check: 'Zakat and Sadaqah kept separate and recorded', evidence: 'Fund register', score: null, notes: '' },
      { id: 8, check: 'Imam and staff paid on time, contracts in place', evidence: 'Payroll', score: null, notes: '' },
      { id: 9, check: 'Maintenance issues logged and addressed', evidence: 'Maintenance register', score: null, notes: '' },
      { id: 10, check: 'Community programs active and documented', evidence: 'Program log', score: null, notes: '' },
      { id: 11, check: 'Neighbours and community relations positive', evidence: 'Interview', score: null, notes: '' },
      { id: 12, check: 'Safety: exits, fire, electrical, crowd management', evidence: 'Inspection', score: null, notes: '' },
      { id: 13, check: 'No unauthorized use of masjid funds', evidence: 'Financial review', score: null, notes: '' },
      { id: 14, check: 'Donor acknowledgment issued for large donations', evidence: 'Receipt sample', score: null, notes: '' },
      { id: 15, check: 'Zakat distribution documented and Shariah-compliant', evidence: 'Distribution record', score: null, notes: '' }
    ],

    partH: [
      { id: 1, check: 'Asset register current and matches physical items', evidence: 'Register vs count', score: null, notes: '' },
      { id: 2, check: 'Furniture: usable, safe, sufficient', evidence: 'Observation', score: null, notes: '' },
      { id: 3, check: 'Computers and IT equipment: working, accounted for, secured', evidence: 'Inventory', score: null, notes: '' },
      { id: 4, check: 'Internet connectivity reliable', evidence: 'Speed test', score: null, notes: '' },
      { id: 5, check: 'Printers, projectors, sound systems working', evidence: 'Test', score: null, notes: '' },
      { id: 6, check: 'Air conditioning, fans, heating working', evidence: 'Test', score: null, notes: '' },
      { id: 7, check: 'Water supply: clean, sufficient, tested', evidence: 'Observation', score: null, notes: '' },
      { id: 8, check: 'Electricity: stable, backup available, wiring safe', evidence: 'Inspection', score: null, notes: '' },
      { id: 9, check: 'Generator or UPS working and maintained', evidence: 'Test', score: null, notes: '' },
      { id: 10, check: 'Vehicles: registered, insured, logbook maintained', evidence: 'Vehicle log', score: null, notes: '' },
      { id: 11, check: 'Building condition: roof, walls, paint, seepage, cracks', evidence: 'Inspection', score: null, notes: '' },
      { id: 12, check: 'Furniture and equipment needing repair identified', evidence: 'Photo + list', score: null, notes: '' },
      { id: 13, check: 'Furniture and equipment that is surplus or underused', evidence: 'Photo + list', score: null, notes: '' },
      { id: 14, check: 'Any asset missing or unaccounted for', evidence: 'Investigation note', score: null, notes: '' },
      { id: 15, check: 'Any asset that should be downgraded or disposed of', evidence: 'Recommendation', score: null, notes: '' }
    ],

    partI: [
      { id: 1, check: 'Vendor list current with contact details', evidence: 'OMS vendor records', score: null, notes: '' },
      { id: 2, check: 'All vendors have agreed rates in writing', evidence: 'Contract or quotation', score: null, notes: '' },
      { id: 3, check: 'Purchases above threshold require 3 quotes', evidence: 'Purchase file', score: null, notes: '' },
      { id: 4, check: 'No single-source purchases without justification', evidence: 'Voucher review', score: null, notes: '' },
      { id: 5, check: 'No purchases from staff or relatives without disclosure and approval', evidence: 'Declaration file', score: null, notes: '' },
      { id: 6, check: 'Vendor advances tracked and aged', evidence: 'OMS', score: null, notes: '' },
      { id: 7, check: 'Overdue deliveries chased and documented', evidence: 'OMS', score: null, notes: '' },
      { id: 8, check: 'Quality of goods received inspected and recorded', evidence: 'Receipt note', score: null, notes: '' },
      { id: 9, check: 'No duplicate payments or duplicate invoices', evidence: 'Voucher check', score: null, notes: '' },
      { id: 10, check: 'Vendors paid on time within terms', evidence: 'Payment record', score: null, notes: '' },
      { id: 11, check: 'Vendor disputes logged and resolved', evidence: 'Dispute log', score: null, notes: '' },
      { id: 12, check: 'No cash advances without approval and documentation', evidence: 'Advance register', score: null, notes: '' }
    ],

    partJ: [
      { id: 1, check: 'Registration certificates displayed and current', evidence: 'Physical check', score: null, notes: '' },
      { id: 2, check: 'Tax registration and filings up to date', evidence: 'Compliance file', score: null, notes: '' },
      { id: 3, check: 'Withholding tax deducted and deposited correctly', evidence: 'Tax records', score: null, notes: '' },
      { id: 4, check: 'NPO compliance conditions met (if applicable)', evidence: 'Advisor confirmation', score: null, notes: '' },
      { id: 5, check: 'Fire safety: extinguishers serviced, exits clear, drills done', evidence: 'Inspection log', score: null, notes: '' },
      { id: 6, check: 'First aid kits complete and accessible', evidence: 'Inspection', score: null, notes: '' },
      { id: 7, check: 'Electrical safety: no exposed wires, no overloaded sockets', evidence: 'Inspection', score: null, notes: '' },
      { id: 8, check: 'Building safety: no structural risks, safe stairs, railings', evidence: 'Inspection', score: null, notes: '' },
      { id: 9, check: 'Child protection policy displayed and followed', evidence: 'Observation', score: null, notes: '' },
      { id: 10, check: 'Visitors logged and escorted', evidence: 'Visitor book', score: null, notes: '' },
      { id: 11, check: 'Data protection: records locked, passwords secure, no data on personal phones', evidence: 'Inspection', score: null, notes: '' },
      { id: 12, check: 'CCTV working and footage retained (if installed)', evidence: 'Test', score: null, notes: '' },
      { id: 13, check: 'Security guard present, trained, alert', evidence: 'Interview', score: null, notes: '' },
      { id: 14, check: 'Emergency contact list displayed', evidence: 'Physical check', score: null, notes: '' },
      { id: 15, check: 'Insurance policies current', evidence: 'Certificates', score: null, notes: '' }
    ],

    partK: [
      { id: 1, check: 'Local donors acknowledged and records maintained', evidence: 'Donor register', score: null, notes: '' },
      { id: 2, check: 'Community leaders aware of branch activities', evidence: 'Interview', score: null, notes: '' },
      { id: 3, check: 'Branch participates in local events or welfare', evidence: 'Event log', score: null, notes: '' },
      { id: 4, check: 'Complaints from community handled respectfully', evidence: 'Complaint log', score: null, notes: '' },
      { id: 5, check: 'No reputational issues or local disputes', evidence: 'Interview', score: null, notes: '' },
      { id: 6, check: 'Local zakat and sadaqah collections properly receipted', evidence: 'Receipt book', score: null, notes: '' },
      { id: 7, check: 'Branch supports orphans, widows, or needy as per policy', evidence: 'Welfare record', score: null, notes: '' },
      { id: 8, check: 'No political activity or misuse of Institute platform', evidence: 'Observation', score: null, notes: '' }
    ],

    partL: {
      strengths: [
        { id: 'str-1', strength: '', evidence: '', replication: '' },
        { id: 'str-2', strength: '', evidence: '', replication: '' },
        { id: 'str-3', strength: '', evidence: '', replication: '' }
      ],
      weaknesses: [
        { id: 'w-1', weakness: '', severity: 'Medium', rootCause: '', immediateAction: '' },
        { id: 'w-2', weakness: '', severity: 'Medium', rootCause: '', immediateAction: '' },
        { id: 'w-3', weakness: '', severity: 'Medium', rootCause: '', immediateAction: '' }
      ],
      upgrades: [
        { id: 'up-1', item: '', estimatedCost: '', priority: 'Medium', deadline: '', responsible: '' },
        { id: 'up-2', item: '', estimatedCost: '', priority: 'Medium', deadline: '', responsible: '' }
      ],
      downgrades: [
        { id: 'down-1', item: '', saving: '', reason: '', action: '' },
        { id: 'down-2', item: '', saving: '', reason: '', action: '' }
      ],
      improvements: [
        { id: 'imp-1', improvement: '', benefit: '', cost: '', timeline: '' },
        { id: 'imp-2', improvement: '', benefit: '', cost: '', timeline: '' }
      ],
      deficiencies: [
        { id: 'def-1', deficiency: '', risk: '', legalBreach: 'No', actionRequired: '', deadline: '' },
        { id: 'def-2', deficiency: '', risk: '', legalBreach: 'No', actionRequired: '', deadline: '' }
      ]
    },

    partM: [
      { id: 1, question: 'What works well here?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 2, question: 'What is the biggest problem?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 3, question: 'Are you paid on time?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 4, question: 'Do you have what you need to do your job?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 5, question: 'Is the system helping or hindering?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 6, question: 'Are you treated fairly?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 7, question: 'Do you feel safe reporting a concern?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 8, question: 'What would you change?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 9, question: 'Any concerns about money or honesty?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' },
      { id: 10, question: 'Anything else the Director should know?', staff1: '', staff2: '', staff3: '', student1: '', student2: '', student3: '' }
    ],

    partN: [
      { id: 1, action: 'Enter visit report in OMS with all scores and photos', deadline: '24 hours', done: false, owner: 'Director / Auditor' },
      { id: 2, action: 'Issue written findings to branch manager with required actions', deadline: '24 hours', done: false, owner: 'Director' },
      { id: 3, action: 'Escalate Critical findings to board immediately', deadline: 'Same day', done: false, owner: 'Director' },
      { id: 4, action: 'Assign action items in OMS with owners and deadlines', deadline: '48 hours', done: false, owner: 'Branch Manager / Auditor' },
      { id: 5, action: 'Follow up on financial discrepancies with accountant', deadline: '48 hours', done: false, owner: 'Finance Lead' },
      { id: 6, action: 'Report any suspected fraud or dishonesty to board and auditor', deadline: 'Immediately', done: false, owner: 'Director' },
      { id: 7, action: 'Update asset register with any changes', deadline: '48 hours', done: false, owner: 'Asset Custodian' },
      { id: 8, action: 'Update risk register if new risk identified', deadline: '48 hours', done: false, owner: 'Compliance Lead' },
      { id: 9, action: 'Schedule follow-up visit if Critical issues found', deadline: 'Within 2 weeks', done: false, owner: 'Director' },
      { id: 10, action: 'Share best practices from this branch with other branches', deadline: '7 days', done: false, owner: 'Director' },
      { id: 11, action: "Confirm previous visit's open actions closed", deadline: '7 days', done: false, owner: 'Auditor' },
      { id: 12, action: 'File signed report in branch file and central file', deadline: '7 days', done: false, owner: 'Executive Assistant' }
    ],

    scorecard: calculateScorecard({
      partB: 0,
      partC: 0,
      partD: 0,
      partE: 0,
      partF: 0,
      partG: 0,
      partH: 0,
      partI: 0,
      partJ: 0,
      partK: 0,
      hasMasjid,
      isAcademic
    })
  };
}

export function calculateScorecard(params: {
  partB: number;
  partC: number;
  partD: number;
  partE: number;
  partF: number;
  partG: number;
  partH: number;
  partI: number;
  partJ: number;
  partK: number;
  hasMasjid: boolean;
  isAcademic: boolean;
}): ScorecardData {
  const areas = [
    { name: 'First impressions (Part B)', code: 'B', max: 60, score: params.partB, applicable: true },
    { name: 'Financial controls (Part C)', code: 'C', max: 90, score: params.partC, applicable: true },
    { name: 'Accounts and systems (Part D)', code: 'D', max: 75, score: params.partD, applicable: true },
    { name: 'Staff performance (Part E)', code: 'E', max: 75, score: params.partE, applicable: true },
    { name: 'Academic quality (Part F)', code: 'F', max: 75, score: params.partF, applicable: params.isAcademic },
    { name: 'Masjid operations (Part G)', code: 'G', max: 75, score: params.partG, applicable: params.hasMasjid },
    { name: 'Assets and infrastructure (Part H)', code: 'H', max: 75, score: params.partH, applicable: true },
    { name: 'Procurement and vendors (Part I)', code: 'I', max: 60, score: params.partI, applicable: true },
    { name: 'Compliance and security (Part J)', code: 'J', max: 75, score: params.partJ, applicable: true },
    { name: 'Community relations (Part K)', code: 'K', max: 40, score: params.partK, applicable: true }
  ];

  let totalMax = 0;
  let totalScore = 0;

  const evaluatedAreas = areas.map((a) => {
    const s = Math.min(Math.max(0, a.score || 0), a.max);
    const p = a.applicable && a.max > 0 ? Math.round((s / a.max) * 1000) / 10 : 0;
    let r = 'Satisfactory';
    if (p >= 90) r = 'Excellent';
    else if (p >= 75) r = 'Good';
    else if (p >= 60) r = 'Satisfactory';
    else if (p >= 40) r = 'Weak';
    else r = 'Critical';

    if (a.applicable) {
      totalMax += a.max;
      totalScore += s;
    }

    return {
      name: a.name,
      code: a.code,
      max: a.max,
      score: s,
      percent: p,
      rating: r,
      applicable: a.applicable
    };
  });

  const overallPercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 1000) / 10 : 0;

  let rating: 'Excellent' | 'Good' | 'Satisfactory' | 'Weak' | 'Critical' = 'Satisfactory';
  let ratingDescription = 'Action plan required';

  if (overallPercent >= 90) {
    rating = 'Excellent';
    ratingDescription = 'Model branch, share practices';
  } else if (overallPercent >= 75) {
    rating = 'Good';
    ratingDescription = 'Minor improvements needed';
  } else if (overallPercent >= 60) {
    rating = 'Satisfactory';
    ratingDescription = 'Action plan required';
  } else if (overallPercent >= 40) {
    rating = 'Weak';
    ratingDescription = 'Immediate intervention, re-visit in 4 weeks';
  } else {
    rating = 'Critical';
    ratingDescription = 'Escalate to board, consider management change';
  }

  return {
    areas: evaluatedAreas,
    totalMax,
    totalScore,
    overallPercent,
    rating,
    ratingDescription
  };
}

export const INITIAL_BRANCH_SCHEDULE_2026 = [
  // HQ Jauharabad - Monthly
  { branch: 'HQ Jauharabad', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  // Al Baraka - Feb, Apr, Jun, Aug, Oct, Dec (every 8 weeks)
  { branch: 'Al Baraka', months: [2, 4, 6, 8, 10, 12] },
  // Punjab College - Mar, Jun, Sep, Dec (quarterly)
  { branch: 'Punjab College', months: [3, 6, 9, 12] },
  // Masjid - Jan, Mar, May, Jul, Sep, Nov (every 2 months)
  { branch: 'Masjid', months: [1, 3, 5, 7, 9, 11] },
  // Other campuses - Apr, Aug, Dec
  { branch: 'Other campuses', months: [4, 8, 12] },
  // Surprise visit - Jul
  { branch: 'Surprise visit (any branch)', months: [7] }
];
