'use client'

import { useState, useRef, useEffect } from 'react'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { logActivity, captureInbox, logTime } from '@/lib/api'
import { ProjectCard } from '@/components/projects/project-card'
import { ActivityFeed } from '@/components/feed/activity-feed'
import { ContributionHeatmap } from '@/components/heatmap/contribution-heatmap'
import { CommandInput } from '@/components/input/command-input'
import { StatsBar } from '@/components/stats/stats-bar'
import { InboxPanel } from '@/components/inbox/inbox-panel'
import { SessionsPanel } from '@/components/sessions/sessions-panel'
import type { DashboardData } from '@/lib/types'

export default function Terminal() {
  const { data, isLoading, mutate } = useDashboard()
  const [activePanel, setActivePanel] = useState<'feed' | 'inbox' | 'sessions'>('feed')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [commandHistory])

  async function executeCommand(command: string) {
    setCommandHistory(prev => [...prev, `$ ${command}`])

    const parts = command.trim().toLowerCase().split(' ')
    const cmd = parts[0]
    const args = parts.slice(1)

    switch (cmd) {
      case 'status':
        setCommandHistory(prev => [...prev, formatStatus(data)])
        break

      case 'log':
        if (args.length > 0) {
          const message = parts.slice(1).join(' ')
          await logActivity(message)
          setCommandHistory(prev => [...prev, `Logged: ${message}`])
          mutate()
        } else {
          setCommandHistory(prev => [...prev, 'Usage: log <message>'])
        }
        break

      case 'capture':
        if (args.length > 0) {
          const content = parts.slice(1).join(' ')
          await captureInbox(content)
          setCommandHistory(prev => [...prev, `Captured to inbox: ${content}`])
          mutate()
        } else {
          setCommandHistory(prev => [...prev, 'Usage: capture <message>'])
        }
        break

      case 'track':
      case 't':
        if (args.length > 0) {
          const description = parts.slice(1).join(' ')
          const result = await logTime(description)
          if (result.success) {
            const { category, projectSlug } = result.categorization
            setCommandHistory(prev => [...prev,
              `Logged: ${description}`,
              `  > Category: ${category}${projectSlug ? ` | Project: ${projectSlug}` : ''}`
            ])
          }
          mutate()
        } else {
          setCommandHistory(prev => [...prev, 'Usage: track <what you did>'])
        }
        break

      case 'feed':
        setActivePanel('feed')
        setCommandHistory(prev => [...prev, 'Showing activity feed'])
        break

      case 'inbox':
        setActivePanel('inbox')
        setCommandHistory(prev => [...prev, 'Showing inbox panel'])
        break

      case 'sessions':
        setActivePanel('sessions')
        setCommandHistory(prev => [...prev, 'Showing sessions panel'])
        break

      case 'clear':
        setCommandHistory([])
        break

      case 'help':
        setCommandHistory(prev => [...prev,
          '',
          'COMMANDS',
          String.fromCharCode(0x2500).repeat(40),
          '  status        Show all project statuses',
          '  feed          Show activity feed',
          '  sessions      Show recent sessions',
          '  inbox         Show inbox panel',
          '  log <msg>     Log an activity',
          '  capture <msg> Quick capture to inbox',
          '  track <msg>   Log time entry (auto-categorizes)',
          '  t <msg>       Shortcut for track',
          '  clear         Clear terminal output',
          '  help          Show this help',
          ''
        ])
        break

      default:
        setCommandHistory(prev => [...prev, `Unknown command: ${cmd}. Type 'help' for available commands.`])
    }
  }

  function formatStatus(data: DashboardData | undefined): string {
    if (!data) return 'No data available'

    const lines = [
      '',
      'PROJECT STATUS',
      String.fromCharCode(0x2500).repeat(50),
      ...data.today.map(p =>
        `  ${p.icon} ${p.name.padEnd(15)} ${progressBar(p.progress_percent, 20)} ${String(p.progress_percent).padStart(3)}%  (${p.pending_tasks} pending)`
      ),
      '',
      `  Tasks: ${data.stats.pending_tasks} pending | ${data.stats.active_tasks} active | ${data.stats.completed_today} done today`,
      `  Inbox: ${data.stats.inbox_count} items`,
      ''
    ]
    return lines.join('\n')
  }

  function progressBar(percent: number, width: number): string {
    const filled = Math.round((percent / 100) * width)
    const empty = width - filled
    return '\u2588'.repeat(filled) + '\u2591'.repeat(empty)
  }

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pb-bg text-[#00ff00] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl mb-4">LOADING</div>
          <div className="text-sm text-gray-500">Initializing SamirOS Terminal...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pb-bg text-[#e0e0e0]">
      {/* Title Bar */}
      <header className="border-b border-[#333] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
              <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-wider">SAMIR OS TERMINAL</h1>
            <span className="text-xs text-gray-600">v1.0.0</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="text-pb-accent">
              {data?.recentSessions?.find(s => !s.ended_at)
                ? `SESSION ACTIVE`
                : 'NO SESSION'}
            </span>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      {data && <StatsBar stats={data.stats} />}

      {/* Main Content */}
      <div className="p-6">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-lg text-white">{getGreeting()}, Samir</h2>
          <p className="text-gray-500 text-xs mt-1">
            {data?.stats.pending_tasks || 0} tasks pending across {data?.stats.total_projects || 0} projects
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Projects + Terminal */}
          <div className="col-span-5 space-y-6">
            {/* Projects */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#00ff00]">$</span>
                <span className="text-gray-400 text-sm">ls -la ~/projects</span>
              </div>
              <div className="space-y-3">
                {data?.today.map((project) => (
                  <ProjectCard key={project.project_id} project={project} />
                ))}
              </div>
            </section>

            {/* Terminal */}
            <section className="bg-[#111] border border-[#333] rounded-lg overflow-hidden">
              <div className="bg-[#1a1a1a] px-4 py-2 border-b border-[#333] flex items-center justify-between">
                <span className="text-xs text-gray-500">Terminal</span>
                <span className="text-xs text-gray-700">Cmd+K to focus</span>
              </div>
              <div ref={outputRef} className="p-4 h-48 overflow-y-auto text-sm">
                <div className="text-gray-600 mb-2">Type &apos;help&apos; for commands.</div>
                {commandHistory.map((line, i) => (
                  <div
                    key={i}
                    className={line.startsWith('$') ? 'text-[#00ff00]' : 'text-gray-300'}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {line}
                  </div>
                ))}
              </div>
              <CommandInput onSubmit={executeCommand} />
            </section>
          </div>

          {/* Middle Column: Active Session + Receipts placeholder */}
          <div className="col-span-3 space-y-6">
            {/* Active Session Indicator */}
            {data?.recentSessions?.find(s => !s.ended_at) && (
              <div className="bg-[#111] border border-green-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs text-green-400 uppercase tracking-wide">Active Session</span>
                </div>
                {(() => {
                  const active = data.recentSessions.find(s => !s.ended_at)!
                  const elapsed = Math.floor((Date.now() - new Date(active.started_at).getTime()) / 60000)
                  return (
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{active.project?.icon}</span>
                        <span className="text-sm text-white">{active.project?.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {elapsed < 60 ? `${elapsed}m` : `${Math.floor(elapsed / 60)}h ${elapsed % 60}m`} elapsed
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Receipt count summary */}
            <div className="bg-[#111] border border-[#333] rounded-lg p-4">
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3">System</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sessions today</span>
                  <span className="text-white">
                    {data?.recentSessions?.filter(s => {
                      const d = new Date(s.started_at)
                      const today = new Date()
                      return d.toDateString() === today.toDateString()
                    }).length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Feed items</span>
                  <span className="text-white">{data?.feed?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Inbox items</span>
                  <span className={data?.stats.inbox_count ? 'text-orange-400' : 'text-white'}>
                    {data?.stats.inbox_count || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Feed / Inbox / Sessions */}
          <div className="col-span-4 space-y-4">
            {/* Panel Tabs */}
            <div className="flex gap-2">
              {(['feed', 'inbox', 'sessions'] as const).map(panel => (
                <button
                  key={panel}
                  onClick={() => setActivePanel(panel)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    activePanel === panel
                      ? 'bg-[#333] text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {panel.toUpperCase()}
                  {panel === 'inbox' && data?.stats.inbox_count ? ` (${data.stats.inbox_count})` : ''}
                </button>
              ))}
            </div>

            {/* Active Panel */}
            <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden h-[500px]">
              {activePanel === 'feed' && <ActivityFeed items={data?.feed || []} />}
              {activePanel === 'inbox' && (
                <InboxPanel items={data?.inbox || []} onRefresh={() => mutate()} />
              )}
              {activePanel === 'sessions' && (
                <SessionsPanel sessions={data?.recentSessions || []} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Contribution Heatmap */}
        <div className="mt-6">
          <ContributionHeatmap data={data?.heatmap || []} />
        </div>
      </div>
    </div>
  )
}
