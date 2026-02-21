import { useApp } from '../../context/AppContext'
import { SCORE_THRESHOLDS } from '../../data/questions'

function ScoreRing({ score, level, size = 56 }) {
  const threshold = SCORE_THRESHOLDS[level]
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = (score - 5) / 15 // min=5, max=20
  const dashOffset = circumference * (1 - percentage)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="dark:text-vida-dark-border text-slate-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={threshold.color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color: threshold.color }}>
        {score}
      </span>
    </div>
  )
}

export default function DomainCard({ domain, scoreData }) {
  const { dispatch } = useApp()
  const hasScore = scoreData !== null
  const threshold = hasScore ? SCORE_THRESHOLDS[scoreData.level] : null

  const cardStyle = hasScore
    ? { backgroundColor: threshold.bg, borderColor: threshold.color + '40' }
    : {}

  const cardClass = hasScore
    ? 'rounded-2xl p-5 border transition-all'
    : 'rounded-2xl p-5 border transition-all dark:bg-vida-dark-card bg-white dark:border-vida-dark-border border-slate-200'

  return (
    <div className={cardClass} style={cardStyle}>
      <div className="flex items-start justify-between">
        {/* Left */}
        <div className="flex items-start gap-4 flex-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: domain.color + '20' }}
          >
            {domain.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold dark:text-white text-slate-800 mb-0.5">{domain.label}</h3>
            <p className="text-xs dark:text-slate-400 text-slate-500">{domain.description}</p>
            {hasScore && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: threshold.color, backgroundColor: threshold.color + '20' }}
                >
                  {threshold.label}
                </span>
                <span className="text-xs dark:text-slate-500 text-slate-400">
                  {new Date(scoreData.completedAt).toLocaleDateString('en-GB', {
                    weekday: 'short', day: 'numeric', month: 'short',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: score ring */}
        <div className="flex-shrink-0 ml-3">
          {hasScore ? (
            <ScoreRing score={scoreData.score} level={scoreData.level} />
          ) : (
            <div className="w-14 h-14 rounded-full dark:bg-vida-dark-border/50 bg-slate-100 flex items-center justify-center">
              <span className="text-xs dark:text-slate-500 text-slate-400">—</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {hasScore ? (
          <>
            <button
              onClick={() => dispatch({ type: 'VIEW_INSIGHTS', payload: { domain: domain.id, ...scoreData } })}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: threshold.color + '25', color: threshold.color }}
            >
              View insights
            </button>
            <button
              onClick={() => dispatch({ type: 'START_QUESTIONNAIRE', payload: domain.id })}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium dark:bg-vida-dark-border/60 bg-slate-100 dark:text-slate-300 text-slate-600 transition-all hover:opacity-80"
            >
              Redo check-in
            </button>
          </>
        ) : (
          <button
            onClick={() => dispatch({ type: 'START_QUESTIONNAIRE', payload: domain.id })}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-vida-primary text-white transition-all hover:bg-vida-primary-dim active:scale-95"
          >
            Start check-in →
          </button>
        )}
      </div>
    </div>
  )
}
