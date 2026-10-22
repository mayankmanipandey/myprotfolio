/**
 * Mayank Mani Pandey — ECE Portfolio Client Logic
 * Full-stack integration with offline static fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  const cfg = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ==========================================
  // 1. STATE & AUDIO SYNTHESIS
  // ==========================================
  let isSoundEnabled = localStorage.getItem('mmp_sfx') === 'true';
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq = 440, type = 'sine', duration = 0.08) {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext policy fallback
    }
  }

  // SFX Toggle Button
  const sfxBtn = $('sfxToggleBtn');
  function updateSfxButtonUI() {
    if (sfxBtn) {
      sfxBtn.style.color = isSoundEnabled ? 'var(--accent)' : 'var(--text-muted)';
      sfxBtn.title = isSoundEnabled ? 'Sound FX: ON (Click to mute)' : 'Sound FX: MUTED (Click to enable)';
    }
  }
  updateSfxButtonUI();
  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('mmp_sfx', isSoundEnabled ? 'true' : 'false');
      updateSfxButtonUI();
      if (isSoundEnabled) playTone(587.33, 'triangle', 0.1);
      showToast(isSoundEnabled ? 'Sound effects enabled' : 'Sound effects muted');
    });
  }

  // ==========================================
  // 2. THEME CONTROLLER
  // ==========================================
  const themeBtn = $('themeToggleBtn');
  const savedTheme = localStorage.getItem('mmp_theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      playTone(isDark ? 523.25 : 392.0, 'sine', 0.06);
      if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('mmp_theme', 'light');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('mmp_theme', 'dark');
      }
    });
  }

  // ==========================================
  // 3. TOAST SYSTEM
  // ==========================================
  const toastContainer = $('toastContainer');
  function showToast(message, isError = false) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.innerHTML = `
      <span>${isError ? '⚠️' : '⚡'}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // ==========================================
  // 4. MOBILE NAVIGATION DRAWER
  // ==========================================
  const mobileMenuBtn = $('mobileMenuBtn');
  const mobileDrawer = $('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      playTone(isOpen ? 659.25 : 440, 'triangle', 0.05);
    });

    $$('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 5. DATA POPULATION FROM CONFIG
  // ==========================================
  if ($('brandInitials')) $('brandInitials').textContent = cfg.initials || 'MMP';
  if ($('brandFullName')) $('brandFullName').textContent = cfg.name || 'Mayank Mani Pandey';
  if ($('heroName')) $('heroName').textContent = cfg.name || 'Mayank Mani Pandey';
  if ($('heroIntro')) $('heroIntro').textContent = cfg.intro || '';
  if ($('statProjects')) $('statProjects').textContent = `${cfg.projects ? cfg.projects.length : 3}+`;
  if ($('statSkills')) $('statSkills').textContent = `${cfg.skills ? cfg.skills.length : 12}+`;

  if ($('aboutBioText')) {
    $('aboutBioText').innerHTML = `<p>${cfg.about || ''}</p>`;
  }

  if ($('contactEmailLink')) {
    $('contactEmailLink').textContent = cfg.email || 'mayankmanipandey2004@gmail.com';
    $('contactEmailLink').href = `mailto:${cfg.email || 'mayankmanipandey2004@gmail.com'}`;
  }

  if ($('footerCopyright')) {
    $('footerCopyright').textContent = `© ${new Date().getFullYear()} ${cfg.name || 'Mayank Mani Pandey'}. Pondicherry University.`;
  }

  // Social Links in About & Contact
  const socialIcons = {
    github: `<svg class="icon-inline" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
    linkedin: `<svg class="icon-inline" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    instagram: `<svg class="icon-inline" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    email: `<svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
  };

  if (cfg.social) {
    const socialsHtml = Object.entries(cfg.social).map(([name, url]) => `
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-circle-btn" title="${name}">
        ${socialIcons[name] || name.toUpperCase()}
      </a>
    `).join('');
    if ($('aboutSocials')) $('aboutSocials').innerHTML = socialsHtml;

    const contactPillsHtml = Object.entries(cfg.social).map(([name, url]) => `
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-pill">
        ${name.toUpperCase()} ↗
      </a>
    `).join('');
    if ($('contactSocialPills')) $('contactSocialPills').innerHTML = contactPillsHtml;
  }

  // Timeline list in About
  if (cfg.timeline && $('timelineList')) {
    $('timelineList').innerHTML = cfg.timeline.map(item => `
      <div class="timeline-node">
        <div class="timeline-dot"></div>
        <div class="timeline-period">${item.period}</div>
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-place">${item.place}</div>
        <p class="timeline-desc">${item.description}</p>
      </div>
    `).join('');
  }

  // ==========================================
  // 6. DYNAMIC TYPING EFFECT
  // ==========================================
  const typingEl = $('typingRole');
  const roles = cfg.typingRoles || [
    "Electronics & Communication Engineering Student",
    "Embedded Systems & IoT Builder",
    "Arduino & Microcontroller Prototyper"
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeTick() {
    if (!typingEl) return;
    const current = roles[roleIdx];
    if (isDeleting) {
      charIdx--;
      typingEl.textContent = current.substring(0, charIdx);
      if (charIdx <= 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeTick, 400);
        return;
      }
      setTimeout(typeTick, 35);
    } else {
      charIdx++;
      typingEl.textContent = current.substring(0, charIdx);
      if (charIdx >= current.length) {
        isDeleting = true;
        setTimeout(typeTick, 2400);
        return;
      }
      setTimeout(typeTick, 65);
    }
  }
  typeTick();

  // ==========================================
  // 7. TERMINAL CODE TABS
  // ==========================================
  const terminalCodeMap = {
    arduino: `// ATmega328P 7-Segment Decimal Driver
#include <avr/io.h>
#include <util/delay.h>

const uint8_t BCD_LUT[10] = {
  0x3F, 0x06, 0x5B, 0x4F, 0x66, 
  0x6D, 0x7D, 0x07, 0x7F, 0x6F
};

int main(void) {
  DDRD = 0xFF; // Set PORTD pins as Segment Outputs
  uint8_t count = 0;
  
  while(1) {
    PORTD = BCD_LUT[count % 10];
    count++;
    _delay_ms(1000);
  }
}`,
    iot: `// Green Garuda IoT Telemetry Packet
#include <WiFi.h>
#include <HTTPClient.h>

struct WasteSensorPacket {
  const char* nodeId = "BIN_PONDY_01";
  float fillDepthCm = 14.8;
  float batteryVolts = 4.12;
  bool isCoverOpen = false;
};

void transmitTelemetry(WasteSensorPacket p) {
  HTTPClient http;
  http.begin("https://api.greengaruda.eco/telemetry");
  http.addHeader("Content-Type", "application/json");
  // Transmit encrypted JSON payload...
}`,
    bio: `{
  "name": "Mayank Mani Pandey",
  "status": "Engineering Undergraduate",
  "degree": "B.Tech in Electronics & Communication",
  "institution": "Pondicherry University",
  "focusAreas": [
    "Microcontrollers & AVR",
    "IoT Device Prototyping",
    "Hardware Circuit Design",
    "Full-Stack Web Control"
  ],
  "location": "Pondicherry, India",
  "openForInternships": true
}`
  };

  const codeContentEl = $('terminalCodeContent');
  if (codeContentEl) codeContentEl.textContent = terminalCodeMap.arduino;

  $$('.terminal-tabs .tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.terminal-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-tab');
      if (codeContentEl && terminalCodeMap[key]) {
        codeContentEl.textContent = terminalCodeMap[key];
        playTone(700, 'sine', 0.04);
      }
    });
  });

  const copyCodeBtn = $('copyCodeBtn');
  if (copyCodeBtn && codeContentEl) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeContentEl.textContent).then(() => {
        playTone(880, 'triangle', 0.1);
        const span = copyCodeBtn.querySelector('span');
        const orig = span.textContent;
        span.textContent = 'Copied!';
        setTimeout(() => span.textContent = orig, 1800);
      });
    });
  }

  // ==========================================
  // 8. SKILLS MATRIX RENDERING & FILTERING
  // ==========================================
  const skillsContainer = $('skillsGridContainer');
  function renderSkills(filter = 'all') {
    if (!skillsContainer || !cfg.skills) return;
    const filtered = filter === 'all' 
      ? cfg.skills 
      : cfg.skills.filter(s => s.category.toLowerCase() === filter.toLowerCase());

    skillsContainer.innerHTML = filtered.map(s => `
      <article class="skill-card reveal visible">
        <div class="skill-top">
          <span class="skill-category-tag">${s.category}</span>
          <span class="skill-level-badge">${s.level}</span>
        </div>
        <h3 class="skill-name">${s.name}</h3>
        <div class="skill-meter-container">
          <div class="skill-meter-labels">
            <span>Proficiency</span>
            <span>${s.percent}%</span>
          </div>
          <div class="skill-meter-bar">
            <div class="skill-meter-fill" style="width: ${s.percent}%"></div>
          </div>
        </div>
      </article>
    `).join('');
  }
  renderSkills();

  $$('#skillFilterTabs .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#skillFilterTabs .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSkills(btn.getAttribute('data-filter'));
      playTone(480, 'sine', 0.04);
    });
  });

  // ==========================================
  // 9. INTERACTIVE ECE VIRTUAL LAB (7-SEGMENT)
  // ==========================================
  // Common-cathode 7-segment bitmasks: GFEDCBA
  // Segment order: a, b, c, d, e, f, g, dp
  const SEGMENT_LUT = [
    { num: 0, bin: '0b00111111', hex: '0x3F', on: ['seg-a', 'seg-b', 'seg-c', 'seg-d', 'seg-e', 'seg-f'] },
    { num: 1, bin: '0b00000110', hex: '0x06', on: ['seg-b', 'seg-c'] },
    { num: 2, bin: '0b01011011', hex: '0x5B', on: ['seg-a', 'seg-b', 'seg-d', 'seg-e', 'seg-g'] },
    { num: 3, bin: '0b01001111', hex: '0x4F', on: ['seg-a', 'seg-b', 'seg-c', 'seg-d', 'seg-g'] },
    { num: 4, bin: '0b01100110', hex: '0x66', on: ['seg-b', 'seg-c', 'seg-f', 'seg-g'] },
    { num: 5, bin: '0b01101101', hex: '0x6D', on: ['seg-a', 'seg-c', 'seg-d', 'seg-f', 'seg-g'] },
    { num: 6, bin: '0b01111101', hex: '0x7D', on: ['seg-a', 'seg-c', 'seg-d', 'seg-e', 'seg-f', 'seg-g'] },
    { num: 7, bin: '0b00000111', hex: '0x07', on: ['seg-a', 'seg-b', 'seg-c'] },
    { num: 8, bin: '0b01111111', hex: '0x7F', on: ['seg-a', 'seg-b', 'seg-c', 'seg-d', 'seg-e', 'seg-f', 'seg-g'] },
    { num: 9, bin: '0b01101111', hex: '0x6F', on: ['seg-a', 'seg-b', 'seg-c', 'seg-d', 'seg-f', 'seg-g'] }
  ];

  let currentDigit = 0;
  let autoCycleTimer = null;

  function update7SegmentDisplay(val) {
    currentDigit = ((val % 10) + 10) % 10;
    const item = SEGMENT_LUT[currentDigit];

    // Reset all segments
    $$('#sevenSegmentDisplay .segment').forEach(el => {
      el.classList.remove('on');
      el.classList.add('off');
    });

    // Turn on segments in LUT
    item.on.forEach(segId => {
      const seg = $(segId);
      if (seg) {
        seg.classList.remove('off');
        seg.classList.add('on');
      }
    });

    if ($('currentDigitValue')) $('currentDigitValue').textContent = currentDigit;
    if ($('binaryBusVal')) $('binaryBusVal').textContent = item.bin;
    if ($('hexBusVal')) $('hexBusVal').textContent = item.hex;

    // Pitch rises with count (musical 8-bit scale)
    const baseFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];
    playTone(baseFreqs[currentDigit], 'square', 0.07);
  }

  // Initialize with 0
  update7SegmentDisplay(0);

  if ($('labBtnInc')) {
    $('labBtnInc').addEventListener('click', () => update7SegmentDisplay(currentDigit + 1));
  }
  if ($('labBtnDec')) {
    $('labBtnDec').addEventListener('click', () => update7SegmentDisplay(currentDigit - 1));
  }
  if ($('labBtnReset')) {
    $('labBtnReset').addEventListener('click', () => update7SegmentDisplay(0));
  }

  // Auto cycle toggle
  const labBtnAuto = $('labBtnAuto');
  const autoBtnText = $('autoBtnText');
  if (labBtnAuto && autoBtnText) {
    labBtnAuto.addEventListener('click', () => {
      if (autoCycleTimer) {
        clearInterval(autoCycleTimer);
        autoCycleTimer = null;
        autoBtnText.textContent = '▶ Auto Cycle';
        labBtnAuto.classList.remove('primary');
      } else {
        autoBtnText.textContent = '⏹ Stop Auto';
        labBtnAuto.classList.add('primary');
        autoCycleTimer = setInterval(() => {
          update7SegmentDisplay(currentDigit + 1);
        }, 900);
      }
    });
  }

  // Live Telemetry Stream
  async function fetchTelemetry() {
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const data = await res.json();
        if ($('telDevice')) $('telDevice').textContent = data.device;
        if ($('telVoltage')) $('telVoltage').textContent = data.voltage;
        if ($('telCurrent')) $('telCurrent').textContent = data.currentMa;
        if ($('telTemp')) $('telTemp').textContent = data.temperatureC;
        if ($('telRssi')) $('telRssi').textContent = data.signalRssi;
        if ($('telI2c')) $('telI2c').textContent = data.i2cBus;
        if ($('telemetryStatusText')) {
          $('telemetryStatusText').textContent = `CONNECTED • ${data.device} • ${data.voltage} • ${data.temperatureC}`;
        }
      } else {
        simulateTelemetry();
      }
    } catch (e) {
      simulateTelemetry();
    }
  }

  function simulateTelemetry() {
    const v = (4.95 + Math.random() * 0.1).toFixed(2);
    const ma = (142 + Math.floor(Math.random() * 15)).toString();
    const t = (26.8 + Math.random() * 1.2).toFixed(1);
    if ($('telVoltage')) $('telVoltage').textContent = `${v} V`;
    if ($('telCurrent')) $('telCurrent').textContent = `${ma} mA`;
    if ($('telTemp')) $('telTemp').textContent = `${t} °C`;
  }

  fetchTelemetry();
  const refreshTelBtn = $('refreshTelemetryBtn');
  if (refreshTelBtn) {
    refreshTelBtn.addEventListener('click', () => {
      playTone(600, 'sine', 0.05);
      fetchTelemetry();
      showToast('Polled hardware bus telemetry.');
    });
  }

  // ==========================================
  // 10. PROJECTS RENDERING & MODAL
  // ==========================================
  const projectsContainer = $('projectsGridContainer');
  const projectModal = $('projectModal');
  const modalContent = $('modalProjectContent');

  function renderProjects(filter = 'all') {
    if (!projectsContainer || !cfg.projects) return;
    const filtered = filter === 'all'
      ? cfg.projects
      : cfg.projects.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));

    projectsContainer.innerHTML = filtered.map((p, i) => `
      <article class="project-card reveal visible" data-id="${p.id}">
        <div class="project-image-box">
          <img src="${p.image}" alt="${p.title}" class="project-img" loading="lazy" />
          <span class="project-type-badge">${p.type}</span>
        </div>
        <div class="project-content">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-description">${p.description}</p>
          <div class="project-tags">
            ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-footer">
            <button class="circuit-breakdown-btn" data-project-idx="${i}">
              <span>Circuit Breakdown</span>
              <span>→</span>
            </button>
            <div class="project-links">
              <a href="${p.githubUrl || '#'}" target="_blank" rel="noopener" class="icon-btn" title="GitHub Source">
                ${socialIcons.github}
              </a>
            </div>
          </div>
        </div>
      </article>
    `).join('');

    // Attach modal open events
    $$('.circuit-breakdown-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-project-idx'), 10);
        openProjectModal(filtered[idx]);
      });
    });
  }
  renderProjects();

  $$('#projectFilterTabs .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#projectFilterTabs .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.getAttribute('data-filter'));
      playTone(520, 'sine', 0.04);
    });
  });

  function openProjectModal(project) {
    if (!projectModal || !modalContent) return;
    playTone(660, 'sine', 0.08);

    modalContent.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="modal-project-img" />
      <span class="modal-type">${project.type}</span>
      <h2 class="modal-title">${project.title}</h2>
      <p class="modal-details">${project.details || project.description}</p>

      ${project.highlights ? `
        <h4 style="margin-bottom: 8px;">Key Engineering Highlights:</h4>
        <ul class="modal-highlights">
          ${project.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      ` : ''}

      ${project.codeSnippet ? `
        <h4 style="margin-bottom: 8px;">Firmware / Circuit Implementation Logic:</h4>
        <div class="modal-code-box">
          <pre><code>${project.codeSnippet}</code></pre>
        </div>
      ` : ''}

      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <a href="${project.githubUrl || '#'}" target="_blank" rel="noopener" class="btn btn-primary">
          ${socialIcons.github}
          <span>View on GitHub</span>
        </a>
        <a href="#contact" class="btn btn-secondary modal-contact-btn">
          <span>Discuss This Project</span>
        </a>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');

    const discussBtn = modalContent.querySelector('.modal-contact-btn');
    if (discussBtn) {
      discussBtn.addEventListener('click', () => {
        closeProjectModal();
      });
    }
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
  }

  const closeProjectBtn = $('closeProjectModalBtn');
  if (closeProjectBtn) closeProjectBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // ==========================================
  // 11. ACHIEVEMENTS RENDERING
  // ==========================================
  const achievementsContainer = $('achievementsGridContainer');
  if (achievementsContainer && cfg.achievements) {
    achievementsContainer.innerHTML = cfg.achievements.map(a => `
      <article class="achievement-card reveal visible">
        <div class="achievement-badge-box">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
        </div>
        <div>
          <div class="achievement-year">${a.year || 'Honor'}</div>
          <h3 class="achievement-title">${a.title}</h3>
          <div class="achievement-org">${a.org || ''}</div>
          <p class="achievement-text">${a.text}</p>
        </div>
      </article>
    `).join('');
  }

  // ==========================================
  // 12. FULL-STACK GUESTBOOK (WITH OFFLINE FALLBACK)
  // ==========================================
  const gbEntriesList = $('guestbookEntriesList');
  const gbForm = $('guestbookForm');
  const gbCharCount = $('gbCharCount');
  const gbMessage = $('gbMessage');
  const gbTotalCount = $('guestbookTotalCount');

  // Initial local guestbook cache fallback
  let localGuestbook = [
    {
      name: "Pondicherry Tech Forum",
      role: "Community Peer",
      badge: "Collaborator",
      message: "Mayank's hardware debugging and Arduino prototyping skills are genuinely impressive. Great teammate on ECE projects!",
      date: new Date().toISOString()
    },
    {
      name: "Hackathon Judging Panel",
      role: "Green Tech Reviewer",
      badge: "Mentor",
      message: "Green Garuda Co. had one of the clearest circular-economy IoT architectures presented at the event.",
      date: new Date().toISOString()
    }
  ];

  async function loadGuestbook() {
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        renderGuestbookEntries(data);
      } else {
        renderGuestbookEntries(localGuestbook);
      }
    } catch (e) {
      renderGuestbookEntries(localGuestbook);
    }
  }

  function renderGuestbookEntries(entries) {
    if (!gbEntriesList) return;
    if (gbTotalCount) gbTotalCount.textContent = entries.length;
    gbEntriesList.innerHTML = entries.map(entry => {
      const formattedDate = new Date(entry.date || Date.now()).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
      });
      return `
        <div class="gb-entry-card">
          <div class="gb-entry-top">
            <div>
              <div class="gb-author">${entry.name}</div>
              <div class="gb-role">${entry.role || 'Visitor'}</div>
            </div>
            <span class="gb-badge">${entry.badge || 'Visitor'}</span>
          </div>
          <p class="gb-message">${entry.message}</p>
          <div class="gb-date">${formattedDate}</div>
        </div>
      `;
    }).join('');
  }

  loadGuestbook();

  if (gbMessage && gbCharCount) {
    gbMessage.addEventListener('input', () => {
      gbCharCount.textContent = gbMessage.value.length;
    });
  }

  if (gbForm) {
    gbForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('gbName').value.trim();
      const role = $('gbRole').value.trim() || 'Visitor';
      const badge = $('gbBadge').value;
      const message = $('gbMessage').value.trim();

      if (!name || !message) {
        showToast('Please fill out all required fields.', true);
        return;
      }

      const payload = { name, role, badge, message };
      try {
        const res = await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const result = await res.json();
          showToast('Guestbook entry posted successfully!');
          playTone(880, 'triangle', 0.12);
          gbForm.reset();
          if (gbCharCount) gbCharCount.textContent = '0';
          loadGuestbook();
        } else {
          fallbackLocalGuestbookPost(payload);
        }
      } catch (err) {
        fallbackLocalGuestbookPost(payload);
      }
    });
  }

  function fallbackLocalGuestbookPost(entry) {
    entry.date = new Date().toISOString();
    localGuestbook.unshift(entry);
    renderGuestbookEntries(localGuestbook);
    showToast('Signed guestbook! (Saved locally in offline mode)');
    playTone(880, 'triangle', 0.12);
    if (gbForm) gbForm.reset();
    if (gbCharCount) gbCharCount.textContent = '0';
  }

  // ==========================================
  // 13. FULL-STACK CONTACT FORM
  // ==========================================
  const contactForm = $('contactForm');
  const contactCharCount = $('contactCharCount');
  const contactMessage = $('contactMessage');
  const contactSubmitBtn = $('contactSubmitBtn');
  const contactSubmitText = $('contactSubmitText');

  if (contactMessage && contactCharCount) {
    contactMessage.addEventListener('input', () => {
      contactCharCount.textContent = contactMessage.value.length;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('contactName').value.trim();
      const email = $('contactEmail').value.trim();
      const subject = $('contactSubject').value.trim();
      const interest = $('contactInterest').value;
      const message = $('contactMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', true);
        return;
      }

      if (contactSubmitText) contactSubmitText.textContent = 'Transmitting Message...';
      if (contactSubmitBtn) contactSubmitBtn.disabled = true;

      const payload = { name, email, subject, interest, message };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          showToast(`Message sent! Mayank has received your note.`);
          playTone(987.77, 'triangle', 0.15);
          contactForm.reset();
          if (contactCharCount) contactCharCount.textContent = '0';
        } else {
          const err = await res.json();
          showToast(err.error || 'Failed to submit form.', true);
        }
      } catch (err) {
        // Offline or GitHub Pages static fallback -> open mailto
        showToast('API unreachable — opening your email client...');
        window.location.href = `mailto:${cfg.email || 'mayankmanipandey2004@gmail.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Mayank,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
      } finally {
        if (contactSubmitText) contactSubmitText.textContent = 'Send Message to Mayank';
        if (contactSubmitBtn) contactSubmitBtn.disabled = false;
      }
    });
  }

  // ==========================================
  // 14. ADMIN INBOX MODAL
  // ==========================================
  const openInboxBtn = $('openInboxModalBtn');
  const inboxModal = $('inboxModal');
  const closeInboxBtn = $('closeInboxModalBtn');
  const inboxList = $('inboxMessagesList');

  async function loadInboxMessages() {
    if (!inboxList) return;
    inboxList.innerHTML = `<p style="color: var(--text-muted); padding: 12px;">Loading messages from backend server...</p>`;
    try {
      const res = await fetch('/api/contact/messages');
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          inboxList.innerHTML = data.messages.map(msg => `
            <div class="inbox-item">
              <div class="inbox-item-top">
                <span class="inbox-sender">${msg.name} &lt;${msg.email}&gt;</span>
                <span class="inbox-time">${new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <div class="inbox-subject">Subject: ${msg.subject} [${msg.interest || 'General'}]</div>
              <p class="inbox-body">${msg.message}</p>
            </div>
          `).join('');
        } else {
          inboxList.innerHTML = `<p style="color: var(--text-muted); padding: 16px;">No messages received yet. Submit one using the contact form!</p>`;
        }
      } else {
        inboxList.innerHTML = `<p style="color: var(--text-muted); padding: 16px;">Server returned status ${res.status}. Messages available when server.js is running.</p>`;
      }
    } catch (e) {
      inboxList.innerHTML = `<p style="color: var(--text-muted); padding: 16px;">Backend server currently offline or in static preview mode. Run <code>npm start</code> to activate full API storage.</p>`;
    }
  }

  if (openInboxBtn && inboxModal) {
    openInboxBtn.addEventListener('click', () => {
      inboxModal.classList.add('open');
      inboxModal.setAttribute('aria-hidden', 'false');
      loadInboxMessages();
      playTone(550, 'sine', 0.05);
    });
  }

  function closeInboxModal() {
    if (!inboxModal) return;
    inboxModal.classList.remove('open');
    inboxModal.setAttribute('aria-hidden', 'true');
  }

  if (closeInboxBtn) closeInboxBtn.addEventListener('click', closeInboxModal);
  if (inboxModal) {
    inboxModal.addEventListener('click', (e) => {
      if (e.target === inboxModal) closeInboxModal();
    });
  }

  // ==========================================
  // 15. VISITOR METRICS & HEALTH PING
  // ==========================================
  async function syncStats() {
    try {
      await fetch('/api/stats/visit', { method: 'POST' });
      const res = await fetch('/api/stats');
      if (res.ok) {
        const stats = await res.json();
        if ($('footerViewsCount')) $('footerViewsCount').textContent = stats.views;
        if ($('footerServerBadge')) $('footerServerBadge').textContent = 'Full-Stack Online';
        if ($('statBackendStatus')) $('statBackendStatus').textContent = '100% OK';
      }
    } catch (e) {
      if ($('footerServerBadge')) $('footerServerBadge').textContent = 'Static Mode';
    }
  }
  syncStats();

  // ==========================================
  // 16. INTERACTIVE CIRCUIT / PARTICLE CANVAS
  // ==========================================
  const canvas = $('circuitCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor(width / 35), 45);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1
      });
    }

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function animateCircuit() {
      ctx.clearRect(0, 0, width, height);

      const isLight = document.body.classList.contains('light-theme');
      const dotColor = isLight ? 'rgba(15, 118, 110, 0.4)' : 'rgba(16, 240, 165, 0.4)';
      const lineColor = isLight ? 'rgba(15, 118, 110, 0.08)' : 'rgba(16, 240, 165, 0.08)';
      const mouseLineColor = isLight ? 'rgba(2, 132, 199, 0.2)' : 'rgba(56, 189, 248, 0.25)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        const mouseDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (mouseDist < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = mouseLineColor;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animateCircuit);
    }
    animateCircuit();
  }

  // ==========================================
  // 17. SCROLL REVEAL OBSERVER
  // ==========================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  $$('.reveal').forEach(el => observer.observe(el));
});
