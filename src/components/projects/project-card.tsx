'use client'

import { useState } from 'react'
import type { ProjectToday } from '@/lib/types'
import { SessionHistory } from './session-history'
import { TaskList } from './task-list'

const PROJECT_APPS: Record<string, string> = {
  printbliss: 'https://printbliss-platform.vercel.app/dashboard',
  nucleus: 'https://nucleus-content.vercel.app',
  samirhamid: 'https://samirhamid.com',
  'prime-trade': 'https://prime-trade-exchange.vercel.app',
  'milestone-merch': 'https://milestone-merch.vercel.app',
  'samir-os-terminal': 'https://samir-os-terminal.vercel.app',
  spine: 'https://github.com/shutupsamir/agentic-spine',
}

const PROJECT_REPOS: Record<string, string> = {
  printbliss: 'https://github.com/shutupsamir/printbliss-platform',
  nucleus: 'https://github.com/shutupsamir/nucleus',
  samirhamid: 'https://github.com/shutupsamir/samir-website',
  'prime-trade': 'https://github.com/shutupsamir/prime-trade-exchange',
  'milestone-merch': 'https://github.com/shutupsamir/milestone-merch',
  'samir-os-terminal': 'https://github.com/shutupsamir/samir-os-terminal',
  spine: 'https://github.com/shutupsamir/agentic-spine',
}

interface ProjectCardProps {
  project: ProjectToday
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [sessionsOpen, setSessionsOpen] = useState(false)
  const [tasksOpen, setTasksOpen] = useState(false)
  const appUrl = PROJECT_APPS[project.slug]
  const repoUrl = PROJECT_REPOS[project.slug]

  function formatTimeAgo(dateStr?: string) {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  function progressBar(percent: number): string {
    const width = 20
    const filled = Math.round((percent / 100) * width)
    const empty = width - filled
    return '\u2588'.repeat(filled) + '\u2591'.repeat(empty)
  }

  return (
    <div
      className="bg-[#111] border border-[#333] rounded-lg p-4 hover:border-[#555] transition-colors"
      style={{ borderLeftColor: project.color, borderLeftWidth: '3px' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{project.icon}</span>
          <span className="font-medium text-white">{project.name}</span>
        </div>
        <span className="text-xs text-gray-600">
          {formatTimeAgo(project.last_session_at)}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{project.progress_percent}%</span>
        </div>
        <div className="font-mono text-xs" style={{ color: project.color }}>
          {progressBar(project.progress_percent)}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span className="text-yellow-400">{project.pending_tasks} pending</span>
        <span className="text-blue-400">{project.active_tasks} active</span>
        <span className="text-green-400">{project.completed_today} done</span>
      </div>

      {project.last_session_summary && (
        <div className="text-xs text-gray-500 mt-3 truncate">
          &ldquo;{project.last_session_summary}&rdquo;
        </div>
      )}

      {/* Action links */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#222]">
        {appUrl ? (
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-pb-accent hover:text-pb-accent-hover transition-colors"
          >
            Open app &rarr;
          </a>
        ) : (
          <span className="text-xs text-gray-700">No app URL</span>
        )}
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-white transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            repo
          </a>
        )}
      </div>

      {/* Sessions toggle */}
      <button
        onClick={() => setSessionsOpen(!sessionsOpen)}
        className="w-full flex items-center gap-1 pt-2 mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        <span className="transition-transform" style={{ transform: sessionsOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          &#9656;
        </span>
        Sessions
      </button>

      <SessionHistory slug={project.slug} isOpen={sessionsOpen} />

      {/* Tasks toggle */}
      <button
        onClick={() => setTasksOpen(!tasksOpen)}
        className="w-full flex items-center gap-1 pt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        <span className="transition-transform" style={{ transform: tasksOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          &#9656;
        </span>
        Tasks
        {(project.pending_tasks + project.active_tasks) > 0 && (
          <span className="ml-auto text-gray-700">{project.pending_tasks + project.active_tasks}</span>
        )}
      </button>

      <TaskList slug={project.slug} isOpen={tasksOpen} />
    </div>
  )
}
