'use client'

import { useState } from 'react'
import type { MindMapNode, ProjectNodeData, SessionNodeData, TaskNodeData, ActivityNodeData, InboxNodeData, StatsNodeData } from '@/lib/mindmap/types'
import { AGENT_COLORS, STATUS_COLORS } from '@/lib/mindmap/constants'
import { useHabits } from '@/lib/hooks/use-habits'
import { useCalendarToday, type CalendarEvent } from '@/lib/hooks/use-calendar-today'

interface DetailPanelProps {
  node: MindMapNode | null
  onClose: () => void
}

export function DetailPanel({ node, onClose }: DetailPanelProps) {
  if (!node) return null

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-160px)] overflow-y-auto z-50 animate-node-appear">
      <div
        className="rounded-xl border border-white/10 p-4 space-y-3"
        style={{
          background: 'rgba(13,13,13,0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors text-sm"
        >
          \u2715
        </button>

        {renderContent(node)}
      </div>
    </div>
  )
}

function renderContent(node: MindMapNode) {
  const data = node.data

  switch ((data as { type: string }).type) {
    case 'center':
      return <CenterDetail />
    case 'project':
      return <ProjectDetail data={data as ProjectNodeData} />
    case 'session':
      return <SessionDetail data={data as SessionNodeData} />
    case 'task':
      return <TaskDetail data={data as TaskNodeData} />
    case 'activity':
      return <ActivityDetail data={data as ActivityNodeData} />
    case 'inbox':
      return <InboxDetail data={data as InboxNodeData} />
    case 'stats':
      return <StatsDetail data={data as StatsNodeData} />
    default:
      return null
  }
}

function CenterDetail() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-[#00ff88] font-bold text-sm tracking-wider">SAMIR OS</h3>
        <p className="text-xs text-gray-400 mt-2">
          Your neural command center. Click projects to expand.
        </p>
      </div>

      <HabitSection />

      <div className="border-t border-white/5 pt-4">
        <CalendarSection />
      </div>
    </div>
  )
}

function HabitSection() {
  const { habits, completedCount, totalCount, addHabit, removeHabit, toggleCheck, isChecked } = useHabits()
  const [newHabit, setNewHabit] = useState('')

  const handleAdd = () => {
    const name = newHabit.trim()
    if (!name) return
    addHabit(name)
    setNewHabit('')
  }

  return (
    <div className="border-t border-white/5 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[#00ff88] font-bold text-xs tracking-wider">DAILY HABITS</h4>
        {totalCount > 0 && (
          <span className="text-[10px] text-gray-500">
            {completedCount}/{totalCount}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="w-full h-1 rounded-full bg-white/5 mt-2">
          <div
            className="h-full rounded-full transition-all bg-[#00ff88]"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* Habit list */}
      <div className="mt-3 space-y-1.5">
        {habits.map(habit => (
          <div
            key={habit.id}
            className="flex items-center gap-2 group"
          >
            <button
              onClick={() => toggleCheck(habit.id)}
              className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                isChecked(habit.id)
                  ? 'bg-[#00ff88]/20 border-[#00ff88]/50'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {isChecked(habit.id) && (
                <span className="text-[#00ff88] text-[10px]">{'\u2713'}</span>
              )}
            </button>
            <span className={`text-xs flex-1 ${
              isChecked(habit.id) ? 'text-gray-500 line-through' : 'text-gray-300'
            }`}>
              {habit.name}
            </span>
            <button
              onClick={() => removeHabit(habit.id)}
              className="text-gray-700 hover:text-red-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {'\u2715'}
            </button>
          </div>
        ))}
      </div>

      {/* Add habit form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleAdd() }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          placeholder="New habit..."
          className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88]/30"
        />
        <button
          type="submit"
          className="text-[10px] text-[#00ff88]/60 hover:text-[#00ff88] px-2 py-1 border border-white/10 rounded transition-colors"
        >
          +
        </button>
      </form>
    </div>
  )
}

function CalendarSection() {
  const { events, isLoading, isConnected } = useCalendarToday()

  if (!isConnected) {
    return (
      <div>
        <h4 className="text-[#60a5fa] font-bold text-xs tracking-wider">CALENDAR</h4>
        <a
          href="/api/auth/google"
          className="mt-2 inline-block text-xs text-[#60a5fa]/60 hover:text-[#60a5fa] underline transition-colors"
        >
          Connect Google Calendar
        </a>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <h4 className="text-[#60a5fa] font-bold text-xs tracking-wider">CALENDAR</h4>
        <p className="text-[10px] text-gray-600 mt-2 animate-pulse">Loading events...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="text-[#60a5fa] font-bold text-xs tracking-wider">TODAY</h4>
        <span className="text-[10px] text-gray-500">{events.length} events</span>
      </div>
      {events.length === 0 ? (
        <p className="text-xs text-gray-500 mt-2">No events today</p>
      ) : (
        <div className="mt-2 space-y-2">
          {events.map((event: CalendarEvent) => (
            <div
              key={event.id}
              className="bg-white/5 rounded-lg p-2 border border-white/5"
            >
              <div className="text-xs text-white">{event.summary}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {event.allDay
                  ? 'All day'
                  : `${formatTime(event.start)} - ${formatTime(event.end)}`
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } catch {
    return iso
  }
}

function ProjectDetail({ data }: { data: ProjectNodeData }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xl">{data.icon}</span>
        <h3 className="text-white font-bold text-sm">{data.name}</h3>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span style={{ color: data.color }}>{data.progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${data.progress}%`, backgroundColor: data.color }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <StatBox label="Pending" value={data.pendingTasks} color="#facc15" />
          <StatBox label="Active" value={data.activeTasks} color="#60a5fa" />
          <StatBox label="Done" value={data.completedToday} color="#4ade80" />
        </div>
        {data.hasActiveSession && (
          <div className="flex items-center gap-2 mt-2 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Session active
          </div>
        )}
        {data.lastSessionSummary && (
          <div className="mt-2">
            <span className="text-[10px] text-gray-500 uppercase">Last session</span>
            <p className="text-xs text-gray-300 mt-0.5 italic">&quot;{data.lastSessionSummary}&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SessionDetail({ data }: { data: SessionNodeData }) {
  const agentColor = AGENT_COLORS[data.agentName || 'claude'] || AGENT_COLORS.claude
  const elapsed = data.isLive
    ? Math.floor((Date.now() - new Date(data.startedAt).getTime()) / 60000)
    : data.durationMinutes || 0
  const timeStr = elapsed < 60 ? `${elapsed}m` : `${Math.floor(elapsed / 60)}h ${elapsed % 60}m`

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: agentColor }} />
        <h3 className="text-white font-bold text-sm">
          {data.agentName || 'Session'}
          {data.isLive && <span className="ml-2 text-green-400 text-xs animate-pulse">LIVE</span>}
        </h3>
      </div>
      <div className="mt-2 space-y-1 text-xs text-gray-400">
        <div>Duration: {timeStr}</div>
        <div>Started: {new Date(data.startedAt).toLocaleTimeString()}</div>
        {data.summary && <p className="mt-2 text-gray-300 italic">&quot;{data.summary}&quot;</p>}
      </div>
    </div>
  )
}

function TaskDetail({ data }: { data: TaskNodeData }) {
  const statusColor = STATUS_COLORS[data.status] || '#6b7280'
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
        <h3 className="text-white font-bold text-sm">{data.title}</h3>
      </div>
      <div className="mt-2 space-y-1 text-xs text-gray-400">
        <div>Status: <span style={{ color: statusColor }}>{data.status}</span></div>
        <div>Priority: {data.priority}</div>
        {data.assignedTo && (
          <div className="flex items-center gap-1">
            Assigned to:
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: AGENT_COLORS[data.assignedTo] || '#666' }} />
            {data.assignedTo}
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityDetail({ data }: { data: ActivityNodeData }) {
  return (
    <div>
      <h3 className="text-blue-400 font-bold text-sm">Recent Activity</h3>
      <div className="mt-2 space-y-2">
        {data.feedItems.map(item => (
          <div key={item.id} className="text-xs">
            <span className="text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
            <span className="text-gray-300 ml-2">{item.title || item.eventType}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function InboxDetail({ data }: { data: InboxNodeData }) {
  return (
    <div>
      <h3 className="text-orange-400 font-bold text-sm">Inbox ({data.count})</h3>
      {data.items.length > 0 ? (
        <div className="mt-2 space-y-2">
          {data.items.map(item => (
            <div key={item.id} className="text-xs text-gray-300 p-2 rounded bg-white/5">
              {item.content}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 mt-2">Inbox clear</p>
      )}
    </div>
  )
}

function StatsDetail({ data }: { data: StatsNodeData }) {
  return (
    <div>
      <h3 className="text-purple-400 font-bold text-sm">Today&apos;s Stats</h3>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <StatBox label="Sessions" value={data.sessionsToday} color="#a78bfa" />
        <StatBox label="Feed Items" value={data.feedCount} color="#60a5fa" />
        <StatBox label="Inbox" value={data.inboxCount} color="#fb923c" />
        <StatBox label="Completed" value={data.completedToday} color="#4ade80" />
        <StatBox label="Pending" value={data.pendingTasks} color="#facc15" />
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-2 text-center">
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[9px] text-gray-500 uppercase">{label}</div>
    </div>
  )
}
