'use client'

import { useState, useCallback, useEffect } from 'react'

interface Habit {
  id: string
  name: string
  createdAt: string
}

interface HabitCheck {
  habitId: string
  date: string // YYYY-MM-DD
}

interface HabitsState {
  habits: Habit[]
  checks: HabitCheck[]
}

const STORAGE_KEY = 'samir-os-habits'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadState(): HabitsState {
  if (typeof window === 'undefined') return { habits: [], checks: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as HabitsState
  } catch { /* ignore */ }
  return { habits: [], checks: [] }
}

function saveState(state: HabitsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useHabits() {
  const [state, setState] = useState<HabitsState>({ habits: [], checks: [] })

  // Hydrate from localStorage on mount
  useEffect(() => {
    setState(loadState())
  }, [])

  const addHabit = useCallback((name: string) => {
    setState(prev => {
      const next: HabitsState = {
        ...prev,
        habits: [...prev.habits, { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() }],
      }
      saveState(next)
      return next
    })
  }, [])

  const removeHabit = useCallback((id: string) => {
    setState(prev => {
      const next: HabitsState = {
        habits: prev.habits.filter(h => h.id !== id),
        checks: prev.checks.filter(c => c.habitId !== id),
      }
      saveState(next)
      return next
    })
  }, [])

  const toggleCheck = useCallback((habitId: string) => {
    const date = todayKey()
    setState(prev => {
      const exists = prev.checks.some(c => c.habitId === habitId && c.date === date)
      const next: HabitsState = {
        ...prev,
        checks: exists
          ? prev.checks.filter(c => !(c.habitId === habitId && c.date === date))
          : [...prev.checks, { habitId, date }],
      }
      saveState(next)
      return next
    })
  }, [])

  const isChecked = useCallback((habitId: string): boolean => {
    const date = todayKey()
    return state.checks.some(c => c.habitId === habitId && c.date === date)
  }, [state.checks])

  const completedCount = state.checks.filter(c => c.date === todayKey()).length

  return {
    habits: state.habits,
    completedCount,
    totalCount: state.habits.length,
    addHabit,
    removeHabit,
    toggleCheck,
    isChecked,
  }
}
