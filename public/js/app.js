import { api } from './api.js';
import {
  BRANCH_LIST,
  PART_A_TASKS,
  PART_B_OBSERVATIONS,
  PART_C_CHECKS,
  PART_D_CHECKS,
  PART_E_CHECKS,
  PART_F_CHECKS,
  PART_G_CHECKS,
  PART_H_CHECKS,
  PART_I_CHECKS,
  PART_J_CHECKS,
  PART_K_CHECKS,
  PART_M_QUESTIONS,
  PART_N_ACTIONS
} from './checklist-data.js';
import { SignaturePad } from './signature.js';
import { OperatingChecklistManager } from './operating.js';

// Application State
const state = {
  user: null,
  currentTab: 'dashboard',
  currentVisit: null,
  activePart: 'partA',
  visitsList: [],
  scheduleData: [],
  stats: null,
  saveTimeout: null,
  directorSigPad: null,
  managerSigPad: null,
  opManager: null
};

// UI Elements
const el = {
  authScreen: document.getElementById('auth-screen'),
  adminScreen: document.getElementById('admin-screen'),
  loginForm: document.getElementById('login-form'),
  loginError: document.getElementById('login-error'),
  userNameBadge: document.getElementById('user-name-badge'),
  userRoleBadge: document.getElementById('user-role-badge'),
  logoutBtn: document.getElementById('logout-btn'),
  
  // Navigation Tabs
  navBtns: document.querySelectorAll('.nav-tab-btn'),
  tabViews: {
    dashboard: document.getElementById('view-dashboard'),
    visits: document.getElementById('view-visits'),
    editor: document.getElementById('view-editor'),
    schedule: document.getElementById('view-schedule'),
    operating: document.getElementById('view-operating'),
    users: document.getElementById('view-users')
  },

  // Modals
  newVisitModal: document.getElementById('new-visit-modal'),
  shareModal: document.getElementById('share-modal'),
  syncIndicator: document.getElementById('sync-indicator')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await checkAuth();
});

// Event Listeners Setup
function setupEventListeners() {
  // Login Form
  el.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;
    try {
      el.loginError.style.display = 'none';
      await api.login(user, pass);
      await checkAuth();
    } catch (err) {
      el.loginError.textContent = err.message || 'Invalid credentials';
      el.loginError.style.display = 'block';
    }
  });

  // Demo user quick login buttons
  document.querySelectorAll('.btn-demo-login').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('login-username').value = btn.dataset.user;
      document.getElementById('login-password').value = btn.dataset.pass;
      el.loginForm.dispatchEvent(new Event('submit'));
    });
  });

  // Logout
  el.logoutBtn.addEventListener('click', async () => {
    await api.logout();
    state.user = null;
    state.currentVisit = null;
    showAuthScreen();
  });

  // Navigation tab clicks
  el.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // New Visit Modal open/close
  document.getElementById('btn-new-visit')?.addEventListener('click', () => {
    openNewVisitModal();
  });
  document.getElementById('btn-close-new-modal')?.addEventListener('click', () => {
    el.newVisitModal.classList.remove('open');
  });

  // Branch select custom campus toggle
  const branchSelect = document.getElementById('new-visit-branch');
  const customBranchGroup = document.getElementById('new-visit-custom-branch-group');
  const customBranchInput = document.getElementById('new-visit-custom-branch');
  branchSelect?.addEventListener('change', () => {
    const isOther = branchSelect.value === 'Other Campuses' || branchSelect.value === 'Other Campus';
    if (customBranchGroup) {
      customBranchGroup.style.display = isOther ? 'block' : 'none';
    }
    if (isOther && customBranchInput) {
      customBranchInput.focus();
    }
  });

  document.getElementById('form-new-visit')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleCreateVisit();
  });

  // Share Modal controls
  document.getElementById('btn-close-share-modal')?.addEventListener('click', () => {
    el.shareModal.classList.remove('open');
  });
  document.getElementById('btn-generate-share')?.addEventListener('click', async () => {
    await handleGenerateShareLink();
  });
  document.getElementById('btn-copy-share-link')?.addEventListener('click', () => {
    const input = document.getElementById('share-url-input');
    navigator.clipboard.writeText(input.value);
    alert('Share link copied to clipboard!');
  });
  document.getElementById('btn-copy-whatsapp')?.addEventListener('click', () => {
    copyWhatsAppSummary();
  });

  // Filter Visits
  document.getElementById('filter-branch')?.addEventListener('change', loadVisitsList);
  document.getElementById('filter-status')?.addEventListener('change', loadVisitsList);
  document.getElementById('search-visits')?.addEventListener('input', debounce(loadVisitsList, 300));

  // Editor Actions
  document.getElementById('btn-save-draft')?.addEventListener('click', () => saveCurrentVisit(true));
  document.getElementById('btn-open-share')?.addEventListener('click', () => openShareModal());
  document.getElementById('btn-print-visit')?.addEventListener('click', () => window.print());
  document.getElementById('btn-submit-oms')?.addEventListener('click', () => handleSubmitToOMS());

  // Signature Pads
  const dirCanvas = document.getElementById('director-canvas');
  if (dirCanvas) {
    state.directorSigPad = new SignaturePad(dirCanvas, (dataUrl) => {
      if (state.currentVisit) {
        state.currentVisit.director_signature = dataUrl;
        state.currentVisit.director_sign_date = new Date().toISOString().substring(0, 10);
        triggerAutoSave();
      }
    });
    document.getElementById('btn-clear-director-sig')?.addEventListener('click', () => state.directorSigPad.clear());
  }

  const mgrCanvas = document.getElementById('manager-canvas');
  if (mgrCanvas) {
    state.managerSigPad = new SignaturePad(mgrCanvas, (dataUrl) => {
      if (state.currentVisit) {
        state.currentVisit.manager_signature = dataUrl;
        state.currentVisit.manager_sign_date = new Date().toISOString().substring(0, 10);
        triggerAutoSave();
      }
    });
    document.getElementById('btn-clear-manager-sig')?.addEventListener('click', () => state.managerSigPad.clear());
  }

  // Photo Upload
  document.getElementById('photo-input')?.addEventListener('change', handlePhotoUpload);

  // Dynamic Part L Table Row buttons
  setupPartLAddButtons();
}

// Check Authentication
async function checkAuth() {
  try {
    // Attempt setup in case D1 DB is fresh
    await api.setup().catch(() => {});

    const res = await api.me();
    state.user = res.user;
    showAdminScreen();
    await loadInitialData();
  } catch (err) {
    state.user = null;
    showAuthScreen();
  }
}

function showAuthScreen() {
  el.authScreen.style.display = 'flex';
  el.adminScreen.style.display = 'none';
}

function showAdminScreen() {
  el.authScreen.style.display = 'none';
  el.adminScreen.style.display = 'block';

  el.userNameBadge.textContent = state.user.name;
  el.userRoleBadge.textContent = state.user.role;

  // Toggle user management tab for Director only
  const usersTabBtn = document.querySelector('[data-tab="users"]');
  if (usersTabBtn) {
    usersTabBtn.style.display = state.user.role === 'director' ? 'flex' : 'none';
  }

  if (!state.opManager) {
    state.opManager = new OperatingChecklistManager();
    window.opManager = state.opManager;
    state.opManager.init();
  }

  switchTab('dashboard');
}

// Switch Active Navigation Tab
export function switchTab(tabName) {
  state.currentTab = tabName;
  el.navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  Object.entries(el.tabViews).forEach(([key, view]) => {
    if (view) view.style.display = key === tabName ? 'block' : 'none';
  });

  if (tabName === 'dashboard') loadDashboardData();
  if (tabName === 'visits') loadVisitsList();
  if (tabName === 'schedule') loadRotationSchedule();
  if (tabName === 'operating' && state.opManager) state.opManager.loadDailyLog(state.opManager.currentDate);
  if (tabName === 'users') loadUsersList();
}

// -------------------------------------------------------------
// Dashboard View
// -------------------------------------------------------------
async function loadDashboardData() {
  try {
    const stats = await api.getStats();
    state.stats = stats;

    document.getElementById('stat-total-visits').textContent = stats.totalVisits;
    document.getElementById('stat-avg-score').textContent = stats.avgScore > 0 ? `${stats.avgScore}%` : 'N/A';
    document.getElementById('stat-annual-progress').textContent = `${stats.annualCompletedVisits} / ${stats.annualTarget}`;
    
    // Render branch status list
    const branchContainer = document.getElementById('dashboard-branch-stats');
    if (branchContainer) {
      if (!stats.branchStats || stats.branchStats.length === 0) {
        branchContainer.innerHTML = '<p class="text-muted">No inspection records yet. Click "New Inspection" to start.</p>';
      } else {
        branchContainer.innerHTML = stats.branchStats.map(b => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light)">
            <div>
              <strong>${escapeHtml(b.branch)}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted)">Last Visit: ${b.last_visit || 'Never'} (${b.count} total)</div>
            </div>
            <div>
              <span class="badge ${getRatingBadgeClass(b.avg_percent)}">${b.avg_percent ? b.avg_percent.toFixed(1) + '%' : 'Pending'}</span>
            </div>
          </div>
        `).join('');
      }
    }

    // Load recent visits
    const recent = await api.getVisits();
    const recentTable = document.getElementById('dashboard-recent-visits');
    if (recentTable) {
      const top5 = (recent.visits || []).slice(0, 5);
      if (top5.length === 0) {
        recentTable.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:1.5rem;">No visits found.</td></tr>';
      } else {
        recentTable.innerHTML = top5.map(v => `
          <tr>
            <td><strong>${escapeHtml(v.branch)}</strong></td>
            <td>${v.visit_date}</td>
            <td><span class="badge" style="background:#f1f5f9; color:#475569;">${v.visit_type}</span></td>
            <td><strong>${v.score_percent ? v.score_percent.toFixed(1) + '%' : '0%'}</strong></td>
            <td><span class="badge ${getRatingBadgeClass(v.score_percent)}">${v.rating || 'Draft'}</span></td>
            <td>
              <button class="btn btn-sm btn-secondary" onclick="window.openVisit('${v.id}')">Open</button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

// -------------------------------------------------------------
// Visits List View
// -------------------------------------------------------------
async function loadVisitsList() {
  const branch = document.getElementById('filter-branch')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  const search = document.getElementById('search-visits')?.value.toLowerCase() || '';

  try {
    const res = await api.getVisits({ branch, status });
    let visits = res.visits || [];

    if (search) {
      visits = visits.filter(v => 
        v.branch.toLowerCase().includes(search) || 
        v.visit_date.includes(search) ||
        (v.accompanied_by && v.accompanied_by.toLowerCase().includes(search))
      );
    }

    state.visitsList = visits;
    const tbody = document.getElementById('visits-table-body');
    if (!tbody) return;

    if (visits.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-muted);">No visits matching the selected filters.</td></tr>';
      return;
    }

    tbody.innerHTML = visits.map(v => `
      <tr>
        <td>
          <strong>${escapeHtml(v.branch)}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted)">Created by ${escapeHtml(v.created_by || 'Director')}</div>
        </td>
        <td>${v.visit_date}</td>
        <td><span class="badge" style="background:#f1f5f9; color:#475569;">${v.visit_type}</span></td>
        <td><strong>${v.score_percent ? v.score_percent.toFixed(1) + '%' : '0%'}</strong> (${v.total_score}/${v.max_score})</td>
        <td><span class="badge ${getRatingBadgeClass(v.score_percent)}">${v.rating || 'Draft'}</span></td>
        <td><span class="badge ${v.status === 'Submitted OMS' ? 'badge-excellent' : 'badge-good'}">${v.status}</span></td>
        <td>
          <div style="display:flex; gap:0.35rem;">
            <button class="btn btn-sm btn-primary" onclick="window.openVisit('${v.id}')">Inspect / Edit</button>
            <button class="btn btn-sm btn-secondary" onclick="window.openShareFromList('${v.id}')" title="Share with Board/Auditor">Share</button>
            ${state.user.role === 'director' ? `<button class="btn btn-sm btn-danger" onclick="window.deleteVisitRecord('${v.id}')">Delete</button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load visits:', err);
  }
}

// -------------------------------------------------------------
// New Visit Creation
// -------------------------------------------------------------
function openNewVisitModal() {
  const dateInput = document.getElementById('new-visit-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().substring(0, 10);
  }
  const branchSelect = document.getElementById('new-visit-branch');
  const customBranchGroup = document.getElementById('new-visit-custom-branch-group');
  const customBranchInput = document.getElementById('new-visit-custom-branch');
  if (customBranchGroup && branchSelect) {
    const isOther = branchSelect.value === 'Other Campuses' || branchSelect.value === 'Other Campus';
    customBranchGroup.style.display = isOther ? 'block' : 'none';
    if (!isOther && customBranchInput) {
      customBranchInput.value = '';
    }
  }
  el.newVisitModal.classList.add('open');
}

async function handleCreateVisit() {
  const branchSelect = document.getElementById('new-visit-branch');
  let branch = branchSelect?.value || 'HQ Jauharabad';
  if (branch === 'Other Campuses' || branch === 'Other Campus') {
    const customBranch = document.getElementById('new-visit-custom-branch')?.value?.trim();
    if (!customBranch) {
      alert('Please enter the name of the campus or unit.');
      document.getElementById('new-visit-custom-branch')?.focus();
      return;
    }
    branch = customBranch;
  }

  const visit_date = document.getElementById('new-visit-date').value;
  const visit_type = document.getElementById('new-visit-type').value;
  const accompanied_by = document.getElementById('new-visit-accompanied').value;
  const has_masjid = document.getElementById('new-visit-has-masjid').checked;
  const is_academic = document.getElementById('new-visit-is-academic').checked;

  try {
    const res = await api.createVisit({
      branch,
      visit_date,
      visit_type,
      accompanied_by,
      has_masjid,
      is_academic
    });

    el.newVisitModal.classList.remove('open');
    await openVisit(res.id);
  } catch (err) {
    alert('Error creating visit: ' + err.message);
  }
}

// -------------------------------------------------------------
// Checklist Editor (The 17 Parts)
// -------------------------------------------------------------
export async function openVisit(id) {
  try {
    showSyncIndicator('Loading visit report...');
    const res = await api.getVisit(id);
    state.currentVisit = res.visit;
    hideSyncIndicator();

    renderChecklistEditor();
    switchTab('editor');
  } catch (err) {
    alert('Failed to load visit: ' + err.message);
  }
}
window.openVisit = openVisit;

function renderChecklistEditor() {
  const v = state.currentVisit;
  if (!v) return;

  // Header Details
  document.getElementById('editor-branch-title').textContent = v.branch;
  document.getElementById('editor-date-display').textContent = v.visit_date;
  document.getElementById('editor-type-badge').textContent = v.visit_type;
  document.getElementById('editor-status-badge').textContent = v.status;
  document.getElementById('editor-accompanied').value = v.accompanied_by || '';
  document.getElementById('editor-time-in').value = v.time_in || '';
  document.getElementById('editor-time-out').value = v.time_out || '';
  document.getElementById('editor-oms-ref').value = v.oms_reference || '';

  // Branch Toggles
  const toggleMasjid = document.getElementById('toggle-has-masjid');
  const toggleAcademic = document.getElementById('toggle-is-academic');
  if (toggleMasjid) {
    toggleMasjid.checked = v.has_masjid === 1;
    toggleMasjid.onchange = () => {
      v.has_masjid = toggleMasjid.checked ? 1 : 0;
      updateScorecardLive();
      triggerAutoSave();
    };
  }
  if (toggleAcademic) {
    toggleAcademic.checked = v.is_academic === 1;
    toggleAcademic.onchange = () => {
      v.is_academic = toggleAcademic.checked ? 1 : 0;
      updateScorecardLive();
      triggerAutoSave();
    };
  }

  // Render Subnav Pills
  setupSubnavPills();

  // Render Part A
  renderPartA();

  // Render Part B
  renderPartB();
  renderPhotos();

  // Render Parts C through K
  renderPartC();
  renderPartD();
  renderPartE();
  renderPartF();
  renderPartG();
  renderPartH();
  renderPartI();
  renderPartJ();
  renderPartK();

  // Render Part L
  renderPartL();

  // Render Part M
  renderPartM();

  // Render Part N
  renderPartN();

  // Render Part O & Live Scorecard
  updateScorecardLive();

  // Signatures
  if (state.directorSigPad && v.director_signature) {
    state.directorSigPad.loadDataURL(v.director_signature);
  } else if (state.directorSigPad) {
    state.directorSigPad.clear();
  }

  if (state.managerSigPad && v.manager_signature) {
    state.managerSigPad.loadDataURL(v.manager_signature);
  } else if (state.managerSigPad) {
    state.managerSigPad.clear();
  }
}

// Subnav Pills
function setupSubnavPills() {
  const container = document.getElementById('checklist-subnav');
  if (!container) return;

  const parts = [
    { id: 'partA', label: 'Part A: Prep' },
    { id: 'partB', label: 'Part B: Arrival' },
    { id: 'partC', label: 'Part C: Cash' },
    { id: 'partD', label: 'Part D: Systems' },
    { id: 'partE', label: 'Part E: Staff' },
    { id: 'partF', label: 'Part F: Academic' },
    { id: 'partG', label: 'Part G: Masjid' },
    { id: 'partH', label: 'Part H: Assets' },
    { id: 'partI', label: 'Part I: Vendors' },
    { id: 'partJ', label: 'Part J: Compliance' },
    { id: 'partK', label: 'Part K: Community' },
    { id: 'partL', label: 'Part L: Findings' },
    { id: 'partM', label: 'Part M: Interviews' },
    { id: 'partN', label: 'Part N: Actions' },
    { id: 'partO', label: 'Part O: Scorecard' },
    { id: 'partP', label: 'Part P: Sign-off' }
  ];

  container.innerHTML = parts.map((p, idx) => `
    <button class="part-pill ${idx === 0 ? 'active' : ''}" onclick="window.scrollToPart('${p.id}')">${p.label}</button>
  `).join('');
}

window.scrollToPart = (partId) => {
  const target = document.getElementById(`section-${partId}`);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.part-pill').forEach(pill => {
      pill.classList.toggle('active', pill.textContent.includes(partId.toUpperCase().replace('PART', 'PART ')));
    });
  }
};

// Part A: Pre-visit Prep
function renderPartA() {
  const container = document.getElementById('part-a-tbody');
  if (!container) return;
  const items = state.currentVisit.data.partA;

  container.innerHTML = items.map((item, index) => `
    <tr>
      <td style="width: 40px; text-align:center;">${item.id}</td>
      <td>${escapeHtml(item.task)}</td>
      <td style="width: 80px; text-align:center;">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="window.togglePartA(${index}, this.checked)">
      </td>
      <td>
        <input type="text" class="form-control" style="width:100%;" placeholder="Notes..." value="${escapeHtml(item.notes || '')}" oninput="window.updatePartANotes(${index}, this.value)">
      </td>
    </tr>
  `).join('');
}

window.togglePartA = (index, done) => {
  state.currentVisit.data.partA[index].done = done;
  triggerAutoSave();
};

window.updatePartANotes = (index, notes) => {
  state.currentVisit.data.partA[index].notes = notes;
  triggerAutoSave();
};

// Generic Scored Checklist Section Renderer (Parts B, C, D, E, F, G, H, I, J, K)
function renderScoredSection(sectionKey, tbodyId, hasEvidence = true) {
  const container = document.getElementById(tbodyId);
  if (!container) return;
  const items = state.currentVisit.data[sectionKey];

  container.innerHTML = items.map((item, index) => `
    <tr>
      <td style="width: 35px; text-align:center; font-weight:600;">${item.id}</td>
      <td>${escapeHtml(item.observation || item.check)}</td>
      ${hasEvidence ? `<td style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(item.evidence || '')}</td>` : ''}
      <td style="width: 170px;">
        <div class="score-selector">
          ${[1, 2, 3, 4, 5].map(score => `
            <button type="button" class="score-btn score-${score} ${item.score === score ? 'selected' : ''}" onclick="window.setSectionScore('${sectionKey}', ${index}, ${score})">${score}</button>
          `).join('')}
          <button type="button" class="btn btn-sm btn-secondary" style="margin-left:4px; padding:2px 6px; font-size:0.7rem;" onclick="window.setSectionScore('${sectionKey}', ${index}, null)" title="Clear score">×</button>
        </div>
      </td>
      <td>
        <input type="text" class="form-control" style="width:100%; font-size:0.8rem;" placeholder="Findings & notes..." value="${escapeHtml(item.notes || '')}" oninput="window.updateSectionNotes('${sectionKey}', ${index}, this.value)">
      </td>
    </tr>
  `).join('');
}

window.setSectionScore = (sectionKey, index, score) => {
  state.currentVisit.data[sectionKey][index].score = score;
  renderScoredSection(sectionKey, `${sectionKey.toLowerCase()}-tbody`, sectionKey !== 'partB');
  updateScorecardLive();
  triggerAutoSave();
};

window.updateSectionNotes = (sectionKey, index, notes) => {
  state.currentVisit.data[sectionKey][index].notes = notes;
  triggerAutoSave();
};

// Renders for all parts
function renderPartB() { renderScoredSection('partB', 'partb-tbody', false); }
function renderPartC() { renderScoredSection('partC', 'partc-tbody', true); }
function renderPartD() { renderScoredSection('partD', 'partd-tbody', true); }
function renderPartE() { renderScoredSection('partE', 'parte-tbody', true); }
function renderPartF() { renderScoredSection('partF', 'partf-tbody', true); }
function renderPartG() { renderScoredSection('partG', 'partg-tbody', true); }
function renderPartH() { renderScoredSection('partH', 'parth-tbody', true); }
function renderPartI() { renderScoredSection('partI', 'parti-tbody', true); }
function renderPartJ() { renderScoredSection('partJ', 'partj-tbody', true); }
function renderPartK() { renderScoredSection('partK', 'partk-tbody', true); }

// Photos Management (Part B)
function renderPhotos() {
  const container = document.getElementById('photo-gallery');
  if (!container) return;
  const photos = state.currentVisit.data.photos || [];

  if (photos.length === 0) {
    container.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; padding: 1rem; border: 1px dashed var(--border-light); border-radius: var(--radius); text-align: center;">No photos uploaded yet. Required photos: Entrance, Notice Board, Cash Storage, Any Deficiencies, Any Strengths.</p>';
    return;
  }

  container.innerHTML = photos.map((p, index) => `
    <div class="photo-card">
      <button class="photo-delete-btn" onclick="window.deletePhoto(${index})">×</button>
      <img src="${p.dataUrl}" alt="${escapeHtml(p.caption)}" class="photo-preview" onclick="window.previewPhoto('${p.dataUrl}')">
      <div class="photo-meta">
        <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.65rem;">${p.category}</span>
        <input type="text" class="form-control" style="font-size:0.75rem; margin-top:0.25rem;" value="${escapeHtml(p.caption || '')}" placeholder="Caption..." oninput="window.updatePhotoCaption(${index}, this.value)">
      </div>
    </div>
  `).join('');
}

window.deletePhoto = (index) => {
  if (confirm('Delete this photo?')) {
    state.currentVisit.data.photos.splice(index, 1);
    renderPhotos();
    triggerAutoSave();
  }
};

window.updatePhotoCaption = (index, caption) => {
  state.currentVisit.data.photos[index].caption = caption;
  triggerAutoSave();
};

window.previewPhoto = (url) => {
  const win = window.open();
  win.document.write(`<img src="${url}" style="max-width:100%; height:auto;">`);
};

async function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const category = document.getElementById('photo-category')?.value || 'general';
  const caption = document.getElementById('photo-caption')?.value || '';

  // Compress and read image to max 800px
  const dataUrl = await compressImageFile(file, 800, 800, 0.7);

  if (!state.currentVisit.data.photos) state.currentVisit.data.photos = [];
  state.currentVisit.data.photos.push({
    id: 'ph_' + Date.now(),
    category,
    caption: caption || file.name,
    dataUrl,
    uploadedAt: new Date().toISOString()
  });

  e.target.value = '';
  document.getElementById('photo-caption').value = '';
  renderPhotos();
  triggerAutoSave();
}

function compressImageFile(file, maxWidth, maxHeight, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// Part L: Strengths, Weaknesses, Recommendations
// -------------------------------------------------------------
function renderPartL() {
  const l = state.currentVisit.data.partL;

  // Strengths
  const strTbody = document.getElementById('partl-strengths-tbody');
  if (strTbody) {
    strTbody.innerHTML = (l.strengths || []).map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.strength)}" oninput="window.updatePartLField('strengths', ${idx}, 'strength', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.evidence)}" oninput="window.updatePartLField('strengths', ${idx}, 'evidence', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.replication)}" oninput="window.updatePartLField('strengths', ${idx}, 'replication', this.value)"></td>
        <td><button class="btn btn-sm btn-danger" onclick="window.removePartLRow('strengths', ${idx})">×</button></td>
      </tr>
    `).join('');
  }

  // Weaknesses
  const weakTbody = document.getElementById('partl-weaknesses-tbody');
  if (weakTbody) {
    weakTbody.innerHTML = (l.weaknesses || []).map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.weakness)}" oninput="window.updatePartLField('weaknesses', ${idx}, 'weakness', this.value)"></td>
        <td>
          <select class="form-control" onchange="window.updatePartLField('weaknesses', ${idx}, 'severity', this.value)">
            ${['Critical', 'High', 'Medium', 'Low'].map(s => `<option value="${s}" ${row.severity === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.rootCause)}" oninput="window.updatePartLField('weaknesses', ${idx}, 'rootCause', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.immediateAction)}" oninput="window.updatePartLField('weaknesses', ${idx}, 'immediateAction', this.value)"></td>
        <td><button class="btn btn-sm btn-danger" onclick="window.removePartLRow('weaknesses', ${idx})">×</button></td>
      </tr>
    `).join('');
  }

  // Upgrades
  const upTbody = document.getElementById('partl-upgrades-tbody');
  if (upTbody) {
    upTbody.innerHTML = (l.upgrades || []).map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.item)}" oninput="window.updatePartLField('upgrades', ${idx}, 'item', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.estimatedCost)}" oninput="window.updatePartLField('upgrades', ${idx}, 'estimatedCost', this.value)"></td>
        <td>
          <select class="form-control" onchange="window.updatePartLField('upgrades', ${idx}, 'priority', this.value)">
            ${['Critical', 'High', 'Medium', 'Low'].map(s => `<option value="${s}" ${row.priority === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.deadline)}" oninput="window.updatePartLField('upgrades', ${idx}, 'deadline', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.responsible)}" oninput="window.updatePartLField('upgrades', ${idx}, 'responsible', this.value)"></td>
        <td><button class="btn btn-sm btn-danger" onclick="window.removePartLRow('upgrades', ${idx})">×</button></td>
      </tr>
    `).join('');
  }

  // Downgrades
  const downTbody = document.getElementById('partl-downgrades-tbody');
  if (downTbody) {
    downTbody.innerHTML = (l.downgrades || []).map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.item)}" oninput="window.updatePartLField('downgrades', ${idx}, 'item', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.saving)}" oninput="window.updatePartLField('downgrades', ${idx}, 'saving', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.reason)}" oninput="window.updatePartLField('downgrades', ${idx}, 'reason', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.action)}" oninput="window.updatePartLField('downgrades', ${idx}, 'action', this.value)"></td>
        <td><button class="btn btn-sm btn-danger" onclick="window.removePartLRow('downgrades', ${idx})">×</button></td>
      </tr>
    `).join('');
  }

  // Improvements
  const impTbody = document.getElementById('partl-improvements-tbody');
  if (impTbody) {
    impTbody.innerHTML = (l.improvements || []).map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.improvement)}" oninput="window.updatePartLField('improvements', ${idx}, 'improvement', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.benefit)}" oninput="window.updatePartLField('improvements', ${idx}, 'benefit', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.cost)}" oninput="window.updatePartLField('improvements', ${idx}, 'cost', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.timeline)}" oninput="window.updatePartLField('improvements', ${idx}, 'timeline', this.value)"></td>
        <td><button class="btn btn-sm btn-danger" onclick="window.removePartLRow('improvements', ${idx})">×</button></td>
      </tr>
    `).join('');
  }

  // Deficiencies
  const defTbody = document.getElementById('partl-deficiencies-tbody');
  if (defTbody) {
    defTbody.innerHTML = (l.deficiencies || []).map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.deficiency)}" oninput="window.updatePartLField('deficiencies', ${idx}, 'deficiency', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.risk)}" oninput="window.updatePartLField('deficiencies', ${idx}, 'risk', this.value)"></td>
        <td>
          <select class="form-control" onchange="window.updatePartLField('deficiencies', ${idx}, 'legalBreach', this.value)">
            ${['No', 'Yes', 'Potential'].map(o => `<option value="${o}" ${row.legalBreach === o ? 'selected' : ''}>${o}</option>`).join('')}
          </select>
        </td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.actionRequired)}" oninput="window.updatePartLField('deficiencies', ${idx}, 'actionRequired', this.value)"></td>
        <td><input type="text" class="form-control" value="${escapeHtml(row.deadline)}" oninput="window.updatePartLField('deficiencies', ${idx}, 'deadline', this.value)"></td>
        <td><button class="btn btn-sm btn-danger" onclick="window.removePartLRow('deficiencies', ${idx})">×</button></td>
      </tr>
    `).join('');
  }
}

window.updatePartLField = (category, index, field, value) => {
  state.currentVisit.data.partL[category][index][field] = value;
  triggerAutoSave();
};

window.removePartLRow = (category, index) => {
  state.currentVisit.data.partL[category].splice(index, 1);
  renderPartL();
  triggerAutoSave();
};

function setupPartLAddButtons() {
  document.getElementById('btn-add-strength')?.addEventListener('click', () => {
    state.currentVisit.data.partL.strengths.push({ id: 'str_' + Date.now(), strength: '', evidence: '', replication: '' });
    renderPartL();
    triggerAutoSave();
  });
  document.getElementById('btn-add-weakness')?.addEventListener('click', () => {
    state.currentVisit.data.partL.weaknesses.push({ id: 'w_' + Date.now(), weakness: '', severity: 'Medium', rootCause: '', immediateAction: '' });
    renderPartL();
    triggerAutoSave();
  });
  document.getElementById('btn-add-upgrade')?.addEventListener('click', () => {
    state.currentVisit.data.partL.upgrades.push({ id: 'up_' + Date.now(), item: '', estimatedCost: '', priority: 'Medium', deadline: '', responsible: '' });
    renderPartL();
    triggerAutoSave();
  });
  document.getElementById('btn-add-downgrade')?.addEventListener('click', () => {
    state.currentVisit.data.partL.downgrades.push({ id: 'dn_' + Date.now(), item: '', saving: '', reason: '', action: '' });
    renderPartL();
    triggerAutoSave();
  });
  document.getElementById('btn-add-improvement')?.addEventListener('click', () => {
    state.currentVisit.data.partL.improvements.push({ id: 'imp_' + Date.now(), improvement: '', benefit: '', cost: '', timeline: '' });
    renderPartL();
    triggerAutoSave();
  });
  document.getElementById('btn-add-deficiency')?.addEventListener('click', () => {
    state.currentVisit.data.partL.deficiencies.push({ id: 'def_' + Date.now(), deficiency: '', risk: '', legalBreach: 'No', actionRequired: '', deadline: '' });
    renderPartL();
    triggerAutoSave();
  });
}

// -------------------------------------------------------------
// Part M: Staff and Student Interviews
// -------------------------------------------------------------
function renderPartM() {
  const tbody = document.getElementById('partm-tbody');
  if (!tbody) return;
  const questions = state.currentVisit.data.partM || [];

  tbody.innerHTML = questions.map((q, idx) => `
    <tr>
      <td style="font-weight:600; width:35px; text-align:center;">${q.id}</td>
      <td style="font-weight:500; min-width:180px;">${escapeHtml(q.question)}</td>
      <td><textarea class="form-control" rows="2" style="font-size:0.75rem; width:120px;" oninput="window.updateInterviewField(${idx}, 'staff1', this.value)">${escapeHtml(q.staff1 || '')}</textarea></td>
      <td><textarea class="form-control" rows="2" style="font-size:0.75rem; width:120px;" oninput="window.updateInterviewField(${idx}, 'staff2', this.value)">${escapeHtml(q.staff2 || '')}</textarea></td>
      <td><textarea class="form-control" rows="2" style="font-size:0.75rem; width:120px;" oninput="window.updateInterviewField(${idx}, 'staff3', this.value)">${escapeHtml(q.staff3 || '')}</textarea></td>
      <td><textarea class="form-control" rows="2" style="font-size:0.75rem; width:120px;" oninput="window.updateInterviewField(${idx}, 'student1', this.value)">${escapeHtml(q.student1 || '')}</textarea></td>
      <td><textarea class="form-control" rows="2" style="font-size:0.75rem; width:120px;" oninput="window.updateInterviewField(${idx}, 'student2', this.value)">${escapeHtml(q.student2 || '')}</textarea></td>
      <td><textarea class="form-control" rows="2" style="font-size:0.75rem; width:120px;" oninput="window.updateInterviewField(${idx}, 'student3', this.value)">${escapeHtml(q.student3 || '')}</textarea></td>
    </tr>
  `).join('');
}

window.updateInterviewField = (index, field, value) => {
  state.currentVisit.data.partM[index][field] = value;
  triggerAutoSave();
};

// -------------------------------------------------------------
// Part N: Post-Visit Actions (Within 48 Hours)
// -------------------------------------------------------------
function renderPartN() {
  const tbody = document.getElementById('partn-tbody');
  if (!tbody) return;
  const actions = state.currentVisit.data.partN || [];

  tbody.innerHTML = actions.map((act, idx) => `
    <tr>
      <td style="font-weight:600; width:35px; text-align:center;">${act.id}</td>
      <td>${escapeHtml(act.action)}</td>
      <td style="width:110px;"><span class="badge" style="background:#fef3c7; color:#92400e;">${act.deadline}</span></td>
      <td style="width:140px;">
        <input type="text" class="form-control" style="font-size:0.75rem;" value="${escapeHtml(act.owner || '')}" placeholder="Owner..." oninput="window.updateActionOwner(${idx}, this.value)">
      </td>
      <td style="width:60px; text-align:center;">
        <input type="checkbox" ${act.done ? 'checked' : ''} onchange="window.toggleActionDone(${idx}, this.checked)">
      </td>
      <td>
        <input type="text" class="form-control" style="font-size:0.75rem;" value="${escapeHtml(act.notes || '')}" placeholder="Notes..." oninput="window.updateActionNotes(${idx}, this.value)">
      </td>
    </tr>
  `).join('');
}

window.toggleActionDone = (index, done) => {
  state.currentVisit.data.partN[index].done = done;
  triggerAutoSave();
};

window.updateActionOwner = (index, owner) => {
  state.currentVisit.data.partN[index].owner = owner;
  triggerAutoSave();
};

window.updateActionNotes = (index, notes) => {
  state.currentVisit.data.partN[index].notes = notes;
  triggerAutoSave();
};

// -------------------------------------------------------------
// Part O: Live Scorecard Calculation
// -------------------------------------------------------------
function updateScorecardLive() {
  const v = state.currentVisit;
  if (!v || !v.data) return;

  const sumScores = (items) => items ? items.reduce((sum, item) => sum + (typeof item.score === 'number' ? item.score : 0), 0) : 0;

  const partB = sumScores(v.data.partB);
  const partC = sumScores(v.data.partC);
  const partD = sumScores(v.data.partD);
  const partE = sumScores(v.data.partE);
  const partF = sumScores(v.data.partF);
  const partG = sumScores(v.data.partG);
  const partH = sumScores(v.data.partH);
  const partI = sumScores(v.data.partI);
  const partJ = sumScores(v.data.partJ);
  const partK = sumScores(v.data.partK);

  const areas = [
    { name: 'First impressions (Part B)', code: 'B', max: 60, score: partB, applicable: true },
    { name: 'Financial controls (Part C)', code: 'C', max: 90, score: partC, applicable: true },
    { name: 'Accounts and systems (Part D)', code: 'D', max: 75, score: partD, applicable: true },
    { name: 'Staff performance (Part E)', code: 'E', max: 75, score: partE, applicable: true },
    { name: 'Academic quality (Part F)', code: 'F', max: 75, score: partF, applicable: v.is_academic === 1 },
    { name: 'Masjid operations (Part G)', code: 'G', max: 75, score: partG, applicable: v.has_masjid === 1 },
    { name: 'Assets and infrastructure (Part H)', code: 'H', max: 75, score: partH, applicable: true },
    { name: 'Procurement and vendors (Part I)', code: 'I', max: 60, score: partI, applicable: true },
    { name: 'Compliance and security (Part J)', code: 'J', max: 75, score: partJ, applicable: true },
    { name: 'Community relations (Part K)', code: 'K', max: 40, score: partK, applicable: true }
  ];

  let totalMax = 0;
  let totalScore = 0;

  const evaluatedAreas = areas.map(a => {
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

    return { ...a, score: s, percent: p, rating: r };
  });

  const overallPercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 1000) / 10 : 0;

  let rating = 'Satisfactory';
  let ratingDesc = 'Action plan required';
  if (overallPercent >= 90) { rating = 'Excellent'; ratingDesc = 'Model branch, share practices'; }
  else if (overallPercent >= 75) { rating = 'Good'; ratingDesc = 'Minor improvements needed'; }
  else if (overallPercent >= 60) { rating = 'Satisfactory'; ratingDesc = 'Action plan required'; }
  else if (overallPercent >= 40) { rating = 'Weak'; ratingDesc = 'Immediate intervention, re-visit in 4 weeks'; }
  else { rating = 'Critical'; ratingDesc = 'Escalate to board, consider management change'; }

  v.total_score = totalScore;
  v.max_score = totalMax;
  v.score_percent = overallPercent;
  v.rating = rating;

  v.data.scorecard = {
    areas: evaluatedAreas,
    totalMax,
    totalScore,
    overallPercent,
    rating,
    ratingDescription: ratingDesc
  };

  // Update UI Elements
  document.getElementById('banner-total-score').textContent = totalScore;
  document.getElementById('banner-max-score').textContent = totalMax;
  document.getElementById('banner-score-percent').textContent = `${overallPercent.toFixed(1)}%`;
  
  const ratingBadge = document.getElementById('banner-rating-badge');
  if (ratingBadge) {
    ratingBadge.textContent = `${rating} — ${ratingDesc}`;
    ratingBadge.className = `badge ${getRatingBadgeClass(overallPercent)}`;
  }

  // Update Scorecard Table
  const tbody = document.getElementById('scorecard-tbody');
  if (tbody) {
    tbody.innerHTML = evaluatedAreas.map(a => `
      <tr style="${!a.applicable ? 'opacity: 0.45; text-decoration: line-through;' : ''}">
        <td><strong>${a.name}</strong></td>
        <td>${a.applicable ? a.max : 'N/A'}</td>
        <td><strong>${a.applicable ? a.score : '-'}</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div class="score-bar-bg" style="flex:1;">
              <div class="score-bar-fill" style="width: ${a.percent}%;"></div>
            </div>
            <span style="font-weight:600; font-size:0.75rem; width:45px;">${a.applicable ? a.percent.toFixed(1) + '%' : '-'}</span>
          </div>
        </td>
        <td><span class="badge ${getRatingBadgeClass(a.percent)}">${a.applicable ? a.rating : 'Excluded'}</span></td>
      </tr>
    `).join('') + `
      <tr style="background:var(--bg-subtle); font-weight:700; font-size:1rem; border-top:2px solid var(--border-light);">
        <td>TOTAL SCORECARD</td>
        <td>${totalMax}</td>
        <td>${totalScore}</td>
        <td>${overallPercent.toFixed(1)}%</td>
        <td><span class="badge ${getRatingBadgeClass(overallPercent)}">${rating}</span></td>
      </tr>
    `;
  }
}

// -------------------------------------------------------------
// Auto-Save and Submission
// -------------------------------------------------------------
function triggerAutoSave() {
  showSyncIndicator('Saving to Cloudflare D1...');
  if (state.saveTimeout) clearTimeout(state.saveTimeout);
  state.saveTimeout = setTimeout(() => {
    saveCurrentVisit(false);
  }, 1000);
}

async function saveCurrentVisit(showNotice = true) {
  const v = state.currentVisit;
  if (!v) return;

  // Sync inputs
  v.accompanied_by = document.getElementById('editor-accompanied')?.value || '';
  v.time_in = document.getElementById('editor-time-in')?.value || '';
  v.time_out = document.getElementById('editor-time-out')?.value || '';
  v.oms_reference = document.getElementById('editor-oms-ref')?.value || '';

  try {
    const res = await api.updateVisit(v.id, {
      accompanied_by: v.accompanied_by,
      time_in: v.time_in,
      time_out: v.time_out,
      status: v.status,
      has_masjid: v.has_masjid === 1,
      is_academic: v.is_academic === 1,
      data: v.data,
      director_signature: v.director_signature,
      director_sign_date: v.director_sign_date,
      manager_signature: v.manager_signature,
      manager_sign_date: v.manager_sign_date,
      oms_reference: v.oms_reference
    });

    showSyncIndicator('Saved to Cloudflare D1 ✓', 2000);
    if (showNotice) {
      alert('Inspection report saved successfully to Cloudflare D1!');
    }
  } catch (err) {
    showSyncIndicator('Error saving', 3000);
    console.error('Save error:', err);
  }
}

async function handleSubmitToOMS() {
  const ref = prompt('Enter OMS Reference ID / Ticket #:', state.currentVisit.oms_reference || 'OMS-2026-');
  if (ref) {
    state.currentVisit.oms_reference = ref;
    state.currentVisit.oms_entry_date = new Date().toISOString().substring(0, 10);
    state.currentVisit.status = 'Submitted OMS';
    document.getElementById('editor-oms-ref').value = ref;
    document.getElementById('editor-status-badge').textContent = 'Submitted OMS';
    await saveCurrentVisit(true);
  }
}

// -------------------------------------------------------------
// Share Options (Inside Admin)
// -------------------------------------------------------------
export async function openShareModal(visitId = null) {
  const id = visitId || state.currentVisit?.id;
  if (!id) return;

  el.shareModal.dataset.visitId = id;
  el.shareModal.classList.add('open');

  const urlInput = document.getElementById('share-url-input');
  urlInput.value = '';

  await loadActiveShares(id);
}
window.openShareModal = openShareModal;
window.openShareFromList = (id) => openShareModal(id);

async function loadActiveShares(visitId) {
  const container = document.getElementById('active-shares-list');
  if (!container) return;

  try {
    const res = await api.getShares(visitId);
    const shares = res.shares || [];

    if (shares.length === 0) {
      container.innerHTML = '<p class="text-muted" style="font-size:0.8rem;">No active share links. Click "Generate Link" below.</p>';
      return;
    }

    container.innerHTML = shares.map(s => {
      const fullUrl = `${window.location.origin}/shared.html?token=${s.token}`;
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 0.5rem; background: var(--bg-subtle); border-radius: var(--radius); margin-bottom: 0.5rem; font-size:0.8rem;">
          <div>
            <strong>${escapeHtml(s.label || 'Share Link')}</strong>
            <div style="font-size:0.7rem; color:var(--text-muted);">Expires: ${s.expires_at ? s.expires_at.substring(0,10) : 'Never'}</div>
          </div>
          <div style="display:flex; gap:0.35rem;">
            <button class="btn btn-sm btn-secondary" onclick="navigator.clipboard.writeText('${fullUrl}'); alert('Copied!');">Copy</button>
            <button class="btn btn-sm btn-secondary" onclick="window.open('${fullUrl}', '_blank')">Preview</button>
            <button class="btn btn-sm btn-danger" onclick="window.revokeShareLink('${s.token}')">Revoke</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Failed to load shares:', err);
  }
}

async function handleGenerateShareLink() {
  const visitId = el.shareModal.dataset.visitId;
  const label = document.getElementById('share-label').value || 'Executive Board Link';
  const days = parseInt(document.getElementById('share-expiry-days').value, 10);

  try {
    const res = await api.createShare(visitId, { label, daysValid: days });
    const fullUrl = `${window.location.origin}${res.shareUrl}`;
    document.getElementById('share-url-input').value = fullUrl;
    await loadActiveShares(visitId);
  } catch (err) {
    alert('Failed to generate share link: ' + err.message);
  }
}

window.revokeShareLink = async (token) => {
  if (confirm('Revoke this share link? It will immediately stop working.')) {
    await api.revokeShare(token);
    const visitId = el.shareModal.dataset.visitId;
    await loadActiveShares(visitId);
  }
};

function copyWhatsAppSummary() {
  const v = state.currentVisit;
  const shareUrl = document.getElementById('share-url-input').value || window.location.href;
  const text = `*DIRECTOR'S VISIT REPORT — NURULQURAN PAKISTAN*
🏛 *Branch:* ${v ? v.branch : 'Branch'}
📅 *Date:* ${v ? v.visit_date : ''}
📊 *Score:* ${v ? v.score_percent.toFixed(1) + '%' : ''} (${v ? v.rating : ''})
🔗 *Review Report:* ${shareUrl}

_Confidential Inspection Report for OMS filing._`;

  navigator.clipboard.writeText(text);
  alert('WhatsApp summary copied to clipboard! Paste directly into WhatsApp.');
}

// -------------------------------------------------------------
// Part Q: Annual Rotation Schedule Matrix
// -------------------------------------------------------------
async function loadRotationSchedule() {
  const yearSelect = document.getElementById('schedule-year')?.value || 2026;
  try {
    const res = await api.getSchedule(yearSelect);
    const schedule = res.schedule || [];
    state.scheduleData = schedule;

    const branches = BRANCH_LIST.concat(['Surprise visit (any branch)']);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const thead = document.getElementById('schedule-matrix-thead');
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Branch / Target</th>
          ${months.map(m => `<th>${m}</th>`).join('')}
          <th>Total</th>
        </tr>
      `;
    }

    const tbody = document.getElementById('schedule-matrix-tbody');
    if (tbody) {
      let totalCompleted = 0;
      let totalPlanned = 0;

      tbody.innerHTML = branches.map(branch => {
        let branchCompleted = 0;
        let branchPlanned = 0;

        const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(monthNum => {
          const item = schedule.find(s => s.branch === branch && s.month === monthNum);
          if (!item) {
            return `<td><span style="color:#cbd5e1;">-</span></td>`;
          }

          if (item.status === 'completed') {
            branchCompleted++;
            totalCompleted++;
            return `<td><span class="schedule-cell completed" onclick="window.editScheduleCell('${item.id}')" title="Completed: ${item.score_percent ? item.score_percent + '%' : ''}">✓</span></td>`;
          } else if (item.status === 'planned') {
            branchPlanned++;
            totalPlanned++;
            return `<td><span class="schedule-cell planned" onclick="window.editScheduleCell('${item.id}')" title="Planned visit">🗓</span></td>`;
          } else {
            return `<td><span class="schedule-cell skipped" onclick="window.editScheduleCell('${item.id}')" title="Skipped">✕</span></td>`;
          }
        }).join('');

        return `
          <tr>
            <td><strong>${escapeHtml(branch)}</strong></td>
            ${cells}
            <td><strong>${branchCompleted}</strong> / ${branchPlanned + branchCompleted}</td>
          </tr>
        `;
      }).join('');

      document.getElementById('schedule-summary-tracker').textContent = `${totalCompleted} Completed / ${totalPlanned + totalCompleted} Scheduled (Minimum: 24 documented visits per year)`;
    }
  } catch (err) {
    console.error('Failed to load schedule:', err);
  }
}

window.editScheduleCell = (id) => {
  const item = state.scheduleData.find(s => s.id === id);
  if (!item) return;

  const nextStatus = item.status === 'planned' ? 'completed' : (item.status === 'completed' ? 'skipped' : 'planned');
  api.updateScheduleItem({
    year: item.year,
    branch: item.branch,
    month: item.month,
    status: nextStatus
  }).then(() => loadRotationSchedule());
};

// -------------------------------------------------------------
// User Management View (Director Only)
// -------------------------------------------------------------
async function loadUsersList() {
  if (state.user?.role !== 'director') return;
  try {
    const res = await api.getUsers();
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    tbody.innerHTML = (res.users || []).map(u => `
      <tr>
        <td><strong>${escapeHtml(u.name)}</strong></td>
        <td><code>${escapeHtml(u.username)}</code></td>
        <td><span class="role-tag">${u.role}</span></td>
        <td>${escapeHtml(u.branch || 'All Branches')}</td>
        <td>${u.created_at ? u.created_at.substring(0, 10) : ''}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="window.resetUserPassword('${u.id}')">Reset Password</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load users:', err);
  }
}

window.resetUserPassword = async (id) => {
  const newPass = prompt('Enter new password (at least 6 characters):');
  if (newPass && newPass.length >= 6) {
    try {
      await api.request(`/api/users/${id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword: newPass })
      });
      alert('Password updated successfully!');
    } catch (err) {
      alert('Error updating password: ' + err.message);
    }
  }
};

document.getElementById('form-new-user')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('new-user-name').value;
  const username = document.getElementById('new-user-username').value;
  const role = document.getElementById('new-user-role').value;
  const password = document.getElementById('new-user-pass').value;
  const branch = document.getElementById('new-user-branch').value;

  try {
    await api.createUser({ name, username, role, password, branch });
    alert('User created successfully!');
    e.target.reset();
    loadUsersList();
  } catch (err) {
    alert('Error creating user: ' + err.message);
  }
});

// -------------------------------------------------------------
// Helpers & Utilities
// -------------------------------------------------------------
async function loadInitialData() {
  await Promise.all([
    loadDashboardData(),
    loadVisitsList(),
    loadRotationSchedule()
  ]);
}

function showSyncIndicator(msg, duration = null) {
  if (!el.syncIndicator) return;
  el.syncIndicator.textContent = msg;
  el.syncIndicator.style.display = 'flex';
  if (duration) {
    setTimeout(hideSyncIndicator, duration);
  }
}

function hideSyncIndicator() {
  if (el.syncIndicator) el.syncIndicator.style.display = 'none';
}

function getRatingBadgeClass(percent) {
  if (percent >= 90) return 'badge-excellent';
  if (percent >= 75) return 'badge-good';
  if (percent >= 60) return 'badge-satisfactory';
  if (percent >= 40) return 'badge-weak';
  return 'badge-critical';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.deleteVisitRecord = async (id) => {
  if (confirm('Are you sure you want to delete this inspection record? This action cannot be undone.')) {
    try {
      await api.deleteVisit(id);
      await loadVisitsList();
      await loadDashboardData();
    } catch (err) {
      alert('Error deleting visit: ' + err.message);
    }
  }
};
