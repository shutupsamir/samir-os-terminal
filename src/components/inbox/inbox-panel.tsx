'use client'

import { useState } from 'react'
import type { InboxItem } from '@/lib/types'
import { captureInbox, processInboxItem } from '@/lib/api'

interface InboxPanelProps {
  items: InboxItem[]
  onRefresh: () => void
}

export function InboxPanel({ items, onRefresh }: InboxPanelProps) {
  const [input, setInput] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)

  async function capture() {
    if (!input.trim()) return

    try {
      await captureInbox(input.trim())
      setInput('')
      onRefresh()
    } catch (error) {
      console.error('Capture failed:', error)
    }
  }

  async function handleProcess(itemId: string, action: 'archive' | 'done') {
    setProcessing(itemId)
    try {
      await processInboxItem(itemId, action)
      onRefresh()
    } catch (error) {
      console.error('Process failed:', error)
    } finally {
      setProcessing(null)
    }
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#333]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && capture()}
            placeholder="Quick capture..."
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-gray-300 outline-none focus:border-[#555] placeholder:text-gray-600"
          />
          <button
            onClick={capture}
            className="px-3 py-2 bg-[#333] hover:bg-[#444] text-white text-sm rounded transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            Inbox empty
          </div>
        ) : (
          <div className="divide-y divide-[#222]">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3 hover:bg-[#1a1a1a] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 text-xs mt-1">~</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-300">{item.content}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <span>{formatTime(item.captured_at)}</span>
                      {item.project && (
                        <>
                          <span>|</span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.project.color }}
                            />
                            {item.project.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleProcess(item.id, 'done')}
                      disabled={processing === item.id}
                      className="p-1 text-green-500 hover:bg-green-900/30 rounded text-xs"
                      title="Mark done"
                    >
                      done
                    </button>
                    <button
                      onClick={() => handleProcess(item.id, 'archive')}
                      disabled={processing === item.id}
                      className="p-1 text-gray-500 hover:bg-gray-700/30 rounded text-xs"
                      title="Archive"
                    >
                      rm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
