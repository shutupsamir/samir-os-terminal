import type { DashboardData, Task, FeedItem } from '@/lib/types'
import type {
  MindMapNode,
  MindMapEdge,
  CenterNodeData,
  ProjectNodeData,
  SessionNodeData,
  TaskNodeData,
  ActivityNodeData,
  InboxNodeData,
  StatsNodeData,
} from '@/lib/mindmap/types'
import { ACCENT_COLORS } from '@/lib/mindmap/constants'

interface BuildGraphInput {
  dashboard: DashboardData
  expandedProjects: Set<string>
  projectTasks: Record<string, Task[]>
}

interface GraphOutput {
  nodes: MindMapNode[]
  edges: MindMapEdge[]
}

export function buildGraph({
  dashboard,
  expandedProjects,
  projectTasks,
}: BuildGraphInput): GraphOutput {
  const nodes: MindMapNode[] = []
  const edges: MindMapEdge[] = []

  const activeSessions = dashboard.recentSessions?.filter(s => !s.ended_at) || []

  // ─── Center node ───
  const centerData: CenterNodeData = {
    type: 'center',
    label: 'Samir',
    activeSessionCount: activeSessions.length,
    totalProjects: dashboard.stats.total_projects,
  }
  nodes.push({
    id: 'center',
    type: 'center',
    position: { x: 0, y: 0 },
    data: centerData,
    draggable: true,
  })

  // ─── Project nodes ───
  for (const project of dashboard.today) {
    const hasActiveSession = activeSessions.some(s => s.project?.slug === project.slug)
    const isExpanded = expandedProjects.has(project.slug) || hasActiveSession

    const projectData: ProjectNodeData = {
      type: 'project',
      slug: project.slug,
      name: project.name,
      icon: project.icon,
      color: project.color,
      progress: project.progress_percent,
      pendingTasks: project.pending_tasks,
      activeTasks: project.active_tasks,
      completedToday: project.completed_today,
      hasActiveSession,
      lastSessionSummary: project.last_session_summary,
      expanded: isExpanded,
    }

    const nodeId = `project-${project.slug}`
    nodes.push({
      id: nodeId,
      type: 'project',
      position: { x: 0, y: 0 }, // Layout engine positions these
      data: projectData,
      draggable: true,
    })

    edges.push({
      id: `center->${nodeId}`,
      source: 'center',
      target: nodeId,
      type: 'neural',
      data: {
        glowColor: project.color || ACCENT_COLORS.project,
        animated: hasActiveSession,
      },
    })

    // ─── Child nodes (when expanded) ───
    if (isExpanded) {
      // Sessions for this project
      const projectSessions = (dashboard.recentSessions || [])
        .filter(s => s.project?.slug === project.slug)
        .slice(0, 3)

      for (const session of projectSessions) {
        const sessionId = `session-${session.id}`
        const sessionData: SessionNodeData = {
          type: 'session',
          sessionId: session.id,
          projectSlug: project.slug,
          agentName: session.context?.agent_name,
          isLive: !session.ended_at,
          startedAt: session.started_at,
          endedAt: session.ended_at,
          durationMinutes: session.duration_minutes,
          summary: session.summary,
        }
        nodes.push({
          id: sessionId,
          type: 'session',
          position: { x: 0, y: 0 },
          data: sessionData,
          draggable: true,
        })
        edges.push({
          id: `${nodeId}->${sessionId}`,
          source: nodeId,
          target: sessionId,
          type: 'neural',
          data: {
            glowColor: !session.ended_at ? '#4ade80' : '#334155',
            animated: !session.ended_at,
          },
        })
      }

      // Task nodes (direct children of project — no cluster intermediary)
      const tasks = projectTasks[project.slug] || []
      const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled')
      for (const task of activeTasks.slice(0, 8)) {
        const taskNodeId = `task-${task.id}`
        const taskData: TaskNodeData = {
          type: 'task',
          taskId: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assigned_to,
          projectSlug: project.slug,
        }
        nodes.push({
          id: taskNodeId,
          type: 'task',
          position: { x: 0, y: 0 },
          data: taskData,
          draggable: true,
        })
        edges.push({
          id: `${nodeId}->${taskNodeId}`,
          source: nodeId,
          target: taskNodeId,
          type: 'neural',
          data: { glowColor: '#facc1540', animated: false },
        })
      }

      // Activity node (last 5 feed items for this project)
      const projectFeed = (dashboard.feed || [])
        .filter((f: FeedItem) => f.project_slug === project.slug)
        .slice(0, 5)
      if (projectFeed.length > 0) {
        const activityId = `activity-${project.slug}`
        const activityData: ActivityNodeData = {
          type: 'activity',
          feedItems: projectFeed.map((f: FeedItem) => ({
            id: f.id,
            title: f.title,
            timestamp: f.timestamp,
            eventType: f.event_type,
          })),
          projectSlug: project.slug,
        }
        nodes.push({
          id: activityId,
          type: 'activity',
          position: { x: 0, y: 0 },
          data: activityData,
          draggable: true,
        })
        edges.push({
          id: `${nodeId}->${activityId}`,
          source: nodeId,
          target: activityId,
          type: 'neural',
          data: { glowColor: '#60a5fa30', animated: false },
        })
      }
    }
  }

  // ─── Inbox node ───
  const inboxData: InboxNodeData = {
    type: 'inbox',
    count: dashboard.stats.inbox_count,
    items: (dashboard.inbox || []).slice(0, 5).map(i => ({ id: i.id, content: i.content })),
  }
  nodes.push({
    id: 'inbox',
    type: 'inbox',
    position: { x: 0, y: 0 },
    data: inboxData,
    draggable: true,
  })
  edges.push({
    id: 'center->inbox',
    source: 'center',
    target: 'inbox',
    type: 'neural',
    data: {
      glowColor: dashboard.stats.inbox_count > 0 ? '#fb923c' : '#333',
      animated: dashboard.stats.inbox_count > 0,
    },
  })

  // ─── Stats node ───
  const sessionsToday = (dashboard.recentSessions || []).filter(s => {
    const d = new Date(s.started_at)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  }).length

  const statsData: StatsNodeData = {
    type: 'stats',
    sessionsToday,
    feedCount: dashboard.feed?.length || 0,
    inboxCount: dashboard.stats.inbox_count,
    pendingTasks: dashboard.stats.pending_tasks,
    completedToday: dashboard.stats.completed_today,
  }
  nodes.push({
    id: 'stats',
    type: 'stats',
    position: { x: 0, y: 0 },
    data: statsData,
    draggable: true,
  })
  edges.push({
    id: 'center->stats',
    source: 'center',
    target: 'stats',
    type: 'neural',
    data: { glowColor: '#a78bfa', animated: false },
  })

  return { nodes, edges }
}
