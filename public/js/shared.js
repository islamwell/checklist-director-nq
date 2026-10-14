import { api } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const loadingSpinner = document.getElementById('loading-spinner');
  const errorContainer = document.getElementById('error-container');
  const reportContainer = document.getElementById('report-container');

  if (!token) {
    loadingSpinner.style.display = 'none';
    errorContainer.style.display = 'block';
    document.getElementById('error-title').textContent = 'No Access Token';
    document.getElementById('error-message').textContent = 'Please check the link provided by the Director.';
    return;
  }

  try {
    const res = await api.getSharedReport(token);
    const v = res.visit;
    const share = res.share;

    loadingSpinner.style.display = 'none';
    reportContainer.style.display = 'block';

    if (share && share.label) {
      document.getElementById('share-label-badge').textContent = share.label;
    }

    // Populate Banner & Meta
    document.getElementById('rep-branch').textContent = v.branch;
    document.getElementById('rep-date').textContent = v.visit_date;
    document.getElementById('rep-type').textContent = v.visit_type;
    document.getElementById('rep-oms').textContent = v.status;
    document.getElementById('rep-score').textContent = v.total_score;
    document.getElementById('rep-max').textContent = v.max_score;
    document.getElementById('rep-percent').textContent = `${v.score_percent.toFixed(1)}%`;

    const ratingBadge = document.getElementById('rep-rating');
    ratingBadge.textContent = v.rating || 'Satisfactory';
    ratingBadge.className = `badge ${getRatingBadgeClass(v.score_percent)}`;

    document.getElementById('rep-accompanied').textContent = v.accompanied_by || 'None recorded';
    document.getElementById('rep-times').textContent = (v.time_in && v.time_out) ? `${v.time_in} – ${v.time_out}` : 'Not recorded';
    document.getElementById('rep-oms-ref').textContent = v.oms_reference || 'Pending OMS Filing';
    document.getElementById('rep-oms-date').textContent = v.oms_entry_date || 'Pending';

    // Populate Scorecard Table
    const sc = v.data?.scorecard;
    const scTbody = document.getElementById('rep-scorecard-tbody');
    if (sc && sc.areas && scTbody) {
      scTbody.innerHTML = sc.areas.map(a => `
        <tr style="${!a.applicable ? 'opacity: 0.45; text-decoration: line-through;' : ''}">
          <td><strong>${escapeHtml(a.name)}</strong></td>
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
          <td>${sc.totalMax}</td>
          <td>${sc.totalScore}</td>
          <td>${sc.overallPercent.toFixed(1)}%</td>
          <td><span class="badge ${getRatingBadgeClass(sc.overallPercent)}">${sc.rating}</span></td>
        </tr>
      `;
    }

    // Populate Strengths
    const strTbody = document.getElementById('rep-strengths-tbody');
    const strengths = (v.data?.partL?.strengths || []).filter(s => s.strength.trim());
    if (strTbody) {
      if (strengths.length === 0) {
        strTbody.innerHTML = '<tr><td colspan="4" class="text-muted" style="text-align:center;">No specific strengths recorded.</td></tr>';
      } else {
        strTbody.innerHTML = strengths.map((s, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${escapeHtml(s.strength)}</strong></td>
            <td>${escapeHtml(s.evidence || '')}</td>
            <td>${escapeHtml(s.replication || '')}</td>
          </tr>
        `).join('');
      }
    }

    // Populate Weaknesses
    const weakTbody = document.getElementById('rep-weaknesses-tbody');
    const weaknesses = (v.data?.partL?.weaknesses || []).filter(w => w.weakness.trim());
    if (weakTbody) {
      if (weaknesses.length === 0) {
        weakTbody.innerHTML = '<tr><td colspan="5" class="text-muted" style="text-align:center;">No specific weaknesses recorded.</td></tr>';
      } else {
        weakTbody.innerHTML = weaknesses.map((w, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${escapeHtml(w.weakness)}</strong></td>
            <td><span class="badge ${w.severity === 'Critical' ? 'badge-critical' : 'badge-weak'}">${w.severity}</span></td>
            <td>${escapeHtml(w.rootCause || '')}</td>
            <td>${escapeHtml(w.immediateAction || '')}</td>
          </tr>
        `).join('');
      }
    }

    // Populate Deficiencies
    const defTbody = document.getElementById('rep-deficiencies-tbody');
    const deficiencies = (v.data?.partL?.deficiencies || []).filter(d => d.deficiency.trim());
    if (defTbody) {
      if (deficiencies.length === 0) {
        defTbody.innerHTML = '<tr><td colspan="6" class="text-muted" style="text-align:center;">No regulatory or legal breaches detected.</td></tr>';
      } else {
        defTbody.innerHTML = deficiencies.map((d, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${escapeHtml(d.deficiency)}</strong></td>
            <td>${escapeHtml(d.risk || '')}</td>
            <td><span class="badge ${d.legalBreach === 'Yes' ? 'badge-critical' : 'badge-good'}">${d.legalBreach}</span></td>
            <td>${escapeHtml(d.actionRequired || '')}</td>
            <td>${escapeHtml(d.deadline || '')}</td>
          </tr>
        `).join('');
      }
    }

    // Populate Photos
    const photosContainer = document.getElementById('rep-photos-gallery');
    const photos = v.data?.photos || [];
    if (photos.length === 0) {
      document.getElementById('rep-photos-card').style.display = 'none';
    } else {
      photosContainer.innerHTML = photos.map(p => `
        <div class="photo-card">
          <img src="${p.dataUrl}" alt="${escapeHtml(p.caption)}" class="photo-preview">
          <div class="photo-meta">
            <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.65rem;">${p.category}</span>
            <div style="font-weight:600; font-size:0.75rem; margin-top:0.25rem;">${escapeHtml(p.caption || '')}</div>
          </div>
        </div>
      `).join('');
    }

    // Populate Post-Visit Actions
    const actTbody = document.getElementById('rep-actions-tbody');
    const actions = v.data?.partN || [];
    if (actTbody) {
      actTbody.innerHTML = actions.map(act => `
        <tr>
          <td>${act.id}</td>
          <td><strong>${escapeHtml(act.action)}</strong></td>
          <td><span class="badge" style="background:#fef3c7; color:#92400e;">${act.deadline}</span></td>
          <td>${escapeHtml(act.owner || '-')}</td>
          <td style="text-align:center;">
            <span class="badge ${act.done ? 'badge-excellent' : 'badge-weak'}">${act.done ? '✓ Done' : 'Pending'}</span>
          </td>
          <td>${escapeHtml(act.notes || '')}</td>
        </tr>
      `).join('');
    }

    // Populate Signatures
    if (v.director_signature) {
      document.getElementById('rep-director-sig-container').innerHTML = `
        <img src="${v.director_signature}" style="max-height:80px; max-width:100%;" alt="Director Signature">
      `;
      document.getElementById('rep-director-sig-date').textContent = `Signed on: ${v.director_sign_date || v.visit_date}`;
    }

    if (v.manager_signature) {
      document.getElementById('rep-manager-sig-container').innerHTML = `
        <img src="${v.manager_signature}" style="max-height:80px; max-width:100%;" alt="Manager Signature">
      `;
      document.getElementById('rep-manager-sig-date').textContent = `Acknowledged on: ${v.manager_sign_date || v.visit_date}`;
    }

  } catch (err) {
    loadingSpinner.style.display = 'none';
    errorContainer.style.display = 'block';
    document.getElementById('error-title').textContent = 'Access Failed';
    document.getElementById('error-message').textContent = err.message || 'Unable to retrieve the shared report.';
  }
});

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
