import { api } from './api.js';

export class OperatingChecklistManager {
  constructor() {
    this.currentDate = new Date().toISOString().substring(0, 10);
    this.operatingData = null;
    this.dailyLog = null;
    this.kpis = [];
  }

  async init() {
    await this.loadOperatingData();
    this.setupEventListeners();
    await this.loadDailyLog(this.currentDate);
    await this.loadKPIs();
  }

  setupEventListeners() {
    const dateInput = document.getElementById('op-daily-date');
    if (dateInput) {
      dateInput.value = this.currentDate;
      dateInput.addEventListener('change', (e) => {
        this.currentDate = e.target.value;
        this.loadDailyLog(this.currentDate);
      });
    }

    document.getElementById('btn-op-today')?.addEventListener('click', () => {
      this.currentDate = new Date().toISOString().substring(0, 10);
      if (dateInput) dateInput.value = this.currentDate;
      this.loadDailyLog(this.currentDate);
    });

    document.getElementById('btn-op-yesterday')?.addEventListener('click', () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      this.currentDate = d.toISOString().substring(0, 10);
      if (dateInput) dateInput.value = this.currentDate;
      this.loadDailyLog(this.currentDate);
    });

    document.getElementById('btn-save-daily-log')?.addEventListener('click', () => {
      this.saveDailyLog(false);
    });

    document.getElementById('btn-sign-daily-log')?.addEventListener('click', () => {
      this.saveDailyLog(true);
    });
  }

  async loadOperatingData() {
    try {
      const data = await api.request('/api/operating/data');
      this.operatingData = data;
      this.renderTimeAllocation(data.timeAllocations);
      this.renderWeeklyChecklist(data.weekly);
      this.renderBiweeklyChecklist(data.biweekly);
      this.renderMonthlyChecklist(data.monthly);
      this.renderQuarterlyChecklist(data.quarterly);
      this.renderYearlyCalendar(data.yearly, data.annualOneTime);
      this.renderDelegationRules(data.delegationRules);
      this.renderAccountability(data.accountabilityTerms);
    } catch (err) {
      console.error('Failed to load operating data:', err);
    }
  }

  async loadDailyLog(date) {
    try {
      const res = await api.request(`/api/operating/daily?date=${date}`);
      this.dailyLog = res.log;
      this.renderDailyChecklist();
    } catch (err) {
      console.error('Failed to load daily log:', err);
    }
  }

  renderTimeAllocation(allocations) {
    const container = document.getElementById('op-time-allocation-grid');
    if (!container) return;

    container.innerHTML = allocations.map(a => `
      <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius); border:1px solid var(--border-light);">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.35rem;">
          <strong style="font-size:0.9rem;">${escapeHtml(a.area)}</strong>
          <span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.8rem;">${a.percent}% (${a.hoursPerWeek} hrs/wk)</span>
        </div>
        <div class="score-bar-bg" style="height:6px;">
          <div class="score-bar-fill" style="width:${a.percent * 2.5}%;"></div>
        </div>
      </div>
    `).join('');
  }

  renderDailyChecklist() {
    const data = this.dailyLog?.data;
    if (!data) return;

    this.renderDailyGroup('morning', 'op-daily-morning-tbody', data.morning);
    this.renderDailyGroup('midday', 'op-daily-midday-tbody', data.midday);
    this.renderDailyGroup('afternoon', 'op-daily-afternoon-tbody', data.afternoon);
    this.renderDailyGroup('endOfDay', 'op-daily-end-tbody', data.endOfDay);

    this.updateDailyProgress();
  }

  renderDailyGroup(sectionKey, tbodyId, items) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody || !items) return;

    tbody.innerHTML = items.map((t, idx) => `
      <tr>
        <td style="font-weight:600; width:35px; text-align:center;">${t.id}</td>
        <td>
          <strong>${escapeHtml(t.action)}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
            📄 <strong>Evidence:</strong> ${escapeHtml(t.evidence)}
          </div>
          ${t.escalationTrigger ? `
            <div style="font-size:0.75rem; color:#b91c1c; margin-top:2px;">
              ⚠️ <strong>Trigger:</strong> ${escapeHtml(t.escalationTrigger)}
            </div>
          ` : ''}
        </td>
        <td style="width:70px; text-align:center;">
          <input type="checkbox" ${t.done ? 'checked' : ''} onchange="window.opManager.toggleDailyTask('${sectionKey}', ${idx}, this.checked)">
        </td>
        <td style="width:250px;">
          <input type="text" class="form-control" style="font-size:0.8rem;" placeholder="Evidence / Notes / OMS #" value="${escapeHtml(t.notes || '')}" oninput="window.opManager.updateDailyNotes('${sectionKey}', ${idx}, this.value)">
        </td>
      </tr>
    `).join('');
  }

  toggleDailyTask(sectionKey, index, done) {
    this.dailyLog.data[sectionKey][index].done = done;
    this.updateDailyProgress();
  }

  updateDailyNotes(sectionKey, index, notes) {
    this.dailyLog.data[sectionKey][index].notes = notes;
  }

  updateDailyProgress() {
    let completed = 0;
    let total = 0;
    ['morning', 'midday', 'afternoon', 'endOfDay'].forEach(k => {
      const group = this.dailyLog.data[k] || [];
      total += group.length;
      completed += group.filter(t => t.done).length;
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const badge = document.getElementById('op-daily-progress-badge');
    if (badge) {
      badge.textContent = `${completed} / ${total} (${percent}%) Completed`;
      badge.className = `badge ${percent === 100 ? 'badge-excellent' : (percent >= 70 ? 'badge-good' : 'badge-weak')}`;
    }
  }

  async saveDailyLog(signedOff = false) {
    try {
      const res = await api.request('/api/operating/daily', {
        method: 'POST',
        body: JSON.stringify({
          date: this.currentDate,
          data: this.dailyLog.data,
          signed_off: signedOff
        })
      });

      if (signedOff) {
        alert('Daily Operating Log signed off and certified in OMS record!');
      } else {
        alert('Daily Operating Log saved successfully!');
      }
      await this.loadDailyLog(this.currentDate);
    } catch (err) {
      alert('Error saving daily log: ' + err.message);
    }
  }

  renderWeeklyChecklist(weekly) {
    const tbody = document.getElementById('op-weekly-tbody');
    if (!tbody || !weekly) return;

    tbody.innerHTML = weekly.map(w => `
      <tr>
        <td style="width:110px;"><strong>${escapeHtml(w.day)}</strong></td>
        <td>${escapeHtml(w.action)}</td>
        <td style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(w.evidence)}</td>
      </tr>
    `).join('');
  }

  renderBiweeklyChecklist(biweekly) {
    const tbody = document.getElementById('op-biweekly-tbody');
    if (!tbody || !biweekly) return;

    tbody.innerHTML = biweekly.map(b => `
      <tr>
        <td style="width:35px; text-align:center; font-weight:600;">${b.id}</td>
        <td><strong>${escapeHtml(b.action)}</strong></td>
        <td style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(b.evidence)}</td>
      </tr>
    `).join('');
  }

  renderMonthlyChecklist(monthly) {
    const tbody = document.getElementById('op-monthly-tbody');
    if (!tbody || !monthly) return;

    tbody.innerHTML = monthly.map(m => `
      <tr>
        <td style="width:35px; text-align:center; font-weight:600;">${m.id}</td>
        <td><strong>${escapeHtml(m.action)}</strong></td>
        <td style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(m.evidence)}</td>
        <td style="width:120px;"><span class="badge" style="background:#fee2e2; color:#991b1b;">${escapeHtml(m.deadline || '')}</span></td>
      </tr>
    `).join('');
  }

  renderQuarterlyChecklist(quarterly) {
    const tbody = document.getElementById('op-quarterly-tbody');
    if (!tbody || !quarterly) return;

    tbody.innerHTML = quarterly.map(q => `
      <tr>
        <td style="width:35px; text-align:center; font-weight:600;">${q.id}</td>
        <td><strong>${escapeHtml(q.action)}</strong></td>
        <td style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(q.evidence)}</td>
      </tr>
    `).join('');
  }

  renderYearlyCalendar(yearly, annualDuties) {
    const calTbody = document.getElementById('op-yearly-cal-tbody');
    if (calTbody && yearly) {
      calTbody.innerHTML = yearly.map(y => `
        <tr>
          <td style="width:110px;"><strong>${escapeHtml(y.month)}</strong></td>
          <td>${escapeHtml(y.duties)}</td>
          <td style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(y.evidence)}</td>
        </tr>
      `).join('');
    }

    const dutiesTbody = document.getElementById('op-yearly-duties-tbody');
    if (dutiesTbody && annualDuties) {
      dutiesTbody.innerHTML = annualDuties.map(d => `
        <tr>
          <td style="width:35px; text-align:center; font-weight:600;">${d.id}</td>
          <td><strong>${escapeHtml(d.action)}</strong></td>
          <td style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(d.evidence)}</td>
        </tr>
      `).join('');
    }
  }

  async loadKPIs() {
    try {
      const res = await api.request('/api/operating/kpis?year=2026');
      this.kpis = res.kpis || [];
      this.renderKPIs();
    } catch (err) {
      console.error('Failed to load KPIs:', err);
    }
  }

  renderKPIs() {
    const tbody = document.getElementById('op-kpis-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.kpis.map((k, idx) => `
      <tr>
        <td style="font-weight:600; width:35px; text-align:center;">${k.kpi_num}</td>
        <td><strong>${escapeHtml(k.kpi)}</strong></td>
        <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${escapeHtml(k.target)}</span></td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(k.measured_by)}</td>
        <td style="width:140px;">
          <input type="text" class="form-control" style="font-size:0.8rem;" value="${escapeHtml(k.current_value || '')}" onchange="window.opManager.updateKPIField(${idx}, 'current_value', this.value)">
        </td>
        <td style="width:130px;">
          <select class="form-control" style="font-size:0.8rem;" onchange="window.opManager.updateKPIField(${idx}, 'status', this.value)">
            <option value="on_track" ${k.status === 'on_track' ? 'selected' : ''}>On Track</option>
            <option value="attention" ${k.status === 'attention' ? 'selected' : ''}>Needs Attention</option>
            <option value="critical" ${k.status === 'critical' ? 'selected' : ''}>Critical Risk</option>
            <option value="achieved" ${k.status === 'achieved' ? 'selected' : ''}>Achieved</option>
          </select>
        </td>
        <td>
          <input type="text" class="form-control" style="font-size:0.8rem;" placeholder="Audit note..." value="${escapeHtml(k.notes || '')}" onchange="window.opManager.updateKPIField(${idx}, 'notes', this.value)">
        </td>
      </tr>
    `).join('');
  }

  async updateKPIField(index, field, value) {
    const kpi = this.kpis[index];
    if (!kpi) return;
    kpi[field] = value;

    try {
      await api.request(`/api/operating/kpis/${kpi.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          current_value: kpi.current_value,
          status: kpi.status,
          notes: kpi.notes
        })
      });
    } catch (err) {
      alert('Error updating KPI: ' + err.message);
    }
  }

  renderDelegationRules(rules) {
    const container = document.getElementById('op-delegation-rules');
    if (!container || !rules) return;

    container.innerHTML = rules.map(r => `
      <div style="background:#fee2e2; border-left:4px solid #b91c1c; padding:0.75rem 1rem; border-radius:4px; font-size:0.85rem; color:#991b1b; display:flex; align-items:center; gap:0.75rem;">
        <span style="font-weight:bold; font-size:1.1rem;">⛔ ${r.num}</span>
        <span>${escapeHtml(r.rule)}</span>
      </div>
    `).join('');
  }

  renderAccountability(terms) {
    const list = document.getElementById('op-accountability-list');
    if (!list || !terms) return;

    list.innerHTML = terms.map(t => `
      <li style="margin-bottom:0.5rem; line-height:1.4;">${escapeHtml(t)}</li>
    `).join('');
  }
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
