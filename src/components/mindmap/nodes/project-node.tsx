import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ProjectNodeData } from '@/lib/mindmap/types'

function ProjectNodeComponent({ data }: NodeProps) {
  const d = data as unknown as ProjectNodeData
  const color = d.color || '#60a5fa'
  const progressPct = Math.min(100, Math.max(0, d.progress))

  return (
    <div className="project-node animate-fade-in">
      <div
        className="relative w-[160px] rounded-xl cursor-pointer transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
        style={{
          background: '#111',
          border: `1px solid ${color}30`,
          borderLeft: d.hasActiveSession ? `3px solid #4ade80` : `3px solid ${color}50`,
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className="text-lg shrink-0">{d.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-white/90 font-medium truncate">{d.name}</div>
            {d.pendingTasks > 0 && (
              <div className="text-[9px] text-white/40">{d.pendingTasks} pending</div>
            )}
          </div>
          <span className="text-[10px] text-white/30 shrink-0">
            {d.expanded ? '\u25C0' : '\u25B6'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] w-full bg-white/5">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${progressPct}%`, background: color }}
          />
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="target" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

export const ProjectNode = memo(ProjectNodeComponent)
