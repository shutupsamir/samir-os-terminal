import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { SessionNodeData } from '@/lib/mindmap/types'
import { AGENT_COLORS } from '@/lib/mindmap/constants'

function SessionNodeComponent({ data }: NodeProps) {
  const d = data as unknown as SessionNodeData
  const agentColor = AGENT_COLORS[d.agentName || 'claude'] || AGENT_COLORS.claude

  const elapsed = d.isLive
    ? Math.floor((Date.now() - new Date(d.startedAt).getTime()) / 60000)
    : d.durationMinutes || 0
  const timeStr = elapsed < 60 ? `${elapsed}m` : `${Math.floor(elapsed / 60)}h${elapsed % 60}m`

  return (
    <div className="session-node animate-fade-in">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
        style={{
          background: '#111',
          border: d.isLive ? '1px solid #4ade8050' : '1px solid #ffffff10',
        }}
      >
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: agentColor }} />
        <span className="text-[10px] text-white/60">{timeStr}</span>
        {d.isLive && (
          <span className="text-[8px] font-bold text-green-400 uppercase tracking-wider">Live</span>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="target" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

export const SessionNode = memo(SessionNodeComponent)
