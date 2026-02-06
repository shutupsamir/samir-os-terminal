'use client'

import type { ProjectToday } from '@/lib/types'

interface ProjectCardProps {
  project: ProjectToday
}

export function ProjectCard({ project }: ProjectCardProps) {
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
    </div>
  )
}
