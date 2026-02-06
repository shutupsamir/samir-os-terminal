'use client'

import { useState } from 'react'
import { useProjectTasks } from '@/lib/hooks/use-project-tasks'
import { updateTask } from '@/lib/api'
import type { Task } from '@/lib/types'

const AGENT_COLORS: Record<string, string> = {
  claude: '#22c55e',
  clae: '#3b82f6',
  mack: '#a855f7',
  samir: '#c45c35',
}

const PRIORITY_INDICATORS: Record<string, string> = {
  urgent: '!!!',
  high: '!!',
  medium: '!',
  low: '.',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400',
  in_progress: 'text-blue-400',
  completed: 'text-green-400',
  blocked: 'text-red-400',
  cancelled: 'text-gray-600',
}

interface TaskListProps {
  slug: string
  isOpen: boolean
}

export function TaskList({ slug, isOpen }: TaskListProps) {
  const { data: tasks, isLoading, mutate } = useProjectTasks(isOpen ? slug : null)
  const [processing, setProcessing] = useState<string | null>(null)

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="border-t border-[#222] pt-3 mt-3">
        <div className="text-xs text-gray-600 animate-pulse">Loading tasks...</div>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="border-t border-[#222] pt-3 mt-3">
        <div className="text-xs text-gray-600">No tasks</div>
      </div>
    )
  }

  const active = tasks.filter(t => t.status === 'in_progress')
  const blocked = tasks.filter(t => t.status === 'blocked')
  const pending = tasks.filter(t => t.status === 'pending')
  const completed = tasks.filter(t => t.status === 'completed').slice(0, 3)
  const ordered = [...active, ...blocked, ...pending, ...completed]

  async function cycleStatus(task: Task) {
    const next: Record<string, string> = {
      pending: 'in_progress',
      in_progress: 'completed',
      blocked: 'in_progress',
    }
    const nextStatus = next[task.status]
    if (!nextStatus) return

    setProcessing(task.id)
    try {
      await updateTask(task.id, { status: nextStatus as Task['status'] })
      mutate()
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="border-t border-[#222] pt-3 mt-3 space-y-2">
      {ordered.map(task => (
        <div key={task.id} className="flex items-start gap-2 text-xs group">
          <button
            onClick={() => cycleStatus(task)}
            disabled={processing === task.id || task.status === 'completed' || task.status === 'cancelled'}
            className={`flex-shrink-0 mt-0.5 ${STATUS_COLORS[task.status]} hover:opacity-70 disabled:cursor-default`}
            title={`${task.status} (click to advance)`}
          >
            {task.status === 'completed' ? '[x]' :
             task.status === 'in_progress' ? '[~]' :
             task.status === 'blocked' ? '[!]' : '[ ]'}
          </button>

          <div className="flex-1 min-w-0">
            <span className={task.status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-300'}>
              {task.title}
            </span>
          </div>

          <span className="text-gray-600 flex-shrink-0">
            {PRIORITY_INDICATORS[task.priority]}
          </span>

          {task.assigned_to && (
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: AGENT_COLORS[task.assigned_to] || '#6b7280' }}
              title={task.assigned_to}
            />
          )}
        </div>
      ))}
    </div>
  )
}
