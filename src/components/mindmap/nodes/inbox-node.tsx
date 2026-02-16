import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { InboxNodeData } from '@/lib/mindmap/types'

function InboxNodeComponent({ data }: NodeProps) {
  const d = data as unknown as InboxNodeData
  const hasItems = d.count > 0

  return (
    <div className="inbox-node animate-fade-in">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
        style={{
          background: '#111',
          border: hasItems ? '1px solid #fb923c30' : '1px solid #ffffff10',
        }}
      >
        <span className="text-sm">{hasItems ? '\u2709' : '\u2713'}</span>
        <div>
          <div className="text-[10px] text-white/60">Inbox</div>
          {hasItems && (
            <div className="text-[9px] text-orange-400 font-bold">{d.count} items</div>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  )
}

export const InboxNode = memo(InboxNodeComponent)
