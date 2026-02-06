export interface DashboardStats {
  total_projects: number
  pending_tasks: number
  active_tasks: number
  completed_today: number
  inbox_count: number
}

export interface DashboardData {
  stats: DashboardStats
  projects: Project[]
  today: ProjectToday[]
  feed: FeedItem[]
  heatmap: HeatmapDay[]
  inbox: InboxItem[]
  recentSessions: Session[]
}

export interface Project {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  status: string
}

export interface ProjectToday {
  project_id: string
  slug: string
  name: string
  icon: string
  color: string
  progress_percent: number
  pending_tasks: number
  active_tasks: number
  completed_today: number
  last_session_summary?: string
  last_session_at?: string
}

export interface FeedItem {
  id: string
  timestamp: string
  event_type: string
  title?: string
  icon: string
  project_slug?: string
  project_name?: string
  project_color?: string
}

export interface HeatmapDay {
  day: string
  project_slug: string
  project_color: string
  events: number
  total_intensity: number
  max_intensity: number
}

export interface Session {
  id: string
  started_at: string
  ended_at?: string
  duration_minutes?: number
  summary?: string
  accomplishments?: string[]
  next_steps?: string[]
  context?: {
    agent_name?: string
    [key: string]: unknown
  }
  project?: {
    slug: string
    name: string
    icon: string
    color: string
  }
}

export interface InboxItem {
  id: string
  content: string
  project_id?: string
  captured_at: string
  project?: {
    slug: string
    name: string
    icon: string
    color: string
  }
}

export interface Receipt {
  id: string
  spine_run_id: string
  receipt_type: string
  status: string
  project_slug?: string
  provider?: string
  receipt_path: string
  token_usage?: {
    total?: number
    prompt?: number
    completion?: number
  }
  created_at: string
}
