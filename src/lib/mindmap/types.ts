import type { Node, Edge } from '@xyflow/react'

export type MindMapNodeType =
  | 'center'
  | 'project'
  | 'session'
  | 'taskCluster'
  | 'task'
  | 'activity'
  | 'inbox'
  | 'stats'

export interface CenterNodeData {
  [key: string]: unknown
  type: 'center'
  label: string
  activeSessionCount: number
  totalProjects: number
}

export interface ProjectNodeData {
  [key: string]: unknown
  type: 'project'
  slug: string
  name: string
  icon: string
  color: string
  progress: number
  pendingTasks: number
  activeTasks: number
  completedToday: number
  hasActiveSession: boolean
  lastSessionSummary?: string
  expanded: boolean
}

export interface SessionNodeData {
  [key: string]: unknown
  type: 'session'
  sessionId: string
  projectSlug: string
  agentName?: string
  isLive: boolean
  startedAt: string
  endedAt?: string
  durationMinutes?: number
  summary?: string
}

export interface TaskClusterNodeData {
  [key: string]: unknown
  type: 'taskCluster'
  projectSlug: string
  totalTasks: number
  pendingCount: number
  activeCount: number
  blockedCount: number
  expanded: boolean
}

export interface TaskNodeData {
  [key: string]: unknown
  type: 'task'
  taskId: string
  title: string
  status: string
  priority: string
  assignedTo?: string
  projectSlug: string
}

export interface ActivityNodeData {
  [key: string]: unknown
  type: 'activity'
  feedItems: Array<{
    id: string
    title?: string
    timestamp: string
    eventType: string
  }>
  projectSlug: string
}

export interface InboxNodeData {
  [key: string]: unknown
  type: 'inbox'
  count: number
  items: Array<{ id: string; content: string }>
}

export interface StatsNodeData {
  [key: string]: unknown
  type: 'stats'
  sessionsToday: number
  feedCount: number
  inboxCount: number
  pendingTasks: number
  completedToday: number
}

export type MindMapNodeData =
  | CenterNodeData
  | ProjectNodeData
  | SessionNodeData
  | TaskClusterNodeData
  | TaskNodeData
  | ActivityNodeData
  | InboxNodeData
  | StatsNodeData

export type MindMapNode = Node<MindMapNodeData>
export type MindMapEdge = Edge<{ animated?: boolean; glowColor?: string }>
