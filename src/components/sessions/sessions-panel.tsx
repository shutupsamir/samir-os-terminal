'use client'

import type { Session } from '@/lib/types'

interface SessionsPanelProps {
  sessions: Session[]
}

export function SessionsPanel({ sessions }: SessionsPanelProps) {
  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }

  function formatDuration(minutes?: number) {
    if (!minutes) return ''
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#333]">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide">Recent Sessions</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No sessions yet
          </div>
        ) : (
          <div className="divide-y divide-[#222]">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-3 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {session.project && (
                      <>
                        <span>{session.project.icon}</span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: session.project.color }}
                        >
                          {session.project.name}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    {session.duration_minutes && (
                      <span className="text-gray-500">
                        {formatDuration(session.duration_minutes)}
                      </span>
                    )}
                    {!session.ended_at && (
                      <span className="text-green-400 animate-pulse">LIVE</span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  {formatDate(session.started_at)}
                </div>

                {session.summary && (
                  <div className="text-sm text-gray-400 mb-2">
                    {session.summary}
                  </div>
                )}

                {session.accomplishments && session.accomplishments.length > 0 && (
                  <div className="text-xs text-gray-500 space-y-1">
                    {session.accomplishments.slice(0, 3).map((acc, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green-500">+</span>
                        <span>{acc}</span>
                      </div>
                    ))}
                    {session.accomplishments.length > 3 && (
                      <div className="text-gray-600">
                        +{session.accomplishments.length - 3} more
                      </div>
                    )}
                  </div>
                )}

                {session.next_steps && session.next_steps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#222]">
                    <span className="text-xs text-gray-600">
                      Next: {session.next_steps[0]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
