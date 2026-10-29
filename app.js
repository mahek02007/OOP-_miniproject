// ===== DATA STORE =====
let patients = [];
let doctors = [];
let appointments = [];
let nextPatientId = 1;
let nextDoctorId = 1;
let nextApptId = 1;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  renderAll();
});

function updateClock() {
  const now = new Date();
  const opts = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  document.getElementById('header-time').textContent = now.toLocaleDateString('en-US', opts);
}

// ===== NAVIGATION =====
function showSection(name) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target
  document.getElementById('section-' + name).classList.add('active');
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');

  // Update header title
  const titles = { dashboard: 'Dashboard', patients: 'Patient Management', doctors: 'Doctor Management', appointments: 'Appointment Management' };
  document.getElementById('header-title').textContent = titles[name] || name;

  return false;
}

// ===== MODAL =====
function openModal(id) {
  if (id === 'add-appt-modal') populateApptDropdowns();
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ===== TOAST =====
let toastTimer = null;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>`;
  toast.innerHTML = icon + msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3500);
}

// ===== ADD PATIENT =====
function addPatient() {
  const name = document.getElementById('p-name').value.trim();
  const age = parseInt(document.getElementById('p-age').value);
  const condition = document.getElementById('p-condition').value.trim();

  if (!name) { showToast('Please enter a patient name.', 'error'); return; }
  if (!age || age < 1 || age > 120) { showToast('Please enter a valid age (1–120).', 'error'); return; }
  if (!condition) { showToast('Please enter the medical condition.', 'error'); return; }

  patients.push({ id: nextPatientId++, name, age, condition });

  // Clear form
  document.getElementById('p-name').value = '';
  document.getElementById('p-age').value = '';
  document.getElementById('p-condition').value = '';

  closeModal('add-patient-modal');
  renderAll();
  showToast(`Patient <strong>${name}</strong> added successfully.`);
}

// ===== ADD DOCTOR =====
function addDoctor() {
  const name = document.getElementById('d-name').value.trim();
  const spec = document.getElementById('d-spec').value.trim();

  if (!name) { showToast('Please enter a doctor name.', 'error'); return; }
  if (!spec) { showToast('Please enter a specialization.', 'error'); return; }

  doctors.push({ id: nextDoctorId++, name, specialization: spec });

  document.getElementById('d-name').value = '';
  document.getElementById('d-spec').value = '';

  closeModal('add-doctor-modal');
  renderAll();
  showToast(`Dr. <strong>${name}</strong> added successfully.`);
}

// ===== BOOK APPOINTMENT =====
function populateApptDropdowns() {
  const pSel = document.getElementById('a-patient');
  const dSel = document.getElementById('a-doctor');

  pSel.innerHTML = '<option value="">-- Select Patient --</option>';
  dSel.innerHTML = '<option value="">-- Select Doctor --</option>';

  patients.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `[${p.id}] ${p.name}`;
    pSel.appendChild(opt);
  });

  doctors.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `[${d.id}] Dr. ${d.name}`;
    dSel.appendChild(opt);
  });
}

function bookAppointment() {
  if (patients.length === 0) { showToast('Please add a patient first.', 'error'); return; }
  if (doctors.length === 0) { showToast('Please add a doctor first.', 'error'); return; }

  const pId = parseInt(document.getElementById('a-patient').value);
  const dId = parseInt(document.getElementById('a-doctor').value);
  const date = document.getElementById('a-date').value;
  const time = document.getElementById('a-time').value;

  if (!pId) { showToast('Please select a patient.', 'error'); return; }
  if (!dId) { showToast('Please select a doctor.', 'error'); return; }
  if (!date) { showToast('Please select a date.', 'error'); return; }
  if (!time) { showToast('Please select a time.', 'error'); return; }

  appointments.push({ id: nextApptId++, patientId: pId, doctorId: dId, date, time });

  document.getElementById('a-patient').value = '';
  document.getElementById('a-doctor').value = '';
  document.getElementById('a-date').value = '';
  document.getElementById('a-time').value = '';

  closeModal('add-appt-modal');
  renderAll();
  showToast('Appointment booked successfully.');
}

// ===== DELETE =====
function deletePatient(id) {
  patients = patients.filter(p => p.id !== id);
  appointments = appointments.filter(a => a.patientId !== id);
  renderAll();
  showToast('Patient record removed.', 'error');
}

function deleteDoctor(id) {
  doctors = doctors.filter(d => d.id !== id);
  appointments = appointments.filter(a => a.doctorId !== id);
  renderAll();
  showToast('Doctor record removed.', 'error');
}

function deleteAppointment(id) {
  appointments = appointments.filter(a => a.id !== id);
  renderAll();
  showToast('Appointment cancelled.', 'error');
}

// ===== VIEW DETAILS =====
function viewPatient(id) {
  const p = patients.find(x => x.id === id);
  if (!p) return;
  document.getElementById('view-patient-body').innerHTML = `
    <div class="detail-card">
      <p><span>Patient ID</span><span>#${p.id}</span></p>
      <p><span>Full Name</span><span>${p.name}</span></p>
      <p><span>Age</span><span>${p.age} years</span></p>
      <p><span>Medical Condition</span><span>${p.condition}</span></p>
    </div>`;
  openModal('view-patient-modal');
}

function viewDoctor(id) {
  const d = doctors.find(x => x.id === id);
  if (!d) return;
  document.getElementById('view-doctor-body').innerHTML = `
    <div class="detail-card">
      <p><span>Doctor ID</span><span>#${d.id}</span></p>
      <p><span>Full Name</span><span>Dr. ${d.name}</span></p>
      <p><span>Specialization</span><span>${d.specialization}</span></p>
    </div>`;
  openModal('view-doctor-modal');
}

// ===== SEARCH =====
function searchPatientById() {
  const id = parseInt(document.getElementById('search-patient-id').value);
  const resultEl = document.getElementById('search-result');

  if (!id) { resultEl.innerHTML = ''; return; }

  const p = patients.find(x => x.id === id);
  if (p) {
    resultEl.innerHTML = `
      <div class="detail-card">
        <p><span>Patient ID</span><span>#${p.id}</span></p>
        <p><span>Name</span><span>${p.name}</span></p>
        <p><span>Age</span><span>${p.age} years</span></p>
        <p><span>Condition</span><span>${p.condition}</span></p>
      </div>`;
  } else {
    resultEl.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem;margin-top:8px;">❌ Patient #${id} not found.</p>`;
  }
}

function handleSearch(query) {
  query = query.toLowerCase().trim();
  if (!query) { renderAll(); return; }

  // Filter tables in place
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.condition.toLowerCase().includes(query) ||
    String(p.id).includes(query)
  );
  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(query) ||
    d.specialization.toLowerCase().includes(query) ||
    String(d.id).includes(query)
  );

  renderPatientsTable(filteredPatients);
  renderDoctorsTable(filteredDoctors);
}

// ===== RENDER ALL =====
function renderAll() {
  updateStats();
  renderPatientsTable(patients);
  renderDoctorsTable(doctors);
  renderAppointmentsTable(appointments);
  renderRecentAppointments();
  updateBadges();
}

function updateStats() {
  animateCount('stat-patients', patients.length);
  animateCount('stat-doctors', doctors.length);
  animateCount('stat-appointments', appointments.length);
}

function animateCount(elId, target) {
  const el = document.getElementById(elId);
  const current = parseInt(el.textContent) || 0;
  if (current === target) return;
  const step = target > current ? 1 : -1;
  const interval = setInterval(() => {
    const val = parseInt(el.textContent) + step;
    el.textContent = val;
    if (val === target) clearInterval(interval);
  }, 30);
}

function updateBadges() {
  document.getElementById('patient-badge').textContent = patients.length;
  document.getElementById('doctor-badge').textContent = doctors.length;
  document.getElementById('appt-badge').textContent = appointments.length;
}

// ===== RENDER PATIENTS TABLE =====
function renderPatientsTable(data) {
  const tbody = document.getElementById('patients-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No patients registered yet.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(p => `
    <tr>
      <td><span style="color:var(--text-muted);font-size:0.8rem">#${p.id}</span></td>
      <td><strong>${p.name}</strong></td>
      <td>${p.age}</td>
      <td><span style="background:rgba(59,130,246,0.1);color:var(--blue-light);padding:3px 10px;border-radius:99px;font-size:0.78rem">${p.condition}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-ghost" onclick="viewPatient(${p.id})">View</button>
          <button class="btn btn-sm btn-danger" onclick="deletePatient(${p.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== RENDER DOCTORS TABLE =====
function renderDoctorsTable(data) {
  const tbody = document.getElementById('doctors-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No doctors registered yet.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(d => `
    <tr>
      <td><span style="color:var(--text-muted);font-size:0.8rem">#${d.id}</span></td>
      <td><strong>Dr. ${d.name}</strong></td>
      <td><span style="background:rgba(20,184,166,0.1);color:var(--teal-light);padding:3px 10px;border-radius:99px;font-size:0.78rem">${d.specialization}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-ghost" onclick="viewDoctor(${d.id})">View</button>
          <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${d.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== RENDER APPOINTMENTS TABLE =====
function renderAppointmentsTable(data) {
  const tbody = document.getElementById('appointments-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No appointments booked yet.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(a => {
    const patient = patients.find(p => p.id === a.patientId);
    const doctor = doctors.find(d => d.id === a.doctorId);
    const patientName = patient ? patient.name : `Patient #${a.patientId}`;
    const doctorName = doctor ? `Dr. ${doctor.name}` : `Doctor #${a.doctorId}`;
    const formattedDate = a.date ? new Date(a.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
    const formattedTime = a.time ? formatTime12h(a.time) : 'N/A';
    return `
      <tr>
        <td><span style="color:var(--text-muted);font-size:0.8rem">#${a.id}</span></td>
        <td><strong>${patientName}</strong></td>
        <td>${doctorName}</td>
        <td style="color:var(--blue-light)">${formattedDate}</td>
        <td style="color:var(--teal-light)">${formattedTime}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${a.id})">Cancel</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ===== RENDER RECENT APPOINTMENTS (DASHBOARD) =====
function renderRecentAppointments() {
  const container = document.getElementById('recent-appointments-list');
  const recent = [...appointments].reverse().slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p>No appointments yet</p>
      </div>`;
    return;
  }

  container.innerHTML = recent.map(a => {
    const patient = patients.find(p => p.id === a.patientId);
    const doctor = doctors.find(d => d.id === a.doctorId);
    const patientName = patient ? patient.name : `Patient #${a.patientId}`;
    const doctorName = doctor ? `Dr. ${doctor.name}` : `Doctor #${a.doctorId}`;
    const formattedDate = a.date ? new Date(a.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '';
    const formattedTime = a.time ? formatTime12h(a.time) : '';
    return `
      <div class="appt-item">
        <div class="appt-info">
          <span class="appt-patient">${patientName}</span>
          <span class="appt-doctor">${doctorName}</span>
        </div>
        <div class="appt-datetime">
          <div class="appt-date">${formattedDate}</div>
          <div class="appt-time">${formattedTime}</div>
        </div>
      </div>`;
  }).join('');
}

// ===== HELPERS =====
function formatTime12h(time24) {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

// Keyboard shortcut: Enter to submit in modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});
