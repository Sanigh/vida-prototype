import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const initialState = {
  // Theme
  theme: 'dark', // 'dark' | 'light'

  // App navigation
  screen: 'splash', // 'splash' | 'onboarding' | 'dashboard' | 'questionnaire' | 'results' | 'insights'

  // Current questionnaire
  activeDomain: null,
  currentQuestionIndex: 0,
  currentAnswers: {},

  // User profile (from onboarding)
  profile: null,

  // Weekly scores: { sleep: { score, level, answers, completedAt }, ... }
  scores: {},

  // Which domain's results to show
  resultsData: null,
}

function loadState() {
  try {
    const saved = localStorage.getItem('vida_state')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Always start on splash or dashboard (not mid-questionnaire)
      return {
        ...initialState,
        ...parsed,
        screen: parsed.profile ? 'dashboard' : 'splash',
        activeDomain: null,
        currentQuestionIndex: 0,
        currentAnswers: {},
        resultsData: null,
        theme: parsed.theme || 'dark',
      }
    }
  } catch {
    // ignore
  }
  return initialState
}

function saveState(state) {
  try {
    const toSave = {
      theme: state.theme,
      profile: state.profile,
      scores: state.scores,
    }
    localStorage.setItem('vida_state', JSON.stringify(toSave))
  } catch {
    // ignore
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }

    case 'SET_SCREEN':
      return { ...state, screen: action.payload }

    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        profile: action.payload,
        screen: 'dashboard',
      }

    case 'START_QUESTIONNAIRE':
      return {
        ...state,
        activeDomain: action.payload,
        currentQuestionIndex: 0,
        currentAnswers: {},
        screen: 'questionnaire',
      }

    case 'ANSWER_QUESTION':
      return {
        ...state,
        currentAnswers: {
          ...state.currentAnswers,
          [action.payload.questionId]: action.payload.score,
        },
      }

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      }

    case 'PREV_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      }

    case 'SUBMIT_QUESTIONNAIRE': {
      const { domain, score, level, answers } = action.payload
      const updatedScores = {
        ...state.scores,
        [domain]: {
          score,
          level,
          answers,
          completedAt: new Date().toISOString(),
        },
      }
      return {
        ...state,
        scores: updatedScores,
        resultsData: { domain, score, level, answers },
        screen: 'results',
        activeDomain: null,
        currentQuestionIndex: 0,
        currentAnswers: {},
      }
    }

    case 'VIEW_INSIGHTS':
      return {
        ...state,
        resultsData: action.payload,
        screen: 'insights',
      }

    case 'GO_DASHBOARD':
      return {
        ...state,
        screen: 'dashboard',
        activeDomain: null,
        currentQuestionIndex: 0,
        currentAnswers: {},
        resultsData: null,
      }

    case 'RESET_SCORES':
      return {
        ...state,
        scores: {},
        screen: 'dashboard',
      }

    case 'RESET_ALL':
      return { ...initialState, theme: state.theme }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  // Apply theme to html element
  useEffect(() => {
    const html = document.documentElement
    if (state.theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [state.theme])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
