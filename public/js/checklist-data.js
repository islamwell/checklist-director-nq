// NurulQuran Pakistan - Director's Inspection System Definitions

export const BRANCH_LIST = [
  'HQ Jauharabad',
  'Al Baraka',
  'Punjab College',
  'Masjid',
  'Other Campuses'
];

export const PART_A_TASKS = [
  { id: 1, task: 'Announce visit date in writing. Do not announce exact arrival time or agenda to prevent staging.' },
  { id: 2, task: "Pull last visit's report and open action items for this branch" },
  { id: 3, task: 'Pull branch financials: last 3 months income/expenditure, cash position, fee collection, donation report' },
  { id: 4, task: 'Pull OMS data: task completion rate, overdue items, purchase requests, vendor advances, daily update compliance by staff' },
  { id: 5, task: 'Pull HR data: attendance, leave, overtime, vacancies, disciplinary matters' },
  { id: 6, task: 'Pull academic data: enrollment, attendance, exam results, teacher feedback, complaints' },
  { id: 7, task: 'Pull asset register for the branch' },
  { id: 8, task: 'Pull outstanding audit, compliance, or tax items' },
  { id: 9, task: 'List unresolved grievances from staff or students' },
  { id: 10, task: 'Prepare surprise items: documents to inspect without prior notice' },
  { id: 11, task: 'Book transport and confirm logistics' },
  { id: 12, task: 'Brief the auditor or accountant if accompanying' }
];

export const PART_B_OBSERVATIONS = [
  { id: 1, observation: 'Exterior: gate, signage, cleanliness, security guard present and alert' },
  { id: 2, observation: 'Entrance: welcoming, safe, accessible, no hazards' },
  { id: 3, observation: 'Reception: staffed, records maintained, visitors logged' },
  { id: 4, observation: 'Cleanliness: floors, walls, toilets, kitchen, prayer area' },
  { id: 5, observation: 'Lighting and ventilation' },
  { id: 6, observation: 'Safety: fire extinguishers, emergency exits, first aid, electrical wiring' },
  { id: 7, observation: 'Noise level and discipline in corridors and classrooms' },
  { id: 8, observation: 'Students: present, engaged, respectful, in uniform (if applicable)' },
  { id: 9, observation: 'Staff: present, attentive, not idle or on phones' },
  { id: 10, observation: 'Notice boards: current, informative, not outdated or torn' },
  { id: 11, observation: 'Unattended cash, documents, or valuables visible?' },
  { id: 12, observation: 'Locks, cupboards, and cash storage secured?' }
];

export const PART_C_CHECKS = [
  { id: 1, check: 'Cash on hand counted physically and matched to register', evidence: 'Cash count sheet signed by Director and cashier' },
  { id: 2, check: 'All receipts pre-numbered and accounted for', evidence: 'Receipt book inspection' },
  { id: 3, check: "Yesterday's collections banked; deposit slip available", evidence: 'Bank slip' },
  { id: 4, check: 'Bank reconciliation up to date', evidence: 'Accounts system' },
  { id: 5, check: 'Petty cash: balance correct, vouchers complete, no IOUs', evidence: 'Petty cash book' },
  { id: 6, check: 'Fee collection: receipts issued, register updated, system entry same day', evidence: 'Fee register vs accounts' },
  { id: 7, check: 'Donation receipts issued with proper acknowledgment', evidence: 'Donation register' },
  { id: 8, check: 'Zakat and restricted funds kept separately and correctly recorded', evidence: 'Fund register' },
  { id: 9, check: 'Vendor payments: PO, invoice, delivery note, approval all present', evidence: 'Voucher sample of 5' },
  { id: 10, check: 'Vendor advances: documented, tracked, aged, no overdue unchased', evidence: 'OMS vendor log' },
  { id: 11, check: 'No payment without dual signature', evidence: 'Cheque register' },
  { id: 12, check: 'No cash payment above policy limit', evidence: 'Voucher review' },
  { id: 13, check: 'Outstanding receivables: list exists, follow-up documented', evidence: 'Ageing report' },
  { id: 14, check: 'No undocumented loans or inter-unit transfers', evidence: 'Ledger review' },
  { id: 15, check: 'Cashier has no access to ledger posting (segregation of duties)', evidence: 'System access review' },
  { id: 16, check: 'No personal money mixed with Institute money', evidence: 'Cash count' },
  { id: 17, check: 'Safe combination known only to authorised persons', evidence: 'Interview' },
  { id: 18, check: 'Cash insurance in place and current', evidence: 'Policy document' }
];

export const PART_D_CHECKS = [
  { id: 1, check: 'All transactions entered in the accounts system, not Excel or paper only', evidence: 'System vs physical records' },
  { id: 2, check: 'Entries made within 24 hours of transaction', evidence: 'System timestamps' },
  { id: 3, check: 'No silent edits or deletions; reversals used correctly', evidence: 'Audit trail' },
  { id: 4, check: 'Two-step sign-in active for all financial users', evidence: 'System check' },
  { id: 5, check: 'Access rights correct: no staff has more access than needed', evidence: 'User list review' },
  { id: 6, check: 'Month-end close completed on time last 3 months', evidence: 'Signed statements' },
  { id: 7, check: 'OMS daily updates submitted by all staff', evidence: 'OMS compliance report' },
  { id: 8, check: 'Work items closed within deadline', evidence: 'OMS report' },
  { id: 9, check: 'Purchase requests raised in OMS, not WhatsApp or verbal', evidence: 'OMS log' },
  { id: 10, check: 'Vendor records complete: advance, pending, delivery, communication', evidence: 'OMS vendor records' },
  { id: 11, check: 'Attachments (receipts, invoices, photos, voice notes) present', evidence: 'OMS sample' },
  { id: 12, check: 'Staff can use the system without help', evidence: 'Live demonstration by staff' },
  { id: 13, check: 'No parallel paper system undermining the system', evidence: 'Observation' },
  { id: 14, check: 'Backups working; last restore test date confirmed', evidence: 'IT log' },
  { id: 15, check: 'Passwords not shared; no written passwords visible', evidence: 'Physical check' }
];

export const PART_E_CHECKS = [
  { id: 1, check: 'Attendance register matches actual presence', evidence: 'Register vs headcount' },
  { id: 2, check: 'Late arrivals and absences documented with reasons', evidence: 'Attendance record' },
  { id: 3, check: 'Staff job descriptions available and understood', evidence: 'Interview sample' },
  { id: 4, check: 'Staff know their supervisor and reporting line', evidence: 'Interview' },
  { id: 5, check: 'Salaries paid on time, no deductions without written reason', evidence: 'Payroll record' },
  { id: 6, check: 'Staff have contracts and appointment letters', evidence: 'HR file sample' },
  { id: 7, check: 'No child labour or underage staff', evidence: 'Observation and records' },
  { id: 8, check: 'Staff grievances: log maintained, resolved within 7 days', evidence: 'Grievance register' },
  { id: 9, check: 'Disciplinary matters documented and fair', evidence: 'HR file' },
  { id: 10, check: 'Training needs identified and recorded', evidence: 'Training log' },
  { id: 11, check: 'Staff morale: interviews reveal satisfaction or issues', evidence: 'Interview 3 staff privately' },
  { id: 12, check: 'No staff working excessive hours without overtime or compensation', evidence: 'Attendance + payroll' },
  { id: 13, check: 'Staff understand safeguarding and child protection rules', evidence: 'Interview' },
  { id: 14, check: 'Staff know how to report a concern', evidence: 'Interview' },
  { id: 15, check: 'No favouritism or nepotism visible in roles or duties', evidence: 'Observation' }
];

export const PART_F_CHECKS = [
  { id: 1, check: 'Timetable displayed and followed', evidence: 'Observation' },
  { id: 2, check: 'Teachers present and on time', evidence: 'Register' },
  { id: 3, check: 'Lesson plans or course outlines available', evidence: 'Teacher file' },
  { id: 4, check: 'Student attendance recorded daily', evidence: 'Register' },
  { id: 5, check: 'Assessment records maintained; marks entered timely', evidence: 'Mark sheets' },
  { id: 6, check: 'Student progress tracked; weak students identified', evidence: 'Progress report' },
  { id: 7, check: 'Exam schedules followed; no leaks or irregularities', evidence: 'Exam records' },
  { id: 8, check: 'Certificates issued only after genuine completion', evidence: 'Certificate register' },
  { id: 9, check: 'Library or learning resources available and used', evidence: 'Observation' },
  { id: 10, check: 'Student complaints: log maintained, resolved', evidence: 'Complaint register' },
  { id: 11, check: 'Parent communication: meetings held, feedback recorded', evidence: 'Parent meeting log' },
  { id: 12, check: "Teachers' performance reviewed regularly", evidence: 'Appraisal record' },
  { id: 13, check: 'Curriculum current and approved', evidence: 'Curriculum document' },
  { id: 14, check: "Course content aligns with NurulQuran's mission", evidence: 'Sample review' },
  { id: 15, check: 'Online and on-campus students treated consistently', evidence: 'Interview' }
];

export const PART_G_CHECKS = [
  { id: 1, check: 'Cleanliness of prayer area, wudu area, toilets', evidence: 'Observation' },
  { id: 2, check: 'Five daily prayers conducted on time', evidence: 'Attendance log' },
  { id: 3, check: "Jumu'ah arrangements: capacity, sound, safety", evidence: 'Observation' },
  { id: 4, check: 'Donation boxes sealed, numbered, dual-counted', evidence: 'Collection record' },
  { id: 5, check: 'Collections counted in presence of two people, recorded', evidence: 'Count sheet' },
  { id: 6, check: 'Collections banked within 24 hours', evidence: 'Bank slip' },
  { id: 7, check: 'Zakat and Sadaqah kept separate and recorded', evidence: 'Fund register' },
  { id: 8, check: 'Imam and staff paid on time, contracts in place', evidence: 'Payroll' },
  { id: 9, check: 'Maintenance issues logged and addressed', evidence: 'Maintenance register' },
  { id: 10, check: 'Community programs active and documented', evidence: 'Program log' },
  { id: 11, check: 'Neighbours and community relations positive', evidence: 'Interview' },
  { id: 12, check: 'Safety: exits, fire, electrical, crowd management', evidence: 'Inspection' },
  { id: 13, check: 'No unauthorized use of masjid funds', evidence: 'Financial review' },
  { id: 14, check: 'Donor acknowledgment issued for large donations', evidence: 'Receipt sample' },
  { id: 15, check: 'Zakat distribution documented and Shariah-compliant', evidence: 'Distribution record' }
];

export const PART_H_CHECKS = [
  { id: 1, check: 'Asset register current and matches physical items', evidence: 'Register vs count' },
  { id: 2, check: 'Furniture: usable, safe, sufficient', evidence: 'Observation' },
  { id: 3, check: 'Computers and IT equipment: working, accounted for, secured', evidence: 'Inventory' },
  { id: 4, check: 'Internet connectivity reliable', evidence: 'Speed test' },
  { id: 5, check: 'Printers, projectors, sound systems working', evidence: 'Test' },
  { id: 6, check: 'Air conditioning, fans, heating working', evidence: 'Test' },
  { id: 7, check: 'Water supply: clean, sufficient, tested', evidence: 'Observation' },
  { id: 8, check: 'Electricity: stable, backup available, wiring safe', evidence: 'Inspection' },
  { id: 9, check: 'Generator or UPS working and maintained', evidence: 'Test' },
  { id: 10, check: 'Vehicles: registered, insured, logbook maintained', evidence: 'Vehicle log' },
  { id: 11, check: 'Building condition: roof, walls, paint, seepage, cracks', evidence: 'Inspection' },
  { id: 12, check: 'Furniture and equipment needing repair identified', evidence: 'Photo + list' },
  { id: 13, check: 'Furniture and equipment that is surplus or underused', evidence: 'Photo + list' },
  { id: 14, check: 'Any asset missing or unaccounted for', evidence: 'Investigation note' },
  { id: 15, check: 'Any asset that should be downgraded or disposed of', evidence: 'Recommendation' }
];

export const PART_I_CHECKS = [
  { id: 1, check: 'Vendor list current with contact details', evidence: 'OMS vendor records' },
  { id: 2, check: 'All vendors have agreed rates in writing', evidence: 'Contract or quotation' },
  { id: 3, check: 'Purchases above threshold require 3 quotes', evidence: 'Purchase file' },
  { id: 4, check: 'No single-source purchases without justification', evidence: 'Voucher review' },
  { id: 5, check: 'No purchases from staff or relatives without disclosure and approval', evidence: 'Declaration file' },
  { id: 6, check: 'Vendor advances tracked and aged', evidence: 'OMS' },
  { id: 7, check: 'Overdue deliveries chased and documented', evidence: 'OMS' },
  { id: 8, check: 'Quality of goods received inspected and recorded', evidence: 'Receipt note' },
  { id: 9, check: 'No duplicate payments or duplicate invoices', evidence: 'Voucher check' },
  { id: 10, check: 'Vendors paid on time within terms', evidence: 'Payment record' },
  { id: 11, check: 'Vendor disputes logged and resolved', evidence: 'Dispute log' },
  { id: 12, check: 'No cash advances without approval and documentation', evidence: 'Advance register' }
];

export const PART_J_CHECKS = [
  { id: 1, check: 'Registration certificates displayed and current', evidence: 'Physical check' },
  { id: 2, check: 'Tax registration and filings up to date', evidence: 'Compliance file' },
  { id: 3, check: 'Withholding tax deducted and deposited correctly', evidence: 'Tax records' },
  { id: 4, check: 'NPO compliance conditions met (if applicable)', evidence: 'Advisor confirmation' },
  { id: 5, check: 'Fire safety: extinguishers serviced, exits clear, drills done', evidence: 'Inspection log' },
  { id: 6, check: 'First aid kits complete and accessible', evidence: 'Inspection' },
  { id: 7, check: 'Electrical safety: no exposed wires, no overloaded sockets', evidence: 'Inspection' },
  { id: 8, check: 'Building safety: no structural risks, safe stairs, railings', evidence: 'Inspection' },
  { id: 9, check: 'Child protection policy displayed and followed', evidence: 'Observation' },
  { id: 10, check: 'Visitors logged and escorted', evidence: 'Visitor book' },
  { id: 11, check: 'Data protection: records locked, passwords secure, no data on personal phones', evidence: 'Inspection' },
  { id: 12, check: 'CCTV working and footage retained (if installed)', evidence: 'Test' },
  { id: 13, check: 'Security guard present, trained, alert', evidence: 'Interview' },
  { id: 14, check: 'Emergency contact list displayed', evidence: 'Physical check' },
  { id: 15, check: 'Insurance policies current', evidence: 'Certificates' }
];

export const PART_K_CHECKS = [
  { id: 1, check: 'Local donors acknowledged and records maintained', evidence: 'Donor register' },
  { id: 2, check: 'Community leaders aware of branch activities', evidence: 'Interview' },
  { id: 3, check: 'Branch participates in local events or welfare', evidence: 'Event log' },
  { id: 4, check: 'Complaints from community handled respectfully', evidence: 'Complaint log' },
  { id: 5, check: 'No reputational issues or local disputes', evidence: 'Interview' },
  { id: 6, check: 'Local zakat and sadaqah collections properly receipted', evidence: 'Receipt book' },
  { id: 7, check: 'Branch supports orphans, widows, or needy as per policy', evidence: 'Welfare record' },
  { id: 8, check: 'No political activity or misuse of Institute platform', evidence: 'Observation' }
];

export const PART_M_QUESTIONS = [
  { id: 1, question: 'What works well here?' },
  { id: 2, question: 'What is the biggest problem?' },
  { id: 3, question: 'Are you paid on time?' },
  { id: 4, question: 'Do you have what you need to do your job?' },
  { id: 5, question: 'Is the system helping or hindering?' },
  { id: 6, question: 'Are you treated fairly?' },
  { id: 7, question: 'Do you feel safe reporting a concern?' },
  { id: 8, question: 'What would you change?' },
  { id: 9, question: 'Any concerns about money or honesty?' },
  { id: 10, question: 'Anything else the Director should know?' }
];

export const PART_N_ACTIONS = [
  { id: 1, action: 'Enter visit report in OMS with all scores and photos', deadline: '24 hours' },
  { id: 2, action: 'Issue written findings to branch manager with required actions', deadline: '24 hours' },
  { id: 3, action: 'Escalate Critical findings to board immediately', deadline: 'Same day' },
  { id: 4, action: 'Assign action items in OMS with owners and deadlines', deadline: '48 hours' },
  { id: 5, action: 'Follow up on financial discrepancies with accountant', deadline: '48 hours' },
  { id: 6, action: 'Report any suspected fraud or dishonesty to board and auditor', deadline: 'Immediately' },
  { id: 7, action: 'Update asset register with any changes', deadline: '48 hours' },
  { id: 8, action: 'Update risk register if new risk identified', deadline: '48 hours' },
  { id: 9, action: 'Schedule follow-up visit if Critical issues found', deadline: 'Within 2 weeks' },
  { id: 10, action: 'Share best practices from this branch with other branches', deadline: '7 days' },
  { id: 11, action: "Confirm previous visit's open actions closed", deadline: '7 days' },
  { id: 12, action: 'File signed report in branch file and central file', deadline: '7 days' }
];
