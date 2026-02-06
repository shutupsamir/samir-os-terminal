import useSWR from 'swr'
import { getProjectSessions } from '@/lib/api'

export function useProjectSessions(slug: string | null, limit = 10) {
  return useSWR(
    slug ? ['project-sessions', slug, limit] : null,
    () => getProjectSessions(slug!, limit),
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
    }
  )
}
