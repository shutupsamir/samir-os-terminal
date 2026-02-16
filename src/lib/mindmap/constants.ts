// Node sizes (width × height for cards)
export const NODE_SIZES = {
  center: 120,
  project: 80,
  session: 50,
  taskCluster: 50,
  task: 30,
  activity: 50,
  inbox: 60,
  stats: 60,
} as const

// Horizontal tree layout spacing
export const TREE_LAYOUT = {
  /** X distance from center to project column */
  centerToProject: 400,
  /** Y gap between project nodes */
  projectGap: 200,
  /** X distance from project to child column */
  projectToChild: 250,
  /** Y gap between child nodes */
  childGap: 60,
  /** X distance from child to grandchild (task cluster → tasks) */
  childToGrandchild: 200,
  /** Y gap between grandchild nodes */
  grandchildGap: 60,
  /** Y offset for inbox/stats below center */
  utilityOffset: 200,
  /** X offset for inbox/stats from center */
  utilitySpread: 160,
} as const

// Agent colors
export const AGENT_COLORS: Record<string, string> = {
  claude: '#4ade80',
  clae: '#60a5fa',
  mack: '#a78bfa',
  samir: '#fb923c',
}

// Status colors
export const STATUS_COLORS: Record<string, string> = {
  pending: '#facc15',
  in_progress: '#60a5fa',
  completed: '#4ade80',
  blocked: '#f87171',
  cancelled: '#6b7280',
}

// Priority indicators
export const PRIORITY_ICONS: Record<string, string> = {
  urgent: '!!!',
  high: '!!',
  medium: '!',
  low: '.',
}

// Accent colors for edges/nodes
export const ACCENT_COLORS = {
  center: '#00ff88',
  project: '#60a5fa',
  session: '#4ade80',
  inbox: '#fb923c',
  stats: '#a78bfa',
  edge: '#475569',
} as const
