import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function SplashScreen() {
  const { state, dispatch } = useApp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.profile) {
        dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })
      } else {
        dispatch({ type: 'SET_SCREEN', payload: 'onboarding' })
      }
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen dark:bg-vida-dark-bg bg-vida-light-bg flex flex-col items-center justify-center">
      <div className="flex flex-col items-center animate-fade-in">
        {/* Logo */}
        <div className="w-24 h-24 rounded-[28px] bg-vida-primary/20 flex items-center justify-center mb-8 animate-pulse-slow">
          <span className="text-5xl">🌸</span>
        </div>

        <h1 className="text-4xl font-semibold text-vida-primary mb-3 tracking-tight">
          Vida
        </h1>
        <p className="text-sm dark:text-slate-400 text-slate-500">
          Your postpartum recovery companion
        </p>

        {/* Loading dots */}
        <div className="flex gap-2 mt-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-vida-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
