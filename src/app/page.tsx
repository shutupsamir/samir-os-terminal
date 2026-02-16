'use client'

import { useState, useCallback } from 'react'
import { useMindMap } from '@/components/mindmap/use-mind-map'
import { MindMapCanvas } from '@/components/mindmap/mind-map-canvas'
import { DetailPanel } from '@/components/mindmap/panels/detail-panel'
import { TerminalOverlay } from '@/components/mindmap/panels/terminal-overlay'
import { handleMapCommand } from '@/lib/mindmap/commands'
import { logActivity, captureInbox, logTime, createTask } from '@/lib/api'

export default function NeuralMindMap() {
  const {
    nodes,
    edges,
    isLoading,
    selectedNodeId,
    dashboard,
    mutate,
    toggleProject,
    selectNode,
    expandAll,
    collapseAll,
    focusProject,
  } = useMindMap()

  const [terminalCollapsed, setTerminalCollapsed] = useState(false)

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) || null : null

  // ─── Single click: expand/collapse + show detail ───
  const handleNodeClick = useCallback((nodeId: string, nodeType: string) => {
    if (nodeType === 'project') {
      const slug = nodeId.replace('project-', '')
      toggleProject(slug)
    }
    // Always toggle detail panel
    selectNode(selectedNodeId === nodeId ? null : nodeId)
  }, [toggleProject, selectNode, selectedNodeId])

  // ─── Terminal commands ───
  const handleCommand = useCallback(async (command: string) => {
    const parts = command.trim().split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Try map commands first
    const projectSlugs = dashboard?.today.map(p => p.slug) || []
    const mapResult = handleMapCommand(cmd, args, {
      focusProject,
      expandAll,
      collapseAll,
      toggleProject,
      selectNode,
      projectSlugs,
    })
    if (mapResult.handled) return

    // Original terminal commands
    switch (cmd) {
      case 'log':
        if (args.length > 0) {
          await logActivity(args.join(' '))
          mutate()
        }
        break

      case 'capture':
        if (args.length > 0) {
          await captureInbox(args.join(' '))
          mutate()
        }
        break

      case 'track':
      case 't':
        if (args.length > 0) {
          await logTime(args.join(' '))
          mutate()
        }
        break

      case 'task':
        if (args.length > 0) {
          await createTask(args.join(' '))
          mutate()
        }
        break

      case 'status':
        expandAll()
        break

      case 'help':
        break
    }
  }, [dashboard, mutate, focusProject, expandAll, collapseAll, toggleProject, selectNode])

  // ─── Loading state ───
  if (isLoading) {
    return (
      <div className="min-h-screen bg-pb-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 animate-breathe"
            style={{
              background: 'radial-gradient(circle at 40% 35%, #1a3a2a, #0d1a14 70%)',
              boxShadow: '0 0 20px rgba(0,255,136,0.15)',
            }}
          />
          <div className="text-[#00ff88]/60 text-sm animate-pulse tracking-widest">LOADING</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-pb-bg neural-bg">
      {/* Status bar */}
      <header className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
            </div>
            <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase font-bold">SamirOS</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-600 pointer-events-auto">
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {dashboard?.recentSessions?.find(s => !s.ended_at) ? (
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                SESSION ACTIVE
              </span>
            ) : (
              <span className="text-gray-600">NO SESSION</span>
            )}
            {dashboard && (
              <span className="text-gray-600">
                {dashboard.stats.pending_tasks} pending
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mind map canvas */}
      <MindMapCanvas
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
      />

      {/* Detail panel */}
      <DetailPanel
        node={selectedNode}
        onClose={() => selectNode(null)}
      />

      {/* Terminal overlay */}
      <TerminalOverlay
        onCommand={handleCommand}
        collapsed={terminalCollapsed}
        onToggle={() => setTerminalCollapsed(prev => !prev)}
      />
    </div>
  )
}
