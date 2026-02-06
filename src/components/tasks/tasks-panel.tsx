'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { getAllTasks, updateTask, createTask } from '@/lib/api'
import type { Task } from '@/lib/types'

const AGENT_COLORS: Record<string, string> = {
  claude: '#22c55e',
  clae: '#3b82f6',
  mack: '#a855f7',
  samir: '#c45c35',
}

export function TasksPanel() {
  const { data: tasks, mutate } = useSWR('all-tasks', getAllTasks, {
    refreshInterval: 15_000,
  })
  const [input, setInput] = useState('')

  const inProgress = tasks?.filter(t => t.status === 'in_progress') || []
  const blocked = tasks?.filter(t => t.status === 'blocked') || []
  const pending = tasks?.filter(t => t.status === 'pending') || []
  const completed = tasks?.filter(t => t.status === 'completed').slice(0, 5) || []

  async function quickCreate() {
    if (!input.trim()) return
    await createTask(input.trim())
    setInput('')
    mutate()
  }

  async function cycleStatus(task: Task) {
    const next: Record<string, string> = {
      pending: 'in_progress',
      in_progress: 'completed',
      blocked: 'in_progress',
    }
    const nextStatus = next[task.status]
    if (!nextStatus) return
    await updateTask(task.id, { status: nextStatus as Task['status'] })
    mutate()
  }

  function renderGroup(label: string, color: string, items: Task[]) {
    if (items.length === 0) return null
    return (
      <div className="mb-3">
        <div className={`text-xs ${color} px-2 py-1 uppercase tracking-wide`}>
          {label} ({items.length})
        </div>
        {items.map(task => (
          <div key={task.id} className="flex items-start gap-2 p-2 hover:bg-[#1a1a1a] rounded group">
            <button
              onClick={() => cycleStatus(task)}
              disabled={task.status === 'completed' || task.status === 'cancelled'}
              className={`flex-shrink-0 text-xs mt-0.5 ${
                task.status === 'completed' ? 'text-green-400' :
                task.status === 'in_progress' ? 'text-blue-400' :
                task.status === 'blocked' ? 'text-red-400' : 'text-yellow-400'
              } disabled:cursor-default`}
            >
              {task.status === 'completed' ? '[x]' :
               task.status === 'in_progress' ? '[~]' :
               task.status === 'blocked' ? '[!]' : '[ ]'}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${task.status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                {task.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                {task.project && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.project.color }} />
                    {task.project.name}
                  </span>
                )}
                {task.assigned_to && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AGENT_COLORS[task.assigned_to] || '#6b7280' }} />
                    {task.assigned_to}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#333]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && quickCreate()}
            placeholder="New task..."
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-gray-300 outline-none focus:border-[#555] placeholder:text-gray-600"
          />
          <button
            onClick={quickCreate}
            className="px-3 py-2 bg-[#333] hover:bg-[#444] text-white text-sm rounded transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {renderGroup('In Progress', 'text-blue-400', inProgress)}
        {renderGroup('Blocked', 'text-red-400', blocked)}
        {renderGroup('Pending', 'text-yellow-400', pending)}
        {renderGroup('Recently Done', 'text-green-400', completed)}
        {!tasks?.length && (
          <div className="text-center text-gray-600 py-8">No tasks yet</div>
        )}
      </div>
    </div>
  )
}
