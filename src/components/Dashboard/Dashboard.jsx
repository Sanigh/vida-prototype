import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { DOMAINS, SCORE_THRESHOLDS, getScoreLevel } from '../../data/questions'

// ─── helpers ──────────────────────────────────────────────────────────────────

const f = (n) => n.toFixed(2)

const ICONS = {
  physical:   '🏃',
  mental:     '🧘',
  sleep:      '🌙',
  motherhood: '🤱',
}

// Convert degrees (0 = 12-o'clock, clockwise) → SVG {x,y}
function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) }
}

// Build an SVG arc path string
function arcPath(cx, cy, r, startDeg, sweepDeg) {
  const s = polar(cx, cy, r, startDeg)
  const e = polar(cx, cy, r, startDeg + sweepDeg)
  const large = sweepDeg > 180 ? 1 : 0
  return `M ${f(s.x)} ${f(s.y)} A ${f(r)} ${f(r)} 0 ${large} 1 ${f(e.x)} ${f(e.y)}`
}

// ─── Gauge dial ───────────────────────────────────────────────────────────────

function GaugeDial({ score, level, domainId, size = 108 }) {
  const cx = size / 2
  const cy = size / 2
  const r  = size * 0.36
  const sw = size * 0.093

  const START = 225   // 7:30 o'clock (lower-left)
  const SWEEP = 270   // total arc = 270°, gap = 90° at the bottom

  const pct      = score && level ? Math.max(0.04, (score - 5) / 15) : 0
  const fillSwp  = SWEEP * pct
  const color    = level ? SCORE_THRESHOLDS[level].color : null

  const trackPath = arcPath(cx, cy, r, START, SWEEP)
  const fillPath  = pct > 0.02 ? arcPath(cx, cy, r, START, fillSwp) : null

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        {/* background track */}
        <path d={trackPath} fill="none" stroke="#272442" strokeWidth={sw} strokeLinecap="round" />
        {/* score fill */}
        {fillPath && color && (
          <path d={fillPath} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        )}
      </svg>
      {/* icon centred over the SVG */}
      <div className="absolute inset-0 flex items-center justify-center"
           style={{ paddingTop: size * 0.08 }}>
        <span style={{ fontSize: size * 0.26, lineHeight: 1 }}>{ICONS[domainId]}</span>
      </div>
    </div>
  )
}

// ─── Domain card (one quarter of the 2×2 grid) ───────────────────────────────

function DomainCard({ domain, scoreData }) {
  const { dispatch } = useApp()
  const hasScore = !!scoreData
  const thr = hasScore ? SCORE_THRESHOLDS[scoreData.level] : null

  return (
    <button
      onClick={() =>
        hasScore
          ? dispatch({ type: 'VIEW_INSIGHTS', payload: { domain: domain.id, ...scoreData } })
          : dispatch({ type: 'START_QUESTIONNAIRE', payload: domain.id })
      }
      className="dark:bg-[#1B1830] bg-slate-100/80 rounded-[20px] p-3 text-left w-full transition-all active:scale-[0.97]"
    >
      {/* header */}
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[13px] font-semibold dark:text-white text-slate-800 leading-none">
          {domain.label}
        </span>
        <span className="text-base dark:text-slate-500 text-slate-400 leading-none">›</span>
      </div>
      <p className="text-[10px] dark:text-slate-500 text-slate-400 mb-2">Today</p>

      {/* gauge */}
      <div className="flex justify-center">
        <GaugeDial
          score={hasScore ? scoreData.score : null}
          level={hasScore ? scoreData.level : null}
          domainId={domain.id}
          size={108}
        />
      </div>

      {/* score label */}
      <p className="text-center text-[13px] font-semibold mt-1"
         style={{ color: thr?.color ?? 'transparent' }}>
        {hasScore ? thr.label : (
          <span className="dark:text-slate-600 text-slate-400 text-[11px] font-normal">
            Tap to start
          </span>
        )}
      </p>
    </button>
  )
}

// ─── Overall Recovery gradient banner ────────────────────────────────────────

const BANNER_GRADIENTS = {
  superb: 'linear-gradient(90deg,#3B2B72 0%,#7645C8 55%,#7AFF71 100%)',
  good:   'linear-gradient(90deg,#3B2B72 0%,#7645C8 55%,#1CBE72 100%)',
  fair:   'linear-gradient(90deg,#3B2B72 0%,#7645C8 55%,#F9F37E 100%)',
  poor:   'linear-gradient(90deg,#3B2B72 0%,#7645C8 55%,#FF9767 100%)',
}

function RecoveryBanner({ scores }) {
  const vals = Object.values(scores)

  if (!vals.length) {
    return (
      <div className="rounded-2xl mb-4 px-5 py-3 flex items-center justify-between"
           style={{ background: 'linear-gradient(90deg,#2A1F52 0%,#3B2B72 100%)' }}>
        <span className="text-sm font-semibold text-white/80">Overall Recovery</span>
        <span className="text-xs text-white/40">No check-ins yet</span>
      </div>
    )
  }

  const avg   = Math.round(vals.reduce((a, b) => a + b.score, 0) / vals.length)
  const level = getScoreLevel(avg)
  const label = SCORE_THRESHOLDS[level].label

  return (
    <div className="rounded-2xl mb-4 px-5 py-3 flex items-center justify-between"
         style={{ background: BANNER_GRADIENTS[level] }}>
      <span className="text-sm font-semibold text-white">Overall Recovery</span>
      <span className="text-sm font-bold text-white">{label}</span>
    </div>
  )
}

// ─── Insight card ─────────────────────────────────────────────────────────────

const INSIGHT_MSGS = {
  superb: "You're doing beautifully this week. Keep nurturing what's working for you.",
  good:   'Progress looks good! Every small step forward counts.',
  fair:   "Recovery has its waves. Be gentle with yourself — you're doing more than you know.",
  poor:   "This has been a tough week. Reaching out for support is a brave and important step.",
}

function InsightSection({ scores }) {
  const { dispatch } = useApp()
  const vals        = Object.values(scores)
  const firstKey    = Object.keys(scores)[0]
  const firstScore  = scores[firstKey]

  const msg = vals.length
    ? INSIGHT_MSGS[getScoreLevel(Math.round(vals.reduce((a, b) => a + b.score, 0) / vals.length))]
    : 'Complete your first check-in to receive personalised insights about your recovery.'

  return (
    <div className="mb-5">
      <h2 className="text-[15px] font-bold dark:text-white text-slate-800 mb-2.5">Insight</h2>
      <div className="dark:bg-[#1B1830] bg-white rounded-[20px] p-4 border dark:border-transparent border-slate-200/60">
        <p className="text-[13px] dark:text-slate-300 text-slate-700 leading-relaxed mb-4">{msg}</p>

        <div className="mb-4">
          <p className="text-[10px] dark:text-slate-500 text-slate-400 uppercase tracking-wider mb-1.5">
            Progress since last week
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[13px] dark:text-slate-400 text-slate-500">No data yet</p>
            <span className="text-[13px] dark:text-slate-600 text-slate-300">— —</span>
          </div>
        </div>

        <button
          onClick={() =>
            firstScore && dispatch({ type: 'VIEW_INSIGHTS', payload: { domain: firstKey, ...firstScore } })
          }
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full
                     border dark:border-[#3A3560] border-slate-200 dark:hover:bg-white/5 hover:bg-slate-50
                     transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-vida-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[9px] font-bold">V</span>
          </div>
          <span className="text-[13px] dark:text-slate-300 text-slate-600">
            Chat with Vida to learn more
          </span>
        </button>
      </div>
    </div>
  )
}

// ─── Suggested For You ────────────────────────────────────────────────────────

const CARDS = [
  {
    title: 'Breathe Through the Change',
    sub:   '5-minute',
    // warm skin-tone gradient to suggest a person photo
    bg: 'linear-gradient(160deg,#c9a57a 0%,#a07050 40%,#5a3820 100%)',
  },
  {
    title: 'Breathe Through the Change',
    sub:   '5-minute guided breath',
    bg: 'linear-gradient(160deg,#b89070 0%,#886040 40%,#503020 100%)',
  },
  {
    title: 'Gentle Morning Stretch',
    sub:   '10-minute',
    bg: 'linear-gradient(160deg,#7090b8 0%,#507090 40%,#304060 100%)',
  },
]

function SuggestedContent() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold dark:text-white text-slate-800">Suggested For You</h2>
        <button className="w-7 h-7 rounded-lg dark:bg-[#2A2648] bg-slate-200 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                  className="dark:stroke-slate-300 stroke-slate-500" />
          </svg>
        </button>
      </div>

      {/* horizontal scroll — negative margin trick so cards go edge-to-edge */}
      <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1"
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {CARDS.map((c, i) => (
          <button key={i}
            className="flex-shrink-0 w-[138px] h-[182px] rounded-[18px] overflow-hidden relative
                       transition-all active:scale-[0.97]"
            style={{ background: c.bg }}>
            {/* abstract silhouette */}
            <svg className="absolute inset-0 w-full h-full opacity-25"
                 viewBox="0 0 138 182" preserveAspectRatio="xMidYMax meet">
              <ellipse cx="69" cy="52" rx="16" ry="18" fill="white" />
              <path d="M52 76 Q57 128 69 150 Q81 128 86 76 Q76 69 69 67 Q62 69 52 76Z" fill="white" />
              <path d="M52 78 Q34 92 38 112 Q48 104 56 98" fill="white" />
              <path d="M86 78 Q104 92 100 112 Q90 104 82 98" fill="white" />
            </svg>
            {/* bottom overlay */}
            <div className="absolute inset-0"
                 style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.82) 45%,transparent 80%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
              <p className="text-[11px] font-semibold text-white leading-snug mb-0.5">{c.title}</p>
              <p className="text-[10px] text-white/55">{c.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Bottom navigation ────────────────────────────────────────────────────────

function BottomNav({ active, onChange }) {
  const tabs = [
    {
      key: 'summary',
      label: 'Summary',
      icon: (on) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
                stroke={on ? '#B99CFF' : '#6B7280'} strokeWidth="1.6" />
          <path d="M9 21V12h6v9" stroke={on ? '#B99CFF' : '#6B7280'} strokeWidth="1.6"
                strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'checkin',
      label: 'Check-in',
      icon: (on) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="2" width="14" height="18" rx="2"
                stroke={on ? '#B99CFF' : '#6B7280'} strokeWidth="1.6" />
          <path d="M9 7h6M9 11h6M9 15h3"
                stroke={on ? '#B99CFF' : '#6B7280'} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="17" cy="17" r="3.5" fill={on ? '#B99CFF' : '#6B7280'} />
          <path d="M15.7 17l.9.9 1.7-1.7"
                stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30
                    dark:bg-[#0A0814]/96 bg-white/96 backdrop-blur-md
                    border-t dark:border-[#2A2648]/60 border-slate-200">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto"
           style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {tabs.map(({ key, label, icon }) => (
          <button key={key} onClick={() => onChange(key)}
                  className="flex flex-col items-center gap-1 px-10 py-1 transition-all">
            {icon(active === key)}
            <span className={`text-[10px] font-medium transition-colors ${
              active === key ? 'text-vida-primary' : 'dark:text-slate-500 text-slate-400'
            }`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Settings dropdown ────────────────────────────────────────────────────────

function AvatarMenu() {
  const [open, setOpen] = useState(false)
  const { dispatch }    = useApp()

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-vida-primary to-purple-600
                         flex items-center justify-center shadow-md">
        <span className="text-white text-[11px] font-bold">V</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-44
                          dark:bg-[#1B1830] bg-white
                          border dark:border-[#2A2648] border-slate-200
                          rounded-2xl shadow-2xl p-1.5">
            <button onClick={() => { dispatch({ type: 'RESET_SCORES' }); setOpen(false) }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-[13px]
                               dark:text-slate-300 text-slate-600
                               hover:bg-vida-primary/10 transition-all">
              Reset weekly scores
            </button>
            <button onClick={() => { dispatch({ type: 'RESET_ALL' }); setOpen(false) }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-[13px]
                               text-red-400 hover:bg-red-400/10 transition-all">
              Reset everything
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Check-in tab ─────────────────────────────────────────────────────────────

function CheckInTab({ onTabChange }) {
  const { state, dispatch } = useApp()
  const { scores, theme }   = state

  return (
    <div className="min-h-screen dark:bg-[#0F0D1A] bg-[#F7F3FF] pb-28">
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold dark:text-white text-slate-800">Weekly Check-in</h1>
        <button
          onClick={() => dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' })}
          className="w-8 h-8 rounded-full dark:bg-[#2A2648] bg-slate-200 flex items-center justify-center text-sm"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <p className="px-5 text-[13px] dark:text-slate-400 text-slate-500 mb-6">
        Select an area to check in on this week.
      </p>

      <div className="px-5 space-y-3 max-w-md mx-auto">
        {Object.values(DOMAINS).map((d) => {
          const sd  = scores[d.id] || null
          const thr = sd ? SCORE_THRESHOLDS[sd.level] : null
          return (
            <button key={d.id}
                    onClick={() => dispatch({ type: 'START_QUESTIONNAIRE', payload: d.id })}
                    className="w-full dark:bg-[#1B1830] bg-white rounded-[20px] p-4
                               flex items-center gap-4 text-left
                               border dark:border-transparent border-slate-200/60
                               transition-all active:scale-[0.98]">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                   style={{ backgroundColor: d.color + '22' }}>
                {ICONS[d.id]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold dark:text-white text-slate-800">{d.label}</p>
                <p className="text-xs dark:text-slate-400 text-slate-500 truncate">{d.description}</p>
                {sd && (
                  <span className="text-xs font-semibold" style={{ color: thr.color }}>
                    {thr.label} this week
                  </span>
                )}
              </div>
              <span className="text-vida-primary text-sm flex-shrink-0">
                {sd ? 'Redo →' : 'Start →'}
              </span>
            </button>
          )
        })}
      </div>

      <BottomNav active="checkin" onChange={onTabChange} />
    </div>
  )
}

// ─── Main Dashboard (Summary tab) ────────────────────────────────────────────

export default function Dashboard() {
  const { state, dispatch } = useApp()
  const { scores, theme }   = state
  const [week, setWeek]     = useState(12)
  const [tab, setTab]       = useState('summary')

  if (tab === 'checkin') {
    return <CheckInTab onTabChange={setTab} />
  }

  return (
    <div className="min-h-screen dark:bg-[#0F0D1A] bg-[#F7F3FF] pb-28">

      {/* ── Header ── */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        {/* Logo */}
        <span className="text-[22px] font-bold italic text-vida-primary"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Vida
        </span>

        {/* Week nav */}
        <div className="flex items-center gap-1">
          <button onClick={() => setWeek(w => Math.max(1, w - 1))}
                  className="dark:text-slate-400 text-slate-500 text-lg px-1.5 py-0.5
                             hover:text-vida-primary transition-colors">
            ‹
          </button>
          <span className="text-[11px] font-semibold dark:text-slate-300 text-slate-600 tracking-[0.12em] px-1">
            WEEK {week}
          </span>
          <button onClick={() => setWeek(w => w + 1)}
                  className="dark:text-slate-400 text-slate-500 text-lg px-1.5 py-0.5
                             hover:text-vida-primary transition-colors">
            ›
          </button>
        </div>

        {/* Theme toggle + avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' })}
            className="w-7 h-7 rounded-full dark:bg-[#2A2648] bg-slate-200 flex items-center justify-center text-xs"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <AvatarMenu />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-5 max-w-md mx-auto">

        {/* Overall Recovery banner */}
        <RecoveryBanner scores={scores} />

        {/* 2 × 2 domain grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {Object.values(DOMAINS).map(d => (
            <DomainCard key={d.id} domain={d} scoreData={scores[d.id] || null} />
          ))}
        </div>

        {/* Insight */}
        <InsightSection scores={scores} />

        {/* Suggested */}
        <SuggestedContent />
      </div>

      {/* Bottom nav */}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
