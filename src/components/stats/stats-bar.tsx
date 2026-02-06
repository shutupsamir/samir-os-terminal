'use client'

import type { DashboardStats } from '@/lib/types'

interface StatsBarProps {
  stats: DashboardStats
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="bg-[#111] border-b border-[#333] px-6 py-2">
      <div className="flex items-center gap-8 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">PROJECTS</span>
          <span className="text-white font-mono">{stats.total_projects}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span className="text-gray-600">PENDING</span>
          <span className="text-yellow-400 font-mono">{stats.pending_tasks}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="text-gray-600">ACTIVE</span>
          <span className="text-blue-400 font-mono">{stats.active_tasks}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-gray-600">DONE TODAY</span>
          <span className="text-green-400 font-mono">{stats.completed_today}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">INBOX</span>
          <span className={`font-mono ${stats.inbox_count > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
            {stats.inbox_count}
          </span>
        </div>
      </div>
    </div>
  )
}
