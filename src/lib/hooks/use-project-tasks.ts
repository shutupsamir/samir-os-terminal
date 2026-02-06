import useSWR from 'swr'
import { getProjectTasks } from '@/lib/api'

export function useProjectTasks(slug: string | null) {
  return useSWR(
    slug ? ['project-tasks', slug] : null,
    () => getProjectTasks(slug!),
    {
      refreshInterval: 15_000,
      revalidateOnFocus: true,
    }
  )
}
