-- NurulQuran Pakistan - Director's Branch Visit System Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'director', -- 'director', 'auditor', 'manager', 'viewer'
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  branch TEXT, -- assigned branch if branch manager
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  branch TEXT NOT NULL,
  visit_date TEXT NOT NULL,
  visit_type TEXT NOT NULL DEFAULT 'Scheduled',
  time_in TEXT,
  time_out TEXT,
  accompanied_by TEXT,
  status TEXT NOT NULL DEFAULT 'Draft', -- 'Draft', 'Submitted OMS', 'Closed'
  has_masjid INTEGER NOT NULL DEFAULT 0,
  is_academic INTEGER NOT NULL DEFAULT 1,
  total_score REAL DEFAULT 0,
  max_score REAL DEFAULT 700,
  score_percent REAL DEFAULT 0,
  rating TEXT,
  data_json TEXT NOT NULL,
  director_signature TEXT,
  director_sign_date TEXT,
  manager_signature TEXT,
  manager_sign_date TEXT,
  oms_reference TEXT,
  oms_entry_date TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS share_tokens (
  id TEXT PRIMARY KEY,
  visit_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  label TEXT,
  access_type TEXT NOT NULL DEFAULT 'read',
  expires_at TEXT,
  revoked INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rotation_schedule (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  branch TEXT NOT NULL,
  month INTEGER NOT NULL, -- 1 to 12
  status TEXT NOT NULL DEFAULT 'planned', -- 'planned', 'completed', 'skipped'
  visit_id TEXT,
  notes TEXT,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_visits_branch ON visits(branch);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_share_tokens ON share_tokens(token);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_schedule_year_branch ON rotation_schedule(year, branch);
