'use client'

import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { CenterNode } from './nodes/center-node'
import { ProjectNode } from './nodes/project-node'
import { SessionNode } from './nodes/session-node'
import { TaskNode } from './nodes/task-node'
import { ActivityNode } from './nodes/activity-node'
import { InboxNode } from './nodes/inbox-node'
import { StatsNode } from './nodes/stats-node'
import { NeuralEdge } from './edges/neural-edge'

const nodeTypes: NodeTypes = {
  center: CenterNode,
  project: ProjectNode,
  session: SessionNode,
  task: TaskNode,
  activity: ActivityNode,
  inbox: InboxNode,
  stats: StatsNode,
}

const edgeTypes: EdgeTypes = {
  neural: NeuralEdge,
}

interface MindMapCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodeClick: (nodeId: string, nodeType: string) => void
}

export function MindMapCanvas({ nodes: inputNodes, edges: inputEdges, onNodeClick }: MindMapCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(inputNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(inputEdges)

  // Sync external changes — deterministic layout means we can replace positions directly
  useEffect(() => {
    setNodes(inputNodes)
  }, [inputNodes, setNodes])

  useEffect(() => {
    setEdges(inputEdges)
  }, [inputEdges, setEdges])

  const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    onNodeClick(node.id, node.type || '')
  }, [onNodeClick])

  const miniMapNodeColor = useCallback((node: Node) => {
    switch (node.type) {
      case 'center': return '#00ff88'
      case 'project': return (node.data as Record<string, unknown>).color as string || '#60a5fa'
      case 'session': return '#4ade80'
      case 'task': return '#facc15'
      case 'inbox': return '#fb923c'
      case 'stats': return '#a78bfa'
      default: return '#333'
    }
  }, [])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{ animated: false }}
        proOptions={{ hideAttribution: true }}
        className="mind-map-flow"
      >
        <Background color="#1a1a1a" gap={40} size={1} />
        <Controls
          className="!bg-[#111] !border-[#333] !rounded-lg [&_button]:!bg-[#111] [&_button]:!border-[#333] [&_button]:!text-white [&_button:hover]:!bg-[#222]"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={miniMapNodeColor}
          maskColor="rgba(0,0,0,0.8)"
          className="!bg-[#0a0a0a] !border-[#333] !rounded-lg"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  )
}
