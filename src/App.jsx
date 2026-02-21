import { useApp } from './context/AppContext'
import SplashScreen from './components/Splash/SplashScreen'
import OnboardingFlow from './components/Onboarding/OnboardingFlow'
import Dashboard from './components/Dashboard/Dashboard'
import QuestionnaireFlow from './components/Questionnaire/QuestionnaireFlow'
import ResultsPage from './components/Results/ResultsPage'
import AIInsights from './components/Insights/AIInsights'

export default function App() {
  const { state } = useApp()

  const screens = {
    splash: <SplashScreen />,
    onboarding: <OnboardingFlow />,
    dashboard: <Dashboard />,
    questionnaire: <QuestionnaireFlow />,
    results: <ResultsPage />,
    insights: <AIInsights />,
  }

  return (
    <div className="font-sans">
      {screens[state.screen] ?? <Dashboard />}
    </div>
  )
}
