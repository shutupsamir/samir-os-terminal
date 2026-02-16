import type { MindMapNode, MindMapEdge } from '@/lib/mindmap/types'
import { TREE_LAYOUT } from '@/lib/mindmap/constants'

/**
 * Deterministic horizontal tree layout.
 * Center at origin, projects split left/right, children flow outward.
 * No d3-force, no simulation, no jitter. Same data → same positions.
 */
export function computeLayout(
  nodes: MindMapNode[],
  edges: MindMapEdge[],
): MindMapNode[] {
  if (nodes.length === 0) return nodes

  const T = TREE_LAYOUT
  const positioned = new Map<string, { x: number; y: number }>()

  // Categorize nodes
  const projectNodes = nodes.filter(n => n.type === 'project')
  const inboxNode = nodes.find(n => n.id === 'inbox')
  const statsNode = nodes.find(n => n.id === 'stats')

  // Center always at origin
  positioned.set('center', { x: 0, y: 0 })

  // Split projects: first half goes left, second half goes right
  const leftProjects = projectNodes.slice(0, Math.ceil(projectNodes.length / 2))
  const rightProjects = projectNodes.slice(Math.ceil(projectNodes.length / 2))

  // Position a column of projects
  function positionProjectColumn(
    projects: MindMapNode[],
    side: 'left' | 'right',
  ) {
    const xSign = side === 'left' ? -1 : 1
    const projectX = xSign * T.centerToProject
    const totalHeight = (projects.length - 1) * T.projectGap
    const startY = -totalHeight / 2

    projects.forEach((pNode, i) => {
      const projectY = startY + i * T.projectGap
      positioned.set(pNode.id, { x: projectX, y: projectY })

      // Find children of this project
      const childEdges = edges.filter(e => e.source === pNode.id)
      const childIds = childEdges.map(e => e.target as string)
      const children = nodes.filter(n => childIds.includes(n.id))

      if (children.length === 0) return

      const childX = projectX + xSign * T.projectToChild
      const childTotalHeight = (children.length - 1) * T.childGap
      const childStartY = projectY - childTotalHeight / 2

      children.forEach((child, ci) => {
        const childY = childStartY + ci * T.childGap
        positioned.set(child.id, { x: childX, y: childY })

        // Grandchildren (tasks inside cluster)
        const grandchildEdges = edges.filter(e => e.source === child.id)
        const grandchildIds = grandchildEdges.map(e => e.target as string)
        const grandchildren = nodes.filter(n => grandchildIds.includes(n.id))

        if (grandchildren.length === 0) return

        const gcX = childX + xSign * T.childToGrandchild
        const gcTotalHeight = (grandchildren.length - 1) * T.grandchildGap
        const gcStartY = childY - gcTotalHeight / 2

        grandchildren.forEach((gc, gi) => {
          positioned.set(gc.id, { x: gcX, y: gcStartY + gi * T.grandchildGap })
        })
      })
    })
  }

  positionProjectColumn(leftProjects, 'left')
  positionProjectColumn(rightProjects, 'right')

  // Inbox: bottom-left of center
  if (inboxNode) {
    positioned.set('inbox', {
      x: -T.utilitySpread,
      y: T.utilityOffset,
    })
  }

  // Stats: bottom-right of center
  if (statsNode) {
    positioned.set('stats', {
      x: T.utilitySpread,
      y: T.utilityOffset,
    })
  }

  // Apply positions
  return nodes.map(node => {
    const pos = positioned.get(node.id) || { x: 0, y: 0 }
    return { ...node, position: pos }
  })
}

export function getNodeSize(type: string): number {
  const sizes: Record<string, number> = {
    center: 120,
    project: 80,
    session: 50,
    taskCluster: 50,
    task: 30,
    activity: 50,
    inbox: 60,
    stats: 60,
  }
  return sizes[type] || 40
}
