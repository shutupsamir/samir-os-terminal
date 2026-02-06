'use client'

import type { FeedItem } from '@/lib/types'

interface ActivityFeedProps {
  items: FeedItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Group by date
  const grouped: Record<string, FeedItem[]> = {}
  items.forEach(item => {
    const dateKey = formatDate(item.timestamp)
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(item)
  })

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-3 border-b border-[#333] sticky top-0 bg-[#111]">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide">Live Feed</h3>
      </div>

      <div className="p-2">
        {Object.entries(grouped).map(([date, dateItems]) => (
          <div key={date} className="mb-4">
            <div className="text-xs text-gray-600 px-2 py-1 sticky top-10 bg-[#111]">
              {date}
            </div>
            {dateItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 px-2 py-2 hover:bg-[#1a1a1a] rounded transition-colors"
              >
                <span className="text-xs text-gray-600 w-12 flex-shrink-0 font-mono">
                  {formatTime(item.timestamp)}
                </span>
                <span className="flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-300 truncate">
                    {item.title || item.event_type}
                  </div>
                  {item.project_name && (
                    <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.project_color }}
                      />
                      {item.project_name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center text-gray-600 py-8">
            No activity yet
          </div>
        )}
      </div>
    </div>
  )
}
