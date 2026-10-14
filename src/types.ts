export interface User {
  id: string;
  username: string;
  name: string;
  role: 'director' | 'auditor' | 'manager' | 'viewer';
  password_hash: string;
  salt: string;
  branch?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface ChecklistItem {
  id: number;
  task?: string;
  check?: string;
  observation?: string;
  evidence?: string;
  done?: boolean;
  score?: number | null; // 1 to 5
  notes?: string;
}

export interface PhotoItem {
  id: string;
  category: 'entrance' | 'notice_board' | 'cash_storage' | 'deficiency' | 'strength' | 'general';
  caption: string;
  dataUrl: string; // Base64 or URL
  uploadedAt: string;
}

export interface StrengthRow {
  id: string;
  strength: string;
  evidence: string;
  replication: string;
}

export interface WeaknessRow {
  id: string;
  weakness: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  rootCause: string;
  immediateAction: string;
}

export interface UpgradeRow {
  id: string;
  item: string;
  estimatedCost: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  deadline: string;
  responsible: string;
}

export interface DowngradeRow {
  id: string;
  item: string;
  saving: string;
  reason: string;
  action: string;
}

export interface ImprovementRow {
  id: string;
  improvement: string;
  benefit: string;
  cost: string;
  timeline: string;
}

export interface DeficiencyRow {
  id: string;
  deficiency: string;
  risk: string;
  legalBreach: string; // 'Yes' | 'No' | 'Potential'
  actionRequired: string;
  deadline: string;
}

export interface InterviewRow {
  id: number;
  question: string;
  staff1: string;
  staff2: string;
  staff3: string;
  student1: string;
  student2: string;
  student3: string;
}

export interface ActionItem {
  id: number;
  action: string;
  deadline: string;
  done: boolean;
  owner?: string;
  notes?: string;
  omsReference?: string;
}

export interface ScorecardArea {
  name: string;
  code: string;
  max: number;
  score: number;
  percent: number;
  rating: string;
  applicable: boolean;
}

export interface ScorecardData {
  areas: ScorecardArea[];
  totalMax: number;
  totalScore: number;
  overallPercent: number;
  rating: 'Excellent' | 'Good' | 'Satisfactory' | 'Weak' | 'Critical';
  ratingDescription: string;
}

export interface VisitData {
  partA: ChecklistItem[]; // Pre-visit prep (12 items)
  partB: ChecklistItem[]; // Arrival & first impressions (12 items)
  photos: PhotoItem[]; // Photos
  partC: ChecklistItem[]; // Financial controls & cash (18 items)
  partD: ChecklistItem[]; // Accounts & systems (15 items)
  partE: ChecklistItem[]; // Staff performance & welfare (15 items)
  partF: ChecklistItem[]; // Academic quality (15 items)
  partG: ChecklistItem[]; // Masjid operations (15 items)
  partH: ChecklistItem[]; // Physical assets & infrastructure (15 items)
  partI: ChecklistItem[]; // Procurement & vendors (12 items)
  partJ: ChecklistItem[]; // Compliance, safety, security (15 items)
  partK: ChecklistItem[]; // Community relations (8 items)
  partL: {
    strengths: StrengthRow[];
    weaknesses: WeaknessRow[];
    upgrades: UpgradeRow[];
    downgrades: DowngradeRow[];
    improvements: ImprovementRow[];
    deficiencies: DeficiencyRow[];
  };
  partM: InterviewRow[]; // 10 interview questions
  partN: ActionItem[]; // 12 post-visit actions
  scorecard: ScorecardData;
  generalNotes?: string;
}

export interface VisitRecord {
  id: string;
  branch: string;
  visit_date: string;
  visit_type: 'Scheduled' | 'Surprise';
  time_in?: string;
  time_out?: string;
  accompanied_by?: string;
  status: 'Draft' | 'Submitted OMS' | 'Closed';
  has_masjid: number;
  is_academic: number;
  total_score: number;
  max_score: number;
  score_percent: number;
  rating?: string;
  data_json: string; // serialized VisitData
  director_signature?: string;
  director_sign_date?: string;
  manager_signature?: string;
  manager_sign_date?: string;
  oms_reference?: string;
  oms_entry_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ShareToken {
  id: string;
  visit_id: string;
  token: string;
  label?: string;
  access_type: 'read' | 'comment';
  expires_at?: string | null;
  revoked: number;
  created_by: string;
  created_at: string;
}

export interface ScheduleItem {
  id: string;
  year: number;
  branch: string;
  month: number;
  status: 'planned' | 'completed' | 'skipped';
  visit_id?: string;
  notes?: string;
  updated_at: string;
}

export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
}
