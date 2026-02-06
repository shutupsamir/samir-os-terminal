'use client'

import { useProjectSessions } from '@/lib/hooks/use-project-sessions'
import type { Session } from '@/lib/types'

const AGENT_COLORS: Record<string, string> = {
  claude: '#22c55e',
  clae: '#3b82f6',
  mack: '#a855f7',
}

function getAgentName(session: Session): string {
  return session.context?.agent_name || 'unknown'
}

function getAgentColor(session: Session): string {
  const agent = getAgentName(session)
  return AGENT_COLORS[agent] || '#6b7280'
}

function formatTimeAgo(dateStr: string): string {
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

function formatDuration(minutes?: number): string {
  if (!minutes) return ''
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

interface SessionHistoryProps {
  slug: string
  isOpen: boolean
}

export function SessionHistory({ slug, isOpen }: SessionHistoryProps) {
  const { data: sessions, isLoading } = useProjectSessions(isOpen ? slug : null)

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="border-t border-[#222] pt-3 mt-3">
        <div className="text-xs text-gray-600 animate-pulse">Loading sessions...</div>
      </div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="border-t border-[#222] pt-3 mt-3">
        <div className="text-xs text-gray-600">No sessions yet</div>
      </div>
    )
  }

  return (
    <div className="border-t border-[#222] pt-3 mt-3 space-y-3">
      {sessions.map((session) => {
        const agent = getAgentName(session)
        const agentColor = getAgentColor(session)
        const isActive = !session.ended_at

        return (
          <div key={session.id} className="text-xs space-y-1">
            {/* Header: agent dot + name + time + duration */}
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: agentColor,
                  boxShadow: isActive ? `0 0 6px ${agentColor}` : 'none',
                }}
              />
              <span style={{ color: agentColor }} className="font-medium">
                {agent}
              </span>
              <span className="text-gray-600">
                {formatTimeAgo(session.started_at)}
              </span>
              {session.duration_minutes != null && (
                <span className="text-gray-600">
                  {formatDuration(session.duration_minutes)}
                </span>
              )}
              {isActive && (
                <span className="text-green-400 font-medium ml-auto">LIVE</span>
              )}
            </div>

            {/* Summary */}
            {session.summary && (
              <div className="text-gray-400 pl-4 truncate">
                &ldquo;{session.summary}&rdquo;
              </div>
            )}

            {/* Accomplishments (first 3) */}
            {session.accomplishments && session.accomplishments.length > 0 && (
              <div className="pl-4 space-y-0.5">
                {session.accomplishments.slice(0, 3).map((item, i) => (
                  <div key={i} className="text-gray-500 truncate">
                    + {item}
                  </div>
                ))}
                {session.accomplishments.length > 3 && (
                  <div className="text-gray-600">
                    +{session.accomplishments.length - 3} more
                  </div>
                )}
              </div>
            )}

            {/* Next steps */}
            {session.next_steps && session.next_steps.length > 0 && (
              <div className="text-gray-600 pl-4 truncate">
                Next: {session.next_steps[0]}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
