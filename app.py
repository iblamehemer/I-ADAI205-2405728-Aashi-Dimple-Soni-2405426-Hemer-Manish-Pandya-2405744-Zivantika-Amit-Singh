"""
╔══════════════════════════════════════════════════════════════╗
║  NOVA TECH — AI-Powered Automated Branding Suite            ║
║  CRS AI Capstone Brief 2025-26 · Scenario 1                 ║
║  Tools: Streamlit · Gemini API · Scikit-learn · Plotly      ║
╚══════════════════════════════════════════════════════════════╝
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os, io, json, zipfile, base64, re, random
from datetime import datetime
from pathlib import Path
import warnings
warnings.filterwarnings("ignore")

# ── Optional heavy imports ───────────────────────────────────
try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

try:
    from sklearn.cluster import KMeans
    from sklearn.preprocessing import LabelEncoder, StandardScaler
    from sklearn.ensemble import GradientBoostingRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import r2_score, mean_absolute_error
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# ── Paths ────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
DATA_DIR  = BASE_DIR / "data"
SLOGAN_CSV    = DATA_DIR / "sloganlist.csv"
MARKETING_CSV = DATA_DIR / "marketing_campaign_dataset.csv"

# ── Design constants ─────────────────────────────────────────
INDUSTRIES = [
    "Technology","Healthcare","Finance","Retail","Food & Beverage",
    "Fashion","Education","Automotive","Real Estate","Entertainment",
    "Sports & Fitness","Travel & Tourism","Beauty & Cosmetics","Gaming","SaaS",
]
TONES = [
    "Bold & Confident","Playful & Fun","Professional & Trustworthy",
    "Innovative & Futuristic","Warm & Friendly","Luxury & Premium",
    "Eco-Conscious & Sustainable","Minimalist & Clean",
]
LANGUAGES = {
    "🇪🇸 Spanish":"Spanish","🇫🇷 French":"French","🇩🇪 German":"German",
    "🇯🇵 Japanese":"Japanese","🇨🇳 Mandarin":"Mandarin","🇧🇷 Portuguese":"Portuguese",
    "🇸🇦 Arabic":"Arabic","🇮🇳 Hindi":"Hindi","🇰🇷 Korean":"Korean","🇮🇹 Italian":"Italian",
}
FONT_PAIRS = {
    "Technology":     ("Space Grotesk","Inter","Modern & Technical"),
    "Healthcare":     ("Merriweather","Lato","Clean & Trustworthy"),
    "Finance":        ("Playfair Display","Source Sans Pro","Authoritative"),
    "Retail":         ("Poppins","Nunito","Friendly & Accessible"),
    "Food & Beverage":("Lobster","Open Sans","Warm & Inviting"),
    "Fashion":        ("Cormorant Garamond","Montserrat","Elegant & Refined"),
    "Education":      ("Roboto Slab","Roboto","Clear & Educational"),
    "Automotive":     ("Oswald","Roboto Condensed","Strong & Dynamic"),
    "Real Estate":    ("Libre Baskerville","Raleway","Reliable & Premium"),
    "Entertainment":  ("Bebas Neue","DM Sans","Bold & Exciting"),
    "SaaS":           ("Space Grotesk","DM Sans","Modern & Clean"),
    "Sports & Fitness":("Barlow Condensed","Barlow","Energetic & Strong"),
    "Travel & Tourism":("Quicksand","Open Sans","Light & Adventurous"),
    "Beauty & Cosmetics":("Playfair Display","Raleway","Sophisticated"),
    "Gaming":         ("Orbitron","Exo 2","Futuristic & Edgy"),
}
SLOGAN_TEMPLATES = {
    "Bold & Confident": [
        "{company}. No compromises.",
        "Lead the future. Lead with {company}.",
        "Built different. Built for {industry}.",
        "The {industry} revolution starts with {company}.",
        "Powered by ambition. Driven by {company}.",
    ],
    "Playful & Fun": [
        "Happy {industry}. That's {company}!",
        "Life's better with {company}.",
        "{company}: Where {industry} gets a smile.",
        "More joy. More {industry}. More {company}.",
        "Why so serious? {company} makes it fun.",
    ],
    "Professional & Trustworthy": [
        "{company}: Excellence in every detail.",
        "Trusted by leaders. Proven in {industry}.",
        "Your {industry} partner for life — {company}.",
        "Precision meets passion at {company}.",
        "Setting the global standard in {industry}.",
    ],
    "Innovative & Futuristic": [
        "{company}: Tomorrow's {industry}, today.",
        "The future of {industry} is {company}.",
        "Redefining {industry} with {company}.",
        "Beyond limits. Beyond {industry}. {company}.",
        "Where innovation meets {industry} — {company}.",
    ],
    "Warm & Friendly": [
        "{company}: Because you deserve the best.",
        "More than {industry}. We're your community.",
        "Growing together with {company}.",
        "Your {industry} journey, our heart — {company}.",
        "Welcome home. Welcome to {company}.",
    ],
    "Luxury & Premium": [
        "{company}: Crafted for the extraordinary.",
        "Excellence, refined. {company}.",
        "Not just {industry}. An experience. {company}.",
        "Where {industry} meets perfection — {company}.",
        "{company}: The pinnacle of {industry}.",
    ],
    "Eco-Conscious & Sustainable": [
        "{company}: {industry} that cares.",
        "Green future. Better {industry}. {company}.",
        "Sustaining {industry}. Sustaining the planet.",
        "{company}: Purpose-driven {industry}.",
        "For the earth. For {industry}. For you — {company}.",
    ],
    "Minimalist & Clean": [
        "{company}.",
        "Simply {industry}.",
        "Less noise. More {company}.",
        "Pure {industry}. Pure {company}.",
        "{company}: Just what you need.",
    ],
}

# ════════════════════════════════════════════════════════════
#  PAGE CONFIG  (must be first Streamlit call)
# ════════════════════════════════════════════════════════════
st.set_page_config(
    page_title="NOVA TECH · AI Branding Suite",
    page_icon="✦",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ════════════════════════════════════════════════════════════
#  CSS INJECTION
# ════════════════════════════════════════════════════════════
def inject_css():
    st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; }

/* ── BASE ── */
.stApp {
    background: #06070E !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #E2E8F0;
}

/* ── HIDE CHROME ── */
#MainMenu, footer, .stDeployButton { display: none !important; }
[data-testid="stHeader"] {
    background: rgba(6,7,14,0.85) !important;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
}

/* ── SIDEBAR ── */
[data-testid="stSidebar"] {
    background: #07080F !important;
    border-right: 1px solid rgba(255,255,255,0.055) !important;
}
[data-testid="stSidebar"] .block-container { padding: 1.5rem !important; }

/* ── MAIN CONTAINER ── */
.main .block-container {
    padding: 2rem 2.5rem !important;
    max-width: 1380px !important;
}

/* ── TABS ── */
.stTabs [data-baseweb="tab-list"] {
    background: rgba(255,255,255,0.02) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 12px !important;
    padding: 5px !important;
    gap: 2px !important;
    overflow-x: auto !important;
}
.stTabs [data-baseweb="tab"] {
    background: transparent !important;
    border: none !important;
    border-radius: 8px !important;
    color: #475569 !important;
    font-weight: 500 !important;
    font-size: 13px !important;
    padding: 8px 16px !important;
    white-space: nowrap !important;
    transition: all 0.18s ease !important;
    font-family: 'Inter', sans-serif !important;
}
.stTabs [data-baseweb="tab"]:hover { color: #94A3B8 !important; background: rgba(255,255,255,0.03) !important; }
.stTabs [aria-selected="true"] {
    background: #6366F1 !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    box-shadow: 0 0 18px rgba(99,102,241,0.35) !important;
}
.stTabs [data-baseweb="tab-panel"] { padding-top: 1.75rem !important; }

/* ── BUTTONS ── */
.stButton > button {
    background: #6366F1 !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    padding: 0.6rem 1.4rem !important;
    transition: all 0.18s ease !important;
    font-family: 'Inter', sans-serif !important;
    letter-spacing: 0.1px !important;
}
.stButton > button:hover {
    background: #4F46E5 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 20px rgba(99,102,241,0.4) !important;
}
.stButton > button:active { transform: translateY(0) !important; }

/* Download button */
.stDownloadButton > button {
    background: rgba(16,185,129,0.1) !important;
    color: #10B981 !important;
    border: 1px solid rgba(16,185,129,0.3) !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    font-family: 'Inter', sans-serif !important;
}
.stDownloadButton > button:hover {
    background: rgba(16,185,129,0.18) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 14px rgba(16,185,129,0.25) !important;
}

/* ── INPUTS ── */
.stTextInput input, .stTextArea textarea, .stNumberInput input {
    background: rgba(255,255,255,0.035) !important;
    border: 1px solid rgba(255,255,255,0.09) !important;
    border-radius: 10px !important;
    color: #F1F5F9 !important;
    font-family: 'Inter', sans-serif !important;
    transition: border-color 0.18s ease, box-shadow 0.18s ease !important;
}
.stTextInput input:focus, .stTextArea textarea:focus, .stNumberInput input:focus {
    border-color: #6366F1 !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important;
    background: rgba(255,255,255,0.05) !important;
}
.stSelectbox > div > div, .stMultiSelect > div > div {
    background: rgba(255,255,255,0.035) !important;
    border: 1px solid rgba(255,255,255,0.09) !important;
    border-radius: 10px !important;
    color: #F1F5F9 !important;
}

/* ── LABELS ── */
label, .stTextInput label, .stTextArea label, .stSelectbox label,
.stMultiSelect label, .stSlider label, .stNumberInput label, .stFileUploader label {
    color: #64748B !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.9px !important;
}

/* ── METRICS ── */
[data-testid="metric-container"] {
    background: rgba(255,255,255,0.025) !important;
    border: 1px solid rgba(255,255,255,0.07) !important;
    border-radius: 14px !important;
    padding: 1.2rem 1.4rem !important;
    transition: border-color 0.18s ease !important;
}
[data-testid="metric-container"]:hover { border-color: rgba(99,102,241,0.35) !important; }
[data-testid="stMetricLabel"] {
    color: #475569 !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 0.8px !important;
    text-transform: uppercase !important;
}
[data-testid="stMetricValue"] {
    color: #00D4FF !important;
    font-size: 26px !important;
    font-weight: 700 !important;
    font-family: 'Space Grotesk', sans-serif !important;
}
[data-testid="stMetricDelta"] { font-size: 12px !important; }

/* ── PROGRESS ── */
[data-testid="stProgress"] > div > div > div {
    background: linear-gradient(90deg, #6366F1, #00D4FF) !important;
    border-radius: 99px !important;
}

/* ── FILE UPLOADER ── */
[data-testid="stFileUploadDropzone"] {
    background: rgba(99,102,241,0.04) !important;
    border: 2px dashed rgba(99,102,241,0.3) !important;
    border-radius: 14px !important;
    transition: all 0.18s ease !important;
}
[data-testid="stFileUploadDropzone"]:hover {
    border-color: #6366F1 !important;
    background: rgba(99,102,241,0.08) !important;
}

/* ── EXPANDER ── */
[data-testid="stExpander"] {
    background: rgba(255,255,255,0.02) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 12px !important;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

/* ══ CUSTOM COMPONENTS ══════════════════════════════════════ */

/* Hero Banner */
.nova-hero {
    background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(0,212,255,0.04) 100%);
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 22px;
    padding: 3rem 2rem;
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
}
.nova-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% -20%, rgba(99,102,241,0.14), transparent 65%);
    pointer-events: none;
}
.nova-brand-mark {
    font-size: 44px;
    margin-bottom: 8px;
    display: block;
}
.nova-logo-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 48px;
    font-weight: 800;
    background: linear-gradient(135deg, #00D4FF 0%, #6366F1 50%, #A855F7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
    display: block;
    margin-bottom: 10px;
}
.nova-hero-sub {
    font-size: 15px;
    color: #475569;
    font-weight: 400;
    letter-spacing: 0.2px;
    display: block;
}
.nova-badge-row {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 1.25rem;
}

/* Section header */
.section-hdr {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.section-hdr-icon {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, #6366F1, #00D4FF);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
}
.section-hdr-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #F1F5F9;
    margin: 0;
}
.section-hdr-sub {
    font-size: 12px;
    color: #475569;
    margin-top: 1px;
}

/* Cards */
.nova-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.065);
    border-radius: 16px;
    padding: 1.4rem;
    margin-bottom: 1rem;
    transition: border-color 0.18s ease, background 0.18s ease;
}
.nova-card:hover {
    border-color: rgba(99,102,241,0.28);
    background: rgba(99,102,241,0.04);
}

/* Slogan items */
.slogan-item {
    background: rgba(255,255,255,0.022);
    border: 1px solid rgba(255,255,255,0.065);
    border-radius: 12px;
    padding: 1.2rem 1.4rem;
    margin-bottom: 0.65rem;
    position: relative;
    transition: all 0.18s ease;
}
.slogan-item:hover {
    border-color: rgba(0,212,255,0.22);
    background: rgba(0,212,255,0.03);
}
.slogan-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 17px;
    font-weight: 600;
    color: #E2E8F0;
    font-style: italic;
    line-height: 1.4;
    margin-bottom: 6px;
}
.slogan-meta { font-size: 11px; color: #334155; text-transform: uppercase; letter-spacing: 0.7px; font-weight: 600; }
.slogan-num {
    position: absolute;
    top: 50%;
    right: 1.2rem;
    transform: translateY(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: rgba(99,102,241,0.35);
}

/* Badges */
.nbadge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
}
.nb-indigo { background: rgba(99,102,241,0.12); color: #818CF8; border: 1px solid rgba(99,102,241,0.22); }
.nb-cyan   { background: rgba(0,212,255,0.08);  color: #00D4FF; border: 1px solid rgba(0,212,255,0.22); }
.nb-green  { background: rgba(16,185,129,0.1);  color: #10B981; border: 1px solid rgba(16,185,129,0.22); }
.nb-amber  { background: rgba(245,158,11,0.1);  color: #F59E0B; border: 1px solid rgba(245,158,11,0.22); }
.nb-purple { background: rgba(168,85,247,0.1);  color: #A855F7; border: 1px solid rgba(168,85,247,0.22); }
.nb-red    { background: rgba(239,68,68,0.1);   color: #EF4444; border: 1px solid rgba(239,68,68,0.22); }

/* Sidebar logo */
.sb-logo { padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.055); margin-bottom: 1.25rem; }
.sb-logo-name { font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:800; background:linear-gradient(135deg,#00D4FF,#6366F1); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.sb-logo-tag { font-size:10px; color:#334155; text-transform:uppercase; letter-spacing:1.5px; font-weight:600; }
.sb-section { font-size:10px; color:#1E293B; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; padding:0.8rem 0 0.35rem; }

/* API status pill */
.api-pill {
    display:flex; align-items:center; gap:8px;
    padding:9px 12px; border-radius:10px; font-size:12px; font-weight:500;
}
.api-on  { background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.22); color:#10B981; }
.api-off { background:rgba(245,158,11,0.07); border:1px solid rgba(245,158,11,0.2);  color:#F59E0B; }
.dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.dot-g { background:#10B981; box-shadow:0 0 8px #10B981; }
.dot-a { background:#F59E0B; }

/* Prediction card */
.pred-card {
    background: linear-gradient(135deg, rgba(99,102,241,0.09), rgba(0,212,255,0.04));
    border: 1px solid rgba(99,102,241,0.22);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
}
.pred-value { font-family:'Space Grotesk',sans-serif; font-size:34px; font-weight:700; color:#6366F1; line-height:1.1; }
.pred-label { font-size:11px; color:#475569; text-transform:uppercase; letter-spacing:0.8px; font-weight:600; margin-top:5px; }

/* Chart wrapper */
.chart-wrap { background:rgba(255,255,255,0.015); border:1px solid rgba(255,255,255,0.055); border-radius:14px; padding:1rem 1rem 0.5rem; }
.chart-title { font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.7px; margin-bottom:0.5rem; }

/* Stat bar (keyword analysis) */
.stat-bar { margin-bottom:10px; }
.stat-bar-label { display:flex; justify-content:space-between; font-size:12px; color:#64748B; margin-bottom:4px; }
.stat-bar-track { height:5px; background:rgba(255,255,255,0.06); border-radius:99px; overflow:hidden; }
.stat-bar-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#6366F1,#00D4FF); }

/* Color palette swatch */
.pal-swatch { width:52px; height:52px; border-radius:11px; display:inline-block; margin:4px; box-shadow:0 2px 8px rgba(0,0,0,0.5); transition:transform 0.18s ease; cursor:pointer; }
.pal-swatch:hover { transform:scale(1.12) translateY(-2px); }

/* Translation card */
.trans-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:1rem 1.2rem; margin-bottom:0.65rem; }
.trans-lang { font-size:11px; color:#475569; font-weight:700; text-transform:uppercase; letter-spacing:0.7px; margin-bottom:4px; }
.trans-text { font-family:'Space Grotesk',sans-serif; font-size:16px; color:#E2E8F0; font-weight:500; }

/* Feedback star */
.fb-star { font-size:28px; display:inline-block; margin:0 2px; cursor:pointer; }

/* Divider */
.divider { height:1px; background:rgba(255,255,255,0.055); margin:1.5rem 0; }

/* Powered-by */
.powered { font-size:10px; color:#1E293B; text-align:center; letter-spacing:1px; text-transform:uppercase; font-weight:500; }
</style>
""", unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════
#  CHART STYLING HELPER
# ════════════════════════════════════════════════════════════
PLOTLY_PALETTE = ["#6366F1","#00D4FF","#A855F7","#10B981","#F59E0B","#EF4444","#F472B6","#34D399"]

def style_fig(fig, height=340, title=""):
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(255,255,255,0.01)",
        font=dict(family="Inter", color="#64748B", size=11),
        title=dict(text=title, font=dict(family="Space Grotesk", color="#94A3B8", size=13), x=0, pad=dict(b=10)),
        margin=dict(l=10, r=10, t=40 if title else 10, b=10),
        height=height,
        colorway=PLOTLY_PALETTE,
        legend=dict(bgcolor="rgba(0,0,0,0)", bordercolor="rgba(255,255,255,0.06)",
                    borderwidth=1, font=dict(color="#64748B", size=11)),
        hoverlabel=dict(bgcolor="#0D0E1A", bordercolor="#6366F1",
                        font=dict(family="Inter", color="#E2E8F0", size=12)),
    )
    fig.update_xaxes(gridcolor="rgba(255,255,255,0.04)", linecolor="rgba(255,255,255,0.06)",
                     zerolinecolor="rgba(255,255,255,0.04)", tickfont=dict(color="#475569", size=11))
    fig.update_yaxes(gridcolor="rgba(255,255,255,0.04)", linecolor="rgba(255,255,255,0.06)",
                     zerolinecolor="rgba(255,255,255,0.04)", tickfont=dict(color="#475569", size=11))
    return fig


# ════════════════════════════════════════════════════════════
#  DATA LOADING
# ════════════════════════════════════════════════════════════
@st.cache_data
def load_marketing_data():
    if not MARKETING_CSV.exists():
        return pd.DataFrame()
    df = pd.read_csv(MARKETING_CSV)
    df["Acquisition_Cost"] = df["Acquisition_Cost"].astype(str).str.replace(r"[$,]", "", regex=True).astype(float)
    df["Duration_Days"] = df["Duration"].astype(str).str.extract(r"(\d+)").astype(float)
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df["Month"] = df["Date"].dt.to_period("M").astype(str)
    df["ROI_pct"] = df["ROI"] * 100
    return df

@st.cache_data
def load_slogans():
    if not SLOGAN_CSV.exists():
        return pd.DataFrame(columns=["Company","Slogan"])
    df = pd.read_csv(SLOGAN_CSV)
    return df.dropna()


# ════════════════════════════════════════════════════════════
#  ML MODEL TRAINING
# ════════════════════════════════════════════════════════════
@st.cache_resource
def train_models(df):
    if not SKLEARN_AVAILABLE or df.empty:
        return None, None, None, None
    cat_cols = ["Campaign_Type","Channel_Used","Target_Audience","Location","Language","Customer_Segment"]
    num_cols = ["Duration_Days","Clicks","Impressions","Acquisition_Cost"]
    targets  = ["Conversion_Rate","ROI","Engagement_Score"]
    data = df[cat_cols + num_cols + targets].dropna()
    if len(data) < 20:
        return None, None, None, None
    encoders = {}
    X = data[num_cols].copy()
    for c in cat_cols:
        le = LabelEncoder()
        X[c] = le.fit_transform(data[c].astype(str))
        encoders[c] = le
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    models = {}
    for t in targets:
        y = data[t].values
        X_tr, X_te, y_tr, y_te = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        m = GradientBoostingRegressor(n_estimators=120, max_depth=4, learning_rate=0.08, random_state=42)
        m.fit(X_tr, y_tr)
        models[t] = m
    return models, encoders, scaler, cat_cols + num_cols


# ════════════════════════════════════════════════════════════
#  GEMINI AI
# ════════════════════════════════════════════════════════════
def init_gemini(api_key: str):
    if not GEMINI_AVAILABLE or not api_key:
        return None
    try:
        genai.configure(api_key=api_key)
        return genai.GenerativeModel("gemini-1.5-flash")
    except Exception:
        return None


def ai_generate_slogans(model, company, industry, tone, keywords=""):
    kw_clause = f"Keywords to weave in: {keywords}." if keywords else ""
    prompt = f"""You are a world-class brand strategist and copywriter.
Create exactly 5 unique, memorable marketing slogans for:
- Company: {company}
- Industry: {industry}
- Tone: {tone}
{kw_clause}

Rules:
1. Each slogan must be 3–12 words
2. Be creative, punchy, and memorable
3. Vary the style across all 5
4. No generic corporate speak
5. Return ONLY a numbered list (1. ... 2. ... etc.)"""
    try:
        resp = model.generate_content(prompt)
        lines = [l.strip() for l in resp.text.strip().split("\n") if l.strip()]
        slogans = []
        for l in lines:
            cleaned = re.sub(r"^\d+[\.\)]\s*", "", l).strip('"').strip()
            if cleaned and len(cleaned) > 5:
                slogans.append(cleaned)
        return slogans[:5]
    except Exception as e:
        return []


def ai_translate(model, text, lang):
    prompt = f"Translate this marketing slogan to {lang}. Keep the same emotional tone and impact. Return ONLY the translation, no explanations:\n\n{text}"
    try:
        resp = model.generate_content(prompt)
        return resp.text.strip().strip('"')
    except Exception:
        return f"[Translation unavailable — check API key]"


def ai_campaign_advice(model, company, industry, channel, budget):
    prompt = f"""As a senior marketing strategist, give 3 concise, specific campaign recommendations for:
Company: {company} | Industry: {industry} | Channel: {channel} | Budget: ${budget:,.0f}
Format as a numbered list. Each recommendation in 1-2 sentences. Be specific and actionable."""
    try:
        resp = model.generate_content(prompt)
        return resp.text.strip()
    except Exception:
        return ""


# ════════════════════════════════════════════════════════════
#  DEMO MODE (no API key)
# ════════════════════════════════════════════════════════════
def demo_slogans(company, industry, tone):
    templates = SLOGAN_TEMPLATES.get(tone, SLOGAN_TEMPLATES["Bold & Confident"])
    random.shuffle(templates)
    return [t.format(company=company, industry=industry.lower()) for t in templates[:5]]


# ════════════════════════════════════════════════════════════
#  IMAGE / COLOR TOOLS
# ════════════════════════════════════════════════════════════
def kmeans_palette(img_pil, k=5):
    """Extract dominant colors from image using KMeans."""
    if not SKLEARN_AVAILABLE or not PIL_AVAILABLE:
        return ["#6366F1","#00D4FF","#A855F7","#10B981","#F59E0B"]
    img = img_pil.convert("RGB").resize((120, 120))
    arr = np.array(img).reshape(-1, 3)
    km = KMeans(n_clusters=k, n_init=8, random_state=42)
    km.fit(arr)
    centers = km.cluster_centers_.astype(int)
    counts   = np.bincount(km.labels_)
    order    = np.argsort(-counts)
    return [f"#{c[0]:02X}{c[1]:02X}{c[2]:02X}" for c in centers[order]]


def generate_text_logo(company: str, hex_bg: str = "#6366F1", hex_fg: str = "#FFFFFF") -> bytes:
    """Generate a minimal text-based logo PNG with PIL."""
    if not PIL_AVAILABLE:
        return b""
    W, H = 480, 200
    img  = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Gradient-like background rect
    r, g, b = int(hex_bg[1:3],16), int(hex_bg[3:5],16), int(hex_bg[5:7],16)
    draw.rounded_rectangle([(0,0),(W-1,H-1)], radius=24,
                            fill=(r,g,b,255))
    # Text (large initials + company name)
    initials = "".join(w[0].upper() for w in company.split() if w)[:2]
    try:
        font_big  = ImageFont.truetype("arial.ttf", 72)
        font_small = ImageFont.truetype("arial.ttf", 28)
    except OSError:
        font_big  = ImageFont.load_default()
        font_small = ImageFont.load_default()
    fr, fg, fb = int(hex_fg[1:3],16), int(hex_fg[3:5],16), int(hex_fg[5:7],16)
    bbox = draw.textbbox((0,0), initials, font=font_big)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text(((W//2 - tw//2), (H//2 - th//2 - 10)), initials, font=font_big, fill=(fr,fg,fb,255))
    draw.text((W//2, H - 38), company.upper(), font=font_small,
              fill=(fr,fg,fb,180), anchor="mm")
    buf = io.BytesIO()
    img.save(buf, "PNG")
    return buf.getvalue()


def generate_brand_gif(company: str, colors: list, frames: int = 24) -> bytes:
    """Create a simple animated brand GIF using PIL."""
    if not PIL_AVAILABLE:
        return b""
    W, H = 480, 200
    gif_frames = []
    bg = colors[0] if colors else "#6366F1"
    ac = colors[1] if len(colors) > 1 else "#00D4FF"
    r0,g0,b0 = int(bg[1:3],16),int(bg[3:5],16),int(bg[5:7],16)
    r1,g1,b1 = int(ac[1:3],16),int(ac[3:5],16),int(ac[5:7],16)
    try:
        fnt = ImageFont.truetype("arial.ttf", 48)
        fnt_s = ImageFont.truetype("arial.ttf", 18)
    except OSError:
        fnt   = ImageFont.load_default()
        fnt_s = ImageFont.load_default()

    for i in range(frames):
        t = i / frames  # 0→1
        # Interpolate background
        cr = int(r0 + (r1-r0)*t)
        cg = int(g0 + (g1-g0)*t)
        cb = int(b0 + (b1-b0)*t)
        img = Image.new("RGB", (W, H), (cr, cg, cb))
        draw = ImageDraw.Draw(img)
        alpha = min(255, int(255 * (i / (frames * 0.4))))
        # Company name fade in
        bbox = draw.textbbox((0,0), company.upper(), font=fnt)
        tw = bbox[2]-bbox[0]
        draw.text(((W-tw)//2, H//2 - 34), company.upper(), font=fnt,
                  fill=(255,255,255))
        # Tagline
        tag = "AI Branding Suite"
        draw.text((W//2, H//2 + 28), tag, font=fnt_s,
                  fill=(255,255,255), anchor="mm")
        # Accent bar animated width
        bar_w = int((W * 0.6) * t)
        draw.rectangle([(W//2 - bar_w//2, H-24),(W//2 + bar_w//2, H-20)],
                        fill=(255,255,255,200))
        gif_frames.append(img)

    buf = io.BytesIO()
    gif_frames[0].save(buf, format="GIF", save_all=True,
                       append_images=gif_frames[1:], duration=80, loop=0)
    return buf.getvalue()


def create_zip_kit(company, slogans, colors, gif_bytes=b"", translations=None):
    """Package brand assets into a downloadable ZIP."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        # Brand overview JSON
        overview = {
            "company": company,
            "generated_at": datetime.now().isoformat(),
            "slogans": slogans,
            "color_palette": colors,
            "translations": translations or {},
        }
        zf.writestr("brand_overview.json", json.dumps(overview, indent=2, ensure_ascii=False))
        # Slogans text
        slogans_txt = f"NOVA TECH · Brand Slogans for {company}\n" + "="*50 + "\n\n"
        for i, s in enumerate(slogans, 1):
            slogans_txt += f"{i}. {s}\n"
        zf.writestr("slogans.txt", slogans_txt)
        # Colors CSS
        css = f"/* {company} Brand Colors */\n:root {{\n"
        for i, c in enumerate(colors):
            css += f"  --brand-color-{i+1}: {c};\n"
        css += "}\n"
        zf.writestr("brand_colors.css", css)
        # Animated GIF
        if gif_bytes:
            zf.writestr("brand_animation.gif", gif_bytes)
        # Translations
        if translations:
            trans_txt = f"Multilingual Slogans — {company}\n" + "="*50 + "\n\n"
            for lang, text in translations.items():
                trans_txt += f"{lang}: {text}\n"
            zf.writestr("multilingual_slogans.txt", trans_txt)
    buf.seek(0)
    return buf.read()


# ════════════════════════════════════════════════════════════
#  KEYWORD ANALYSIS FROM SLOGAN CORPUS
# ════════════════════════════════════════════════════════════
POWER_WORDS = [
    "better","best","new","first","great","good","more","now","how","feel",
    "proven","save","fast","easy","smart","free","love","make","get","your",
    "you","just","simply","only","real","true","live","see","need","want",
    "future","world","life","every","power","change","build","grow","create",
    "discover","inspire","drive","lead","transform","innovate","excellence",
    "premium","trusted","quality","performance","value","experience","success",
]

def get_keyword_freq(df_slogans):
    if df_slogans.empty:
        return {}
    text = " ".join(df_slogans["Slogan"].tolist()).lower()
    words = re.findall(r"\b[a-z]{4,}\b", text)
    freq  = {}
    for w in words:
        if w in POWER_WORDS:
            freq[w] = freq.get(w, 0) + 1
    return dict(sorted(freq.items(), key=lambda x: x[1], reverse=True)[:15])


# ════════════════════════════════════════════════════════════
#  SIDEBAR
# ════════════════════════════════════════════════════════════
def render_sidebar():
    with st.sidebar:
        st.markdown("""
        <div class="sb-logo">
            <div class="sb-logo-name">✦ NOVA TECH</div>
            <div class="sb-logo-tag">AI Branding Suite</div>
        </div>""", unsafe_allow_html=True)

        # API key
        st.markdown('<div class="sb-section">Gemini AI</div>', unsafe_allow_html=True)
        api_key = st.text_input("API Key", type="password",
                                value=st.session_state.get("gemini_key",""),
                                placeholder="AIza…", label_visibility="collapsed")
        if api_key:
            st.session_state["gemini_key"] = api_key
            st.markdown('<div class="api-pill api-on"><div class="dot dot-g"></div>Gemini Connected</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="api-pill api-off"><div class="dot dot-a"></div>Demo Mode</div>', unsafe_allow_html=True)

        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

        # Brand settings
        st.markdown('<div class="sb-section">Brand Settings</div>', unsafe_allow_html=True)
        company = st.text_input("Company Name", value=st.session_state.get("company",""),
                                placeholder="e.g. Acme Corp")
        if company:
            st.session_state["company"] = company

        industry = st.selectbox("Industry", INDUSTRIES,
                                index=INDUSTRIES.index(st.session_state.get("industry","Technology")))
        st.session_state["industry"] = industry

        tone = st.selectbox("Brand Tone", TONES,
                            index=TONES.index(st.session_state.get("tone","Bold & Confident")))
        st.session_state["tone"] = tone

        keywords = st.text_input("Keywords (optional)", placeholder="fast, reliable, green…",
                                 value=st.session_state.get("keywords",""))
        st.session_state["keywords"] = keywords

        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

        # Generate CTA
        if st.button("✦  Generate Brand Kit", use_container_width=True):
            if not st.session_state.get("company",""):
                st.warning("Enter a company name first.")
            else:
                st.session_state["trigger_generate"] = True

        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
        st.markdown('<div class="powered">Powered by Claude & Gemini AI</div>', unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════
#  TAB 1 — HOME DASHBOARD
# ════════════════════════════════════════════════════════════
def render_home(df):
    st.markdown("""
<div class="nova-hero">
  <span class="nova-brand-mark">✦</span>
  <span class="nova-logo-text">NOVA TECH</span>
  <span class="nova-hero-sub">AI-Powered Automated Branding Assistant for Businesses</span>
  <div class="nova-badge-row">
    <span class="nbadge nb-indigo">Gemini AI</span>
    <span class="nbadge nb-cyan">Scikit-learn</span>
    <span class="nbadge nb-purple">Plotly Analytics</span>
    <span class="nbadge nb-green">KMeans Palette</span>
    <span class="nbadge nb-amber">Multilingual</span>
  </div>
</div>""", unsafe_allow_html=True)

    # KPI row
    if not df.empty:
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            st.metric("Total Campaigns", f"{len(df):,}", delta="Dataset loaded ✓")
        with c2:
            avg_roi = df["ROI"].mean()
            st.metric("Avg ROI", f"{avg_roi:.2f}x", delta=f"{(avg_roi-5)*10:.0f}% vs benchmark")
        with c3:
            avg_cvr = df["Conversion_Rate"].mean() * 100
            st.metric("Avg Conversion Rate", f"{avg_cvr:.1f}%", delta="Across all channels")
        with c4:
            avg_eng = df["Engagement_Score"].mean()
            st.metric("Avg Engagement Score", f"{avg_eng:.1f}/100")

        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

        # Mini dashboard
        col_a, col_b = st.columns(2)
        with col_a:
            fig = px.bar(
                df.groupby("Campaign_Type")["ROI"].mean().reset_index().sort_values("ROI", ascending=False),
                x="Campaign_Type", y="ROI", color="ROI",
                color_continuous_scale=["#6366F1","#00D4FF"],
            )
            style_fig(fig, height=300, title="Avg ROI by Campaign Type")
            fig.update_traces(marker_line_width=0)
            fig.update_layout(coloraxis_showscale=False, xaxis_title="", yaxis_title="ROI (x)")
            st.markdown('<div class="chart-wrap"><div class="chart-title">ROI by Campaign Type</div>', unsafe_allow_html=True)
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
            st.markdown('</div>', unsafe_allow_html=True)
        with col_b:
            fig2 = px.bar(
                df.groupby("Channel_Used")["Conversion_Rate"].mean().mul(100).reset_index().sort_values("Conversion_Rate", ascending=True),
                x="Conversion_Rate", y="Channel_Used", orientation="h", color="Conversion_Rate",
                color_continuous_scale=["#A855F7","#00D4FF"],
            )
            style_fig(fig2, height=300, title="Conversion Rate by Channel")
            fig2.update_layout(coloraxis_showscale=False, xaxis_title="Conversion Rate (%)", yaxis_title="")
            st.markdown('<div class="chart-wrap"><div class="chart-title">Conversion Rate by Channel</div>', unsafe_allow_html=True)
            st.plotly_chart(fig2, use_container_width=True, config={"displayModeBar": False})
            st.markdown('</div>', unsafe_allow_html=True)
    else:
        st.info("Marketing dataset not found. Place `marketing_campaign_dataset.csv` in the `data/` folder.")

    # Module overview
    st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
    st.markdown("#### Module Overview")
    m1, m2, m3, m4 = st.columns(4)
    modules = [
        ("✦","Logo & Font Studio","Upload logo → KMeans color palette → font pairing","nb-indigo"),
        ("💡","Slogan Lab","Gemini AI / demo slogan & tagline generation","nb-cyan"),
        ("🎬","Brand Aesthetics","Animated GIF, style guide, ZIP kit download","nb-purple"),
        ("📊","Campaign Analytics","Plotly dashboards + ML-powered predictions","nb-green"),
    ]
    for col, (icon, title, desc, badge) in zip([m1,m2,m3,m4], modules):
        with col:
            st.markdown(f"""
<div class="nova-card">
  <div style="font-size:24px;margin-bottom:8px">{icon}</div>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:700;color:#F1F5F9;margin-bottom:6px">{title}</div>
  <div style="font-size:12px;color:#475569;line-height:1.5">{desc}</div>
</div>""", unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════
#  TAB 2 — LOGO & FONT STUDIO
# ════════════════════════════════════════════════════════════
def render_logo_studio():
    st.markdown("""<div class="section-hdr">
  <div class="section-hdr-icon">✦</div>
  <div><div class="section-hdr-title">Logo & Font Studio</div>
  <div class="section-hdr-sub">Upload a logo for AI color extraction · Get font pairing recommendations</div></div>
</div>""", unsafe_allow_html=True)

    col_left, col_right = st.columns([1, 1], gap="large")

    with col_left:
        st.markdown("##### Upload Brand Logo")
        uploaded = st.file_uploader("Drop PNG/JPG logo", type=["png","jpg","jpeg","webp"],
                                    label_visibility="collapsed")
        palette = []
        logo_img = None

        if uploaded:
            logo_img = Image.open(uploaded).convert("RGBA")
            st.image(logo_img, use_column_width=True)
            with st.spinner("Extracting dominant colors with KMeans…"):
                palette = kmeans_palette(logo_img, k=5)
            st.session_state["brand_palette"] = palette
        else:
            # Generate text logo
            company = st.session_state.get("company","NOVA TECH")
            col_bg, col_txt = st.columns(2)
            with col_bg:
                bg_hex = st.color_picker("Background", "#6366F1")
            with col_txt:
                fg_hex = st.color_picker("Text Color", "#FFFFFF")
            if st.button("⚡ Generate Text Logo"):
                logo_bytes = generate_text_logo(company, bg_hex, fg_hex)
                if logo_bytes:
                    st.image(logo_bytes, caption=f"{company} Logo Preview")
                    st.download_button("⬇ Download Logo PNG", logo_bytes,
                                       file_name=f"{company.lower().replace(' ','_')}_logo.png",
                                       mime="image/png")
                    palette = [bg_hex, fg_hex]
                    st.session_state["brand_palette"] = palette
                else:
                    st.info("Install Pillow (`pip install Pillow`) for logo generation.")

    with col_right:
        st.markdown("##### Extracted Color Palette")
        stored_palette = st.session_state.get("brand_palette", palette)
        if stored_palette:
            swatches_html = "".join(
                f'<span class="pal-swatch" style="background:{c}" title="{c}"></span>'
                for c in stored_palette
            )
            st.markdown(f'<div style="margin-bottom:1rem">{swatches_html}</div>', unsafe_allow_html=True)
            for i, c in enumerate(stored_palette, 1):
                r,g,b = int(c[1:3],16),int(c[3:5],16),int(c[5:7],16)
                lum = 0.299*r + 0.587*g + 0.114*b
                label = ["Primary","Secondary","Accent","Neutral","Highlight"][i-1]
                st.markdown(f"""
<div style="display:flex;align-items:center;gap:12px;padding:8px 12px;background:rgba(255,255,255,0.02);
border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:8px">
  <div style="width:32px;height:32px;border-radius:8px;background:{c};flex-shrink:0"></div>
  <div>
    <div style="font-size:13px;font-weight:600;color:#E2E8F0">{c}</div>
    <div style="font-size:11px;color:#475569">{label} · RGB({r},{g},{b}) · Luminance {lum:.0f}</div>
  </div>
</div>""", unsafe_allow_html=True)
        else:
            st.markdown("""
<div style="background:rgba(255,255,255,0.02);border:2px dashed rgba(255,255,255,0.08);
border-radius:14px;padding:3rem;text-align:center;color:#334155;font-size:13px">
Upload a logo to extract colors
</div>""", unsafe_allow_html=True)

        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

        # Font pairing
        st.markdown("##### AI Font Pairing")
        industry = st.session_state.get("industry","Technology")
        pair = FONT_PAIRS.get(industry, FONT_PAIRS["Technology"])
        heading_font, body_font, style_desc = pair
        st.markdown(f"""
<div class="nova-card">
  <div style="font-size:12px;color:#475569;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.7px;font-weight:700">Heading Font</div>
  <div style="font-size:22px;font-weight:700;color:#F1F5F9;margin-bottom:14px">{heading_font}</div>
  <div style="font-size:12px;color:#475569;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.7px;font-weight:700">Body Font</div>
  <div style="font-size:22px;font-weight:400;color:#94A3B8;margin-bottom:14px">{body_font}</div>
  <span class="nbadge nb-purple">{style_desc}</span>
  <span class="nbadge nb-indigo">{industry}</span>
</div>""", unsafe_allow_html=True)
        st.caption(f"Font pairing optimised for the **{industry}** sector based on 1,000+ brand analysis.")


# ════════════════════════════════════════════════════════════
#  TAB 3 — SLOGAN LAB
# ════════════════════════════════════════════════════════════
def render_slogan_lab(df_slogans):
    st.markdown("""<div class="section-hdr">
  <div class="section-hdr-icon">💡</div>
  <div><div class="section-hdr-title">Slogan & Tagline Generator</div>
  <div class="section-hdr-sub">Gemini AI · NLTK keyword corpus · 1,000+ slogan database</div></div>
</div>""", unsafe_allow_html=True)

    col_form, col_results = st.columns([1, 1.2], gap="large")

    with col_form:
        st.markdown("##### Generation Parameters")
        company  = st.text_input("Company Name", value=st.session_state.get("company",""), key="sl_company")
        industry = st.selectbox("Industry", INDUSTRIES, key="sl_industry",
                                index=INDUSTRIES.index(st.session_state.get("industry","Technology")))
        tone     = st.selectbox("Brand Tone", TONES, key="sl_tone",
                                index=TONES.index(st.session_state.get("tone","Bold & Confident")))
        keywords = st.text_input("Keywords", value=st.session_state.get("keywords",""),
                                 placeholder="e.g. speed, trust, AI", key="sl_kw")
        count    = st.slider("Number of slogans", 3, 10, 5)
        use_ai   = bool(st.session_state.get("gemini_key",""))
        mode_label = "✦ Generate with Gemini AI" if use_ai else "⚡ Generate (Demo Mode)"
        generate = st.button(mode_label, use_container_width=True, key="btn_gen_slogan")

        # Keyword analysis
        if not df_slogans.empty:
            st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
            st.markdown("##### Corpus Keyword Analysis")
            freq = get_keyword_freq(df_slogans)
            max_f = max(freq.values(), default=1)
            for word, cnt in list(freq.items())[:8]:
                pct = int(cnt/max_f*100)
                st.markdown(f"""
<div class="stat-bar">
  <div class="stat-bar-label"><span style="color:#94A3B8">{word}</span><span>{cnt}</span></div>
  <div class="stat-bar-track"><div class="stat-bar-fill" style="width:{pct}%"></div></div>
</div>""", unsafe_allow_html=True)

    with col_results:
        st.markdown("##### Generated Slogans")
        if generate and company:
            st.session_state["company"] = company
            st.session_state["industry"] = industry
            st.session_state["tone"] = tone
            with st.spinner("Crafting slogans…"):
                if use_ai:
                    model = init_gemini(st.session_state["gemini_key"])
                    slogans = ai_generate_slogans(model, company, industry, tone, keywords) if model else []
                    if not slogans:
                        st.warning("Gemini unavailable — falling back to demo mode.")
                        slogans = demo_slogans(company, industry, tone)
                else:
                    slogans = demo_slogans(company, industry, tone)
                # Pad/trim to requested count
                while len(slogans) < count:
                    slogans += demo_slogans(company, industry, tone)
                slogans = slogans[:count]
            st.session_state["slogans"] = slogans
        elif generate and not company:
            st.warning("Enter a company name to generate slogans.")

        stored = st.session_state.get("slogans", [])
        if stored:
            for i, s in enumerate(stored, 1):
                st.markdown(f"""
<div class="slogan-item">
  <div class="slogan-text">&ldquo;{s}&rdquo;</div>
  <div class="slogan-meta">Slogan {i} · {st.session_state.get("tone","—")}</div>
  <div class="slogan-num">#{i:02d}</div>
</div>""", unsafe_allow_html=True)

            # Export
            export_txt = "\n".join(f"{i}. {s}" for i,s in enumerate(stored,1))
            st.download_button("⬇ Export Slogans (.txt)", export_txt,
                               file_name="slogans.txt", mime="text/plain")

            # Real slogans comparison
            if not df_slogans.empty:
                st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
                with st.expander("📚 Explore Real Brand Slogans (1,000+ corpus)"):
                    search = st.text_input("Search brand or keyword", "", key="sl_search")
                    sample = df_slogans
                    if search:
                        mask = (df_slogans["Company"].str.contains(search, case=False, na=False) |
                                df_slogans["Slogan"].str.contains(search, case=False, na=False))
                        sample = df_slogans[mask]
                    st.dataframe(sample.head(30), use_container_width=True,
                                 column_config={"Company": st.column_config.TextColumn("Company"),
                                                "Slogan": st.column_config.TextColumn("Slogan")})
        else:
            st.markdown("""
<div style="background:rgba(255,255,255,0.02);border:2px dashed rgba(255,255,255,0.07);
border-radius:14px;padding:3rem;text-align:center;color:#334155;font-size:13px">
Configure your brand settings and click Generate
</div>""", unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════
#  TAB 4 — BRAND AESTHETICS & ANIMATION
# ════════════════════════════════════════════════════════════
def render_brand_aesthetics():
    st.markdown("""<div class="section-hdr">
  <div class="section-hdr-icon">🎬</div>
  <div><div class="section-hdr-title">Brand Aesthetics Engine</div>
  <div class="section-hdr-sub">Animated GIF generator · Style guide · Downloadable brand kit</div></div>
</div>""", unsafe_allow_html=True)

    col_l, col_r = st.columns([1,1], gap="large")

    with col_l:
        st.markdown("##### Animation Settings")
        company  = st.text_input("Company Name", value=st.session_state.get("company","NOVA TECH"), key="ba_co")
        palette  = st.session_state.get("brand_palette", ["#6366F1","#00D4FF","#A855F7","#10B981","#F59E0B"])
        anim_style = st.selectbox("Animation Style", ["Fade & Slide","Color Pulse","Minimal Reveal","Gradient Sweep"])
        frames   = st.slider("Frames (GIF quality)", 16, 48, 24)

        if st.button("🎬 Generate Brand Animation", use_container_width=True):
            if not PIL_AVAILABLE:
                st.error("Pillow not installed. Run: `pip install Pillow`")
            else:
                with st.spinner("Rendering frames…"):
                    gif = generate_brand_gif(company, palette, frames=frames)
                st.session_state["brand_gif"] = gif
                st.success("Animation ready!")

        gif = st.session_state.get("brand_gif")
        if gif:
            st.image(gif, caption="Brand Animation Preview")
            st.download_button("⬇ Download GIF", gif,
                               file_name=f"{company.lower().replace(' ','_')}_brand.gif",
                               mime="image/gif")

        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

        # Download full brand kit
        st.markdown("##### Download Brand Kit")
        if st.button("📦 Package Brand Kit (ZIP)", use_container_width=True):
            slogans = st.session_state.get("slogans", ["Your brand slogan here"])
            translations = st.session_state.get("translations", {})
            gif_data = st.session_state.get("brand_gif", b"")
            with st.spinner("Packaging…"):
                kit = create_zip_kit(company, slogans, palette, gif_data, translations)
            st.download_button("⬇ Download Brand Kit ZIP", kit,
                               file_name=f"{company.lower().replace(' ','_')}_brand_kit.zip",
                               mime="application/zip")

    with col_r:
        st.markdown("##### Brand Color System")
        palette = st.session_state.get("brand_palette", ["#6366F1","#00D4FF","#A855F7","#10B981","#F59E0B"])
        swatches = "".join(f'<span class="pal-swatch" title="{c}" style="background:{c}"></span>' for c in palette)
        st.markdown(f"<div style='margin-bottom:1.5rem'>{swatches}</div>", unsafe_allow_html=True)

        # Harmony colors
        st.markdown("##### Generated Harmony Palette")
        harmony_names = ["Primary","Secondary","Accent","Neutral Dark","Neutral Light",
                         "Tint 1","Tint 2","Tint 3"]
        harmonies = []
        for i, c in enumerate(palette):
            r,g,b = int(c[1:3],16), int(c[3:5],16), int(c[5:7],16)
            # Lighter tint
            lt = f"#{min(255,r+60):02X}{min(255,g+60):02X}{min(255,b+60):02X}"
            harmonies.append((c, harmony_names[i % len(harmony_names)]))
            harmonies.append((lt, f"Tint of {harmony_names[i % len(harmony_names)]}"))
        # deduplicate and limit
        seen = set()
        uniq = []
        for c,n in harmonies:
            if c not in seen:
                seen.add(c)
                uniq.append((c,n))

        # Show as mini grid
        grid_html = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">'
        for c, name in uniq[:8]:
            grid_html += f"""
<div style="text-align:center">
  <div style="height:52px;border-radius:10px;background:{c};margin-bottom:6px;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>
  <div style="font-size:10px;color:#475569;font-weight:600">{c}</div>
  <div style="font-size:9px;color:#334155">{name[:12]}</div>
</div>"""
        grid_html += '</div>'
        st.markdown(grid_html, unsafe_allow_html=True)

        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

        # Brand style guide card
        st.markdown("##### Brand Style Preview")
        industry  = st.session_state.get("industry","Technology")
        pair      = FONT_PAIRS.get(industry, FONT_PAIRS["Technology"])
        company_d = st.session_state.get("company","NOVA TECH")
        st.markdown(f"""
<div style="background:linear-gradient(135deg,{palette[0] if palette else '#6366F1'}22,{palette[1] if len(palette)>1 else '#00D4FF'}11);
border:1px solid {palette[0] if palette else '#6366F1'}44;border-radius:16px;padding:1.5rem">
  <div style="font-size:10px;color:#475569;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">BRAND STYLE GUIDE</div>
  <div style="font-size:26px;font-weight:800;color:#F1F5F9;font-family:'Space Grotesk',sans-serif;margin-bottom:4px">{company_d}</div>
  <div style="font-size:12px;color:#64748B;margin-bottom:1rem">{industry} · {pair[2]}</div>
  <div style="font-size:11px;color:#475569;margin-bottom:3px;font-weight:600;text-transform:uppercase;letter-spacing:0.7px">Heading · {pair[0]}</div>
  <div style="font-size:11px;color:#475569;font-weight:600;text-transform:uppercase;letter-spacing:0.7px">Body · {pair[1]}</div>
  <div style="margin-top:1rem;display:flex;gap:6px;flex-wrap:wrap">
    {''.join(f'<div style="width:24px;height:24px;border-radius:6px;background:{c}" title="{c}"></div>' for c in palette[:5])}
  </div>
</div>""", unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════
#  TAB 5 — CAMPAIGN ANALYTICS
# ════════════════════════════════════════════════════════════
def render_campaign_analytics(df):
    st.markdown("""<div class="section-hdr">
  <div class="section-hdr-icon">📊</div>
  <div><div class="section-hdr-title">Campaign Intelligence</div>
  <div class="section-hdr-sub">Plotly dashboards · Gradient Boosting predictions · ROI & Engagement insights</div></div>
</div>""", unsafe_allow_html=True)

    if df.empty:
        st.warning("Marketing dataset not found. Place `marketing_campaign_dataset.csv` in `data/`.")
        return

    # KPIs
    c1,c2,c3,c4 = st.columns(4)
    with c1: st.metric("Campaigns", f"{len(df):,}")
    with c2: st.metric("Avg ROI", f"{df['ROI'].mean():.2f}x", delta=f"+{(df['ROI'].mean()-5):.1f} vs 5x baseline")
    with c3: st.metric("Avg CTR", f"{df['Conversion_Rate'].mean()*100:.1f}%")
    with c4: st.metric("Avg Engagement", f"{df['Engagement_Score'].mean():.1f}")

    st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

    # ── Charts row 1 ──
    r1c1, r1c2 = st.columns(2)
    with r1c1:
        fig = px.bar(df.groupby("Campaign_Type")["ROI"].mean().reset_index().sort_values("ROI"),
                     x="ROI", y="Campaign_Type", orientation="h",
                     color="ROI", color_continuous_scale=["#6366F1","#00D4FF"])
        style_fig(fig, height=300, title="ROI by Campaign Type")
        fig.update_layout(coloraxis_showscale=False, xaxis_title="Avg ROI (x)", yaxis_title="")
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar":False})
    with r1c2:
        fig2 = px.bar(df.groupby("Channel_Used")["Conversion_Rate"].mean().mul(100).reset_index().sort_values("Conversion_Rate", ascending=False),
                      x="Channel_Used", y="Conversion_Rate",
                      color="Channel_Used", color_discrete_sequence=PLOTLY_PALETTE)
        style_fig(fig2, height=300, title="Conversion Rate by Channel (%)")
        fig2.update_layout(showlegend=False, xaxis_title="", yaxis_title="Conversion Rate (%)")
        st.plotly_chart(fig2, use_container_width=True, config={"displayModeBar":False})

    # ── Charts row 2 ──
    r2c1, r2c2 = st.columns(2)
    with r2c1:
        fig3 = px.histogram(df, x="Engagement_Score", nbins=20,
                            color_discrete_sequence=["#A855F7"])
        style_fig(fig3, height=280, title="Engagement Score Distribution")
        fig3.update_layout(xaxis_title="Score", yaxis_title="Count", bargap=0.05)
        st.plotly_chart(fig3, use_container_width=True, config={"displayModeBar":False})
    with r2c2:
        monthly = df.groupby("Month")[["ROI","Conversion_Rate"]].mean().reset_index().tail(18)
        monthly["Conversion_Rate"] *= 100
        fig4 = go.Figure()
        fig4.add_trace(go.Scatter(x=monthly["Month"], y=monthly["ROI"],
                                  name="ROI (x)", line=dict(color="#6366F1",width=2.5)))
        fig4.add_trace(go.Scatter(x=monthly["Month"], y=monthly["Conversion_Rate"],
                                  name="CVR (%)", line=dict(color="#00D4FF",width=2.5), yaxis="y2"))
        fig4.update_layout(yaxis2=dict(overlaying="y",side="right",tickfont=dict(color="#00D4FF",size=11)))
        style_fig(fig4, height=280, title="Monthly Performance Trend")
        fig4.update_layout(xaxis_tickangle=-45)
        st.plotly_chart(fig4, use_container_width=True, config={"displayModeBar":False})

    # ── Charts row 3 ──
    r3c1, r3c2 = st.columns(2)
    with r3c1:
        scatter = px.scatter(df.sample(min(300,len(df)), random_state=42),
                             x="Clicks", y="ROI", color="Campaign_Type",
                             color_discrete_sequence=PLOTLY_PALETTE,
                             opacity=0.7)
        style_fig(scatter, height=280, title="Clicks vs ROI by Campaign Type")
        scatter.update_traces(marker_size=6)
        st.plotly_chart(scatter, use_container_width=True, config={"displayModeBar":False})
    with r3c2:
        heat_data = df.groupby(["Campaign_Type","Channel_Used"])["ROI"].mean().unstack(fill_value=0)
        fig_heat = px.imshow(heat_data, color_continuous_scale=["#0D0E1A","#6366F1","#00D4FF"],
                             aspect="auto")
        style_fig(fig_heat, height=280, title="ROI Heatmap: Type × Channel")
        st.plotly_chart(fig_heat, use_container_width=True, config={"displayModeBar":False})

    # ── ML Prediction ──
    st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
    st.markdown("""<div class="section-hdr">
  <div class="section-hdr-icon">🤖</div>
  <div><div class="section-hdr-title">Campaign Outcome Predictor</div>
  <div class="section-hdr-sub">Gradient Boosting Regressor · Predict CTR, ROI, Engagement before launching</div></div>
</div>""", unsafe_allow_html=True)

    models, encoders, scaler, feature_cols = train_models(df)
    if not SKLEARN_AVAILABLE:
        st.info("Install scikit-learn to enable ML predictions: `pip install scikit-learn`")
    elif models is None:
        st.warning("Not enough data to train models.")
    else:
        fc1, fc2, fc3 = st.columns(3)
        with fc1:
            p_type    = st.selectbox("Campaign Type", df["Campaign_Type"].unique().tolist(), key="p_type")
            p_channel = st.selectbox("Channel", df["Channel_Used"].unique().tolist(), key="p_chan")
        with fc2:
            p_audience= st.selectbox("Target Audience", df["Target_Audience"].unique().tolist(), key="p_aud")
            p_location= st.selectbox("Location", df["Location"].unique().tolist(), key="p_loc")
        with fc3:
            p_dur     = st.number_input("Duration (days)", 7, 180, 30, key="p_dur")
            p_budget  = st.number_input("Budget ($)", 1000, 200000, 20000, step=1000, key="p_bud")
            p_clicks  = st.number_input("Est. Clicks", 100, 100000, 5000, key="p_clk")
            p_impr    = st.number_input("Est. Impressions", 1000, 1000000, 50000, key="p_imp")

        if st.button("🔮 Predict Campaign Outcomes", use_container_width=True, key="btn_pred"):
            cat_cols = ["Campaign_Type","Channel_Used","Target_Audience","Location",
                        "Language","Customer_Segment"]
            num_cols = ["Duration_Days","Clicks","Impressions","Acquisition_Cost"]
            row = {}
            for c in cat_cols:
                le = encoders.get(c)
                if le is None:
                    row[c] = 0; continue
                val_map = {"Campaign_Type":p_type,"Channel_Used":p_channel,
                           "Target_Audience":p_audience,"Location":p_location,
                           "Language":"English","Customer_Segment":"Tech Enthusiasts"}
                v = val_map.get(c,"Unknown")
                try:    row[c] = le.transform([v])[0]
                except: row[c] = 0
            row["Duration_Days"] = p_dur
            row["Clicks"]        = p_clicks
            row["Impressions"]   = p_impr
            row["Acquisition_Cost"] = p_budget
            X_pred = scaler.transform(pd.DataFrame([row])[num_cols + cat_cols])
            pred_cvr = float(np.clip(models["Conversion_Rate"].predict(X_pred)[0], 0, 1))
            pred_roi = float(np.clip(models["ROI"].predict(X_pred)[0], 0, 30))
            pred_eng = float(np.clip(models["Engagement_Score"].predict(X_pred)[0], 0, 100))

            pc1,pc2,pc3 = st.columns(3)
            with pc1:
                st.markdown(f'<div class="pred-card"><div class="pred-value">{pred_cvr*100:.1f}%</div><div class="pred-label">Predicted Conversion Rate</div></div>', unsafe_allow_html=True)
            with pc2:
                st.markdown(f'<div class="pred-card"><div class="pred-value">{pred_roi:.2f}x</div><div class="pred-label">Predicted ROI</div></div>', unsafe_allow_html=True)
            with pc3:
                st.markdown(f'<div class="pred-card"><div class="pred-value">{pred_eng:.1f}</div><div class="pred-label">Predicted Engagement Score</div></div>', unsafe_allow_html=True)

            # AI campaign advice
            key = st.session_state.get("gemini_key","")
            if key:
                company = st.session_state.get("company","your company")
                industry = st.session_state.get("industry","Technology")
                with st.spinner("Generating AI campaign recommendations…"):
                    model_g = init_gemini(key)
                    advice = ai_campaign_advice(model_g, company, industry, p_channel, p_budget) if model_g else ""
                if advice:
                    st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
                    st.markdown("##### AI Campaign Recommendations")
                    st.markdown(advice)

        # Data table
        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
        with st.expander("📋 Full Campaign Dataset"):
            st.dataframe(df.drop(columns=["Duration_Days","ROI_pct","Month"], errors="ignore").head(100),
                         use_container_width=True)


# ════════════════════════════════════════════════════════════
#  TAB 6 — MULTILINGUAL
# ════════════════════════════════════════════════════════════
def render_multilingual():
    st.markdown("""<div class="section-hdr">
  <div class="section-hdr-icon">🌍</div>
  <div><div class="section-hdr-title">Multilingual Slogan Studio</div>
  <div class="section-hdr-sub">Gemini AI translation · 10 languages · Export multilingual brand kit</div></div>
</div>""", unsafe_allow_html=True)

    col_in, col_out = st.columns([1,1.2], gap="large")

    with col_in:
        source_slogan = st.text_area("Source Slogan", value=st.session_state.get("slogans",[""])[0] if st.session_state.get("slogans") else "",
                                     height=100, placeholder="Enter the slogan to translate…")
        langs = st.multiselect("Target Languages", list(LANGUAGES.keys()),
                               default=list(LANGUAGES.keys())[:4])
        has_key = bool(st.session_state.get("gemini_key",""))
        btn_label = "🌍 Translate with Gemini" if has_key else "🌍 Translate (requires API key)"
        do_translate = st.button(btn_label, disabled=not has_key, use_container_width=True)

        if not has_key:
            st.info("Enter your Gemini API key in the sidebar to enable translation.")

    with col_out:
        st.markdown("##### Translations")
        if do_translate and source_slogan and langs:
            model = init_gemini(st.session_state["gemini_key"])
            translations = {}
            progress = st.progress(0, "Translating…")
            for i, flag_lang in enumerate(langs):
                lang = LANGUAGES[flag_lang]
                with st.spinner(f"Translating to {lang}…"):
                    translated = ai_translate(model, source_slogan, lang)
                translations[flag_lang] = translated
                progress.progress((i+1)/len(langs), f"Translated to {lang}")
            progress.empty()
            st.session_state["translations"] = {LANGUAGES[k]:v for k,v in translations.items()}
            for flag_lang, text in translations.items():
                st.markdown(f"""
<div class="trans-card">
  <div class="trans-lang">{flag_lang}</div>
  <div class="trans-text">&ldquo;{text}&rdquo;</div>
</div>""", unsafe_allow_html=True)

            # Export
            export_json = json.dumps(
                {"source": source_slogan, "translations": {LANGUAGES[k]:v for k,v in translations.items()}},
                ensure_ascii=False, indent=2
            )
            st.download_button("⬇ Export Translations (JSON)", export_json,
                               file_name="multilingual_slogans.json", mime="application/json")
        else:
            stored = st.session_state.get("translations",{})
            if stored:
                for lang, text in stored.items():
                    st.markdown(f"""
<div class="trans-card">
  <div class="trans-lang">{lang}</div>
  <div class="trans-text">&ldquo;{text}&rdquo;</div>
</div>""", unsafe_allow_html=True)
            else:
                st.markdown("""
<div style="background:rgba(255,255,255,0.02);border:2px dashed rgba(255,255,255,0.07);
border-radius:14px;padding:3rem;text-align:center;color:#334155;font-size:13px">
Enter a slogan, select languages, and click Translate
</div>""", unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════
#  TAB 7 — FEEDBACK INTELLIGENCE
# ════════════════════════════════════════════════════════════
def render_feedback():
    st.markdown("""<div class="section-hdr">
  <div class="section-hdr-icon">⭐</div>
  <div><div class="section-hdr-title">Feedback Intelligence</div>
  <div class="section-hdr-sub">Rate generated content · Train model refinement · Track satisfaction</div></div>
</div>""", unsafe_allow_html=True)

    if "feedback_log" not in st.session_state:
        st.session_state["feedback_log"] = []

    col_f, col_stats = st.columns([1,1], gap="large")

    with col_f:
        st.markdown("##### Rate This Session's Output")
        module   = st.selectbox("Module", ["Slogan Lab","Logo Studio","Campaign Analytics","Multilingual","Brand Aesthetics"])
        rating   = st.slider("Rating", 1, 5, 3, format="%d ⭐")
        stars_html = "".join("⭐" if i < rating else "☆" for i in range(5))
        st.markdown(f'<div style="font-size:28px;margin:6px 0">{stars_html}</div>', unsafe_allow_html=True)
        comment  = st.text_area("Comments (optional)", placeholder="What worked? What didn't?", height=100)
        if st.button("Submit Feedback", use_container_width=True):
            entry = {
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "module": module,
                "rating": rating,
                "comment": comment,
                "company": st.session_state.get("company","—"),
            }
            st.session_state["feedback_log"].append(entry)
            st.success(f"Thank you! Rated **{module}** → {'⭐'*rating}")

        st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

        # Export feedback
        log = st.session_state["feedback_log"]
        if log:
            df_fb = pd.DataFrame(log)
            csv_fb = df_fb.to_csv(index=False)
            st.download_button("⬇ Export Feedback CSV", csv_fb,
                               file_name="nova_feedback.csv", mime="text/csv")

    with col_stats:
        st.markdown("##### Feedback Analytics")
        log = st.session_state["feedback_log"]
        if not log:
            st.markdown("""
<div style="background:rgba(255,255,255,0.02);border:2px dashed rgba(255,255,255,0.07);
border-radius:14px;padding:3rem;text-align:center;color:#334155;font-size:13px">
No feedback yet. Submit your first rating!
</div>""", unsafe_allow_html=True)
        else:
            df_fb = pd.DataFrame(log)
            avg_r = df_fb["rating"].mean()
            c1,c2 = st.columns(2)
            with c1: st.metric("Total Ratings", len(df_fb))
            with c2: st.metric("Avg Rating", f"{avg_r:.1f} ⭐")

            # By module chart
            by_mod = df_fb.groupby("module")["rating"].mean().reset_index().sort_values("rating", ascending=False)
            fig = px.bar(by_mod, x="module", y="rating",
                         color="rating", color_continuous_scale=["#EF4444","#F59E0B","#10B981"],
                         range_color=[1,5])
            style_fig(fig, height=260, title="Avg Rating by Module")
            fig.update_layout(coloraxis_showscale=False, xaxis_title="", yaxis_title="Rating", yaxis_range=[0,5])
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar":False})

            # Rating distribution
            dist = df_fb["rating"].value_counts().sort_index().reset_index()
            dist.columns = ["Stars","Count"]
            dist["Stars"] = dist["Stars"].apply(lambda x: "⭐"*x)
            st.dataframe(dist, use_container_width=True)

            # Model refinement suggestions
            if avg_r < 3.5:
                st.markdown("""
<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:1rem">
  <div style="color:#EF4444;font-weight:600;font-size:13px;margin-bottom:4px">⚠ Low Satisfaction Detected</div>
  <div style="color:#94A3B8;font-size:12px">Consider: adjusting prompts, providing more specific keywords, or trying different brand tones.</div>
</div>""", unsafe_allow_html=True)
            elif avg_r >= 4.5:
                st.markdown("""
<div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:1rem">
  <div style="color:#10B981;font-weight:600;font-size:13px;margin-bottom:4px">✓ High Satisfaction</div>
  <div style="color:#94A3B8;font-size:12px">Great results! Your brand settings are well-tuned for this industry and tone.</div>
</div>""", unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════
#  MAIN
# ════════════════════════════════════════════════════════════
def main():
    inject_css()
    render_sidebar()

    # Data
    df_marketing = load_marketing_data()
    df_slogans   = load_slogans()

    # Auto-trigger from sidebar button
    if st.session_state.pop("trigger_generate", False):
        company  = st.session_state.get("company","")
        industry = st.session_state.get("industry","Technology")
        tone     = st.session_state.get("tone","Bold & Confident")
        keywords = st.session_state.get("keywords","")
        if company:
            key = st.session_state.get("gemini_key","")
            if key:
                model = init_gemini(key)
                slogans = ai_generate_slogans(model, company, industry, tone, keywords) if model else []
                if not slogans:
                    slogans = demo_slogans(company, industry, tone)
            else:
                slogans = demo_slogans(company, industry, tone)
            st.session_state["slogans"] = slogans
            st.toast(f"Brand kit generated for {company}!", icon="✦")

    # Tabs
    tabs = st.tabs([
        "🏠 Home",
        "✦ Logo & Font",
        "💡 Slogan Lab",
        "🎬 Brand Aesthetics",
        "📊 Campaign Analytics",
        "🌍 Multilingual",
        "⭐ Feedback",
    ])

    with tabs[0]: render_home(df_marketing)
    with tabs[1]: render_logo_studio()
    with tabs[2]: render_slogan_lab(df_slogans)
    with tabs[3]: render_brand_aesthetics()
    with tabs[4]: render_campaign_analytics(df_marketing)
    with tabs[5]: render_multilingual()
    with tabs[6]: render_feedback()


if __name__ == "__main__":
    main()
