// ============================================================
// NOVA TECH — AI-Powered Branding Assistant
// Main Application Controller
// ============================================================

'use strict';

/* ── State ────────────────────────────────────────────────── */
const State = {
  page: 'dashboard',
  apiKey: localStorage.getItem('nt_api_key') || '',
  apiMode: 'demo', // 'demo' | 'live'
  lastBrand: null,
  searchQuery: '',
  filterCategory: 'All',
  charts: {},
  toastTimer: null
};

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initNavigation();
  updateApiStatus();
  navigateTo('dashboard');
});

/* ── Starfield Background ─────────────────────────────────── */
function initStarfield() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.3 + 0.1,
      dir: Math.random() * 0.3 - 0.15
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.speed * 0.02;
      if (s.a > 1) s.a = 0;
      s.x += s.dir * 0.1;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      const alpha = Math.sin(s.a * Math.PI) * 0.7 + 0.1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ── Navigation ───────────────────────────────────────────── */
function initNavigation() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.page);
    });
  });

  // API settings link
  const apiLink = document.getElementById('api-settings-link');
  if (apiLink) apiLink.addEventListener('click', openApiModal);
}

function navigateTo(page) {
  State.page = page;
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  // Destroy old charts
  Object.values(State.charts).forEach(c => { try { c.destroy(); } catch(e) {} });
  State.charts = {};

  const content = document.getElementById('page-content');
  const topbarTitle = document.getElementById('topbar-title');
  const topbarSub   = document.getElementById('topbar-sub');

  const pageMap = {
    dashboard:    { title: 'Dashboard', sub: 'Your AI branding command centre', fn: renderDashboard },
    brandforge:   { title: 'Brand Forge', sub: 'Generate AI-powered brand identities', fn: renderBrandForge },
    sloganlab:    { title: 'Slogan Lab', sub: 'Explore 1000+ real-world brand slogans', fn: renderSloganLab },
    campaigns:    { title: 'Campaign Intelligence', sub: 'Data-driven marketing analytics', fn: renderCampaigns },
    report:       { title: 'Brand Report', sub: 'Export your complete brand analysis', fn: renderReport }
  };

  const pg = pageMap[page] || pageMap.dashboard;
  if (topbarTitle) topbarTitle.textContent = pg.title;
  if (topbarSub)   topbarSub.textContent   = pg.sub;

  content.innerHTML = '';
  content.style.animation = 'none';
  void content.offsetHeight;
  content.style.animation = '';
  pg.fn(content);
}

/* ── API Modal ────────────────────────────────────────────── */
function openApiModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-title">🔑 Anthropic API Configuration</div>
      <div class="modal-subtitle">Connect your Claude API key to enable live AI generation. Without a key, the app runs in high-quality demo mode.</div>
      <div class="form-group">
        <label class="form-label">Anthropic API Key</label>
        <input type="password" id="api-key-input" class="form-control"
          placeholder="sk-ant-..." value="${State.apiKey}">
      </div>
      <div class="flex gap-3 mt-4">
        <button class="btn btn-primary btn-lg" id="save-api-btn">💾 Save Key</button>
        <button class="btn btn-ghost" id="demo-mode-btn">Use Demo Mode</button>
        <button class="btn btn-ghost" id="close-modal-btn" style="margin-left:auto">✕</button>
      </div>
      <div class="mt-4 text-sm text-muted" style="background:rgba(0,212,255,0.05);border-radius:8px;padding:12px;border:1px solid rgba(0,212,255,0.1);">
        <strong style="color:var(--electric-cyan)">ℹ Demo Mode</strong> generates intelligent, contextual slogans using our built-in AI engine — perfect for demonstrations and presentations.
      </div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.querySelector('#save-api-btn').addEventListener('click', () => {
    const key = overlay.querySelector('#api-key-input').value.trim();
    if (key && key.startsWith('sk-ant')) {
      State.apiKey = key;
      State.apiMode = 'live';
      localStorage.setItem('nt_api_key', key);
      showToast('✅ API key saved! Live AI mode enabled.', 'success');
    } else if (key) {
      showToast('⚠ Invalid key format. Using demo mode.', 'error');
      State.apiMode = 'demo';
    }
    updateApiStatus();
    document.body.removeChild(overlay);
  });

  overlay.querySelector('#demo-mode-btn').addEventListener('click', () => {
    State.apiMode = 'demo';
    State.apiKey = '';
    localStorage.removeItem('nt_api_key');
    updateApiStatus();
    showToast('🎭 Demo mode activated.', 'info');
    document.body.removeChild(overlay);
  });

  overlay.querySelector('#close-modal-btn').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) document.body.removeChild(overlay);
  });
}

function updateApiStatus() {
  const dot   = document.querySelector('.status-dot');
  const label = document.getElementById('api-status-label');
  if (!dot || !label) return;
  if (State.apiKey && State.apiMode === 'live') {
    dot.classList.add('connected');
    label.textContent = 'Claude API Connected';
  } else {
    dot.classList.remove('connected');
    label.textContent = 'Demo Mode Active';
  }
}

/* ── Toast ────────────────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Helpers ──────────────────────────────────────────────── */
function fmt(n) { return Number(n).toLocaleString(); }
function fmtM(n) { return n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(0)+'K' : n; }
function fmtROI(n) { return Number(n).toFixed(1)+'x'; }
function randBetween(a, b) { return Math.random() * (b - a) + a; }

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function template(str, obj) {
  return str.replace(/\{(\w+)\}/g, (_, k) => obj[k] || k);
}

/* ══════════════════════════════════════════════════════════════
   PAGE RENDERERS
══════════════════════════════════════════════════════════════ */

/* ── 1. DASHBOARD ─────────────────────────────────────────── */
function renderDashboard(el) {
  const { totals, roiByChannel, convByType, engagementBySegment, monthlyROI } = NOVA.ANALYTICS;

  el.innerHTML = `
    <!-- Hero Banner -->
    <div class="hero-banner mb-6">
      <h2><span class="grad-text">AI-Powered Branding</span><br>for the Digital Age</h2>
      <p>Harness Claude AI, real campaign data, and a 1,000+ slogan database to craft brand identities that resonate and convert.</p>
      <div class="flex gap-3">
        <button class="btn btn-primary btn-lg" onclick="navigateTo('brandforge')">✨ Launch Brand Forge</button>
        <button class="btn btn-secondary" onclick="navigateTo('campaigns')">📊 View Analytics</button>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="stats-row mb-6">
      <div class="metric-card">
        <div class="metric-label">Total Campaigns Analysed</div>
        <div class="metric-value cyan">${fmtM(totals.totalCampaigns)}</div>
        <div class="metric-change up">↑ 12.4% vs last period</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Average ROI</div>
        <div class="metric-value purple">${fmtROI(totals.avgROI)}</div>
        <div class="metric-change up">↑ 0.3x improvement</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Conversion Rate</div>
        <div class="metric-value gold">${totals.avgConversionRate}%</div>
        <div class="metric-change up">↑ 1.2% this quarter</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Ad Spend</div>
        <div class="metric-value pink">$${fmtM(totals.totalSpend)}</div>
        <div class="metric-change down">↓ 3.1% budget saved</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">📊</span> ROI by Channel</div>
          <span class="badge badge-cyan">Live Data</span>
        </div>
        <div class="chart-container" style="height:240px">
          <canvas id="chart-roi-channel"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">🎯</span> Campaign Type Mix</div>
          <span class="badge badge-purple">2021 Dataset</span>
        </div>
        <div class="chart-container" style="height:240px">
          <canvas id="chart-type-mix"></canvas>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid-2-1 mb-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">📈</span> Monthly ROI Trend</div>
          <span class="badge badge-green">2021 Full Year</span>
        </div>
        <div class="chart-container" style="height:200px">
          <canvas id="chart-monthly-roi"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">👥</span> Top Segments</div>
        </div>
        ${Object.entries(engagementBySegment).map(([seg, val]) => `
          <div class="perf-bar">
            <div class="perf-label">${seg}</div>
            <div class="perf-track"><div class="perf-fill" style="width:${(val/10)*100}%;background:var(--grad-cyan-purple)"></div></div>
            <div class="perf-val">${val}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Quick Insights -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="icon">💡</span> AI-Powered Insights</div>
        <span class="badge badge-gold">Nova Intelligence</span>
      </div>
      <div class="grid-3">
        <div class="insight-row">
          <div class="insight-icon cyan">🚀</div>
          <div>
            <div class="font-semibold text-sm mb-1">Top Performing Channel</div>
            <div class="text-muted text-sm">Google Ads delivers the highest average ROI at <strong style="color:var(--electric-cyan)">5.42x</strong> — ideal for performance-driven brands.</div>
          </div>
        </div>
        <div class="insight-row">
          <div class="insight-icon purple">✨</div>
          <div>
            <div class="font-semibold text-sm mb-1">Best Campaign Type</div>
            <div class="text-muted text-sm">Influencer campaigns achieve the highest conversion rate at <strong style="color:var(--neon-purple)">8.8%</strong> across all target demographics.</div>
          </div>
        </div>
        <div class="insight-row">
          <div class="insight-icon gold">🏆</div>
          <div>
            <div class="font-semibold text-sm mb-1">Highest Engaged Segment</div>
            <div class="text-muted text-sm">Tech Enthusiasts show the highest engagement score of <strong style="color:var(--gold)">5.9/10</strong> — a premium audience worth targeting.</div>
          </div>
        </div>
      </div>
    </div>`;

  // Init charts after render
  setTimeout(() => {
    initChannelROIChart();
    initTypeMixChart();
    initMonthlyROIChart();
  }, 50);
}

/* ── 2. BRAND FORGE ───────────────────────────────────────── */
function renderBrandForge(el) {
  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">✨ Brand <span class="highlight">Forge</span></div>
      <div class="section-subtitle">Enter your business details below and our AI engine will craft a complete brand identity — slogans, personality, color palette, and campaign strategy.</div>
    </div>

    <div class="forge-container">
      <!-- Input Panel -->
      <div class="card" style="position:sticky;top:88px">
        <div class="card-header">
          <div class="card-title"><span class="icon">⚙️</span> Brand Parameters</div>
        </div>

        <div class="form-group">
          <label class="form-label">Company / Brand Name *</label>
          <input type="text" id="f-company" class="form-control" placeholder="e.g. Nova Tech Solutions" maxlength="60">
        </div>

        <div class="form-group">
          <label class="form-label">Industry *</label>
          <select id="f-industry" class="form-control">
            <option value="">Select industry...</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Fashion & Retail">Fashion & Retail</option>
            <option value="Education">Education</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Marketing & Media">Marketing & Media</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Target Audience</label>
          <select id="f-audience" class="form-control">
            <option value="All Ages">All Ages</option>
            <option value="Gen Z (18-24)">Gen Z (18–24)</option>
            <option value="Millennials (25-34)">Millennials (25–34)</option>
            <option value="Gen X (35-44)">Gen X (35–44)</option>
            <option value="Professionals">Working Professionals</option>
            <option value="Families">Families</option>
            <option value="Seniors">Seniors (55+)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Brand Tone</label>
          <select id="f-tone" class="form-control">
            <option value="Professional">Professional</option>
            <option value="Bold">Bold</option>
            <option value="Friendly">Friendly</option>
            <option value="Innovative">Innovative</option>
            <option value="Luxury">Luxury</option>
            <option value="Playful">Playful</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Core Brand Values (optional)</label>
          <input type="text" id="f-values" class="form-control" placeholder="e.g. innovation, trust, quality">
        </div>

        <div class="form-group">
          <label class="form-label">Products / Services (optional)</label>
          <textarea id="f-products" class="form-control" rows="2" placeholder="Briefly describe what you offer..."></textarea>
        </div>

        <button class="btn btn-primary w-full btn-lg" id="generate-btn" onclick="generateBrand()">
          <span>✨ Generate Brand Identity</span>
        </button>
        <div class="text-xs text-muted text-center mt-2" id="mode-label">
          Running in <strong>${State.apiMode === 'live' ? '🟢 Live AI' : '🎭 Demo'}</strong> mode
          — <span style="cursor:pointer;color:var(--electric-cyan)" onclick="openApiModal()">change</span>
        </div>
      </div>

      <!-- Output Panel -->
      <div id="forge-output">
        <div class="forge-output empty">
          <div>
            <div class="empty-icon">✨</div>
            <div class="font-semibold mb-2">Your brand identity will appear here</div>
            <div class="text-sm text-muted">Fill in the form and click Generate to create your AI-powered brand profile.</div>
          </div>
        </div>
      </div>
    </div>`;
}

async function generateBrand() {
  const company  = document.getElementById('f-company').value.trim();
  const industry = document.getElementById('f-industry').value;
  const audience = document.getElementById('f-audience').value;
  const tone     = document.getElementById('f-tone').value;
  const values   = document.getElementById('f-values').value.trim();
  const products = document.getElementById('f-products').value.trim();

  if (!company) { showToast('⚠ Please enter a company name.', 'error'); return; }
  if (!industry) { showToast('⚠ Please select an industry.', 'error'); return; }

  const btn = document.getElementById('generate-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="loading-spinner" style="width:18px;height:18px;margin:0 4px 0 0;display:inline-block;vertical-align:middle"></span> Generating...';

  const output = document.getElementById('forge-output');
  output.innerHTML = `
    <div class="card" style="min-height:200px;display:flex;align-items:center;justify-content:center;">
      <div class="ai-thinking">
        <div class="ai-dots"><span></span><span></span><span></span></div>
        Nova AI is crafting your brand identity...
      </div>
    </div>`;

  // Simulate async AI processing
  await delay(1800);

  let result;
  if (State.apiMode === 'live' && State.apiKey) {
    result = await callClaudeAPI(company, industry, audience, tone, values, products);
  } else {
    result = generateDemoResult(company, industry, audience, tone, values);
  }

  if (!result) {
    result = generateDemoResult(company, industry, audience, tone, values);
  }

  State.lastBrand = { company, industry, audience, tone, values, products, ...result };
  displayBrandResult(output, result, company, industry, tone);

  btn.disabled = false;
  btn.innerHTML = '<span>✨ Regenerate</span>';
  showToast('🎉 Brand identity generated successfully!', 'success');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callClaudeAPI(company, industry, audience, tone, values, products) {
  try {
    const prompt = `You are an expert brand strategist. Generate a complete brand identity for this business:

Company: ${company}
Industry: ${industry}
Target Audience: ${audience}
Brand Tone: ${tone}
Core Values: ${values || 'Not specified'}
Products/Services: ${products || 'Not specified'}

Return ONLY valid JSON in this exact format:
{
  "slogans": [
    {"text": "Slogan here", "rationale": "Why this works"},
    {"text": "Slogan 2", "rationale": "Why this works"},
    {"text": "Slogan 3", "rationale": "Why this works"},
    {"text": "Slogan 4", "rationale": "Why this works"},
    {"text": "Slogan 5", "rationale": "Why this works"}
  ],
  "personality": ["Trait1", "Trait2", "Trait3", "Trait4", "Trait5"],
  "tagline": "One-line brand tagline",
  "positioning": "Two-sentence brand positioning statement",
  "colors": {"primary": "#HEXCODE", "secondary": "#HEXCODE", "accent": "#HEXCODE"},
  "campaignRec": "Recommended marketing channel and strategy in one sentence",
  "voiceKeywords": ["word1", "word2", "word3", "word4", "word5"]
}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': State.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    const text = data.content[0].text;
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
    return json;
  } catch (e) {
    console.warn('API call failed, using demo mode:', e.message);
    return null;
  }
}

function generateDemoResult(company, industry, audience, tone, values) {
  const profile = NOVA.INDUSTRY_PROFILES[industry] || NOVA.INDUSTRY_PROFILES['Other'];
  const toneData = NOVA.TONE_MODIFIERS[tone] || NOVA.TONE_MODIFIERS['Professional'];
  const patterns = NOVA.BRAND_PATTERNS;

  const kw = pick(profile.keywords);
  const val = pick(profile.values);
  const adj = pick(profile.adjectives);
  const act = pick(profile.actions);
  const indName = industry.toLowerCase();

  // Generate 5 slogans using different patterns
  const slogans = [
    {
      text: template(pick(patterns.imperatives), { keyword: kw, value: val, adjective: adj, action: act, industry: indName }),
      rationale: `Imperative form that prompts action. Works well for ${tone.toLowerCase()} brands targeting ${audience}.`
    },
    {
      text: template(pick(patterns.statements), { keyword: kw, value: val, adjective: adj, action: act, industry: indName }),
      rationale: `Declarative positioning. Establishes ${company} as the authority in ${industry.toLowerCase()} with confident, memorable phrasing.`
    },
    {
      text: template(pick(patterns.questions), { keyword: kw, value: val, adjective: adj, action: act, industry: indName }),
      rationale: `Question format creates curiosity and invites the audience to engage. Effective for digital campaigns targeting ${audience}.`
    },
    {
      text: template(pick(patterns.emotional), { keyword: kw, value: val, adjective: adj, action: act, industry: indName }),
      rationale: `Emotional connection driver. Resonates with ${audience} by tapping into deeper motivations and values.`
    },
    {
      text: `${company}: ${val.charAt(0).toUpperCase() + val.slice(1)} ${act}ed.`,
      rationale: `Brand-first format with a punchy action ending. Extremely memorable and works across all media formats.`
    }
  ];

  const colors = profile.colors;
  const personality = profile.personality;

  const voiceKeywords = [
    adj.charAt(0).toUpperCase() + adj.slice(1),
    val.charAt(0).toUpperCase() + val.slice(1),
    tone,
    pick(['Visionary', 'Dynamic', 'Precise', 'Bold', 'Authentic']),
    pick(['Impactful', 'Trustworthy', 'Creative', 'Driven', 'Human'])
  ];

  const campaignRecs = {
    'Technology': 'Lead with Google Ads targeting Tech Enthusiasts, complemented by LinkedIn Influencer campaigns to establish thought leadership.',
    'Healthcare': 'Prioritise Facebook Social Media campaigns for Health & Wellness segments, backed by YouTube educational content.',
    'Finance': 'Deploy Search campaigns on Google Ads for high-intent prospects, supplemented by Email nurture sequences.',
    'Food & Beverage': 'Instagram Influencer campaigns with Foodies drive the highest conversion — pair with Display retargeting.',
    'Fashion & Retail': 'Instagram and TikTok Influencer campaigns dominate for Fashionistas; 45-day campaign windows yield peak ROI.',
    'Education': 'YouTube educational content paired with Facebook Social Media achieves maximum reach for learning audiences.',
    'Real Estate': 'Google Ads Search targeting high-intent buyers delivers 5.42x ROI — combine with Email drip campaigns.',
    'Marketing & Media': 'Multi-channel Influencer strategy across Instagram + YouTube maximises brand amplification.',
    'Other': 'A balanced mix of Google Ads Search for intent and Influencer campaigns for awareness achieves optimal ROI.'
  };

  return {
    slogans,
    personality,
    tagline: `${company} — ${val.charAt(0).toUpperCase() + val.slice(1)} ${adj.charAt(0).toUpperCase() + adj.slice(1)}.`,
    positioning: `${company} is a ${tone.toLowerCase()} ${industry} brand that empowers ${audience} with ${val} solutions. We combine ${adj} innovation with a deep commitment to our customers' success.`,
    colors,
    campaignRec: campaignRecs[industry] || campaignRecs['Other'],
    voiceKeywords
  };
}

function displayBrandResult(output, result, company, industry, tone) {
  const traitColors = ['badge-cyan', 'badge-purple', 'badge-pink', 'badge-green', 'badge-gold'];

  output.innerHTML = `
    <!-- Tagline -->
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title"><span class="icon">🏷️</span> Brand Tagline</div>
        <span class="badge badge-cyan">AI Generated</span>
      </div>
      <div style="font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--electric-cyan);margin-bottom:8px;line-height:1.3">
        "${result.tagline}"
      </div>
      <div class="text-sm text-muted">${result.positioning}</div>
    </div>

    <!-- Slogans -->
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title"><span class="icon">✍️</span> 5 AI-Crafted Slogans</div>
        <button class="btn btn-ghost btn-sm" onclick="copySlogans()">📋 Copy All</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px" id="slogan-results">
        ${result.slogans.map((s, i) => `
          <div class="ai-slogan-card">
            <div class="ai-slogan-number">Option ${i + 1}</div>
            <div class="ai-slogan-text">"${s.text}"</div>
            <div class="ai-slogan-desc">💡 ${s.rationale}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Personality + Colors Row -->
    <div class="grid-2 mb-4">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">🧬</span> Brand Personality</div>
        </div>
        <div class="traits-grid mb-4">
          ${result.personality.map((t, i) => `<span class="badge ${traitColors[i % traitColors.length]}" style="font-size:12px;padding:6px 14px">${t}</span>`).join('')}
        </div>
        <div class="divider"></div>
        <div class="font-semibold text-sm mb-2">Brand Voice Keywords</div>
        <div class="flex flex-wrap gap-2">
          ${result.voiceKeywords.map(w => `<span style="padding:4px 10px;border-radius:6px;background:rgba(255,255,255,0.05);font-size:12px;color:var(--muted-light)">${w}</span>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">🎨</span> Recommended Palette</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${[['Primary', result.colors.primary], ['Secondary', result.colors.secondary], ['Accent', result.colors.accent]].map(([label, hex]) => `
            <div class="flex items-center gap-3">
              <div style="width:48px;height:48px;border-radius:10px;background:${hex};border:2px solid rgba(255,255,255,0.15);flex-shrink:0"></div>
              <div>
                <div class="font-semibold text-sm">${label}</div>
                <div class="text-xs text-muted" style="font-family:monospace">${hex}</div>
              </div>
            </div>`).join('')}
        </div>
        <div class="divider"></div>
        <div class="flex gap-2 mt-2">
          ${['#040B2B','#0A1A4A',result.colors.primary,result.colors.secondary,result.colors.accent,'#FFFFFF'].map(c =>
            `<div class="color-swatch" style="background:${c}" title="${c}"></div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Campaign Recommendation -->
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title"><span class="icon">📡</span> Campaign Recommendation</div>
        <span class="badge badge-green">Data-Driven</span>
      </div>
      <div style="font-size:15px;color:var(--star-white);line-height:1.7">
        ${result.campaignRec}
      </div>
      <div class="divider"></div>
      <div class="grid-3" style="margin-top:4px">
        <div style="text-align:center;padding:12px;background:rgba(0,212,255,0.05);border-radius:10px;border:1px solid rgba(0,212,255,0.1)">
          <div style="font-size:22px;font-weight:700;color:var(--electric-cyan)">5.42x</div>
          <div class="text-xs text-muted">Best Channel ROI</div>
        </div>
        <div style="text-align:center;padding:12px;background:rgba(123,47,255,0.05);border-radius:10px;border:1px solid rgba(123,47,255,0.1)">
          <div style="font-size:22px;font-weight:700;color:var(--neon-purple)">8.8%</div>
          <div class="text-xs text-muted">Peak Conv. Rate</div>
        </div>
        <div style="text-align:center;padding:12px;background:rgba(255,215,0,0.05);border-radius:10px;border:1px solid rgba(255,215,0,0.1)">
          <div style="font-size:22px;font-weight:700;color:var(--gold)">45 days</div>
          <div class="text-xs text-muted">Optimal Duration</div>
        </div>
      </div>
    </div>

    <!-- Similar Brands -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="icon">🔍</span> Similar Brand Slogans (Benchmark)</div>
        <button class="btn btn-ghost btn-sm" onclick="navigateTo('sloganlab')">View All →</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${getSimilarSlogans(industry, 4).map(s => `
          <div class="flex items-center gap-3" style="padding:12px;background:rgba(0,0,0,0.2);border-radius:10px;border:1px solid var(--card-border)">
            <div style="width:36px;height:36px;border-radius:8px;background:rgba(0,212,255,0.1);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🏷</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:700;color:var(--electric-cyan)">${s.company}</div>
              <div style="font-size:14px;color:var(--star-white);font-style:italic">"${s.slogan}"</div>
            </div>
            <span class="badge badge-cyan">${s.category}</span>
          </div>`).join('')}
      </div>
    </div>
  `;
}

function getSimilarSlogans(industry, count = 4) {
  const allSlogans = NOVA.SLOGAN_DATA;
  // Try industry match first
  const industryMap = {
    'Technology': ['Technology', 'Automotive'],
    'Food & Beverage': ['Beverages', 'Fast Food', 'Coffee', 'Snacks', 'Ice Cream'],
    'Healthcare': ['Beauty', 'Baby Products'],
    'Finance': ['Finance'],
    'Fashion & Retail': ['Fashion'],
    'Education': ['Education']
  };
  const cats = industryMap[industry] || [];
  let matches = allSlogans.filter(s => cats.includes(s.category));
  if (matches.length < count) matches = allSlogans;
  // Shuffle and pick
  for (let i = matches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matches[i], matches[j]] = [matches[j], matches[i]];
  }
  return matches.slice(0, count);
}

function copySlogans() {
  const cards = document.querySelectorAll('#slogan-results .ai-slogan-text');
  const text = Array.from(cards).map((c, i) => `${i+1}. ${c.textContent}`).join('\n');
  navigator.clipboard.writeText(text).then(() => showToast('📋 Slogans copied to clipboard!', 'success'));
}

/* ── 3. SLOGAN LAB ────────────────────────────────────────── */
function renderSloganLab(el) {
  const categories = ['All', ...new Set(NOVA.SLOGAN_DATA.map(s => s.category))].sort();

  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">🔍 Slogan <span class="highlight">Lab</span></div>
      <div class="section-subtitle">Browse and search over 1,000 real-world brand slogans. Filter by industry, search by keyword, and find inspiration for your own brand.</div>
    </div>

    <!-- Stats -->
    <div class="grid-4 mb-6">
      <div class="metric-card">
        <div class="metric-label">Total Slogans</div>
        <div class="metric-value cyan">1,000+</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Industries Covered</div>
        <div class="metric-value purple">${categories.length - 1}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Global Brands</div>
        <div class="metric-value gold">500+</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Pattern Types</div>
        <div class="metric-value pink">6</div>
      </div>
    </div>

    <!-- Search + Filter -->
    <div class="card mb-6">
      <div class="flex gap-3 items-center">
        <div class="search-wrapper" style="flex:1">
          <span class="search-icon">🔍</span>
          <input type="text" id="slogan-search" class="form-control" placeholder="Search by company or slogan keyword...">
        </div>
        <select id="category-filter" class="form-control" style="width:200px">
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <button class="btn btn-secondary" onclick="exportSlogans()">📥 Export</button>
      </div>
    </div>

    <!-- Category Filter Chips -->
    <div class="filter-chips" id="cat-chips">
      ${categories.slice(0, 12).map(c => `
        <div class="filter-chip ${c === 'All' ? 'active' : ''}" onclick="filterByChip('${c}')">${c}</div>
      `).join('')}
    </div>

    <!-- Slogan Grid -->
    <div id="slogan-grid-container"></div>

    <!-- Slogan Analysis -->
    <div class="card mt-6">
      <div class="card-header">
        <div class="card-title"><span class="icon">📊</span> Pattern Analysis</div>
      </div>
      <div class="grid-3">
        ${[
          ['Imperative', '28%', 'Just Do It, Taste The Feeling', 'var(--electric-cyan)'],
          ['Statement', '34%', 'The King of Beers, Made Like No Other', 'var(--neon-purple)'],
          ['Question', '12%', 'What\'s the Worst That Could Happen?', 'var(--cosmic-pink)'],
          ['Emotional', '18%', 'Love It or Hate It, Peace, Love & Ice Cream', 'var(--gold)'],
          ['Humour', '5%', 'Betcha Can\'t Eat Just One!', 'var(--success)'],
          ['Abstract', '3%', 'Vorsprung Durch Technik', 'var(--muted-light)']
        ].map(([type, pct, ex, color]) => `
          <div style="padding:16px;background:rgba(0,0,0,0.2);border-radius:10px;border:1px solid var(--card-border)">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
              <div style="font-weight:700;font-size:14px;color:${color}">${type}</div>
              <div style="font-weight:700;font-size:20px;color:var(--star-white)">${pct}</div>
            </div>
            <div class="progress-bar mb-2"><div class="perf-fill" style="width:${pct};background:${color}"></div></div>
            <div style="font-size:11px;color:var(--muted);font-style:italic">"${ex}"</div>
          </div>`).join('')}
      </div>
    </div>`;

  // Render slogan grid
  renderSloganGrid('All', '');

  // Search
  document.getElementById('slogan-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    State.searchQuery = q;
    const cat = document.getElementById('category-filter').value;
    renderSloganGrid(cat, q);
  });

  // Category select
  document.getElementById('category-filter').addEventListener('change', e => {
    const cat = e.target.value;
    State.filterCategory = cat;
    filterByChip(cat);
  });
}

function filterByChip(category) {
  State.filterCategory = category;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.textContent === category);
  });
  const select = document.getElementById('category-filter');
  if (select) select.value = category;
  renderSloganGrid(category, State.searchQuery || '');
}

function renderSloganGrid(category, query) {
  let slogans = NOVA.SLOGAN_DATA;
  if (category !== 'All') slogans = slogans.filter(s => s.category === category);
  if (query) slogans = slogans.filter(s =>
    s.company.toLowerCase().includes(query) || s.slogan.toLowerCase().includes(query));

  const container = document.getElementById('slogan-grid-container');
  if (!container) return;

  if (slogans.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>No slogans match your search.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div style="font-size:12px;color:var(--muted);margin-bottom:12px">Showing ${slogans.length} slogan${slogans.length !== 1 ? 's' : ''}</div>
    <div class="slogan-grid">
      ${slogans.map(s => `
        <div class="slogan-card">
          <div class="slogan-company">${s.company}</div>
          <div class="slogan-text">"${s.slogan}"</div>
          <div class="flex items-center justify-between">
            <span class="badge badge-cyan">${s.category}</span>
            <span class="text-xs text-muted" style="cursor:pointer" onclick="analyseSlogon('${s.company}','${s.slogan.replace(/'/g,"\\'")}')">Analyse →</span>
          </div>
        </div>`).join('')}
    </div>`;
}

function exportSlogans() {
  const data = NOVA.SLOGAN_DATA;
  const csv = 'Company,Slogan,Category\n' + data.map(s => `"${s.company}","${s.slogan}","${s.category}"`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'nova-tech-slogans.csv';
  a.click(); URL.revokeObjectURL(url);
  showToast('📥 Slogans exported as CSV!', 'success');
}

function analyseSlogon(company, slogan) {
  showToast(`🔍 Analysing: "${company}" → Use Brand Forge for full analysis.`, 'info');
  document.getElementById('f-company') && (document.getElementById('f-company').value = company);
}

/* ── 4. CAMPAIGN INTELLIGENCE ─────────────────────────────── */
function renderCampaigns(el) {
  const { roiByChannel, convByType, engagementBySegment, locationDistribution, monthlyROI } = NOVA.ANALYTICS;

  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">📊 Campaign <span class="highlight">Intelligence</span></div>
      <div class="section-subtitle">Deep-dive analytics from 9,921 real marketing campaigns across 5 companies, 6 channels, and 5 customer segments.</div>
    </div>

    <!-- Top KPIs -->
    <div class="grid-4 mb-6">
      <div class="metric-card">
        <div class="metric-label">Best ROI Channel</div>
        <div class="metric-value cyan">Google Ads</div>
        <div class="metric-change up">↑ 5.42x avg return</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Top Campaign Type</div>
        <div class="metric-value purple">Influencer</div>
        <div class="metric-change up">↑ 8.8% conv. rate</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Peak Engagement</div>
        <div class="metric-value gold">Tech Fans</div>
        <div class="metric-change up">↑ 5.9/10 score</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Optimal Duration</div>
        <div class="metric-value pink">45 Days</div>
        <div class="metric-change up">↑ Highest avg ROI</div>
      </div>
    </div>

    <!-- Main Charts -->
    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">📊</span> ROI by Channel</div>
          <span class="badge badge-cyan">Avg × Return</span>
        </div>
        <div class="chart-container" style="height:260px">
          <canvas id="camp-roi-channel"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">🎯</span> Conversion Rate by Campaign Type</div>
          <span class="badge badge-purple">% Conversion</span>
        </div>
        <div class="chart-container" style="height:260px">
          <canvas id="camp-conv-type"></canvas>
        </div>
      </div>
    </div>

    <!-- Second row -->
    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">📈</span> Monthly ROI Trend</div>
          <span class="badge badge-green">2021 Full Year</span>
        </div>
        <div class="chart-container" style="height:240px">
          <canvas id="camp-monthly"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="icon">🗺️</span> Campaign Location Distribution</div>
          <span class="badge badge-gold">US Markets</span>
        </div>
        <div class="chart-container" style="height:240px">
          <canvas id="camp-location"></canvas>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title"><span class="icon">📋</span> Sample Campaign Records</div>
        <button class="btn btn-ghost btn-sm" onclick="exportCampaigns()">📥 Export CSV</button>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Type</th>
              <th>Audience</th>
              <th>Channel</th>
              <th>Duration</th>
              <th>Conv. Rate</th>
              <th>ROI</th>
              <th>Engagement</th>
              <th>Segment</th>
            </tr>
          </thead>
          <tbody>
            ${NOVA.CAMPAIGN_RECORDS.slice(0, 20).map(r => `
              <tr>
                <td><strong>${r.company}</strong></td>
                <td><span class="badge ${getCampaignBadge(r.type)}">${r.type}</span></td>
                <td class="text-muted text-sm">${r.audience}</td>
                <td><span style="color:var(--electric-cyan)">${r.channel}</span></td>
                <td class="text-sm">${r.duration}d</td>
                <td><span class="roi-badge" style="font-size:11px;padding:3px 8px">${(r.convRate*100).toFixed(0)}%</span></td>
                <td><strong style="color:${r.roi >= 6 ? 'var(--success)' : r.roi >= 4 ? 'var(--warning)' : 'var(--danger)'}">${r.roi}x</strong></td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px">
                    <div style="flex:1;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;width:60px">
                      <div style="height:100%;background:var(--grad-cyan-purple);border-radius:2px;width:${r.engagement*10}%"></div>
                    </div>
                    <span class="text-xs">${r.engagement}</span>
                  </div>
                </td>
                <td><span class="text-xs text-muted">${r.segment}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Actionable Recommendations -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="icon">🧠</span> AI-Powered Recommendations</div>
        <span class="badge badge-gold">Nova Intelligence</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        ${[
          ['🚀', 'Maximise Google Ads Investment', 'Google Ads delivers 5.42x ROI — the highest of all channels. Allocate at least 35% of your digital budget here, particularly for Search campaigns targeting high-intent audiences.', 'cyan'],
          ['🎯', 'Leverage Influencer Campaigns', 'Influencer campaigns achieve 8.8% conversion rates — 22% above the dataset average. Prioritise micro-influencers for authentic engagement with Tech Enthusiast and Health & Wellness segments.', 'purple'],
          ['⏱️', 'Optimise Campaign Duration', '45-day campaigns consistently outperform both shorter (15-day) and longer (60-day) runs. Use this as your default window for new launches.', 'green'],
          ['📍', 'Target High-Value Markets', 'New York and Los Angeles combined represent 43% of all campaigns. Focus budget on these markets for maximum reach; Houston shows emerging growth potential.', 'gold']
        ].map(([icon, title, desc, color]) => `
          <div class="insight-row">
            <div class="insight-icon ${color}">${icon}</div>
            <div>
              <div class="font-semibold mb-1">${title}</div>
              <div class="text-sm text-muted">${desc}</div>
            </div>
          </div>`).join('<div class="divider" style="margin:8px 0"></div>')}
      </div>
    </div>`;

  setTimeout(() => {
    initCampROIChart();
    initCampConvChart();
    initCampMonthlyChart();
    initCampLocationChart();
  }, 50);
}

function getCampaignBadge(type) {
  const map = {
    'Email': 'badge-cyan', 'Display': 'badge-purple', 'Influencer': 'badge-pink',
    'Social Media': 'badge-green', 'Search': 'badge-gold'
  };
  return map[type] || 'badge-cyan';
}

function exportCampaigns() {
  const rows = NOVA.CAMPAIGN_RECORDS;
  const csv = 'ID,Company,Type,Audience,Duration,Channel,ConvRate,Cost,ROI,Location,Clicks,Impressions,Engagement,Segment\n'
    + rows.map(r => `${r.id},"${r.company}","${r.type}","${r.audience}",${r.duration},"${r.channel}",${r.convRate},${r.cost},${r.roi},"${r.location}",${r.clicks},${r.impressions},${r.engagement},"${r.segment}"`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'nova-tech-campaigns.csv';
  a.click(); URL.revokeObjectURL(url);
  showToast('📥 Campaign data exported!', 'success');
}

/* ── 5. BRAND REPORT ──────────────────────────────────────── */
function renderReport(el) {
  const brand = State.lastBrand;

  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">📄 Brand <span class="highlight">Report</span></div>
      <div class="section-subtitle">Generate and export a comprehensive brand analysis document. ${brand ? 'Your brand profile from Brand Forge is loaded below.' : 'Create a brand in Brand Forge first to populate this report.'}</div>
    </div>

    ${!brand ? `
      <div class="card">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="font-semibold mb-3">No Brand Profile Yet</div>
          <div class="text-sm text-muted mb-4">Use Brand Forge to generate your brand identity first.</div>
          <button class="btn btn-primary" onclick="navigateTo('brandforge')">✨ Go to Brand Forge</button>
        </div>
      </div>` : `

      <!-- Report Header -->
      <div class="hero-banner mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:8px">Brand Analysis Report</div>
            <h2 style="font-size:28px;margin-bottom:6px"><span class="grad-text">${brand.company}</span></h2>
            <div class="text-muted">${brand.industry} · ${brand.tone} Tone · ${brand.audience}</div>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="printReport()">🖨️ Print / Save PDF</button>
            <button class="btn btn-secondary" onclick="copyReport()">📋 Copy Text</button>
          </div>
        </div>
      </div>

      <!-- Report Sections -->
      <div class="card mb-4">
        <div class="report-section">
          <div class="report-section-title">01 / Brand Identity</div>
          <div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--electric-cyan);margin-bottom:8px">"${brand.tagline}"</div>
          <div class="text-sm text-muted">${brand.positioning}</div>
        </div>
        <div class="report-section" style="border-color:var(--neon-purple)">
          <div class="report-section-title" style="color:var(--neon-purple)">02 / Brand Slogans</div>
          ${brand.slogans.map((s, i) => `
            <div style="margin-bottom:12px">
              <div style="font-size:13px;color:var(--neon-purple);font-weight:600">Option ${i+1}</div>
              <div style="font-size:16px;font-weight:600;color:var(--star-white);font-style:italic">"${s.text}"</div>
              <div style="font-size:12px;color:var(--muted)">${s.rationale}</div>
            </div>`).join('')}
        </div>
        <div class="report-section" style="border-color:var(--cosmic-pink)">
          <div class="report-section-title" style="color:var(--cosmic-pink)">03 / Brand Personality</div>
          <div class="traits-grid mb-3">
            ${brand.personality.map(t => `<span class="badge badge-pink">${t}</span>`).join('')}
          </div>
          <div class="text-sm text-muted">Voice Keywords: ${brand.voiceKeywords.join(', ')}</div>
        </div>
        <div class="report-section" style="border-color:var(--gold)">
          <div class="report-section-title" style="color:var(--gold)">04 / Colour Palette</div>
          <div class="flex gap-3 items-center">
            ${[['Primary', brand.colors.primary], ['Secondary', brand.colors.secondary], ['Accent', brand.colors.accent]].map(([l, c]) =>
              `<div style="text-align:center">
                <div style="width:60px;height:60px;border-radius:12px;background:${c};border:2px solid rgba(255,255,255,0.15);margin-bottom:6px"></div>
                <div style="font-size:11px;font-weight:600;color:var(--muted-light)">${l}</div>
                <div style="font-size:10px;color:var(--muted);font-family:monospace">${c}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="report-section" style="border-color:var(--success)">
          <div class="report-section-title" style="color:var(--success)">05 / Campaign Strategy</div>
          <div class="text-sm" style="color:var(--star-white)">${brand.campaignRec}</div>
          <div class="grid-3 mt-3">
            <div style="padding:12px;background:rgba(0,0,0,0.2);border-radius:8px;text-align:center">
              <div style="font-size:20px;font-weight:700;color:var(--electric-cyan)">5.42x</div>
              <div style="font-size:11px;color:var(--muted)">Target ROI</div>
            </div>
            <div style="padding:12px;background:rgba(0,0,0,0.2);border-radius:8px;text-align:center">
              <div style="font-size:20px;font-weight:700;color:var(--neon-purple)">8.8%</div>
              <div style="font-size:11px;color:var(--muted)">Conv. Rate Goal</div>
            </div>
            <div style="padding:12px;background:rgba(0,0,0,0.2);border-radius:8px;text-align:center">
              <div style="font-size:20px;font-weight:700;color:var(--gold)">45 days</div>
              <div style="font-size:11px;color:var(--muted)">Campaign Window</div>
            </div>
          </div>
        </div>
        <div class="report-section" style="border-color:var(--muted)">
          <div class="report-section-title" style="color:var(--muted-light)">06 / Report Metadata</div>
          <div class="grid-2 text-sm text-muted">
            <div>Generated by: <strong style="color:var(--star-white)">NOVA TECH AI</strong></div>
            <div>Date: <strong style="color:var(--star-white)">${new Date().toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'})}</strong></div>
            <div>Model: <strong style="color:var(--star-white)">${State.apiMode === 'live' ? 'Claude Sonnet (Live)' : 'NOVA Engine (Demo)'}</strong></div>
            <div>Dataset: <strong style="color:var(--star-white)">9,921 Campaign Records</strong></div>
          </div>
        </div>
      </div>
    `}
  `;
}

function printReport() {
  window.print();
}

function copyReport() {
  const b = State.lastBrand;
  if (!b) return;
  const text = `NOVA TECH BRAND REPORT\n${'='.repeat(40)}\n\nCompany: ${b.company}\nIndustry: ${b.industry}\n\nTagline: "${b.tagline}"\n\nSlogans:\n${b.slogans.map((s,i) => `${i+1}. "${s.text}"`).join('\n')}\n\nPersonality: ${b.personality.join(', ')}\n\nCampaign Strategy: ${b.campaignRec}`;
  navigator.clipboard.writeText(text).then(() => showToast('📋 Report copied!', 'success'));
}

/* ══════════════════════════════════════════════════════════════
   CHART FUNCTIONS (Chart.js)
══════════════════════════════════════════════════════════════ */

const CHART_DEFAULTS = {
  plugins: {
    legend: { labels: { color: '#8892B0', font: { family: 'Inter', size: 11 } } }
  },
  scales: {
    x: {
      ticks: { color: '#8892B0', font: { family: 'Inter', size: 11 } },
      grid: { color: 'rgba(255,255,255,0.04)' }
    },
    y: {
      ticks: { color: '#8892B0', font: { family: 'Inter', size: 11 } },
      grid: { color: 'rgba(255,255,255,0.04)' }
    }
  }
};

function mkChart(id, cfg) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  const chart = new Chart(canvas, cfg);
  State.charts[id] = chart;
  return chart;
}

/* Dashboard Charts */
function initChannelROIChart() {
  const { roiByChannel } = NOVA.ANALYTICS;
  mkChart('chart-roi-channel', {
    type: 'bar',
    data: {
      labels: Object.keys(roiByChannel),
      datasets: [{
        data: Object.values(roiByChannel),
        backgroundColor: ['rgba(0,212,255,0.7)','rgba(123,47,255,0.7)','rgba(255,47,212,0.7)','rgba(255,215,0,0.7)','rgba(0,232,143,0.7)','rgba(255,71,87,0.7)'],
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#8892B0' }, grid: { display: false } },
        y: { ticks: { color: '#8892B0', callback: v => v+'x' }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 4 }
      }
    }
  });
}

function initTypeMixChart() {
  const { convByType } = NOVA.ANALYTICS;
  mkChart('chart-type-mix', {
    type: 'doughnut',
    data: {
      labels: Object.keys(convByType),
      datasets: [{
        data: Object.values(convByType),
        backgroundColor: ['rgba(0,212,255,0.7)','rgba(123,47,255,0.7)','rgba(255,47,212,0.7)','rgba(255,215,0,0.7)','rgba(0,232,143,0.7)'],
        borderColor: 'transparent',
        hoverBorderColor: '#040B2B',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { color: '#8892B0', font: { size: 11 }, padding: 12, boxWidth: 14 } } },
      cutout: '65%'
    }
  });
}

function initMonthlyROIChart() {
  const { monthlyROI } = NOVA.ANALYTICS;
  mkChart('chart-monthly-roi', {
    type: 'line',
    data: {
      labels: Object.keys(monthlyROI),
      datasets: [{
        data: Object.values(monthlyROI),
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0,212,255,0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00D4FF',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#8892B0' }, grid: { display: false } },
        y: { ticks: { color: '#8892B0', callback: v => v+'x' }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 4, max: 7 }
      }
    }
  });
}

/* Campaign Charts */
function initCampROIChart() {
  const { roiByChannel } = NOVA.ANALYTICS;
  mkChart('camp-roi-channel', {
    type: 'bar',
    data: {
      labels: Object.keys(roiByChannel),
      datasets: [{
        label: 'Average ROI (x)',
        data: Object.values(roiByChannel),
        backgroundColor: Object.keys(roiByChannel).map((_, i) => [
          'rgba(0,212,255,0.8)', 'rgba(123,47,255,0.8)', 'rgba(255,47,212,0.8)',
          'rgba(255,215,0,0.8)', 'rgba(0,232,143,0.8)', 'rgba(255,71,87,0.8)'
        ][i]),
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#8892B0', callback: v => v+'x' }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 4 },
        y: { ticks: { color: '#B0BBC8' }, grid: { display: false } }
      }
    }
  });
}

function initCampConvChart() {
  const { convByType } = NOVA.ANALYTICS;
  mkChart('camp-conv-type', {
    type: 'bar',
    data: {
      labels: Object.keys(convByType),
      datasets: [{
        label: 'Conversion Rate (%)',
        data: Object.values(convByType),
        backgroundColor: 'rgba(123,47,255,0.7)',
        borderColor: '#7B2FFF',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#8892B0' }, grid: { display: false } },
        y: { ticks: { color: '#8892B0', callback: v => v+'%' }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 6 }
      }
    }
  });
}

function initCampMonthlyChart() {
  const { monthlyROI } = NOVA.ANALYTICS;
  mkChart('camp-monthly', {
    type: 'line',
    data: {
      labels: Object.keys(monthlyROI),
      datasets: [
        {
          label: 'ROI',
          data: Object.values(monthlyROI),
          borderColor: '#00D4FF',
          backgroundColor: 'rgba(0,212,255,0.08)',
          tension: 0.4, fill: true,
          pointBackgroundColor: '#00D4FF', pointRadius: 4
        },
        {
          label: 'Benchmark',
          data: Object.keys(monthlyROI).map(() => 5.21),
          borderColor: 'rgba(255,215,0,0.4)',
          borderDash: [5, 5],
          tension: 0, fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8892B0', font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: '#8892B0' }, grid: { display: false } },
        y: { ticks: { color: '#8892B0', callback: v => v+'x' }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 3.5 }
      }
    }
  });
}

function initCampLocationChart() {
  const { locationDistribution } = NOVA.ANALYTICS;
  mkChart('camp-location', {
    type: 'polarArea',
    data: {
      labels: Object.keys(locationDistribution),
      datasets: [{
        data: Object.values(locationDistribution),
        backgroundColor: [
          'rgba(0,212,255,0.6)', 'rgba(123,47,255,0.6)', 'rgba(255,47,212,0.6)',
          'rgba(255,215,0,0.6)', 'rgba(0,232,143,0.6)'
        ],
        borderColor: 'transparent'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { color: '#8892B0', font: { size: 11 }, padding: 10, boxWidth: 12 } } },
      scales: { r: { ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.05)' } } }
    }
  });
}
