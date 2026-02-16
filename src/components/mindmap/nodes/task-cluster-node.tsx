import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { TaskClusterNodeData } from '@/lib/mindmap/types'

function TaskClusterNodeComponent({ data }: NodeProps) {
  const d = data as unknown as TaskClusterNodeData

  return (
    <div className="task-cluster-node animate-fade-in">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
        style={{
          background: '#111',
          border: '1px solid #facc1530',
        }}
      >
        <span className="text-sm font-bold text-yellow-400">{d.totalTasks}</span>
        <span className="text-[9px] text-yellow-400/50">tasks</span>
        {d.activeCount > 0 && (
          <span className="text-[8px] text-blue-400">{d.activeCount} active</span>
        )}
        <span className="text-[9px] text-white/20 ml-auto">
          {d.expanded ? '\u25C0' : '\u25B6'}
        </span>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="target" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

export const TaskClusterNode = memo(TaskClusterNodeComponent)
