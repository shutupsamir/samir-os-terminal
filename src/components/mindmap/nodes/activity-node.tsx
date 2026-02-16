import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ActivityNodeData } from '@/lib/mindmap/types'

function ActivityNodeComponent({ data }: NodeProps) {
  const d = data as unknown as ActivityNodeData
  const count = d.feedItems.length

  return (
    <div className="activity-node animate-fade-in">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
        style={{
          background: '#111',
          border: '1px solid #60a5fa20',
        }}
      >
        <span className="text-[11px] text-blue-400">{count}</span>
        <span className="text-[9px] text-blue-400/50">activity</span>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="target" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

export const ActivityNode = memo(ActivityNodeComponent)
