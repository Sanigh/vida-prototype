import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const STEPS = [
  { id: 'welcome', type: 'welcome' },
  { id: 'age', type: 'number', field: 'age', label: 'How old are you?', unit: 'years', min: 16, max: 55, placeholder: 'e.g. 28' },
  { id: 'babyAge', type: 'choice', field: 'babyAge', label: 'How old is your baby?', options: [
    { value: '0-2w', label: '0–2 weeks' },
    { value: '2-6w', label: '2–6 weeks' },
    { value: '6-12w', label: '6–12 weeks' },
    { value: '3-6m', label: '3–6 months' },
    { value: '6-12m', label: '6–12 months' },
    { value: '12m+', label: 'Over 12 months' },
  ]},
  { id: 'delivery', type: 'choice', field: 'delivery', label: 'How did you give birth?', options: [
    { value: 'vaginal', label: 'Vaginal birth', emoji: '🌿' },
    { value: 'cesarean', label: 'Cesarean (C-section)', emoji: '⚕️' },
  ]},
  { id: 'feeding', type: 'choice', field: 'feeding', label: 'How are you feeding your baby?', options: [
    { value: 'breastfeeding', label: 'Breastfeeding', emoji: '🤱' },
    { value: 'breastfeeding-struggling', label: 'I want to breastfeed but struggling', emoji: '💙' },
    { value: 'bottle', label: 'Bottle feeding (expressed milk)', emoji: '🍼' },
    { value: 'formula', label: 'Formula feeding', emoji: '🥛' },
    { value: 'mixed', label: 'Mixed feeding', emoji: '🌸' },
  ]},
  { id: 'otherChildren', type: 'choice', field: 'otherChildren', label: 'Do you have other children?', options: [
    { value: 'no', label: 'No, this is my first', emoji: '✨' },
    { value: 'yes-1', label: 'Yes, one other child', emoji: '👶' },
    { value: 'yes-2plus', label: 'Yes, two or more others', emoji: '👨‍👩‍👧‍👦' },
  ]},
  { id: 'notifications', type: 'choice', field: 'notifications', label: 'Would you like gentle weekly check-in reminders?', options: [
    { value: 'yes', label: 'Yes, please remind me', emoji: '🔔' },
    { value: 'no', label: 'Not right now', emoji: '🔕' },
  ]},
  { id: 'privacy', type: 'privacy' },
]

function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-col items-center text-center px-2 animate-slide-up">
      <div className="w-20 h-20 rounded-full bg-vida-primary/20 flex items-center justify-center mb-8 text-4xl">
        🌸
      </div>
      <h1 className="text-3xl font-semibold text-vida-primary mb-4">Welcome to Vida</h1>
      <p className="text-base dark:text-slate-300 text-slate-600 leading-relaxed mb-4">
        Vida is your gentle companion for postpartum recovery — a space that holds your whole self.
      </p>
      <p className="text-sm dark:text-slate-400 text-slate-500 leading-relaxed mb-10">
        Each week, you'll check in across four areas of wellbeing: sleep, physical recovery, mental health, and motherhood. Vida will reflect your progress and offer personalised support along the way.
      </p>
      <p className="text-xs dark:text-slate-500 text-slate-400 mb-8 italic">
        There are no wrong answers. This is your space.
      </p>
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-vida-primary text-white font-semibold text-base transition-all hover:bg-vida-primary-dim active:scale-95"
      >
        Let's begin
      </button>
    </div>
  )
}

function NumberStep({ step, value, onChange, onNext, onBack }) {
  const [inputVal, setInputVal] = useState(value || '')
  const isValid = inputVal && Number(inputVal) >= step.min && Number(inputVal) <= step.max

  return (
    <div className="animate-slide-up">
      <h2 className="text-xl font-semibold dark:text-white text-slate-800 mb-2">{step.label}</h2>
      <p className="text-sm dark:text-slate-400 text-slate-500 mb-8">This helps us personalise your experience.</p>
      <div className="relative mb-8">
        <input
          type="number"
          min={step.min}
          max={step.max}
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value)
            onChange(e.target.value)
          }}
          placeholder={step.placeholder}
          className="w-full px-4 py-4 rounded-2xl dark:bg-vida-dark-card dark:border-vida-dark-border dark:text-white bg-white border-slate-200 border text-slate-800 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-vida-primary"
        />
        {step.unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-slate-400 text-slate-400 text-sm">{step.unit}</span>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl dark:bg-vida-dark-card dark:text-slate-300 bg-slate-100 text-slate-600 font-medium transition-all hover:opacity-80">
          Back
        </button>
        <button
          onClick={() => isValid && onNext(inputVal)}
          disabled={!isValid}
          className="flex-2 flex-grow py-4 rounded-2xl bg-vida-primary text-white font-semibold transition-all hover:bg-vida-primary-dim disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function ChoiceStep({ step, value, onChange, onNext, onBack }) {
  const [selected, setSelected] = useState(value || null)

  const handleSelect = (optionValue) => {
    setSelected(optionValue)
    onChange(optionValue)
  }

  return (
    <div className="animate-slide-up">
      <h2 className="text-xl font-semibold dark:text-white text-slate-800 mb-2">{step.label}</h2>
      <p className="text-sm dark:text-slate-400 text-slate-500 mb-6">Choose one option.</p>
      <div className="space-y-3 mb-8">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
              selected === opt.value
                ? 'border-vida-primary bg-vida-primary/10 dark:text-white text-slate-800'
                : 'dark:border-vida-dark-border dark:bg-vida-dark-card dark:text-slate-300 border-slate-200 bg-white text-slate-600 hover:border-vida-primary/50'
            }`}
          >
            {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
            <span className="font-medium text-sm">{opt.label}</span>
            {selected === opt.value && (
              <span className="ml-auto text-vida-primary">✓</span>
            )}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl dark:bg-vida-dark-card dark:text-slate-300 bg-slate-100 text-slate-600 font-medium transition-all hover:opacity-80">
          Back
        </button>
        <button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="flex-2 flex-grow py-4 rounded-2xl bg-vida-primary text-white font-semibold transition-all hover:bg-vida-primary-dim disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function PrivacyStep({ onNext, onBack }) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="animate-slide-up">
      <h2 className="text-xl font-semibold dark:text-white text-slate-800 mb-2">Your privacy matters</h2>
      <p className="text-sm dark:text-slate-400 text-slate-500 mb-6">Before we start, a few things you should know.</p>

      <div className="dark:bg-vida-dark-card bg-white rounded-2xl p-5 mb-6 space-y-4 dark:border-vida-dark-border border-slate-200 border">
        <div className="flex gap-3">
          <span className="text-vida-primary text-lg">🔒</span>
          <div>
            <p className="text-sm font-medium dark:text-white text-slate-800 mb-1">Your data stays on your device</p>
            <p className="text-xs dark:text-slate-400 text-slate-500">Vida stores your responses locally. We don't share your personal information with third parties.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-vida-primary text-lg">❤️</span>
          <div>
            <p className="text-sm font-medium dark:text-white text-slate-800 mb-1">This is not medical advice</p>
            <p className="text-xs dark:text-slate-400 text-slate-500">Vida is a supportive tool, not a clinical service. Always speak to your healthcare provider about medical concerns.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-vida-primary text-lg">🌱</span>
          <div>
            <p className="text-sm font-medium dark:text-white text-slate-800 mb-1">You can delete everything</p>
            <p className="text-xs dark:text-slate-400 text-slate-500">You can reset all your data from the settings at any time.</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setAgreed(!agreed)}
        className="w-full text-left flex items-start gap-3 mb-8 p-4 rounded-2xl dark:bg-vida-dark-card bg-slate-50 border dark:border-vida-dark-border border-slate-200 transition-all"
      >
        <div className={`w-5 h-5 rounded mt-0.5 flex-shrink-0 border-2 flex items-center justify-center transition-all ${agreed ? 'bg-vida-primary border-vida-primary' : 'dark:border-slate-500 border-slate-300'}`}>
          {agreed && <span className="text-white text-xs">✓</span>}
        </div>
        <span className="text-sm dark:text-slate-300 text-slate-600">
          I understand that Vida is not a medical service, and I agree to the terms above.
        </span>
      </button>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl dark:bg-vida-dark-card dark:text-slate-300 bg-slate-100 text-slate-600 font-medium transition-all hover:opacity-80">
          Back
        </button>
        <button
          onClick={() => agreed && onNext()}
          disabled={!agreed}
          className="flex-2 flex-grow py-4 rounded-2xl bg-vida-primary text-white font-semibold transition-all hover:bg-vida-primary-dim disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Get started
        </button>
      </div>
    </div>
  )
}

export default function OnboardingFlow() {
  const { dispatch } = useApp()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const step = STEPS[stepIndex]
  const progress = stepIndex / (STEPS.length - 1)

  const handleNext = (value) => {
    if (value !== undefined && step.field) {
      setAnswers((prev) => ({ ...prev, [step.field]: value }))
    }

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      // Complete onboarding
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: answers })
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  return (
    <div className="min-h-screen dark:bg-vida-dark-bg bg-vida-light-bg flex flex-col">
      {/* Progress bar */}
      {stepIndex > 0 && (
        <div className="px-6 pt-12 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs dark:text-slate-500 text-slate-400">
              Step {stepIndex} of {STEPS.length - 1}
            </span>
            <span className="text-xs text-vida-primary font-medium">{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-1 dark:bg-vida-dark-border bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-vida-primary rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
        {step.type === 'welcome' && <WelcomeStep onNext={handleNext} />}
        {step.type === 'number' && (
          <NumberStep
            step={step}
            value={answers[step.field]}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [step.field]: v }))}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step.type === 'choice' && (
          <ChoiceStep
            step={step}
            value={answers[step.field]}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [step.field]: v }))}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step.type === 'privacy' && (
          <PrivacyStep onNext={handleNext} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}
