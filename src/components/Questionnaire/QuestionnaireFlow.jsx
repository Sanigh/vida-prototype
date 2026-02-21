import { useApp } from '../../context/AppContext'
import { DOMAINS, QUESTIONS, getScoreLevel } from '../../data/questions'

function OptionButton({ option, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border transition-all mb-3 ${
        selected
          ? 'border-vida-primary bg-vida-primary/10 dark:text-white text-slate-800'
          : 'dark:border-vida-dark-border dark:bg-vida-dark-card dark:text-slate-300 border-slate-200 bg-white text-slate-600 hover:border-vida-primary/50 hover:bg-vida-primary/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            selected ? 'border-vida-primary bg-vida-primary' : 'dark:border-slate-500 border-slate-300'
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <span className="text-sm leading-relaxed">{option.label}</span>
      </div>
    </button>
  )
}

export default function QuestionnaireFlow() {
  const { state, dispatch } = useApp()
  const { activeDomain, currentQuestionIndex, currentAnswers } = state

  const domain = DOMAINS[activeDomain]
  const questions = QUESTIONS[activeDomain]
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = (currentQuestionIndex + 1) / totalQuestions
  const selectedScore = currentAnswers[currentQuestion.id]

  const handleAnswer = (score) => {
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId: currentQuestion.id, score },
    })
  }

  const handleNext = () => {
    if (!selectedScore) return

    if (currentQuestionIndex < totalQuestions - 1) {
      dispatch({ type: 'NEXT_QUESTION' })
    } else {
      // Calculate total score
      const allAnswers = { ...currentAnswers, [currentQuestion.id]: selectedScore }
      const totalScore = Object.values(allAnswers).reduce((sum, s) => sum + s, 0)
      const level = getScoreLevel(totalScore)

      dispatch({
        type: 'SUBMIT_QUESTIONNAIRE',
        payload: {
          domain: activeDomain,
          score: totalScore,
          level,
          answers: allAnswers,
        },
      })
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex === 0) {
      dispatch({ type: 'GO_DASHBOARD' })
    } else {
      dispatch({ type: 'PREV_QUESTION' })
    }
  }

  return (
    <div className="min-h-screen dark:bg-vida-dark-bg bg-vida-light-bg flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 dark:text-slate-400 text-slate-500 text-sm mb-6 hover:text-vida-primary transition-colors"
        >
          <span>←</span>
          <span>{currentQuestionIndex === 0 ? 'Back to dashboard' : 'Previous'}</span>
        </button>

        {/* Domain pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{domain.emoji}</span>
          <span className="text-sm font-medium dark:text-slate-300 text-slate-600">{domain.label} check-in</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1 h-1.5 dark:bg-vida-dark-border bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-vida-primary rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-xs dark:text-slate-400 text-slate-500 flex-shrink-0">
            {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 px-6 pb-8 max-w-md mx-auto w-full">
        <div key={currentQuestion.id} className="animate-slide-up">
          {/* Question number + text */}
          <div className="mb-8">
            <p className="text-xs dark:text-slate-500 text-slate-400 uppercase tracking-wider mb-3">
              Question {currentQuestionIndex + 1}
            </p>
            <h2 className="text-xl font-semibold dark:text-white text-slate-800 leading-snug">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Options */}
          <div className="mb-8">
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option.score}
                option={option}
                selected={selectedScore === option.score}
                onClick={() => handleAnswer(option.score)}
              />
            ))}
          </div>

          {/* Navigation */}
          <button
            onClick={handleNext}
            disabled={!selectedScore}
            className="w-full py-4 rounded-2xl bg-vida-primary text-white font-semibold text-base transition-all hover:bg-vida-primary-dim active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next question →' : 'See my results →'}
          </button>

          <p className="text-center text-xs dark:text-slate-500 text-slate-400 mt-4">
            There are no right or wrong answers — just how you feel right now.
          </p>
        </div>
      </div>
    </div>
  )
}
