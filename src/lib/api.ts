import type { DashboardData, Session, Receipt, InboxItem, Task } from './types'

const API_BASE = '/api/proxy'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// GET helpers
export async function getDashboard(): Promise<DashboardData> {
  const result = await apiFetch<{ success: boolean; data: DashboardData }>('/api/os')
  return result.data
}

export async function getSessions(limit = 20): Promise<Session[]> {
  const result = await apiFetch<{ sessions: Session[] }>(`/api/os/sessions?limit=${limit}`)
  return result.sessions
}

export async function getProjectSessions(projectSlug: string, limit = 10): Promise<Session[]> {
  const result = await apiFetch<{ sessions: Session[] }>(`/api/os/sessions?project=${projectSlug}&limit=${limit}`)
  return result.sessions
}

export async function getReceipts(limit = 20): Promise<Receipt[]> {
  return apiFetch<Receipt[]>(`/api/os/receipts?limit=${limit}`)
}

export async function getInbox(): Promise<InboxItem[]> {
  const result = await apiFetch<{ items: InboxItem[] }>('/api/os/inbox')
  return result.items
}

// POST helpers
export async function logActivity(title: string, projectSlug?: string) {
  return apiFetch('/api/os', {
    method: 'POST',
    body: JSON.stringify({ title, project_slug: projectSlug }),
  })
}

export async function captureInbox(content: string, projectSlug?: string) {
  return apiFetch('/api/os/inbox', {
    method: 'POST',
    body: JSON.stringify({ content, project_slug: projectSlug }),
  })
}

export async function logTime(description: string) {
  return apiFetch<{ success: boolean; categorization: { category: string; projectSlug?: string } }>('/api/os/timelog', {
    method: 'POST',
    body: JSON.stringify({ description }),
  })
}

export async function processInboxItem(inboxId: string, action: 'archive' | 'done') {
  return apiFetch('/api/os/inbox', {
    method: 'PATCH',
    body: JSON.stringify({ inbox_id: inboxId, action }),
  })
}

// Task helpers
export async function getProjectTasks(projectSlug: string): Promise<Task[]> {
  const result = await apiFetch<{ tasks: Task[] }>(`/api/os/tasks?project=${projectSlug}`)
  return result.tasks
}

export async function getAllTasks(): Promise<Task[]> {
  const result = await apiFetch<{ tasks: Task[] }>('/api/os/tasks')
  return result.tasks
}

export async function createTask(title: string, projectSlug?: string, priority?: string): Promise<Task> {
  const result = await apiFetch<{ task: Task }>('/api/os/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, project_slug: projectSlug, priority: priority || 'medium' }),
  })
  return result.task
}

export async function updateTask(taskId: string, updates: Partial<Pick<Task, 'status' | 'priority' | 'assigned_to' | 'title' | 'description'>>): Promise<Task> {
  const result = await apiFetch<{ task: Task }>('/api/os/tasks', {
    method: 'PATCH',
    body: JSON.stringify({ task_id: taskId, ...updates }),
  })
  return result.task
}

export async function convertInboxToTask(inboxId: string, title: string, priority?: string) {
  return apiFetch('/api/os/inbox', {
    method: 'PATCH',
    body: JSON.stringify({
      inbox_id: inboxId,
      action: 'convert_to_task',
      task_data: { title, priority: priority || 'medium' }
    }),
  })
}
