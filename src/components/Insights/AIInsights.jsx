import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { DOMAINS, SCORE_THRESHOLDS } from '../../data/questions'
import { AI_CONTENT } from '../../data/aiContent'

function TypewriterText({ text, delay = 0 }) {
  // Simple animation using CSS — real typewriter would use state
  return (
    <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed animate-fade-in">
      {text}
    </p>
  )
}

function InsightSection({ title, children, icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold dark:text-white text-slate-700">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function BulletList({ items, color }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
            style={{ backgroundColor: color }}
          />
          <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">{item}</p>
        </li>
      ))}
    </ul>
  )
}

function AISummaryHeader({ domain, level, threshold }) {
  return (
    <div
      className="rounded-2xl p-5 mb-6 border"
      style={{ backgroundColor: threshold.bg, borderColor: threshold.color + '40' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-vida-primary/20 flex items-center justify-center">
          <span className="text-xs">✨</span>
        </div>
        <span className="text-xs font-medium text-vida-primary">Vida insights</span>
      </div>
      <p className="text-xs dark:text-slate-400 text-slate-500 leading-relaxed">
        Based on your {domain.label.toLowerCase()} check-in, here's what we want to share with you. This is generated to support you — not to judge you.
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4 py-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-3 dark:bg-vida-dark-border bg-slate-200 rounded-full mb-2" style={{ width: `${60 + i * 10}%` }} />
          <div className="h-3 dark:bg-vida-dark-border bg-slate-200 rounded-full" style={{ width: `${40 + i * 15}%` }} />
        </div>
      ))}
    </div>
  )
}

export default function AIInsights() {
  const { state, dispatch } = useApp()
  const { resultsData } = state
  const [isLoading, setIsLoading] = useState(true)

  // Simulate AI loading
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (!resultsData) {
    dispatch({ type: 'GO_DASHBOARD' })
    return null
  }

  const { domain, score, level } = resultsData
  const domainData = DOMAINS[domain]
  const threshold = SCORE_THRESHOLDS[level]
  const content = AI_CONTENT[domain]?.[level]

  if (!content) {
    dispatch({ type: 'GO_DASHBOARD' })
    return null
  }

  return (
    <div className="min-h-screen dark:bg-vida-dark-bg bg-vida-light-bg">
      {/* Header */}
      <div className="px-6 pt-12">
        <button
          onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'results' })}
          className="flex items-center gap-2 dark:text-slate-400 text-slate-500 text-sm hover:text-vida-primary transition-colors mb-6"
        >
          <span>←</span>
          <span>Back to results</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: domainData.color + '20' }}
          >
            {domainData.emoji}
          </div>
          <div>
            <p className="text-xs dark:text-slate-500 text-slate-400">Personalised insights</p>
            <h1 className="text-lg font-semibold dark:text-white text-slate-800">{domainData.label}</h1>
          </div>
          <div className="ml-auto">
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ color: threshold.color, backgroundColor: threshold.color + '20' }}
            >
              {threshold.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-12 max-w-md mx-auto">
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="animate-fade-in">
            {/* AI context header */}
            <AISummaryHeader domain={domainData} level={level} threshold={threshold} />

            {/* Headline */}
            <div
              className="rounded-2xl p-5 mb-5 border"
              style={{ borderColor: threshold.color + '30', backgroundColor: threshold.color + '08' }}
            >
              <h2 className="text-lg font-semibold dark:text-white text-slate-800 mb-3">
                {content.headline}
              </h2>
              <TypewriterText text={content.summary} />
            </div>

            {/* Understanding section */}
            <div className="dark:bg-vida-dark-card bg-white rounded-2xl border dark:border-vida-dark-border border-slate-200 p-5 mb-4">
              <InsightSection title="What this means for you" icon="💡">
                <BulletList items={content.insights} color={threshold.color} />
              </InsightSection>
            </div>

            {/* Tips section */}
            <div className="dark:bg-vida-dark-card bg-white rounded-2xl border dark:border-vida-dark-border border-slate-200 p-5 mb-4">
              <InsightSection title="Gentle suggestions" icon="🌱">
                <BulletList items={content.tips} color="#B99CFF" />
              </InsightSection>
            </div>

            {/* Encouragement */}
            <div
              className="rounded-2xl p-5 mb-6 border"
              style={{ borderColor: threshold.color + '40', backgroundColor: threshold.bg }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">🌸</span>
                <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed italic">
                  "{content.encouragement}"
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="dark:bg-vida-dark-card bg-slate-50 rounded-2xl border dark:border-vida-dark-border border-slate-200 p-4 mb-6">
              <p className="text-xs dark:text-slate-500 text-slate-400 leading-relaxed">
                <strong className="dark:text-slate-400 text-slate-500">Remember:</strong> Vida's insights are supportive, not clinical. If you're struggling significantly — especially with your mental health — please reach out to your midwife, health visitor, or GP. You deserve proper care.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => dispatch({ type: 'GO_DASHBOARD' })}
                className="w-full py-4 rounded-2xl bg-vida-primary text-white font-semibold text-base transition-all hover:bg-vida-primary-dim active:scale-95"
              >
                Back to dashboard
              </button>
              <button
                onClick={() => dispatch({ type: 'START_QUESTIONNAIRE', payload: domain })}
                className="w-full py-3.5 rounded-2xl dark:bg-vida-dark-card bg-white border dark:border-vida-dark-border border-slate-200 text-sm font-medium dark:text-slate-300 text-slate-600 transition-all hover:opacity-80"
              >
                Redo this check-in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
