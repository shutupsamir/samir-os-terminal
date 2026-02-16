import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { TaskNodeData } from '@/lib/mindmap/types'
import { STATUS_COLORS } from '@/lib/mindmap/constants'

function TaskNodeComponent({ data }: NodeProps) {
  const d = data as unknown as TaskNodeData
  const color = STATUS_COLORS[d.status] || STATUS_COLORS.pending

  return (
    <div className="task-node animate-fade-in">
      <div
        className="flex items-center gap-2 px-2.5 py-1 rounded-md cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
        style={{
          background: '#111',
          border: '1px solid #ffffff08',
          borderLeft: `2px solid ${color}`,
        }}
        title={d.title}
      >
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[9px] text-white/60 max-w-[100px] truncate">{d.title}</span>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="target" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

export const TaskNode = memo(TaskNodeComponent)
