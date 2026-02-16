import { useState, useRef, useCallback, useMemo } from 'react'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { useProjectTasks } from '@/lib/hooks/use-project-tasks'
import { buildGraph } from './graph-builder'
import { computeLayout } from './layout-engine'
import type { MindMapNode, MindMapEdge } from '@/lib/mindmap/types'
import type { Task } from '@/lib/types'

export function useMindMap() {
  const { data: dashboard, isLoading, mutate } = useDashboard()
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Track which project slug we're fetching tasks for
  const [tasksFetchSlug, setTasksFetchSlug] = useState<string | null>(null)
  const { data: fetchedTasks } = useProjectTasks(tasksFetchSlug)
  const projectTasksRef = useRef<Record<string, Task[]>>({})

  // Update task cache when new tasks arrive
  if (tasksFetchSlug && fetchedTasks) {
    projectTasksRef.current[tasksFetchSlug] = fetchedTasks
  }

  const toggleProject = useCallback((slug: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
        setTasksFetchSlug(slug)
      }
      return next
    })
  }, [])

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId)
  }, [])

  const expandAll = useCallback(() => {
    if (!dashboard) return
    const all = new Set(dashboard.today.map(p => p.slug))
    setExpandedProjects(all)
  }, [dashboard])

  const collapseAll = useCallback(() => {
    setExpandedProjects(new Set())
  }, [])

  const focusProject = useCallback((slug: string) => {
    setExpandedProjects(new Set([slug]))
  }, [])

  // Build graph from data — deterministic layout, no positionsRef needed
  const { nodes, edges } = useMemo<{ nodes: MindMapNode[]; edges: MindMapEdge[] }>(() => {
    if (!dashboard) {
      const fallback: MindMapNode[] = [{
        id: 'center',
        type: 'center',
        position: { x: 0, y: 0 },
        data: { type: 'center', label: 'Samir', activeSessionCount: 0, totalProjects: 0 },
        draggable: true,
      }]
      return { nodes: fallback, edges: [] }
    }

    const graph = buildGraph({
      dashboard,
      expandedProjects,
      projectTasks: projectTasksRef.current,
    })

    const positioned = computeLayout(graph.nodes, graph.edges)
    return { nodes: positioned, edges: graph.edges }
  }, [dashboard, expandedProjects])

  return {
    nodes,
    edges,
    isLoading,
    selectedNodeId,
    expandedProjects,
    dashboard,
    mutate,
    toggleProject,
    selectNode,
    expandAll,
    collapseAll,
    focusProject,
  }
}
