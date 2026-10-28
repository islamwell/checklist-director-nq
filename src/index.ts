import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env, User, VisitRecord, VisitData, ShareToken, ScheduleItem } from './types';
import { hashPassword, verifyPassword, generateToken, parseCookie, getSessionUser } from './auth';
import { createDefaultVisitData, calculateScorecard, INITIAL_BRANCH_SCHEDULE_2026 } from './default-checklist';
import {
  TIME_ALLOCATIONS,
  DAILY_CHECKLIST_TEMPLATE,
  WEEKLY_CHECKLIST,
  BIWEEKLY_CHECKLIST,
  MONTHLY_CHECKLIST,
  QUARTERLY_CHECKLIST,
  YEARLY_CALENDAR,
  ANNUAL_ONE_TIME_DUTIES,
  DIRECTOR_KPIS,
  DELEGATION_RULES,
  ACCOUNTABILITY_TERMS,
  getDefaultSectionData,
  computeSectionCounts
} from './operating-checklist-data';

const app = new Hono<{ Bindings: Env; Variables: { user?: User } }>();

// Enable CORS and security headers
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'SAMEORIGIN');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// Authentication middleware for /api/* routes (excluding auth endpoints and shared token endpoints)
app.use('/api/*', async (c, next) => {
  const path = c.req.path;
  const isPublic = 
    path === '/api/health' ||
    path === '/api/auth/login' ||
    path === '/api/auth/setup' ||
    path.startsWith('/api/shared/');

  if (isPublic) {
    return next();
  }

  // Get token from Authorization header or cookie
  const authHeader = c.req.header('Authorization');
  let token: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = parseCookie(c.req.header('Cookie'), 'session');
  }

  const user = await getSessionUser(c.env.DB, token);
  if (!user) {
    return c.json({ error: 'Unauthorized. Please sign in.' }, 401);
  }

  c.set('user', user);
  return next();
});

// -------------------------------------------------------------
// Health and Setup
// -------------------------------------------------------------
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup initial admin and rotation schedule if empty
app.post('/api/auth/setup', async (c) => {
  const db = c.env.DB;
  
  // Check if users exist
  const existingUser = await db.prepare('SELECT id FROM users LIMIT 1').first();
  if (existingUser) {
    return c.json({ message: 'System is already initialized.' });
  }

  const now = new Date().toISOString();

  // Create default accounts
  const accounts = [
    { username: 'director', name: 'Director General', role: 'director', pass: 'NurulQuran2026!' },
    { username: 'auditor', name: 'Compliance & Audit Lead', role: 'auditor', pass: 'Auditor2026!' },
    { username: 'manager', name: 'HQ Branch Manager', role: 'manager', pass: 'Manager2026!', branch: 'HQ Jauharabad' },
    { username: 'board', name: 'Board Member', role: 'viewer', pass: 'Board2026!' }
  ];

  for (const acc of accounts) {
    const { hash, salt } = await hashPassword(acc.pass);
    await db.prepare(`
      INSERT INTO users (id, username, name, role, password_hash, salt, branch, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      'usr_' + generateToken().substring(0, 12),
      acc.username,
      acc.name,
      acc.role,
      hash,
      salt,
      acc.branch || null,
      now,
      now
    ).run();
  }

  // Seed default 2026 annual rotation schedule
  for (const item of INITIAL_BRANCH_SCHEDULE_2026) {
    for (const month of item.months) {
      await db.prepare(`
        INSERT INTO rotation_schedule (id, year, branch, month, status, updated_at)
        VALUES (?, 2026, ?, ?, 'planned', ?)
      `).bind(
        'sch_' + generateToken().substring(0, 12),
        item.branch,
        month,
        now
      ).run();
    }
  }

  // Seed default 2026 Director Scorecard KPIs
  for (const kpi of DIRECTOR_KPIS) {
    await db.prepare(`
      INSERT INTO director_kpis (id, year, kpi_num, kpi, target, measured_by, current_value, status, notes, updated_at)
      VALUES (?, 2026, ?, ?, ?, ?, ?, ?, '', ?)
    `).bind(
      'kpi_' + generateToken().substring(0, 12),
      kpi.kpiNum,
      kpi.kpi,
      kpi.target,
      kpi.measuredBy,
      kpi.currentValue || '',
      kpi.status || 'on_track',
      now
    ).run();
  }

  return c.json({
    success: true,
    message: 'System successfully initialized with default director, auditor, manager, and board accounts.',
    defaultAccounts: accounts.map(a => ({ username: a.username, role: a.role, defaultPass: a.pass }))
  });
});

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
app.post('/api/auth/login', async (c) => {
  const body = await c.req.json<{ username?: string; password?: string }>();
  if (!body.username || !body.password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  const db = c.env.DB;
  const user = await db.prepare('SELECT * FROM users WHERE username = ?')
    .bind(body.username.trim().toLowerCase())
    .first<User>();

  if (!user) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }

  const isValid = await verifyPassword(body.password, user.password_hash, user.salt);
  if (!isValid) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }

  // Create session (valid for 14 days)
  const token = generateToken();
  const sessionId = 'ses_' + generateToken().substring(0, 12);
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  await db.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(sessionId, user.id, token, expiresAt, now).run();

  // Set HTTP-only session cookie
  c.header(
    'Set-Cookie',
    `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${14 * 24 * 60 * 60}`
  );

  return c.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      branch: user.branch
    }
  });
});

app.post('/api/auth/logout', async (c) => {
  const token = parseCookie(c.req.header('Cookie'), 'session') || 
                c.req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  }
  c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return c.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Not authenticated' }, 401);
  return c.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      branch: user.branch
    }
  });
});

// User Management (Director only)
app.get('/api/users', async (c) => {
  const currentUser = c.get('user');
  if (currentUser?.role !== 'director') {
    return c.json({ error: 'Only the Director can view users' }, 403);
  }

  const { results } = await c.env.DB.prepare(
    'SELECT id, username, name, role, branch, created_at, updated_at FROM users ORDER BY created_at ASC'
  ).all<User>();

  return c.json({ users: results || [] });
});

app.post('/api/users', async (c) => {
  const currentUser = c.get('user');
  if (currentUser?.role !== 'director') {
    return c.json({ error: 'Only the Director can create users' }, 403);
  }

  const body = await c.req.json<{ username?: string; name?: string; role?: 'director'|'auditor'|'manager'|'viewer'; password?: string; branch?: string }>();
  if (!body.username || !body.name || !body.role || !body.password) {
    return c.json({ error: 'Username, name, role, and password are required' }, 400);
  }

  const db = c.env.DB;
  const existing = await db.prepare('SELECT id FROM users WHERE username = ?')
    .bind(body.username.trim().toLowerCase())
    .first();
  if (existing) {
    return c.json({ error: 'Username already exists' }, 400);
  }

  const { hash, salt } = await hashPassword(body.password);
  const now = new Date().toISOString();
  const userId = 'usr_' + generateToken().substring(0, 12);

  await db.prepare(`
    INSERT INTO users (id, username, name, role, password_hash, salt, branch, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(userId, body.username.trim().toLowerCase(), body.name.trim(), body.role, hash, salt, body.branch || null, now, now).run();

  return c.json({ success: true, userId });
});

app.put('/api/users/:id/password', async (c) => {
  const currentUser = c.get('user');
  const targetId = c.req.param('id');
  if (currentUser?.role !== 'director' && currentUser?.id !== targetId) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const body = await c.req.json<{ newPassword?: string }>();
  if (!body.newPassword || body.newPassword.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  const { hash, salt } = await hashPassword(body.newPassword);
  const now = new Date().toISOString();
  await c.env.DB.prepare(
    'UPDATE users SET password_hash = ?, salt = ?, updated_at = ? WHERE id = ?'
  ).bind(hash, salt, now, targetId).run();

  return c.json({ success: true, message: 'Password updated successfully' });
});

// -------------------------------------------------------------
// Visit Inspection Endpoints
// -------------------------------------------------------------
app.get('/api/visits', async (c) => {
  const db = c.env.DB;
  const branch = c.req.query('branch');
  const status = c.req.query('status');
  const year = c.req.query('year');

  let sql = 'SELECT id, branch, visit_date, visit_type, time_in, time_out, accompanied_by, status, has_masjid, is_academic, total_score, max_score, score_percent, rating, oms_reference, oms_entry_date, created_by, created_at, updated_at FROM visits WHERE 1=1';
  const bindings: any[] = [];

  if (branch) {
    sql += ' AND branch = ?';
    bindings.push(branch);
  }
  if (status) {
    sql += ' AND status = ?';
    bindings.push(status);
  }
  if (year) {
    sql += " AND substr(visit_date, 1, 4) = ?";
    bindings.push(year);
  }

  sql += ' ORDER BY visit_date DESC, created_at DESC';

  const { results } = await db.prepare(sql).bind(...bindings).all();
  return c.json({ visits: results || [] });
});

app.post('/api/visits', async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{
    branch: string;
    visit_date: string;
    visit_type?: 'Scheduled' | 'Surprise';
    accompanied_by?: string;
    time_in?: string;
    time_out?: string;
    has_masjid?: boolean;
    is_academic?: boolean;
  }>();

  if (!body.branch || !body.visit_date) {
    return c.json({ error: 'Branch and Visit Date are required' }, 400);
  }

  const db = c.env.DB;
  const visitId = 'vst_' + generateToken().substring(0, 12);
  const now = new Date().toISOString();

  const hasMasjid = body.has_masjid ?? (body.branch.toLowerCase().includes('masjid'));
  const isAcademic = body.is_academic ?? (!body.branch.toLowerCase().includes('masjid'));

  const defaultData = createDefaultVisitData(hasMasjid, isAcademic);
  const initialScorecard = defaultData.scorecard;

  await db.prepare(`
    INSERT INTO visits (
      id, branch, visit_date, visit_type, accompanied_by, time_in, time_out,
      status, has_masjid, is_academic, total_score, max_score, score_percent,
      rating, data_json, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    visitId,
    body.branch,
    body.visit_date,
    body.visit_type || 'Scheduled',
    body.accompanied_by || '',
    body.time_in || '',
    body.time_out || '',
    hasMasjid ? 1 : 0,
    isAcademic ? 1 : 0,
    initialScorecard.totalScore,
    initialScorecard.totalMax,
    initialScorecard.overallPercent,
    initialScorecard.rating,
    JSON.stringify(defaultData),
    user?.name || 'Director',
    now,
    now
  ).run();

  // Try to mark rotation schedule item as completed if matching
  const visitYear = parseInt(body.visit_date.substring(0, 4), 10);
  const visitMonth = parseInt(body.visit_date.substring(5, 7), 10);
  if (visitYear && visitMonth) {
    await db.prepare(`
      UPDATE rotation_schedule
      SET status = 'completed', visit_id = ?, updated_at = ?
      WHERE year = ? AND branch = ? AND month = ? AND status = 'planned'
    `).bind(visitId, now, visitYear, body.branch, visitMonth).run();
  }

  return c.json({ success: true, id: visitId });
});

app.get('/api/visits/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;
  const visit = await db.prepare('SELECT * FROM visits WHERE id = ?').bind(id).first<VisitRecord>();

  if (!visit) {
    return c.json({ error: 'Visit report not found' }, 404);
  }

  let data: VisitData;
  try {
    data = JSON.parse(visit.data_json);
  } catch (err) {
    data = createDefaultVisitData(visit.has_masjid === 1, visit.is_academic === 1);
  }

  return c.json({
    visit: {
      ...visit,
      data
    }
  });
});

app.put('/api/visits/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{
    branch?: string;
    visit_date?: string;
    visit_type?: 'Scheduled' | 'Surprise';
    accompanied_by?: string;
    time_in?: string;
    time_out?: string;
    status?: 'Draft' | 'Submitted OMS' | 'Closed';
    has_masjid?: boolean;
    is_academic?: boolean;
    data?: VisitData;
    director_signature?: string;
    director_sign_date?: string;
    manager_signature?: string;
    manager_sign_date?: string;
    oms_reference?: string;
    oms_entry_date?: string;
  }>();

  const db = c.env.DB;
  const existing = await db.prepare('SELECT * FROM visits WHERE id = ?').bind(id).first<VisitRecord>();
  if (!existing) {
    return c.json({ error: 'Visit report not found' }, 404);
  }

  const hasMasjid = body.has_masjid !== undefined ? (body.has_masjid ? 1 : 0) : existing.has_masjid;
  const isAcademic = body.is_academic !== undefined ? (body.is_academic ? 1 : 0) : existing.is_academic;

  let visitData: VisitData;
  if (body.data) {
    visitData = body.data;
  } else {
    try {
      visitData = JSON.parse(existing.data_json);
    } catch {
      visitData = createDefaultVisitData(hasMasjid === 1, isAcademic === 1);
    }
  }

  // Calculate scores for each section
  const sumScores = (items: any[]) => items ? items.reduce((sum, item) => sum + (typeof item.score === 'number' ? item.score : 0), 0) : 0;

  const partBSum = sumScores(visitData.partB);
  const partCSum = sumScores(visitData.partC);
  const partDSum = sumScores(visitData.partD);
  const partESum = sumScores(visitData.partE);
  const partFSum = sumScores(visitData.partF);
  const partGSum = sumScores(visitData.partG);
  const partHSum = sumScores(visitData.partH);
  const partISum = sumScores(visitData.partI);
  const partJSum = sumScores(visitData.partJ);
  const partKSum = sumScores(visitData.partK);

  const updatedScorecard = calculateScorecard({
    partB: partBSum,
    partC: partCSum,
    partD: partDSum,
    partE: partESum,
    partF: partFSum,
    partG: partGSum,
    partH: partHSum,
    partI: partISum,
    partJ: partJSum,
    partK: partKSum,
    hasMasjid: hasMasjid === 1,
    isAcademic: isAcademic === 1
  });

  visitData.scorecard = updatedScorecard;

  const now = new Date().toISOString();

  await db.prepare(`
    UPDATE visits SET
      branch = COALESCE(?, branch),
      visit_date = COALESCE(?, visit_date),
      visit_type = COALESCE(?, visit_type),
      accompanied_by = COALESCE(?, accompanied_by),
      time_in = COALESCE(?, time_in),
      time_out = COALESCE(?, time_out),
      status = COALESCE(?, status),
      has_masjid = ?,
      is_academic = ?,
      total_score = ?,
      max_score = ?,
      score_percent = ?,
      rating = ?,
      data_json = ?,
      director_signature = COALESCE(?, director_signature),
      director_sign_date = COALESCE(?, director_sign_date),
      manager_signature = COALESCE(?, manager_signature),
      manager_sign_date = COALESCE(?, manager_sign_date),
      oms_reference = COALESCE(?, oms_reference),
      oms_entry_date = COALESCE(?, oms_entry_date),
      updated_at = ?
    WHERE id = ?
  `).bind(
    body.branch || null,
    body.visit_date || null,
    body.visit_type || null,
    body.accompanied_by || null,
    body.time_in || null,
    body.time_out || null,
    body.status || null,
    hasMasjid,
    isAcademic,
    updatedScorecard.totalScore,
    updatedScorecard.totalMax,
    updatedScorecard.overallPercent,
    updatedScorecard.rating,
    JSON.stringify(visitData),
    body.director_signature || null,
    body.director_sign_date || null,
    body.manager_signature || null,
    body.manager_sign_date || null,
    body.oms_reference || null,
    body.oms_entry_date || null,
    now,
    id
  ).run();

  return c.json({
    success: true,
    scorecard: updatedScorecard
  });
});

app.delete('/api/visits/:id', async (c) => {
  const user = c.get('user');
  if (user?.role !== 'director') {
    return c.json({ error: 'Only the Director can delete visit records' }, 403);
  }

  const id = c.req.param('id');
  const db = c.env.DB;

  await db.prepare('DELETE FROM share_tokens WHERE visit_id = ?').bind(id).run();
  await db.prepare('DELETE FROM visits WHERE id = ?').bind(id).run();

  return c.json({ success: true, message: 'Visit record deleted' });
});

// -------------------------------------------------------------
// Share Options (Inside Admin)
// -------------------------------------------------------------
app.get('/api/visits/:id/shares', async (c) => {
  const visitId = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM share_tokens WHERE visit_id = ? AND revoked = 0 ORDER BY created_at DESC'
  ).bind(visitId).all<ShareToken>();

  return c.json({ shares: results || [] });
});

app.post('/api/visits/:id/share', async (c) => {
  const user = c.get('user');
  const visitId = c.req.param('id');
  const body = await c.req.json<{ label?: string; daysValid?: number }>();

  const db = c.env.DB;
  const visit = await db.prepare('SELECT id, branch, visit_date FROM visits WHERE id = ?').bind(visitId).first();
  if (!visit) {
    return c.json({ error: 'Visit not found' }, 404);
  }

  const token = 'nq_share_' + generateToken();
  const tokenId = 'stk_' + generateToken().substring(0, 12);
  const now = new Date();
  const expiresAt = body.daysValid ? new Date(now.getTime() + body.daysValid * 24 * 60 * 60 * 1000).toISOString() : null;

  await db.prepare(`
    INSERT INTO share_tokens (id, visit_id, token, label, access_type, expires_at, revoked, created_by, created_at)
    VALUES (?, ?, ?, ?, 'read', ?, 0, ?, ?)
  `).bind(tokenId, visitId, token, body.label || 'Executive Share Link', expiresAt, user?.name || 'Admin', now.toISOString()).run();

  return c.json({
    success: true,
    shareUrl: `/shared.html?token=${token}`,
    token,
    expiresAt,
    label: body.label || 'Executive Share Link'
  });
});

app.delete('/api/shares/:token', async (c) => {
  const token = c.req.param('token');
  await c.env.DB.prepare('UPDATE share_tokens SET revoked = 1 WHERE token = ?').bind(token).run();
  return c.json({ success: true, message: 'Share link revoked' });
});

// Public / Shared View Endpoint (No login required if valid token)
app.get('/api/shared/:token', async (c) => {
  const token = c.req.param('token');
  const db = c.env.DB;

  const shareRecord = await db.prepare(
    'SELECT * FROM share_tokens WHERE token = ? AND revoked = 0'
  ).bind(token).first<ShareToken>();

  if (!shareRecord) {
    return c.json({ error: 'Invalid or revoked share link' }, 404);
  }

  if (shareRecord.expires_at && new Date(shareRecord.expires_at) < new Date()) {
    return c.json({ error: 'This share link has expired' }, 410);
  }

  const visit = await db.prepare('SELECT * FROM visits WHERE id = ?').bind(shareRecord.visit_id).first<VisitRecord>();
  if (!visit) {
    return c.json({ error: 'Visit report no longer exists' }, 404);
  }

  let data: VisitData;
  try {
    data = JSON.parse(visit.data_json);
  } catch {
    data = createDefaultVisitData(visit.has_masjid === 1, visit.is_academic === 1);
  }

  return c.json({
    share: {
      label: shareRecord.label,
      expires_at: shareRecord.expires_at,
      created_by: shareRecord.created_by
    },
    visit: {
      id: visit.id,
      branch: visit.branch,
      visit_date: visit.visit_date,
      visit_type: visit.visit_type,
      time_in: visit.time_in,
      time_out: visit.time_out,
      accompanied_by: visit.accompanied_by,
      status: visit.status,
      total_score: visit.total_score,
      max_score: visit.max_score,
      score_percent: visit.score_percent,
      rating: visit.rating,
      director_signature: visit.director_signature,
      director_sign_date: visit.director_sign_date,
      manager_signature: visit.manager_signature,
      manager_sign_date: visit.manager_sign_date,
      oms_reference: visit.oms_reference,
      oms_entry_date: visit.oms_entry_date,
      data
    }
  });
});

// -------------------------------------------------------------
// Part Q: Annual Rotation Schedule Endpoints
// -------------------------------------------------------------
app.get('/api/schedule', async (c) => {
  const year = parseInt(c.req.query('year') || '2026', 10);
  const db = c.env.DB;

  const { results } = await db.prepare(
    'SELECT s.*, v.score_percent, v.rating, v.status as visit_status FROM rotation_schedule s LEFT JOIN visits v ON s.visit_id = v.id WHERE s.year = ? ORDER BY s.branch, s.month'
  ).bind(year).all();

  return c.json({ year, schedule: results || [] });
});

app.post('/api/schedule', async (c) => {
  const user = c.get('user');
  if (user?.role !== 'director' && user?.role !== 'auditor') {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const body = await c.req.json<{
    year: number;
    branch: string;
    month: number;
    status: 'planned' | 'completed' | 'skipped';
    visit_id?: string;
    notes?: string;
  }>();

  const db = c.env.DB;
  const now = new Date().toISOString();

  // Check if exists
  const existing = await db.prepare(
    'SELECT id FROM rotation_schedule WHERE year = ? AND branch = ? AND month = ?'
  ).bind(body.year, body.branch, body.month).first();

  if (existing) {
    await db.prepare(`
      UPDATE rotation_schedule
      SET status = ?, visit_id = ?, notes = ?, updated_at = ?
      WHERE year = ? AND branch = ? AND month = ?
    `).bind(body.status, body.visit_id || null, body.notes || null, now, body.year, body.branch, body.month).run();
  } else {
    const id = 'sch_' + generateToken().substring(0, 12);
    await db.prepare(`
      INSERT INTO rotation_schedule (id, year, branch, month, status, visit_id, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, body.year, body.branch, body.month, body.status, body.visit_id || null, body.notes || null, now).run();
  }

  return c.json({ success: true });
});

// -------------------------------------------------------------
// Stats & Director Analytics
// -------------------------------------------------------------
app.get('/api/stats', async (c) => {
  const db = c.env.DB;
  
  const totalVisitsRes = await db.prepare('SELECT COUNT(*) as count FROM visits').first<{ count: number }>();
  const totalVisits = totalVisitsRes?.count || 0;

  const avgScoreRes = await db.prepare('SELECT AVG(score_percent) as avgScore FROM visits WHERE status != "Draft"').first<{ avgScore: number }>();
  const avgScore = avgScoreRes?.avgScore ? Math.round(avgScoreRes.avgScore * 10) / 10 : 0;

  const ratingsRes = await db.prepare('SELECT rating, COUNT(*) as count FROM visits GROUP BY rating').all<{ rating: string; count: number }>();

  const branchVisitsRes = await db.prepare(
    'SELECT branch, COUNT(*) as count, AVG(score_percent) as avg_percent, MAX(visit_date) as last_visit FROM visits GROUP BY branch'
  ).all<{ branch: string; count: number; avg_percent: number; last_visit: string }>();

  const completedScheduleCountRes = await db.prepare(
    'SELECT COUNT(*) as count FROM rotation_schedule WHERE status = "completed" AND year = 2026'
  ).first<{ count: number }>();

  return c.json({
    totalVisits,
    avgScore,
    ratings: ratingsRes.results || [],
    branchStats: branchVisitsRes.results || [],
    annualCompletedVisits: completedScheduleCountRes?.count || 0,
    annualTarget: 24
  });
});

// -------------------------------------------------------------
// Director's Operating Checklist Endpoints
// -------------------------------------------------------------
app.get('/api/operating/data', (c) => {
  return c.json({
    timeAllocations: TIME_ALLOCATIONS,
    weekly: WEEKLY_CHECKLIST,
    biweekly: BIWEEKLY_CHECKLIST,
    monthly: MONTHLY_CHECKLIST,
    quarterly: QUARTERLY_CHECKLIST,
    yearly: YEARLY_CALENDAR,
    annualOneTime: ANNUAL_ONE_TIME_DUTIES,
    delegationRules: DELEGATION_RULES,
    accountabilityTerms: ACCOUNTABILITY_TERMS
  });
});

// Get operating section log for any period and type
app.get('/api/operating/section', async (c) => {
  const db = c.env.DB;
  const type = c.req.query('type') || 'daily';
  const period = c.req.query('period') || (type === 'daily' ? new Date().toISOString().substring(0, 10) : 'current');

  const existing = await db.prepare(
    'SELECT * FROM operating_logs WHERE log_date = ? AND log_type = ?'
  ).bind(period, type).first();

  if (existing) {
    try {
      return c.json({
        type,
        period,
        log: {
          ...existing,
          data: JSON.parse((existing as any).data_json)
        }
      });
    } catch {
      // Fallback
    }
  }

  const defaultData = getDefaultSectionData(type);
  const { totalCount } = computeSectionCounts(type, defaultData);

  return c.json({
    type,
    period,
    log: {
      id: null,
      log_date: period,
      log_type: type,
      completed_count: 0,
      total_count: totalCount,
      signed_off: 0,
      data: defaultData
    }
  });
});

// Save or update operating section (daily, weekly, biweekly, monthly, quarterly, yearly)
app.post('/api/operating/section', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const body = await c.req.json<{
    type: string;
    period: string;
    data: any;
    signed_off?: boolean;
  }>();

  if (!body.type || !body.period || body.data === undefined) {
    return c.json({ error: 'Type, period, and data are required' }, 400);
  }

  const now = new Date().toISOString();
  const { completedCount, totalCount } = computeSectionCounts(body.type, body.data);

  const existing = await db.prepare(
    'SELECT id FROM operating_logs WHERE log_date = ? AND log_type = ?'
  ).bind(body.period, body.type).first<{ id: string }>();

  if (existing) {
    await db.prepare(`
      UPDATE operating_logs SET
        data_json = ?,
        completed_count = ?,
        total_count = ?,
        signed_off = ?,
        signed_at = CASE WHEN ? = 1 THEN COALESCE(signed_at, ?) ELSE signed_at END,
        updated_at = ?
      WHERE id = ?
    `).bind(
      JSON.stringify(body.data),
      completedCount,
      totalCount,
      body.signed_off ? 1 : 0,
      body.signed_off ? 1 : 0,
      now,
      now,
      existing.id
    ).run();

    return c.json({
      success: true,
      id: existing.id,
      completedCount,
      totalCount,
      percent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
    });
  } else {
    const id = 'op_' + generateToken().substring(0, 12);
    await db.prepare(`
      INSERT INTO operating_logs (
        id, log_date, log_type, data_json, completed_count, total_count,
        signed_off, signed_at, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.period,
      body.type,
      JSON.stringify(body.data),
      completedCount,
      totalCount,
      body.signed_off ? 1 : 0,
      body.signed_off ? now : null,
      user?.name || 'Director',
      now,
      now
    ).run();

    return c.json({
      success: true,
      id,
      completedCount,
      totalCount,
      percent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
    });
  }
});

// Get daily checklist log for a date (defaults to today)
app.get('/api/operating/daily', async (c) => {
  const db = c.env.DB;
  const date = c.req.query('date') || new Date().toISOString().substring(0, 10);

  const existing = await db.prepare(
    'SELECT * FROM operating_logs WHERE log_date = ? AND log_type = "daily"'
  ).bind(date).first();

  if (existing) {
    try {
      return c.json({
        date,
        log: {
          ...existing,
          data: JSON.parse((existing as any).data_json)
        }
      });
    } catch {
      // Fallback
    }
  }

  return c.json({
    date,
    log: {
      id: null,
      log_date: date,
      log_type: 'daily',
      completed_count: 0,
      total_count: 16,
      signed_off: 0,
      data: DAILY_CHECKLIST_TEMPLATE
    }
  });
});

// Save or update daily checklist
app.post('/api/operating/daily', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const body = await c.req.json<{
    date: string;
    data: any;
    signed_off?: boolean;
  }>();

  if (!body.date || !body.data) {
    return c.json({ error: 'Date and data are required' }, 400);
  }

  const now = new Date().toISOString();
  
  // Count completed tasks
  let completedCount = 0;
  let totalCount = 0;
  ['morning', 'midday', 'afternoon', 'endOfDay'].forEach((sec) => {
    if (Array.isArray(body.data[sec])) {
      totalCount += body.data[sec].length;
      completedCount += body.data[sec].filter((t: any) => t.done).length;
    }
  });

  const existing = await db.prepare(
    'SELECT id FROM operating_logs WHERE log_date = ? AND log_type = "daily"'
  ).bind(body.date).first<{ id: string }>();

  if (existing) {
    await db.prepare(`
      UPDATE operating_logs SET
        data_json = ?,
        completed_count = ?,
        total_count = ?,
        signed_off = ?,
        signed_at = CASE WHEN ? = 1 THEN ? ELSE signed_at END,
        updated_at = ?
      WHERE id = ?
    `).bind(
      JSON.stringify(body.data),
      completedCount,
      totalCount,
      body.signed_off ? 1 : 0,
      body.signed_off ? 1 : 0,
      now,
      now,
      existing.id
    ).run();

    return c.json({ success: true, id: existing.id, completedCount, totalCount });
  } else {
    const id = 'op_' + generateToken().substring(0, 12);
    await db.prepare(`
      INSERT INTO operating_logs (
        id, log_date, log_type, data_json, completed_count, total_count,
        signed_off, signed_at, created_by, created_at, updated_at
      ) VALUES (?, ?, 'daily', ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.date,
      JSON.stringify(body.data),
      completedCount,
      totalCount,
      body.signed_off ? 1 : 0,
      body.signed_off ? now : null,
      user?.name || 'Director',
      now,
      now
    ).run();

    return c.json({ success: true, id, completedCount, totalCount });
  }
});

// Get Director KPIs
app.get('/api/operating/kpis', async (c) => {
  const db = c.env.DB;
  const year = parseInt(c.req.query('year') || '2026', 10);

  let { results } = await db.prepare(
    'SELECT * FROM director_kpis WHERE year = ? ORDER BY kpi_num ASC'
  ).bind(year).all();

  // If no KPIs seeded yet, seed and return
  if (!results || results.length === 0) {
    const now = new Date().toISOString();
    for (const kpi of DIRECTOR_KPIS) {
      const id = 'kpi_' + generateToken().substring(0, 12);
      await db.prepare(`
        INSERT INTO director_kpis (id, year, kpi_num, kpi, target, measured_by, current_value, status, notes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', ?)
      `).bind(id, year, kpi.kpiNum, kpi.kpi, kpi.target, kpi.measuredBy, kpi.currentValue || '', kpi.status || 'on_track', now).run();
    }
    const refreshed = await db.prepare(
      'SELECT * FROM director_kpis WHERE year = ? ORDER BY kpi_num ASC'
    ).bind(year).all();
    results = refreshed.results;
  }

  return c.json({ year, kpis: results || [] });
});

// Update specific Director KPI
app.put('/api/operating/kpis/:id', async (c) => {
  const user = c.get('user');
  if (user?.role !== 'director') {
    return c.json({ error: 'Only the Director can update performance scorecard KPIs' }, 403);
  }

  const id = c.req.param('id');
  const body = await c.req.json<{
    current_value?: string;
    status?: 'on_track' | 'attention' | 'critical' | 'achieved';
    notes?: string;
  }>();

  const now = new Date().toISOString();
  await c.env.DB.prepare(`
    UPDATE director_kpis SET
      current_value = COALESCE(?, current_value),
      status = COALESCE(?, status),
      notes = COALESCE(?, notes),
      updated_at = ?
    WHERE id = ?
  `).bind(body.current_value || null, body.status || null, body.notes || null, now, id).run();

  return c.json({ success: true, message: 'KPI updated successfully' });
});

// List recent operating logs
app.get('/api/operating/logs', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare(
    'SELECT id, log_date, log_type, completed_count, total_count, signed_off, signed_at, created_by, updated_at FROM operating_logs ORDER BY log_date DESC LIMIT 30'
  ).all();

  return c.json({ logs: results || [] });
});

// Static assets fallback for Cloudflare Workers
app.all('*', async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text('Not Found', 404);
});

export default app;
