import { useEffect, useMemo, useRef, useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, Tooltip,
} from 'recharts';
import './App.css';

/* ─── Data ─────────────────────────────────────────────────── */
const METRICS = [
  { key: 'movement',   label: 'Movement',   icon: '⚡', score: 82, color: '#00e5ff' },
  { key: 'positioning',label: 'Positioning',icon: '🎯', score: 91, color: '#a78bfa' },
  { key: 'rotation',   label: 'Rotation',   icon: '🔄', score: 76, color: '#34d399' },
  { key: 'teamfight',  label: 'Team Fight', icon: '⚔️', score: 68, color: '#f59e0b' },
  { key: 'objective',  label: 'Objective',  icon: '🏆', score: 88, color: '#f0b429' },
  { key: 'survival',   label: 'Survival',   icon: '🛡️', score: 73, color: '#60a5fa' },
];

const RADAR_DATA = METRICS.map(m => ({ subject: m.label, value: m.score, fullMark: 100 }));

const OVERALL_SCORE = Math.round(METRICS.reduce((s, m) => s + m.score, 0) / METRICS.length);

function getGrade(score) {
  if (score >= 95) return { letter: 'SSS', color: '#ffd700' };
  if (score >= 90) return { letter: 'SS',  color: '#ffd700' };
  if (score >= 82) return { letter: 'S',   color: '#f0b429' };
  if (score >= 72) return { letter: 'A',   color: '#a78bfa' };
  if (score >= 60) return { letter: 'B',   color: '#60a5fa' };
  return              { letter: 'C',   color: '#94a3b8' };
}

const GRADE = getGrade(OVERALL_SCORE);

function genSparkline(base) {
  return Array.from({ length: 12 }, (_, i) => ({
    t: i,
    v: Math.max(10, Math.min(100, base + (Math.sin(i * 0.8 + base * 0.05) * 14) + (Math.random() * 8 - 4))),
  }));
}

const iconStyle = (color) => ({
  background: `${color}18`,
  color,
  border: `1px solid ${color}30`,
});

const barStyle = (color, score) => ({
  width: `${score}%`,
  background: `linear-gradient(90deg, ${color}99, ${color})`,
  boxShadow: `0 0 6px ${color}55`,
});

const HEATMAP = Array.from({ length: 60 }, () => Math.random());

const CATEGORY_PREVIEW = ['Movement', 'Positioning', 'Rotation', 'Farming', 'Teamfight', 'Objective'];

function TopNav() {
  return (
    <nav className="top-nav">
      <div className="nav-logo">
        <div className="nav-logo-icon">
          <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="9,2 16,6 16,12 9,16 2,12 2,6" fill="none" stroke="white" strokeWidth="1.2" />
            <polygon points="9,5 13,7.5 13,11.5 9,14 5,11.5 5,7.5" fill="rgba(0,229,255,0.35)" stroke="rgba(0,229,255,0.9)" strokeWidth="0.8" />
            <circle cx="9" cy="9" r="1.8" fill="white" />
          </svg>
        </div>
        <div>
          <div className="nav-logo-text">HOK ANALYZER</div>
          <div className="nav-logo-sub">AI GAMEPLAY INTELLIGENCE</div>
        </div>
      </div>

      <div className="nav-divider" />

      <div className="nav-player">
        <div className="nav-avatar">ZX</div>
        <div className="nav-player-info">
          <div className="nav-player-name">ZephyrX</div>
          <div className="nav-player-role">◆ MIDLANE</div>
        </div>
      </div>

      <div className="nav-divider" />

      <div className="nav-tags">
        <div className="nav-tag active">
          <div className="nav-tag-dot" />
          RANKED MODE
        </div>
        <div className="nav-tag">20 MATCHES</div>
        <div className="nav-tag">WIN RATE 58%</div>
        <div className="nav-tag">SESSION #04</div>
      </div>

      <div className="nav-right">
        <div className="nav-session">
          ANALYSIS ACTIVE &nbsp;·&nbsp;
          <span>CV ENGINE v2.4</span>
          &nbsp;·&nbsp;
          <span>28 AUG 2026</span>
        </div>
      </div>
    </nav>
  );
}

function LeftPanel() {
  const grade = GRADE;
  return (
    <div className="left-panel">
      <div className="glass glass-glow grade-widget" style={{ borderRadius: '10px' }}>
        <div className="grade-score-block">
          <div className="grade-label">OVERALL SCORE</div>
          <div className="grade-score">{OVERALL_SCORE}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
            TOP 24% MIDLANERS
          </div>
        </div>
        <div className="grade-letter-block">
          <div className="grade-letter" style={{ color: grade.color, textShadow: `0 0 20px ${grade.color}99` }}>
            {grade.letter}
          </div>
          <div className="grade-sub">RANK</div>
        </div>
      </div>

      <div className="glass glass-glow" style={{ borderRadius: '10px', padding: '12px 10px', flex: 1 }}>
        <div className="panel-header">
          <div className="panel-title">PERFORMANCE <span className="panel-title-accent">OVERVIEW</span></div>
          <div className="panel-badge">6 METRICS</div>
        </div>
        <div className="stats-list">
          {METRICS.map(m => (
            <div key={m.key} className="stat-row fade-in-up">
              <div className="stat-row-icon" style={iconStyle(m.color)}>
                <span style={{ fontSize: '9px' }}>{m.icon}</span>
              </div>
              <div className="stat-row-label">{m.label}</div>
              <div className="stat-row-bar-wrap">
                <div className="stat-row-bar" style={barStyle(m.color, m.score)} />
              </div>
              <div className="stat-row-value" style={{ color: m.color }}>{m.score}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass glass-glow mini-heatmap" style={{ borderRadius: '10px' }}>
        <div style={{ position: 'absolute', top: '6px', left: '10px', fontFamily: 'var(--font-hud)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Positioning Map
        </div>
        <div className="mini-heatmap-grid" style={{ paddingTop: '20px' }}>
          {HEATMAP.map((v, i) => (
            <div key={i} className="hm-cell" style={{
              background: v > 0.75
                ? `rgba(0,229,255,${v * 0.8})`
                : v > 0.5
                ? `rgba(124,58,237,${v * 0.6})`
                : `rgba(255,255,255,${v * 0.06})`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RadarDot({ cx, cy, color }) {
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="rgba(0,229,255,0.4)" strokeWidth={1.5} />;
}

function CenterPanel() {
  return (
    <div className="center-panel">
      <div className="glass glass-glow radar-container">
        <div className="radar-title-row">
          <div className="radar-title">PERFORMANCE RADAR</div>
          <div className="radar-overall">
            <div className="radar-overall-num">{OVERALL_SCORE}</div>
            <div className="radar-overall-max">/100</div>
          </div>
        </div>
        <div className="radar-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_DATA} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid
                gridType="polygon"
                stroke="rgba(100,100,200,0.15)"
                strokeDasharray="2 4"
              />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#8892b0', fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 600, letterSpacing: '0.06em' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
                tickCount={5}
              />
              <Radar
                name="baseline"
                dataKey={() => 100}
                stroke="rgba(100,100,200,0.06)"
                fill="rgba(100,100,200,0.04)"
                fillOpacity={1}
                dot={false}
                isAnimationActive={false}
              />
              <Radar
                name="score"
                dataKey="value"
                stroke="#00e5ff"
                strokeWidth={2}
                fill="rgba(0,229,255,0.15)"
                fillOpacity={1}
                dot={<RadarDot color="#00e5ff" />}
                activeDot={{ r: 6, fill: '#00e5ff', stroke: 'rgba(0,229,255,0.5)', strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10,10,30,0.9)',
                  border: '1px solid rgba(0,229,255,0.3)',
                  borderRadius: '8px',
                  fontFamily: 'Rajdhani',
                  fontSize: '12px',
                  color: '#e8eaf6',
                }}
                formatter={(v) => [`${v}`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
          {METRICS.map(m => (
            <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                {m.label} <span style={{ color: m.color }}>{m.score}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <div className="right-panel">
      <div className="glass glass-glow" style={{ borderRadius: '10px', padding: '12px 10px', flex: '0 0 auto' }}>
        <div className="panel-header">
          <div className="panel-title">GAMEPLAY <span className="panel-title-accent">INSIGHTS</span></div>
          <div className="panel-badge">AI</div>
        </div>

        <div className="insight-section" style={{ marginBottom: '10px' }}>
          <div className="insight-section-title" style={{ color: '#22d3ee' }}>
            <div className="insight-dot" style={{ background: '#22d3ee' }} />
            STRENGTHS
          </div>
          {[
            'Excellent lane positioning. Consistently holds safe ground with strong map awareness.',
            'High objective participation rate — present in 88% of major objective contests.',
          ].map((t, i) => (
            <div key={i} className="insight-item strength">{t}</div>
          ))}
        </div>

        <div className="insight-section" style={{ marginBottom: '10px' }}>
          <div className="insight-section-title" style={{ color: '#f87171' }}>
            <div className="insight-dot" style={{ background: '#f87171' }} />
            WEAKNESSES
          </div>
          {[
            'Team fight coordination is below threshold. Initiation timing is 0.4s late on average.',
            'Rotation speed to dragon significantly slower than top 25% peer group.',
          ].map((t, i) => (
            <div key={i} className="insight-item weakness">{t}</div>
          ))}
        </div>

        <div className="insight-section" style={{ marginBottom: '10px' }}>
          <div className="insight-section-title" style={{ color: 'var(--gold)' }}>
            <div className="insight-dot" style={{ background: 'var(--gold)' }} />
            AREAS TO IMPROVE
          </div>
          {[
            'Rotation efficiency: reduce post-kill loitering by ~3.2s.',
            'Survival rate drops in late-game 5v5 skirmishes — review positioning priority.',
          ].map((t, i) => (
            <div key={i} className="insight-item improve">{t}</div>
          ))}
        </div>
      </div>

      <div className="glass glass-glow ai-rec-card">
        <div className="ai-rec-header">
          <svg viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#a78bfa" strokeWidth="1.2" />
            <path d="M4 6l1.5 1.5L8 4" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          AI RECOMMENDATION
        </div>
        <div className="ai-rec-text">
          Based on 20 analyzed matches, your midlane impact is <strong>above average</strong> but team fight contribution is the critical bottleneck.
          <br /><br />
          Priority focus: <strong>map rotation timing</strong> — specifically the 5–8 minute window where dragon contests most commonly occur.
          Coordinate skill rotations before engaging to compensate for the observed 0.4s initiation delay.
          <br /><br />
          <strong>Projected improvement</strong> if addressed: +6–9 pts overall score within 10 sessions.
        </div>
      </div>

      <div className="glass glass-glow" style={{ borderRadius: '10px', padding: '10px', flex: '0 0 auto' }}>
        <div className="panel-title" style={{ marginBottom: '8px' }}>
          MOVEMENT <span style={{ color: 'var(--cyan)' }}>TRAJECTORY</span>
        </div>
        <TrajectoryViz />
      </div>
    </div>
  );
}

// ─── Trajectory Visualization ──────────────────────────────
function TrajectoryViz() {
  const pts = useMemo(() => {
    const points = [];
    let x = 0.22;
    let y = 0.52;

    for (let i = 0; i < 40; i++) {
      const driftX = Math.sin((i + 1) * 0.9) * 0.08 + ((i % 4) - 1.5) * 0.015;
      const driftY = Math.cos((i + 1) * 1.1) * 0.09 + ((i % 5) - 2) * 0.012;

      x = Math.max(0.05, Math.min(0.95, x + driftX * 0.45));
      y = Math.max(0.05, Math.min(0.95, y + driftY * 0.45));
      points.push({ x, y });
    }

    return points;
  }, []);

  const w = 240, h = 70;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ borderRadius: '6px', background: 'rgba(0,0,0,0.2)' }}>
      {[0.25, 0.5, 0.75].map(t => (
        <g key={t}>
          <line x1={t * w} y1={0} x2={t * w} y2={h} stroke="rgba(100,100,200,0.1)" strokeWidth="0.5" />
          <line x1={0} y1={t * h} x2={w} y2={t * h} stroke="rgba(100,100,200,0.1)" strokeWidth="0.5" />
        </g>
      ))}
      <polyline
        points={pts.map(p => `${p.x * w},${p.y * h}`).join(' ')}
        fill="none"
        stroke="rgba(0,229,255,0.5)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={pts.map(p => `${p.x * w},${p.y * h}`).join(' ')}
        fill="none"
        stroke="rgba(0,229,255,0.15)"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.filter((_, i) => i % 8 === 0).map((p, i) => (
        <circle key={i} cx={p.x * w} cy={p.y * h} r="2.5" fill="#00e5ff" opacity="0.8" />
      ))}
      <circle cx={pts[0].x * w} cy={pts[0].y * h} r="3.5" fill="#22d3ee" stroke="white" strokeWidth="1" />
      <circle cx={pts[pts.length-1].x * w} cy={pts[pts.length-1].y * h} r="3.5" fill="var(--gold)" stroke="white" strokeWidth="1" />
    </svg>
  );
}

function StatCard({ metric, sparkData }) {
  const trend = sparkData[sparkData.length - 1].v - sparkData[sparkData.length - 4].v;
  const trendClass = trend > 2 ? 'trend-up' : trend < -2 ? 'trend-down' : 'trend-flat';
  const trendLabel = trend > 2 ? `▲ +${trend.toFixed(1)}` : trend < -2 ? `▼ ${trend.toFixed(1)}` : '─ stable';

  return (
    <div className="stat-card glass glass-glow fade-in-up" style={{ paddingBottom: '50px' }}>
      <div className="stat-card-top">
        <div className="stat-card-name">
          <span className="stat-card-icon">{metric.icon}</span>
          {metric.label}
        </div>
        <div className={`stat-card-trend ${trendClass}`}>{trendLabel}</div>
      </div>
      <div className="stat-card-score" style={{ color: metric.color }}>{metric.score}</div>

      <div className="stat-card-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={metric.color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BottomTimeline() {
  const sparklines = useMemo(() => METRICS.map(m => genSparkline(m.score)), []);

  return (
    <div className="bottom-timeline" style={{ position: 'relative' }}>
      <div className="timeline-label-row">STATS TIMELINE</div>
      {METRICS.map((m, i) => (
        <StatCard key={m.key} metric={m} sparkData={sparklines[i]} />
      ))}
    </div>
  );
}

function AnalysisResultPage() {
  return (
    <div className="app-shell">
      <TopNav />
      <div className="main-content">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
      <BottomTimeline />
    </div>
  );
}

function UploadState({ onChooseVideo }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="upload-shell">
      <div className="upload-shell-glow" />
      <div className="upload-panel glass glass-glow">
        <div className="upload-header-row">
          <div className="upload-badge">HOK ANALYZER</div>
          <div className="upload-status">READY FOR UPLOAD</div>
        </div>

        <div className="upload-copy">
          <h1>Analyze Your Gameplay</h1>
          <p>Upload your Honor of Kings gameplay recording and get an AI-powered performance analysis.</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".mp4,.mov,.avi,video/mp4,video/quicktime,video/x-msvideo"
          className="upload-input-hidden"
          onChange={onChooseVideo}
        />

        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openPicker();
            }
          }}
        >
          <div className="upload-icon-wrap">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M18 42.5V21.5C18 18.46 20.46 16 23.5 16H40.42L46 21.58V42.5C46 45.54 43.54 48 40.5 48H23.5C20.46 48 18 45.54 18 42.5Z" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
              <path d="M40 16V22H46" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
              <path d="M28 29.5L38 34L28 38.5V29.5Z" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <div className="upload-text-main">Drop your gameplay video here</div>
          <div className="upload-text-sub">or click to browse files</div>
          <div className="upload-format">Supported formats: MP4, MOV, AVI</div>
          <button
            type="button"
            className="upload-button"
            onClick={(event) => {
              event.stopPropagation();
              openPicker();
            }}
          >
            Choose Video
          </button>
        </div>

        <div className="category-preview">
          <div className="category-preview-label">Analysis Categories</div>
          <div className="category-preview-list">
            {CATEGORY_PREVIEW.map((item) => (
              <div key={item} className="category-chip">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gameplay Analysis Simulation ──────────────────────────────
const ANALYSIS_STEPS = [
  'Analyzing Player Movement...',
  'Detecting hero position...',
  'Analyzing positioning...',
  'Tracking rotation and pathing...',
  'Reviewing farming efficiency...',
  'Finalizing match insights...'
];

function formatTimestamp(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function GameplayAnalysisPage({ videoUrl, onAnalysisComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setProgress((previous) => {
        const next = Math.min(100, previous + 1.25);
        setCurrentTime((time) => Math.min(42, time + 0.5));
        return next;
      });
    }, 120);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (progress >= 100) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      onAnalysisComplete();
    }
  }, [progress, onAnalysisComplete]);

  const handleVideoToggle = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      return;
    }

    videoRef.current.pause();
    setIsPlaying(false);
  };

  const heroX = 30 + Math.sin(progress / 18) * 22;
  const heroY = 42 + Math.cos(progress / 16) * 18;
  const trajectory = Array.from({ length: 18 }, (_, index) => {
    const x = 18 + (index / 17) * 58 + Math.sin(index * 0.9 + progress / 16) * 6;
    const y = 52 + Math.cos(index * 1.15 + progress / 18) * 16;
    return `${x},${y}`;
  }).join(' ');

  const currentStatus = ANALYSIS_STEPS[Math.min(ANALYSIS_STEPS.length - 1, Math.floor(progress / 20))];

  return (
    <div className="analysis-page-shell">
      <div className="analysis-header-bar">
        <div className="analysis-header-label">GAMEPLAY ANALYSIS</div>
        <div className="analysis-header-meta">{formatTimestamp(currentTime)} / 00:42</div>
      </div>

      <div className="analysis-stage">
        <div className="analysis-video-panel">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              loop
              className="analysis-video"
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="analysis-video-placeholder">
              <div className="analysis-video-placeholder-inner" />
            </div>
          )}

          <button type="button" className="video-toggle-button" onClick={handleVideoToggle}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div className="tracking-overlay" aria-label="AI hero tracking overlay">
            <div
              className="tracking-box"
              style={{ left: `${heroX}%`, top: `${heroY}%` }}
            >
              <span className="tracking-pill">PLAYER</span>
            </div>
            <div className="tracking-dot" style={{ left: `${heroX + 4}%`, top: `${heroY + 3}%` }} />
            <svg className="tracking-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={trajectory} />
            </svg>
          </div>

          <div className="video-hud">
            <span>LIVE TRACKING</span>
            <strong>{formatTimestamp(currentTime)}</strong>
          </div>
        </div>

        <div className="analysis-sidebar-panel glass glass-glow">
          <div className="analysis-sidebar-header">
            <span>ANALYSIS PROGRESS</span>
            <strong>{Math.round(progress)}%</strong>
          </div>

          <div className="analysis-progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="analysis-status-box">
            <div className="analysis-status-label">Current status</div>
            <div className="analysis-status-text">{currentStatus}</div>
          </div>

          <div className="analysis-step-list">
            {ANALYSIS_STEPS.map((step, index) => (
              <div
                key={step}
                className={`analysis-step-item ${index <= Math.floor(progress / 20) ? 'active' : ''}`}
              >
                <span className="analysis-step-dot" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analysis-results-scroll">
        {progress >= 100 && <AnalysisResultPage />}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('upload');
  const [videoUrl, setVideoUrl] = useState('');

  const handleVideoSelected = (event) => {
    const file = event.target.files?.[0];
    const nextUrl = file ? URL.createObjectURL(file) : '';
    setVideoUrl(nextUrl);
    setScreen('analysis');
  };

  if (screen === 'upload') return <UploadState onChooseVideo={handleVideoSelected} />;

  return <GameplayAnalysisPage videoUrl={videoUrl} onAnalysisComplete={() => {}} />;
}
