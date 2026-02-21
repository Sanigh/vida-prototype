import { useApp } from '../../context/AppContext'
import { DOMAINS, QUESTIONS, SCORE_THRESHOLDS } from '../../data/questions'

function ScoreCircle({ score, level, size = 120 }) {
  const threshold = SCORE_THRESHOLDS[level]
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = (score - 5) / 15
  const dashOffset = circumference * (1 - percentage)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={threshold.color + '30'}
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={threshold.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold dark:text-white text-slate-800">{score}</span>
        <span className="text-xs dark:text-slate-400 text-slate-500">/ 20</span>
      </div>
    </div>
  )
}

function AnswerSummary({ domain, answers }) {
  const questions = QUESTIONS[domain]

  return (
    <div className="dark:bg-vida-dark-card bg-white rounded-2xl border dark:border-vida-dark-border border-slate-200 p-5">
      <h3 className="text-sm font-semibold dark:text-white text-slate-800 mb-4">Your responses</h3>
      <div className="space-y-4">
        {questions.map((q, i) => {
          const score = answers[q.id]
          const option = q.options.find((o) => o.score === score)
          return (
            <div key={q.id}>
              <p className="text-xs dark:text-slate-500 text-slate-400 mb-1">
                Q{i + 1} · {q.text}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm dark:text-slate-300 text-slate-600">{option?.label}</p>
                <div className="flex gap-1 ml-3">
                  {[1, 2, 3, 4].map((dot) => (
                    <div
                      key={dot}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{
                        backgroundColor: dot <= score ? '#B99CFF' : 'transparent',
                        border: `1.5px solid ${dot <= score ? '#B99CFF' : '#3D3960'}`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const { state, dispatch } = useApp()
  const { resultsData } = state

  if (!resultsData) {
    dispatch({ type: 'GO_DASHBOARD' })
    return null
  }

  const { domain, score, level, answers } = resultsData
  const domainData = DOMAINS[domain]
  const threshold = SCORE_THRESHOLDS[level]

  const levelMessages = {
    superb: "You're doing really well in this area. That's meaningful — acknowledge it.",
    good: "You're managing well overall, even if some moments are challenging.",
    fair: "This area is showing some strain. You're not alone, and support is available.",
    poor: "This area needs attention and care. Please be gentle with yourself.",
  }

  return (
    <div className="min-h-screen dark:bg-vida-dark-bg bg-vida-light-bg">
      {/* Back */}
      <div className="px-6 pt-12">
        <button
          onClick={() => dispatch({ type: 'GO_DASHBOARD' })}
          className="flex items-center gap-2 dark:text-slate-400 text-slate-500 text-sm hover:text-vida-primary transition-colors"
        >
          <span>←</span>
          <span>Back to dashboard</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 pb-12 max-w-md mx-auto animate-slide-up">
        {/* Domain header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: domainData.color + '20' }}
          >
            {domainData.emoji}
          </div>
          <div>
            <h1 className="text-xl font-semibold dark:text-white text-slate-800">{domainData.label}</h1>
            <p className="text-xs dark:text-slate-400 text-slate-500">Your check-in results</p>
          </div>
        </div>

        {/* Score card */}
        <div
          className="rounded-3xl p-8 mb-6 border text-center"
          style={{ backgroundColor: threshold.bg, borderColor: threshold.color + '40' }}
        >
          <div className="flex justify-center mb-5">
            <ScoreCircle score={score} level={level} />
          </div>
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3"
            style={{ backgroundColor: threshold.color + '30', color: threshold.color }}
          >
            {threshold.label}
          </div>
          <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
            {levelMessages[level]}
          </p>
        </div>

        {/* AI Insights CTA */}
        <button
          onClick={() => dispatch({ type: 'VIEW_INSIGHTS', payload: resultsData })}
          className="w-full py-4 rounded-2xl bg-vida-primary text-white font-semibold text-base transition-all hover:bg-vida-primary-dim active:scale-95 mb-4"
        >
          Read your personalised insights →
        </button>

        {/* Answer summary */}
        <AnswerSummary domain={domain} answers={answers} />

        {/* Dashboard link */}
        <button
          onClick={() => dispatch({ type: 'GO_DASHBOARD' })}
          className="w-full mt-4 py-3.5 rounded-2xl dark:bg-vida-dark-card bg-white border dark:border-vida-dark-border border-slate-200 text-sm font-medium dark:text-slate-300 text-slate-600 transition-all hover:opacity-80"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}
