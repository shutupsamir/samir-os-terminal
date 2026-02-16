import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { StatsNodeData } from '@/lib/mindmap/types'

function StatsNodeComponent({ data }: NodeProps) {
  const d = data as unknown as StatsNodeData

  return (
    <div className="stats-node animate-fade-in">
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
        style={{
          background: '#111',
          border: '1px solid #a78bfa20',
        }}
      >
        <div className="text-center">
          <div className="text-[11px] text-purple-400 font-bold">{d.sessionsToday}</div>
          <div className="text-[7px] text-purple-400/50">sessions</div>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="text-center">
          <div className="text-[11px] text-green-400">{d.completedToday}</div>
          <div className="text-[7px] text-green-400/50">done</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

export const StatsNode = memo(StatsNodeComponent)
