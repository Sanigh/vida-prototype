import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { DOMAINS, SCORE_THRESHOLDS, getScoreLevel } from '../../data/questions'
import DomainCard from './DomainCard'

const GREETING_BY_TIME = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function WeeklyOverview({ scores }) {
  const completed = Object.keys(scores).length
  const total = 4
  if (completed === 0) return null

  const allScores = Object.values(scores)
  const avgScore = Math.round(allScores.reduce((a, b) => a + b.score, 0) / allScores.length)
  const avgLevel = getScoreLevel(avgScore)
  const threshold = SCORE_THRESHOLDS[avgLevel]

  return (
    <div
      className="rounded-2xl p-5 mb-6 border"
      style={{ backgroundColor: threshold.bg, borderColor: threshold.color + '40' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">
          This week's overview
        </span>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ color: threshold.color, backgroundColor: threshold.color + '20' }}
        >
          {threshold.label}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold dark:text-white text-slate-800">{avgScore}</span>
        <span className="text-sm dark:text-slate-400 text-slate-500 mb-1.5">/ 20 avg score</span>
      </div>
      <p className="text-xs dark:text-slate-400 text-slate-500 mt-2">
        Based on {completed} of {total} areas completed
      </p>
      {completed < total && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: threshold.color + '30' }}>
          <p className="text-xs" style={{ color: threshold.color }}>
            Complete all 4 areas for a fuller picture of your wellbeing 🌸
          </p>
        </div>
      )}
    </div>
  )
}

function EncouragementBanner({ scores }) {
  const completed = Object.keys(scores).length
  if (completed === 4) return null

  const messages = {
    0: 'Start your weekly check-in — it only takes a few minutes and can make a real difference.',
    1: `Great start! ${4 - completed} more areas will give you a fuller picture of your wellbeing.`,
    2: `You're halfway there. ${4 - completed} more areas to complete your weekly check-in.`,
    3: "Just one more area to complete your weekly check-in. You're almost there!",
  }

  return (
    <div className="rounded-2xl p-4 mb-6 dark:bg-vida-dark-card bg-white border dark:border-vida-dark-border border-slate-200 flex items-start gap-3">
      <span className="text-2xl flex-shrink-0">💜</span>
      <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
        {messages[completed]}
      </p>
    </div>
  )
}

function ThemeToggle() {
  const { state, dispatch } = useApp()
  const isDark = state.theme === 'dark'
  return (
    <button
      onClick={() => dispatch({ type: 'SET_THEME', payload: isDark ? 'light' : 'dark' })}
      className="w-9 h-9 rounded-full dark:bg-vida-dark-card bg-white border dark:border-vida-dark-border border-slate-200 flex items-center justify-center transition-all hover:border-vida-primary/50"
      aria-label="Toggle theme"
    >
      <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}

function SettingsMenu() {
  const [open, setOpen] = useState(false)
  const { dispatch } = useApp()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full dark:bg-vida-dark-card bg-white border dark:border-vida-dark-border border-slate-200 flex items-center justify-center transition-all hover:border-vida-primary/50"
        aria-label="Settings"
      >
        <span className="text-base">⚙️</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 dark:bg-vida-dark-card bg-white border dark:border-vida-dark-border border-slate-200 rounded-2xl shadow-xl p-2 min-w-48">
            <button
              onClick={() => { dispatch({ type: 'RESET_SCORES' }); setOpen(false) }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm dark:text-slate-300 text-slate-600 hover:bg-vida-primary/10 transition-all"
            >
              Reset weekly scores
            </button>
            <button
              onClick={() => { dispatch({ type: 'RESET_ALL' }); setOpen(false) }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all"
            >
              Reset everything
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { state } = useApp()
  const { scores } = state

  return (
    <div className="min-h-screen dark:bg-vida-dark-bg bg-vida-light-bg">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-xs dark:text-slate-500 text-slate-400 mb-1 uppercase tracking-wider">
              {GREETING_BY_TIME()}
            </p>
            <h1 className="text-2xl font-semibold dark:text-white text-slate-800">
              Welcome to Vida 🌸
            </h1>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <ThemeToggle />
            <SettingsMenu />
          </div>
        </div>
        <p className="text-sm dark:text-slate-400 text-slate-500 mt-2">
          How are you doing this week? Check in with each area below.
        </p>
      </div>

      {/* Content */}
      <div className="px-6 pb-10 max-w-md mx-auto">
        <WeeklyOverview scores={scores} />
        <EncouragementBanner scores={scores} />

        <p className="text-xs font-medium dark:text-slate-500 text-slate-400 uppercase tracking-wider mb-4">
          Your wellbeing areas
        </p>

        <div className="grid grid-cols-1 gap-4">
          {Object.values(DOMAINS).map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              scoreData={scores[domain.id] || null}
            />
          ))}
        </div>

        <div className="mt-10 text-center space-y-1">
          <p className="text-xs dark:text-slate-600 text-slate-400">
            Vida is a supportive tool, not a medical service.
          </p>
          <p className="text-xs dark:text-slate-600 text-slate-400">
            Always speak to your healthcare provider about medical concerns.
          </p>
        </div>
      </div>
    </div>
  )
}
