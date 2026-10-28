import { api } from './api.js';

export class OperatingChecklistManager {
  constructor() {
    this.todayDate = new Date();
    this.weekDate = new Date();
    this.biweekDate = new Date();
    this.monthDate = new Date();
    this.quarterDate = new Date();
    this.yearDate = new Date();

    this.currentDate = getIsoDate(this.todayDate);
    this.currentWeek = getIsoWeek(this.weekDate);
    this.currentBiweek = getBiweek(this.biweekDate);
    this.currentMonth = getIsoMonth(this.monthDate);
    this.currentQuarter = getQuarterStr(this.quarterDate);
    this.currentYear = `${this.yearDate.getFullYear()}`;

    this.dailyLog = null;
    this.weeklyData = [];
    this.biweeklyData = [];
    this.monthlyData = [];
    this.quarterlyData = [];
    this.yearlyData = { calendar: [], annualDuties: [] };
    this.kpis = [];

    this.autosaveTimers = {};
  }

  async init() {
    this.setupEventListeners();
    await Promise.all([
      this.loadOperatingStaticData(),
      this.loadDailyLog(this.currentDate),
      this.loadSection('weekly', this.currentWeek),
      this.loadSection('biweekly', this.currentBiweek),
      this.loadSection('monthly', this.currentMonth),
      this.loadSection('quarterly', this.currentQuarter),
      this.loadSection('yearly', this.currentYear),
      this.loadKPIs()
    ]);
  }

  // -----------------------------------------------------------
  // Event Listeners Setup
  // -----------------------------------------------------------
  setupEventListeners() {
    // 1. Daily Checklist Controls
    const dailyDateInput = document.getElementById('op-daily-date');
    if (dailyDateInput) {
      dailyDateInput.value = this.currentDate;
      dailyDateInput.addEventListener('change', (e) => {
        this.currentDate = e.target.value;
        this.loadDailyLog(this.currentDate);
      });
    }

    document.getElementById('btn-op-today')?.addEventListener('click', () => {
      this.todayDate = new Date();
      this.currentDate = getIsoDate(this.todayDate);
      if (dailyDateInput) dailyDateInput.value = this.currentDate;
      this.loadDailyLog(this.currentDate);
    });

    document.getElementById('btn-op-yesterday')?.addEventListener('click', () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      this.todayDate = d;
      this.currentDate = getIsoDate(d);
      if (dailyDateInput) dailyDateInput.value = this.currentDate;
      this.loadDailyLog(this.currentDate);
    });

    document.getElementById('btn-save-daily-log')?.addEventListener('click', () => {
      this.saveSection('daily', true);
    });

    document.getElementById('btn-sign-daily-log')?.addEventListener('click', () => {
      this.signOffDay();
    });

    // 2. Weekly Checklist Controls
    document.getElementById('btn-op-prev-week')?.addEventListener('click', () => {
      this.weekDate.setDate(this.weekDate.getDate() - 7);
      this.currentWeek = getIsoWeek(this.weekDate);
      this.updatePeriodLabel('op-weekly-label', this.currentWeek);
      this.loadSection('weekly', this.currentWeek);
    });

    document.getElementById('btn-op-next-week')?.addEventListener('click', () => {
      this.weekDate.setDate(this.weekDate.getDate() + 7);
      this.currentWeek = getIsoWeek(this.weekDate);
      this.updatePeriodLabel('op-weekly-label', this.currentWeek);
      this.loadSection('weekly', this.currentWeek);
    });

    document.getElementById('btn-op-this-week')?.addEventListener('click', () => {
      this.weekDate = new Date();
      this.currentWeek = getIsoWeek(this.weekDate);
      this.updatePeriodLabel('op-weekly-label', this.currentWeek);
      this.loadSection('weekly', this.currentWeek);
    });

    document.getElementById('btn-save-weekly')?.addEventListener('click', () => {
      this.saveSection('weekly', true);
    });

    // 3. Biweekly Checklist Controls
    document.getElementById('btn-op-prev-biweek')?.addEventListener('click', () => {
      this.biweekDate.setDate(this.biweekDate.getDate() - 14);
      this.currentBiweek = getBiweek(this.biweekDate);
      this.updatePeriodLabel('op-biweekly-label', this.currentBiweek);
      this.loadSection('biweekly', this.currentBiweek);
    });

    document.getElementById('btn-op-next-biweek')?.addEventListener('click', () => {
      this.biweekDate.setDate(this.biweekDate.getDate() + 14);
      this.currentBiweek = getBiweek(this.biweekDate);
      this.updatePeriodLabel('op-biweekly-label', this.currentBiweek);
      this.loadSection('biweekly', this.currentBiweek);
    });

    document.getElementById('btn-op-this-biweek')?.addEventListener('click', () => {
      this.biweekDate = new Date();
      this.currentBiweek = getBiweek(this.biweekDate);
      this.updatePeriodLabel('op-biweekly-label', this.currentBiweek);
      this.loadSection('biweekly', this.currentBiweek);
    });

    document.getElementById('btn-save-biweekly')?.addEventListener('click', () => {
      this.saveSection('biweekly', true);
    });

    // 4. Monthly Checklist Controls
    const monthPicker = document.getElementById('op-monthly-picker');
    if (monthPicker) {
      monthPicker.value = this.currentMonth;
      monthPicker.addEventListener('change', (e) => {
        if (!e.target.value) return;
        this.currentMonth = e.target.value;
        const [y, m] = this.currentMonth.split('-');
        this.monthDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
        this.loadSection('monthly', this.currentMonth);
      });
    }

    document.getElementById('btn-op-prev-month')?.addEventListener('click', () => {
      this.monthDate.setMonth(this.monthDate.getMonth() - 1);
      this.currentMonth = getIsoMonth(this.monthDate);
      if (monthPicker) monthPicker.value = this.currentMonth;
      this.loadSection('monthly', this.currentMonth);
    });

    document.getElementById('btn-op-next-month')?.addEventListener('click', () => {
      this.monthDate.setMonth(this.monthDate.getMonth() + 1);
      this.currentMonth = getIsoMonth(this.monthDate);
      if (monthPicker) monthPicker.value = this.currentMonth;
      this.loadSection('monthly', this.currentMonth);
    });

    document.getElementById('btn-op-this-month')?.addEventListener('click', () => {
      this.monthDate = new Date();
      this.currentMonth = getIsoMonth(this.monthDate);
      if (monthPicker) monthPicker.value = this.currentMonth;
      this.loadSection('monthly', this.currentMonth);
    });

    document.getElementById('btn-save-monthly')?.addEventListener('click', () => {
      this.saveSection('monthly', true);
    });

    // 5. Quarterly Checklist Controls
    document.getElementById('btn-op-prev-quarter')?.addEventListener('click', () => {
      this.quarterDate.setMonth(this.quarterDate.getMonth() - 3);
      this.currentQuarter = getQuarterStr(this.quarterDate);
      this.updatePeriodLabel('op-quarterly-label', this.currentQuarter);
      this.loadSection('quarterly', this.currentQuarter);
    });

    document.getElementById('btn-op-next-quarter')?.addEventListener('click', () => {
      this.quarterDate.setMonth(this.quarterDate.getMonth() + 3);
      this.currentQuarter = getQuarterStr(this.quarterDate);
      this.updatePeriodLabel('op-quarterly-label', this.currentQuarter);
      this.loadSection('quarterly', this.currentQuarter);
    });

    document.querySelectorAll('.btn-quarter-select').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const qStr = e.target.getAttribute('data-q'); // Q1, Q2, Q3, Q4
        const qNum = parseInt(qStr.replace('Q', ''), 10);
        this.quarterDate.setMonth((qNum - 1) * 3);
        this.currentQuarter = `${this.quarterDate.getFullYear()}-${qStr}`;
        this.updatePeriodLabel('op-quarterly-label', this.currentQuarter);
        this.loadSection('quarterly', this.currentQuarter);
      });
    });

    document.getElementById('btn-save-quarterly')?.addEventListener('click', () => {
      this.saveSection('quarterly', true);
    });

    // 6. Yearly Checklist Controls
    document.getElementById('btn-op-prev-year')?.addEventListener('click', () => {
      this.yearDate.setFullYear(this.yearDate.getFullYear() - 1);
      this.currentYear = `${this.yearDate.getFullYear()}`;
      this.updatePeriodLabel('op-yearly-label', this.currentYear);
      this.loadSection('yearly', this.currentYear);
    });

    document.getElementById('btn-op-next-year')?.addEventListener('click', () => {
      this.yearDate.setFullYear(this.yearDate.getFullYear() + 1);
      this.currentYear = `${this.yearDate.getFullYear()}`;
      this.updatePeriodLabel('op-yearly-label', this.currentYear);
      this.loadSection('yearly', this.currentYear);
    });

    document.getElementById('btn-op-this-year')?.addEventListener('click', () => {
      this.yearDate = new Date();
      this.currentYear = `${this.yearDate.getFullYear()}`;
      this.updatePeriodLabel('op-yearly-label', this.currentYear);
      this.loadSection('yearly', this.currentYear);
    });

    document.getElementById('btn-save-yearly')?.addEventListener('click', () => {
      this.saveSection('yearly', true);
    });
  }

  updatePeriodLabel(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // -----------------------------------------------------------
  // Static Data (Time Allocations, Rules, Clauses)
  // -----------------------------------------------------------
  async loadOperatingStaticData() {
    try {
      const data = await api.request('/api/operating/data');
      this.renderTimeAllocation(data.timeAllocations);
      this.renderDelegationRules(data.delegationRules);
      this.renderAccountability(data.accountabilityTerms);
    } catch (err) {
      console.error('Failed to load operating static data:', err);
    }
  }

  renderTimeAllocation(allocations) {
    const container = document.getElementById('op-time-allocation-grid');
    if (!container || !allocations) return;

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

  // -----------------------------------------------------------
  // Load Section Generic Handler
  // -----------------------------------------------------------
  async loadSection(type, period) {
    try {
      const res = await api.request(`/api/operating/section?type=${type}&period=${period}`);
      const log = res.log || {};
      const data = log.data;

      if (type === 'weekly') {
        this.weeklyData = Array.isArray(data) ? data : [];
        this.renderWeeklyChecklist();
      } else if (type === 'biweekly') {
        this.biweeklyData = Array.isArray(data) ? data : [];
        this.renderBiweeklyChecklist();
      } else if (type === 'monthly') {
        this.monthlyData = Array.isArray(data) ? data : [];
        this.renderMonthlyChecklist();
      } else if (type === 'quarterly') {
        this.quarterlyData = Array.isArray(data) ? data : [];
        this.renderQuarterlyChecklist();
      } else if (type === 'yearly') {
        this.yearlyData = data || { calendar: [], annualDuties: [] };
        this.renderYearlyChecklist();
      }

      this.updateBadge(type, log.completed_count || 0, log.total_count || 0);
    } catch (err) {
      console.error(`Failed to load ${type} section:`, err);
    }
  }

  // -----------------------------------------------------------
  // 1. Daily Checklist
  // -----------------------------------------------------------
  async loadDailyLog(date) {
    try {
      const res = await api.request(`/api/operating/daily?date=${date}`);
      this.dailyLog = res.log;
      this.renderDailyChecklist();
    } catch (err) {
      console.error('Failed to load daily log:', err);
    }
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
    if (!this.dailyLog?.data?.[sectionKey]?.[index]) return;
    this.dailyLog.data[sectionKey][index].done = done;
    this.updateDailyProgress();
    this.triggerAutosave('daily');
  }

  updateDailyNotes(sectionKey, index, notes) {
    if (!this.dailyLog?.data?.[sectionKey]?.[index]) return;
    this.dailyLog.data[sectionKey][index].notes = notes;
    this.triggerAutosave('daily');
  }

  updateDailyProgress() {
    let completed = 0;
    let total = 0;
    ['morning', 'midday', 'afternoon', 'endOfDay'].forEach(k => {
      const group = this.dailyLog?.data?.[k] || [];
      total += group.length;
      completed += group.filter(t => t.done).length;
    });

    this.updateBadge('daily', completed, total);
  }

  async signOffDay() {
    try {
      showSync('Signing off Daily Operating Log in OMS...');
      await api.request('/api/operating/daily', {
        method: 'POST',
        body: JSON.stringify({
          date: this.currentDate,
          data: this.dailyLog.data,
          signed_off: true
        })
      });
      showSync('Daily Log Signed & Certified in OMS ✓', 3000);
      alert('Daily Operating Log signed off and certified in OMS record!');
      await this.loadDailyLog(this.currentDate);
    } catch (err) {
      alert('Error signing off daily log: ' + err.message);
    }
  }

  // -----------------------------------------------------------
  // 2. Weekly Checklist
  // -----------------------------------------------------------
  renderWeeklyChecklist() {
    const tbody = document.getElementById('op-weekly-tbody');
    if (!tbody) return;

    this.updatePeriodLabel('op-weekly-label', this.currentWeek);

    tbody.innerHTML = this.weeklyData.map((w, idx) => `
      <tr>
        <td style="width:100px;"><strong>${escapeHtml(w.day)}</strong></td>
        <td>
          <div style="font-weight:600; color:var(--text-main); margin-bottom:2px;">${escapeHtml(w.action)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">📄 <strong>Evidence:</strong> ${escapeHtml(w.evidence)}</div>
        </td>
        <td style="width:70px; text-align:center;">
          <input type="checkbox" ${w.done ? 'checked' : ''} onchange="window.opManager.toggleTask('weekly', ${idx}, this.checked)">
        </td>
        <td style="width:250px;">
          <input type="text" class="form-control" style="font-size:0.8rem;" placeholder="Evidence / Notes / OMS #" value="${escapeHtml(w.notes || '')}" oninput="window.opManager.updateTaskNotes('weekly', ${idx}, this.value)">
        </td>
      </tr>
    `).join('');

    this.calculateAndRefreshBadge('weekly', this.weeklyData);
  }

  // -----------------------------------------------------------
  // 3. Biweekly Checklist
  // -----------------------------------------------------------
  renderBiweeklyChecklist() {
    const tbody = document.getElementById('op-biweekly-tbody');
    if (!tbody) return;

    this.updatePeriodLabel('op-biweekly-label', this.currentBiweek);

    tbody.innerHTML = this.biweeklyData.map((b, idx) => `
      <tr>
        <td style="width:35px; text-align:center; font-weight:600;">${b.id}</td>
        <td>
          <div style="font-weight:600; color:var(--text-main); margin-bottom:2px;">${escapeHtml(b.action)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">📄 <strong>Evidence Required:</strong> ${escapeHtml(b.evidence)}</div>
        </td>
        <td style="width:70px; text-align:center;">
          <input type="checkbox" ${b.done ? 'checked' : ''} onchange="window.opManager.toggleTask('biweekly', ${idx}, this.checked)">
        </td>
        <td style="width:250px;">
          <input type="text" class="form-control" style="font-size:0.8rem;" placeholder="Evidence / Notes / OMS #" value="${escapeHtml(b.notes || '')}" oninput="window.opManager.updateTaskNotes('biweekly', ${idx}, this.value)">
        </td>
      </tr>
    `).join('');

    this.calculateAndRefreshBadge('biweekly', this.biweeklyData);
  }

  // -----------------------------------------------------------
  // 4. Monthly Checklist
  // -----------------------------------------------------------
  renderMonthlyChecklist() {
    const tbody = document.getElementById('op-monthly-tbody');
    if (!tbody) return;

    const picker = document.getElementById('op-monthly-picker');
    if (picker) picker.value = this.currentMonth;

    tbody.innerHTML = this.monthlyData.map((m, idx) => `
      <tr>
        <td style="width:35px; text-align:center; font-weight:600;">${m.id}</td>
        <td>
          <div style="font-weight:600; color:var(--text-main); margin-bottom:2px;">${escapeHtml(m.action)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">📄 <strong>Evidence Required:</strong> ${escapeHtml(m.evidence)}</div>
        </td>
        <td style="width:110px;">
          <span class="badge" style="background:#fee2e2; color:#991b1b; font-size:0.75rem;">${escapeHtml(m.deadline || '')}</span>
        </td>
        <td style="width:70px; text-align:center;">
          <input type="checkbox" ${m.done ? 'checked' : ''} onchange="window.opManager.toggleTask('monthly', ${idx}, this.checked)">
        </td>
        <td style="width:250px;">
          <input type="text" class="form-control" style="font-size:0.8rem;" placeholder="Evidence / Notes / OMS #" value="${escapeHtml(m.notes || '')}" oninput="window.opManager.updateTaskNotes('monthly', ${idx}, this.value)">
        </td>
      </tr>
    `).join('');

    this.calculateAndRefreshBadge('monthly', this.monthlyData);
  }

  // -----------------------------------------------------------
  // 5. Quarterly Checklist
  // -----------------------------------------------------------
  renderQuarterlyChecklist() {
    const tbody = document.getElementById('op-quarterly-tbody');
    if (!tbody) return;

    this.updatePeriodLabel('op-quarterly-label', this.currentQuarter);

    tbody.innerHTML = this.quarterlyData.map((q, idx) => `
      <tr>
        <td style="width:35px; text-align:center; font-weight:600;">${q.id}</td>
        <td>
          <div style="font-weight:600; color:var(--text-main); margin-bottom:2px;">${escapeHtml(q.action)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">📄 <strong>Evidence:</strong> ${escapeHtml(q.evidence)}</div>
        </td>
        <td style="width:70px; text-align:center;">
          <input type="checkbox" ${q.done ? 'checked' : ''} onchange="window.opManager.toggleTask('quarterly', ${idx}, this.checked)">
        </td>
        <td style="width:250px;">
          <input type="text" class="form-control" style="font-size:0.8rem;" placeholder="Evidence / Notes / OMS #" value="${escapeHtml(q.notes || '')}" oninput="window.opManager.updateTaskNotes('quarterly', ${idx}, this.value)">
        </td>
      </tr>
    `).join('');

    this.calculateAndRefreshBadge('quarterly', this.quarterlyData);
  }

  // -----------------------------------------------------------
  // 6. Yearly Calendar & Annual Duties
  // -----------------------------------------------------------
  renderYearlyChecklist() {
    this.updatePeriodLabel('op-yearly-label', this.currentYear);

    const calTbody = document.getElementById('op-yearly-cal-tbody');
    if (calTbody && Array.isArray(this.yearlyData?.calendar)) {
      calTbody.innerHTML = this.yearlyData.calendar.map((y, idx) => `
        <tr>
          <td style="width:110px;"><strong>${escapeHtml(y.month)}</strong></td>
          <td>
            <div style="font-weight:600; color:var(--text-main); margin-bottom:2px;">${escapeHtml(y.duties)}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">📄 <strong>Evidence:</strong> ${escapeHtml(y.evidence)}</div>
          </td>
          <td style="width:70px; text-align:center;">
            <input type="checkbox" ${y.done ? 'checked' : ''} onchange="window.opManager.toggleYearlyCalendar(${idx}, this.checked)">
          </td>
          <td style="width:250px;">
            <input type="text" class="form-control" style="font-size:0.8rem;" placeholder="Evidence / Notes / OMS #" value="${escapeHtml(y.notes || '')}" oninput="window.opManager.updateYearlyCalendarNotes(${idx}, this.value)">
          </td>
        </tr>
      `).join('');
    }

    const dutiesTbody = document.getElementById('op-yearly-duties-tbody');
    if (dutiesTbody && Array.isArray(this.yearlyData?.annualDuties)) {
      dutiesTbody.innerHTML = this.yearlyData.annualDuties.map((d, idx) => `
        <tr>
          <td style="width:35px; text-align:center; font-weight:600;">${d.id}</td>
          <td>
            <div style="font-weight:600; color:var(--text-main); margin-bottom:2px;">${escapeHtml(d.action)}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">📄 <strong>Evidence:</strong> ${escapeHtml(d.evidence)}</div>
          </td>
          <td style="width:70px; text-align:center;">
            <input type="checkbox" ${d.done ? 'checked' : ''} onchange="window.opManager.toggleYearlyDuty(${idx}, this.checked)">
          </td>
          <td style="width:250px;">
            <input type="text" class="form-control" style="font-size:0.8rem;" placeholder="Evidence / Notes / OMS #" value="${escapeHtml(d.notes || '')}" oninput="window.opManager.updateYearlyDutyNotes(${idx}, this.value)">
          </td>
        </tr>
      `).join('');
    }

    this.calculateAndRefreshYearlyBadge();
  }

  toggleYearlyCalendar(index, done) {
    if (!this.yearlyData?.calendar?.[index]) return;
    this.yearlyData.calendar[index].done = done;
    this.calculateAndRefreshYearlyBadge();
    this.triggerAutosave('yearly');
  }

  updateYearlyCalendarNotes(index, notes) {
    if (!this.yearlyData?.calendar?.[index]) return;
    this.yearlyData.calendar[index].notes = notes;
    this.triggerAutosave('yearly');
  }

  toggleYearlyDuty(index, done) {
    if (!this.yearlyData?.annualDuties?.[index]) return;
    this.yearlyData.annualDuties[index].done = done;
    this.calculateAndRefreshYearlyBadge();
    this.triggerAutosave('yearly');
  }

  updateYearlyDutyNotes(index, notes) {
    if (!this.yearlyData?.annualDuties?.[index]) return;
    this.yearlyData.annualDuties[index].notes = notes;
    this.triggerAutosave('yearly');
  }

  calculateAndRefreshYearlyBadge() {
    let completed = 0;
    let total = 0;
    if (Array.isArray(this.yearlyData?.calendar)) {
      total += this.yearlyData.calendar.length;
      completed += this.yearlyData.calendar.filter(i => i.done).length;
    }
    if (Array.isArray(this.yearlyData?.annualDuties)) {
      total += this.yearlyData.annualDuties.length;
      completed += this.yearlyData.annualDuties.filter(i => i.done).length;
    }
    this.updateBadge('yearly', completed, total);
  }

  // -----------------------------------------------------------
  // Generic Task Toggling for Array Sections
  // -----------------------------------------------------------
  toggleTask(type, index, done) {
    const list = this.getSectionList(type);
    if (!list || !list[index]) return;
    list[index].done = done;
    this.calculateAndRefreshBadge(type, list);
    this.triggerAutosave(type);
  }

  updateTaskNotes(type, index, notes) {
    const list = this.getSectionList(type);
    if (!list || !list[index]) return;
    list[index].notes = notes;
    this.triggerAutosave(type);
  }

  getSectionList(type) {
    if (type === 'weekly') return this.weeklyData;
    if (type === 'biweekly') return this.biweeklyData;
    if (type === 'monthly') return this.monthlyData;
    if (type === 'quarterly') return this.quarterlyData;
    return null;
  }

  calculateAndRefreshBadge(type, list) {
    if (!Array.isArray(list)) return;
    const total = list.length;
    const completed = list.filter(i => i.done).length;
    this.updateBadge(type, completed, total);
  }

  updateBadge(type, completed, total) {
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const badge = document.getElementById(`op-${type}-progress-badge`);
    if (badge) {
      badge.textContent = `${completed} / ${total} (${percent}%) Completed`;
      badge.className = `badge ${percent === 100 ? 'badge-excellent' : (percent >= 70 ? 'badge-good' : (percent > 0 ? 'badge-satisfactory' : 'badge-weak'))}`;
    }
  }

  // -----------------------------------------------------------
  // Debounced Autosave Engine
  // -----------------------------------------------------------
  triggerAutosave(type) {
    if (this.autosaveTimers[type]) {
      clearTimeout(this.autosaveTimers[type]);
    }
    showSync(`Saving ${type} checklist...`);
    this.autosaveTimers[type] = setTimeout(async () => {
      await this.saveSection(type, false);
    }, 800);
  }

  async saveSection(type, isManual = false) {
    try {
      showSync(`Saving ${type} checklist to OMS...`);
      let period, data;

      if (type === 'daily') {
        period = this.currentDate;
        data = this.dailyLog?.data;
      } else if (type === 'weekly') {
        period = this.currentWeek;
        data = this.weeklyData;
      } else if (type === 'biweekly') {
        period = this.currentBiweek;
        data = this.biweeklyData;
      } else if (type === 'monthly') {
        period = this.currentMonth;
        data = this.monthlyData;
      } else if (type === 'quarterly') {
        period = this.currentQuarter;
        data = this.quarterlyData;
      } else if (type === 'yearly') {
        period = this.currentYear;
        data = this.yearlyData;
      }

      if (!period || !data) return;

      const res = await api.request('/api/operating/section', {
        method: 'POST',
        body: JSON.stringify({
          type,
          period,
          data
        })
      });

      this.updateBadge(type, res.completedCount, res.totalCount);
      showSync(`All ${type} changes saved ✓`, 2000);

      if (isManual) {
        showSync(`Saved ${type} to OMS ✓`, 2500);
      }
    } catch (err) {
      console.error(`Failed to save ${type}:`, err);
      showSync(`Error saving ${type}: ${err.message}`, 3000);
    }
  }

  // -----------------------------------------------------------
  // 7. Director KPIs
  // -----------------------------------------------------------
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
      showSync('Updating KPI in OMS record...');
      await api.request(`/api/operating/kpis/${kpi.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          current_value: kpi.current_value,
          status: kpi.status,
          notes: kpi.notes
        })
      });
      showSync('KPI Updated ✓', 2000);
    } catch (err) {
      alert('Error updating KPI: ' + err.message);
    }
  }
}

// -------------------------------------------------------------
// Date & Period Utility Functions
// -------------------------------------------------------------
function getIsoDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getIsoMonth(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getIsoWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getBiweek(d) {
  const weekStr = getIsoWeek(d);
  const [year, wPart] = weekStr.split('-W');
  const w = parseInt(wPart, 10);
  const bw = Math.max(1, Math.ceil(w / 2));
  return `${year}-BW${String(bw).padStart(2, '0')}`;
}

function getQuarterStr(d) {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-Q${q}`;
}

function showSync(msg, duration = null) {
  const el = document.getElementById('sync-indicator');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'flex';
  if (duration) {
    setTimeout(() => {
      if (el.textContent === msg) {
        el.style.display = 'none';
      }
    }, duration);
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
