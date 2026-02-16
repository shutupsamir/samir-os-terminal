import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { CenterNodeData } from '@/lib/mindmap/types'

function CenterNodeComponent({ data }: NodeProps) {
  const d = data as unknown as CenterNodeData
  return (
    <div className="center-node relative flex items-center justify-center">
      {/* Subtle breathing ring */}
      <div className="absolute w-[130px] h-[130px] rounded-full border border-[#00ff88]/10 animate-breathe" />

      {/* Main orb — lighter */}
      <div
        className="w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center relative z-10 cursor-pointer"
        style={{
          background: 'radial-gradient(circle at 40% 35%, #1a3a2a, #0d1a14 70%)',
          boxShadow: '0 0 20px rgba(0,255,136,0.15), inset 0 0 12px rgba(0,255,136,0.05)',
        }}
      >
        <span className="text-[#00ff88] text-xs font-bold tracking-widest uppercase">Samir</span>
        <span className="text-[#00ff88]/40 text-[10px] mt-0.5">
          {d.totalProjects} projects
        </span>
        {d.activeSessionCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-[8px] text-black font-bold">{d.activeSessionCount}</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

export const CenterNode = memo(CenterNodeComponent)
